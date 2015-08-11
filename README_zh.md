# elves

> 用于avalon.oniui的测试工具，简单，轻量，headless。

基于**phantomJs**, 支持 **mocha chai** 以及 **jquery**。 

![elves](https://raw.githubusercontent.com/ilife5/life/master/statics/images/elf.jpg)

## 安装

#### 从npm上获取

全局初始化，可用于命令行工具。

```
npm install elves -g
```

如果只是想用在本地的nodejs项目中。

```
npm install elves --save
```

依赖于 [Node.js](http://nodejs.org/) 和 [npm](http://npmjs.org/). 并且确保[phantomJs](http://phantomjs.org/) 已经安装.

## 用法


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

首先，我们创建一个**页面**以及**测试用例**。

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

在命令行中执行

```
elves "example/hello world/helloworld.js" "example/hello world/helloworld.html"
```

然后就可以看到测试结果了。如果执行失败，请先参考[安装](https://github.com/ilife5/elves/blob/master/README_zh.md#安装)。

```
  Hello world
    ✓ #should contains 'hello world' in p 


    ✔ 1 test complete (5ms)
```

### 直接对用例进行测试

在某些场景中，我们不需要页面结构，测试纯粹的javascript用例。我们可以通过如下的方式执行。

```
elves "example/case only/index.js"
```

Elves在没有用户给出页面地址的时候，会自动的打开一个空白没有结构的页面对用力进行测试。


### 使用 config.json

我们可以使用**test**目录下的**config.json**文件对测试进行配置。

```
[
    {
        "caseUrl": "example/hello world/helloworld.js"
    }
]
```

在根目录下执行

```
elves
```

我们就可以得到测试结果了。

### 在远程页面上测试用例

Elves支持在远程页面上执行测试用例。

创建如下的case，测试去哪儿网首页的title是否符合期望。

```
var expect = chai.expect;

describe("qunar", function() {
    it("#title should be 【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com", function() {
        expect(document.title).to.equal("【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com")
    });
});
```

执行

```
elves "example/remote server/remote server.js" "http://qunar.com" -r
```

即可得到测试结果

```
  qunar
    ✓ #title should be 【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com 


    ✔ 1 test complete (6ms)
```

### 断言库的切换

Elves支持**chai**以及**expect**断言库，默认为**chai**.

```
//用expect库进行测试
elves -a "expect"
```

### 设置reporter

通过mocha setup使用的配置文件进行设置

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


