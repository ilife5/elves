var server = require('./lib/server')
    , Runner = require('./lib/runner');

module.exports = {
    install: function() {
        server.install();
    },
    run: function(cases, program) {
        var runner = Runner(cases, program);
        runner.on("end", function() {
            server.close();
        });
        return runner;
    }
};