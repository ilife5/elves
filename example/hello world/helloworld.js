var expect = chai.expect;

describe("Hello world", function() {
    it("#should contains 'hello world' in p", function() {
        expect($("p").eq(0).text() == "hello world");
    })
});