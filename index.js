var server = require('./lib/server')
    , Runner = require('./lib/runner');

module.exports = {
    install: function() {
        server.install();
    },
    run: function(config) {
        var runner = Runner(config);
        runner.on("end", function() {
            server.close();
        });
        return runner;
    }
};