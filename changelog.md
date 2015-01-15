change log

======

+ 0.0.4 

> lib/vendor/runner.js
Move injectJs to "onLoadFinished" event.
Use lastest mocha, chai, chai-jquery.
Delete the content of exports checking in chai, chai-jquery.

> lib/shims/process.stdout.write.js
Since Mocha.process is not a global variable，Update process to Mocha.process .

