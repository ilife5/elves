var phantom = require('phantom'),
    fs = require('fs'),
    path = require("path"),
    chalk = require("chalk"),
    Events = require("events");

//for long error stack
require("longjohn");

var runner = new Events.EventEmitter;
var caseStats = {
    allCasesNum: 0,
    passCasesNum: 0,
    failCasesNum: 0
}

function casesRender(cases, program) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.onConsoleMessage(function (msg) {
                var fromConsole = true,
                    elvesConsoleMark = "ELVES_MOCHA_",
                    elvesEndMark = "ELVES_CASE_END_",
                    elvesStatsPass = "ELVES_STATS_PASS",
                    elvesStatsFail = "ELVES_STATS_FAIL"

                if(msg.indexOf(elvesConsoleMark) !== -1){
                    fromConsole = false
                    msg = msg.replace(elvesConsoleMark, "")
                }

                if(msg.indexOf(elvesEndMark) !== -1){
                    console.log(chalk.cyan("[elves log]  ") + "case end!");
                    render();
                } else if(msg.indexOf(elvesStatsPass) !== -1){
                    caseStats.passCasesNum++
                } else if(msg.indexOf(elvesStatsFail) !== -1){
                    caseStats.failCasesNum++
                } else {
                    if(fromConsole && msg.trim() !== ""){
                        console.log(chalk.gray("[console]  " + msg));
                    } else{
                        console.log(msg);
                    }
                }
            });
            page.set('onError', function() {
                console.log("onError");
                console.log(arguments);
                runner.emit("error");
            });
            page.set('onResourceError', function() {
                console.log("onResourceError");
                console.log(arguments);
                runner.emit("resourceError");
            });
            page.set('onResourceTimeout', function() {
                console.log("onResourceTimeout");
                console.log(arguments);
                runner.emit("resourceTimeout");
            });
            page.set('onLoadFinished', function() {
                page.injectJs(path.join(__dirname, "vendor/mocha.js"));
                page.injectJs(path.join(__dirname, "vendor", program.assertions + ".js"));
                page.injectJs(program.mochaOptions);
                page.injectJs(path.join(__dirname, "shims/es5-shim.js"));
                page.injectJs(path.join(__dirname, "shims/console.js"));
                page.injectJs(path.join(__dirname, "shims/process.stdout.write.js"));
                page.injectJs(path.join(__dirname, "vendor/jquery-1.11.2.min.js"));
                page.injectJs(path.join(__dirname, "vendor/simulate.js"));
            });

            render();

            function render() {
                var currentCase = cases.shift();
                if(!currentCase) {

                    if(caseStats.passCasesNum){
                        console.log(chalk.cyan("[elves log]  ") + chalk.green(caseStats.passCasesNum + " passing in all"))
                    }

                    if(caseStats.failCasesNum !== 0){
                        console.log(chalk.cyan("[elves log]  ") + chalk.red(caseStats.failCasesNum + " failing in all"))
                    }

                    ph.exit(0);
                    runner.emit("end");

                } else {
                    caseStats.allCasesNum++

                    console.log(chalk.cyan("[elves log]  ") + "case start...");
                    console.log(chalk.cyan("[elves log]  ") + "page : " + currentCase.pageUrl);
                    console.log(chalk.cyan("[elves log]  ") + "case : " + currentCase.caseUrl);

                    page.open(currentCase.pageUrl, function () {
                        setTimeout(function() {
                            page.evaluate(function() {
                                mocha.setup(pageStatic.mochaSetupOptions);
                            });
                            page.injectJs(path.join(__dirname, "shims/mocha-async.js"));
                            page.injectJs(currentCase.caseUrl);

                            page.evaluate(function () {

                                window.alert = function(str) {
                                    var alertContainer = document.createElement("div")
                                    var alertText = document.createTextNode(str);
                                    alertContainer.appendChild(alertText)
                                    alertContainer.setAttribute("id", "alert")
                                    document.body.appendChild(alertContainer)
                                }

                                var mochaRunner = mocha.run()
                                    .on('pass', function() {
                                        console.log("ELVES_STATS_PASS")
                                    })
                                    .on('fail', function() {
                                        console.log("ELVES_STATS_FAIL")
                                    })
                                    .on('end', testEnd)

                                //if there is no suite, trigger end event
                                if(mochaRunner.grepTotal(mochaRunner.suite) === 0 ) {
                                    testEnd();
                                }

                                function testEnd() {
                                    console.log("ELVES_CASE_END_")
                                }
                            });
                        }, 1000);
                    });
                }
            }
        });
    });

    return runner;
}

module.exports = casesRender;