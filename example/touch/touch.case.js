var expect = chai.expect;

describe("touch", function() {

    var container = $(".container"),
        content = $(".content")

    it("should show tap", function(done) {
        container.simulate("tap")

        // 使断言在行为之后触发
        delay(done, function() {
            expect(content.text()).to.equal("tap");
        }, 0);
    })

    it("should show doubleTap", function(done) {
        // 与上一次tap留出间隔，防止直接触发doubleTap
        setTimeout(function(){
            container.simulate("doubleTap")
        }, 500)

        delay(done, function() {
            expect(content.text()).to.equal("doubleTap");
        }, 1000);
    })

    it("should show press", function(done) {
        container.simulate("press")

        // 需要在长按一段时间后进行断言
        delay(done, function() {
            expect(content.text()).to.equal("press");
        }, 1000);
    })

    it("should show swipeLeft", function(done) {
        container.simulate("swipeLeft")

        delay(done, function() {
            expect(content.text()).to.equal("swipeLeft");
        }, 0);
    })

    it("should show swipeRight", function(done) {
        container.simulate("swipeRight")

        delay(done, function() {
            expect(content.text()).to.equal("swipeRight");
        }, 0);
    })

    it("should show swipeUp", function(done) {
        container.simulate("swipeUp")

        delay(done, function() {
            expect(content.text()).to.equal("swipeUp");
        }, 0);
    })

    it("should show swipeDown", function(done) {
        container.simulate("swipeDown")

        delay(done, function() {
            expect(content.text()).to.equal("swipeDown");
        }, 0);
    })
});