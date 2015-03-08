var phantom = require('phantom'),
    fs = require('fs'),
    path = require("path"),
    chalk = require("chalk"),
    Events = require("events");

//for long error stack
require("longjohn");

var runner = new Events.EventEmitter;

function casesRender(cases, program) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.onConsoleMessage(function (msg) {
                try {
                    var phantomMsg = JSON.parse(msg);

                    if(phantomMsg.phantomMsg && phantomMsg.mochaEnd) {
                        console.log(chalk.cyan("[elves log]  ") + "case end!");
                        render();
                    } else {
                        console.log(msg)
                    }
                } catch(e) {
                    console.log(msg)
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
                var type = program.testType + ".json",
                    files,
                    typeIndex;

                //find config file by program.testType
                files = fs.readdirSync(path.join(__dirname, "config"));
                if( (typeIndex = files.indexOf(type)) > -1) {
                    type = files[typeIndex];
                } else {
                    type = "pc.json"
                }

                page.injectJs(path.join(__dirname, "vendor/mocha.js"));
                page.injectJs(path.join(__dirname, "vendor/chai.js"));
                page.injectJs(path.join(__dirname, "shims/es5-shim.js"));
                page.injectJs(path.join(__dirname, "shims/console.js"));
                page.injectJs(path.join(__dirname, "shims/process.stdout.write.js"));

                //load resource base on testType
                require(path.join(__dirname, "config/", type)).forEach(function(file) {
                    page.injectJs(path.join(__dirname, file));
                });

            });

            render();

            function render() {
                var currentCase = cases.shift();
                if(!currentCase) {
                    ph.exit(0);
                    runner.emit("end");
                } else {
                    console.log(chalk.cyan("[elves log]  ") + "case start...");
                    console.log(chalk.cyan("[elves log]  ") + "page : " + currentCase.pageUrl);
                    console.log(chalk.cyan("[elves log]  ") + "case : " + currentCase.caseUrl);

                    page.open(currentCase.pageUrl, function () {
                        setTimeout(function() {
                            page.evaluate(function() {
                                mocha.setup({
                                    ui: "bdd",
                                    reporter: 'spec',
                                    ignoreLeaks: true
                                });
                            });
                            page.injectJs(path.join(__dirname, "shims/mocha-async.js"));
                            page.injectJs(currentCase.caseUrl);

                            page.evaluate(function () {

                                function testEnd() {
                                    console.log(JSON.stringify({
                                        phantomMsg: true,
                                        mochaEnd: true
                                    }))
                                }

                                var runner = mocha.run().on('end', testEnd);

                                //if there is no suite, trigger end event
                                if(runner.grepTotal(runner.suite) === 0 ) {
                                    testEnd();
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