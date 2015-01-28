ChangeLog

======

> 0.0.4 

+ lib/vendor/runner.js

Move injectJs to "onLoadFinished" event.
Use lastest mocha, chai, chai-jquery.
Delete the content of exports checking in chai, chai-jquery.

+ lib/shims/process.stdout.write.js

Since Mocha.process is not a global variable，Update process to Mocha.process .

> 0.0.5

+ bin/elves

modify path of package.json

+ package.json

delete jsdom dependency

+ hello world

add hell world example

> 0.0.6

+ bin/elves 

fix bug of join localserver address
