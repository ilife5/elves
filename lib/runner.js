var phantom = require('phantom'),
    path = require("path"),
    Events = require("events");

//for long error stack
require("longjohn");

var runner = new Events.EventEmitter;

function casesRender(cases) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.onConsoleMessage(function (msg) {
                try {
                    var phantomMsg = JSON.parse(msg);

                    if(phantomMsg.phantomMsg && phantomMsg.mochaEnd) {
                        render()
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
                page.injectJs(path.join(__dirname, "vendor/jquery-1.11.2.min.js"));
                page.injectJs(path.join(__dirname, "vendor/mocha.js"));
                page.injectJs(path.join(__dirname, "vendor/chai.js"));
                page.injectJs(path.join(__dirname, "vendor/chai-jquery.js"));
                page.injectJs(path.join(__dirname, "vendor/jquery.simulate.js"));
                page.injectJs(path.join(__dirname, "shims/es5-shim.js"));
                page.injectJs(path.join(__dirname, "shims/console.js"));
                page.injectJs(path.join(__dirname, "shims/process.stdout.write.js"));
            });

            render();

            function render() {
                var currentCase = cases.shift();
                if(!currentCase) {
                    ph.exit(0);
                    runner.emit("end");
                } else {
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

                                mocha.run().on('end', function(){
                                    console.log(JSON.stringify({
                                        phantomMsg: true,
                                        mochaEnd: true
                                    }))
                                });

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