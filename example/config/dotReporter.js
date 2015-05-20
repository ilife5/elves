if(typeof pageStatic === "undefined") {
    pageStatic = {};
}

pageStatic.mochaSetupOptions = {
    ui: "bdd",
    reporter: 'tap',
    ignoreLeaks: true
};