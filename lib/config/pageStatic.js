if(typeof pageStatic === "undefined") {
    pageStatic = {};
}

pageStatic.mochaSetupOptions = {
    ui: "bdd",
    reporter: 'spec',
    ignoreLeaks: true
};