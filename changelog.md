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

> 0.0.7

+ bin/elves

support case search.

If there is a xxx.case.js, then find the xxx.html. If match, generate the config.

> 0.0.8

+ lib/config/pc.json
+ lib/config/touch.json
+ lib/vendor/phantom-limb.js
+ lib/vendor/zepto.min.js
+ lib/vendor/zepto.touch.js

features:

+ support set localserver.

    ```
elves -l "http://localhost"
    ```

+ support set testType

    for touch

    ```
elves -t "touch"
    ```

    The runner will import phantom-limb, zepto.min.js, zepto.touch.js.

bugs:

+ mocha runner emit end events fail

> 0.1.1

+ lib/vendor/expect.js

features:

+ add assertions option

    ```
elves -a "expect"
    ```