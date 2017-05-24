var path = require('path')
var webpack = require('webpack')
var coverage = String(process.env.COVERAGE) !== 'false'

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        //  basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [{
            pattern: './*.spec.js'
        }],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],
        preprocessors: {
            '*.spec.js': ['coverage'],
            '*.spec.js': ['webpack']
        },
        browserLogOptions: {
            terminal: true
        },
        browserConsoleLogOptions: {
            terminal: true
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        webpack: {

            module: {
                /* Transpile source and test files */
                preLoaders: [{
                    test: /\.js$/,
                    exclude: path.resolve(__dirname, 'node_modules'),
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['latest', {
                                es2015: {
                                    loose: true
                                }
                            }], 'stage-0', 'react'
                        ],
                        plugins: ['istanbul', 'syntax-async-generators', ["transform-runtime", {
                            "helpers": true,
                            "polyfill": true,
                            "regenerator": true,
                            "moduleName": "babel-runtime"
                        }]],
                        babelrc: false
                    }
                }],
                /* Only Instrument our source files for coverage */
                loaders: []
            },
            resolve: {
                alias: {
                },
                modulesDirectories: [__dirname, 'node_modules']
            },
            plugins: [
                new webpack.DefinePlugin({
                    coverage: coverage,
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV || ''),
                })
            ]
        },
        hostname: '127.0.0.1',
        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        customLaunchers: {
            'Chrome': {
                base: 'WebDriverio',
                browserName: 'chrome',
                name: 'Karma'
            }
        },
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        webpackMiddleware: {
            noInfo: true
        }
    })
}
