// Karma configuration
// Generated on Thu Mar 30 2017 18:03:26 GMT+0800 (CST)
var path = require("path");
var webpack = require("webpack");
var coverage = String(process.env.COVERAGE) !== "false";

module.exports = function (config) {
    var options = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        //  basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha","chai"],


        // list of files / patterns to load in the browser
        files: ["./test/matchers.js",process.env.TRAVIS ? "./test/spec2.js" : "./test/spec.js"],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["spec", "coverage"],
        preprocessors: {
            "dist/React.js": ["coverage"],
            //'src/**/*.js': ['coverage'],
            "test/**/*.js": ["webpack"]
        },
        mochaReporter: {
            showDiff: true
        },
        browserLogOptions: {
            terminal: true
        },
        browserConsoleLogOptions: {
            terminal: true
        },
        coverageReporter: {
            type: "html",
            dir: "coverage/"
        },
        webpack: {

            module: {
                /* Transpile source and test files */
                preLoaders: [{
                    test: /\.jsx?$/,
                    exclude: path.resolve(__dirname, "node_modules"),
                    loader: "babel-loader",
                    query: {
                        presets: ["env", "react"],
                        plugins: ["istanbul", "syntax-async-generators",
                            "transform-class-properties",
                            //'transform-es2015-destructuring',
                            "transform-object-rest-spread", ["transform-runtime", {
                                "helpers": true,
                                "polyfill": true,
                                "regenerator": true,
                                "moduleName": "babel-runtime"
                            }]
                        ],
                        babelrc: false
                    }
                }],
                /* Only Instrument our source files for coverage */
                loaders: []
            },
            resolve: {

                alias: {
                    redux: path.join(__dirname, "./test/redux"),
                    react: path.join(__dirname, "./dist/React"),
                    "react-dom": path.join(__dirname, "./dist/React"),
                    "react-redux": path.join(__dirname, "./test/react-redux")
                },
                modulesDirectories: [__dirname, "node_modules"]
            },
            plugins: [
                new webpack.DefinePlugin({ //添加全局变量
                    coverage: coverage,
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV || ""),
                })
            ]
        },
        webpackMiddleware: {
            noInfo: true //去掉编译文件的LOG
        },
        //hostname: '127.0.0.1',
        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        //    logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        customLaunchers: {
            "Chrome": {
                base: "WebDriverio",
                browserName: "chrome",
                name: "Karma"

            }

        },
        browsers: ["Chrome"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    };
    if (process.env.TRAVIS) {

        options.browsers = ["Firefox"];
    }

    config.set(options);
};