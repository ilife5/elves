# elves

[![Join the chat at https://gitter.im/ilife5/elves](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ilife5/elves?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> An easy, lightweight, headless test tool for avalon.oniui。

Based on **phantomJs**, support **mocha chai and jquery**。

![elves](https://raw.githubusercontent.com/ilife5/life/master/statics/images/elf.jpg)

[中文文档](https://github.com/ilife5/elves/blob/master/README_zh.md)

## Installation

#### install from npm

Use it as a command line tool.

```
npm install elves -g
```

If you only want to use it in a locally nodejs project.

```
npm install elves --save
```

Elves depends on [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/). Also make sure that [phantomJs](http://phantomjs.org/) is installed.

## Usage


```
Usage: 

    elves [options]
    elves [options] <config>
    elves [options] <caseUrl>
    elves [options] <caseUrl> <pageUrl>

Options:

    -h, --help                  output usage information
    -v, --version               output the version number
    -r, --remoteServer          take test on remote server
    -c, --configFile <path>     config file path. defaults to test/elves.config
    -a, --assertions <path>     assertions, defaults to chai
    -l, --localServer <string>  config localServer address, defaults to http://localhost:3000
    -g, --group <string>        runs a group of tests
    -t, --test <string>         runs a single test

```

### hello world

First, we set up a page and case.

```
example/
└── hello world
    ├── helloworld.html
    └── helloworld.js
```

#### helloworld.html

```
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Hello world</title>
</head>
<body>
    <p>hello world</p>
</body>
</html>

```

#### helloworld.js

```
var expect = chai.expect;

describe("Hello world", function() {
    it("#should contains 'hello world' in the p", function() {
        expect($("p").eq(0).text() == "hello world");
    })
});
```

Run the test

```
elves "example/hello world/helloworld.js" "example/hello world/helloworld.html"
```

The report

```
  Hello world
    ✓ #should contains 'hello world' in p 


    ✔ 1 test complete (5ms)
```

### cases only

In some scenarios，we just want to test pure javascript cases without a page。We can be achieved through the following ways。

```
elves "example/case only/index.js"
```

Elves will open an empty page for running cases.


### use config.json

We can also use a config file in test folder.

```
[
    {
        "caseUrl": "example/hello world/helloworld.js"
    }
]
```

Run

```
elves
```

Then we can get the reports.

### test on remote server

Elves also support test on remote server. 

Create case

```
var expect = chai.expect;

describe("qunar", function() {
    it("#title should be 【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com", function() {
        expect(document.title).to.equal("【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com")
    });
});
```

Run

```
elves "example/remote server/remote server.js" "http://qunar.com" -r
```

Then we can get the reports.

```
  qunar
    ✓ #title should be 【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com 


    ✔ 1 test complete (6ms)
```

### assertions

Elves support changing assertions, includes **chai** and **expect**.

```
//test with expect
elves -a "expect"
```

### reporters

Elves support changing reporters through change setupOptions

```
//setupOptions.js
if(typeof pageStatic === "undefined") {
    pageStatic = {};
}

pageStatic.mochaSetupOptions = {
    ui: "bdd",
    reporter: 'list',
    ignoreLeaks: true
};
```

```
elves -M setupOptions.js
```
