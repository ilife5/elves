var expect = chai.expect;

describe("qunar", function() {
    it("#title should be 【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com", function() {
        expect(document.title).to.equal("【去哪儿网】机票查询预订，酒店预订，旅游团购，度假搜索，门票预订-去哪儿网Qunar.com")
    });
});