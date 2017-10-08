require.config({
    appDir: "../../",
    baseUrl: "Include/",
    paths: {
        "main": "require/main",                              // require.js initializer
        "jquery": "script/vendor/jquery-3.2.1.min",
        "underscore": "script/vendor/underscore.min",
        "hogan": "script/vendor/hogan",
        "appControl": "script/app/appControl",
        "listBox": "script/app/jpoListBox",
        "listBoxHTMLGenerator": "script/app/listBoxHTMLGenerator"
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    modules: [
        {
            name: "main"
        }
    ],
    optimize: "none",//"uglify", // "uglify", "uglify2","none",//
    uglify: {
        toplevel: false,
        ascii_only: true,
        beautify: false,
        max_line_length: 1000,
        defines: {  //see "defines" options for ast_mangle in the uglifys docs.
            DEBUG: ['name', 'false']
        },
        no_mangle: false
    },
    optimizeCss: "standard" // "none", "standard.keepLines",  "standard": @import inlining, comment removal and line returns.
});
require(["appControl"], function (appControl) {
    appControl.init();
});