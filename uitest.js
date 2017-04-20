/*eslint no-var:0, object-shorthand:0 */

var coverage = String(process.env.COVERAGE) !== 'false',
    webpack = require('webpack');

var path = require('path');

module.exports = function(config) {
    config.set({
        start: function() {
            console.log('start', arguments)
        },
        basePath: __dirname,

        customLaunchers: {
            'Chrome': {
                base: 'WebDriverio',
                browserName: 'chrome',
                name: 'Karma'
            }
        },
        // customLaunchers: sauceLabs ? sauceLabsLaunchers : travisLaunchers,
        browsers: ['Chrome'],
        frameworks: ['jasmine'],

        reporters: ['spec', 'coverage'],


        browserLogOptions: {
            terminal: true
        },
        browserConsoleLogOptions: {
            terminal: true
        },

        browserNoActivityTimeout: 5 * 60 * 1000,

        // Use only two browsers concurrently, works better with open source Sauce Labs remote testing
        concurrency: 2,


        files: [{
                pattern: 'test/node/**.js',
                webdriver: true,
                watched: false,
            },

        ],

        preprocessors: {
            'src/**/*.js': ['webpack'],
            'test/**/*.js': ['webpack']
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
                // The React DevTools integration requires preact as a module
                // rather than referencing source files inside the module
                // directly
                alias: {
                    //   preact: __dirname + '/src/preact-compat',
                    //   'preact-react-web': __dirname + '/src/preact-compat-react-web',
                },
                modulesDirectories: [__dirname, 'node_modules']
            },
            //     externals: {
            //         'qrn-web': 'QunarReactWeb',
            //     },
            plugins: [
                new webpack.DefinePlugin({
                    coverage: coverage,
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV || ''),
                })
            ]
        },

        webpackMiddleware: {
            noInfo: true
        }
    });
};