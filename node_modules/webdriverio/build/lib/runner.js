'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _gaze = require('gaze');

var _gaze2 = _interopRequireDefault(_gaze);

var _ConfigParser = require('./utils/ConfigParser');

var _ConfigParser2 = _interopRequireDefault(_ConfigParser);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WATCH_NOTIFICATION = '\nWDIO is now in watch mode and is waiting for a change...';

var Runner = function () {
    function Runner() {
        (0, _classCallCheck3.default)(this, Runner);

        this.haltSIGINT = false;
        this.sigintWasCalled = false;
        this.hasSessionID = false;
        this.failures = 0;
        this.forceKillingProcess = false;
        this.isRunning = false;
        this.fileTriggeredWhileRunning = null;
    }

    (0, _createClass3.default)(Runner, [{
        key: 'run',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(m) {
                var _this = this;

                var config, res;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.cid = m.cid;
                                this.specs = m.specs;
                                this.caps = m.caps;

                                this.configParser = new _ConfigParser2.default();
                                this.configParser.addConfigFile(m.configFile);

                                /**
                                 * merge cli arguments into config
                                 */
                                this.configParser.merge(m.argv);

                                /**
                                 * merge host/port changes by service launcher into config
                                 */
                                this.configParser.merge(m.server);

                                config = this.configParser.getConfig();

                                this.addCommandHooks(config);
                                this.initialiseServices(config);

                                _context.next = 12;
                                return this.runHook('beforeSession', config, this.caps, this.specs);

                            case 12:

                                this.framework = this.initialiseFramework(config);
                                global.browser = this.initialiseInstance(m.isMultiremote, this.caps);
                                this.initialisePlugins(config);

                                /**
                                 * store end method before it gets fiberised by wdio-sync
                                 */
                                this.endSession = global.browser.end.bind(global.browser);

                                /**
                                 * initialisation successful, send start message
                                 */
                                process.send({
                                    event: 'runner:start',
                                    cid: m.cid,
                                    specs: m.specs,
                                    capabilities: this.caps,
                                    config: config
                                });

                                /**
                                 * register runner events
                                 */
                                global.browser.on('init', function (payload) {
                                    process.send({
                                        event: 'runner:init',
                                        cid: m.cid,
                                        specs: _this.specs,
                                        sessionID: payload.sessionID,
                                        options: payload.options,
                                        desiredCapabilities: payload.desiredCapabilities
                                    });

                                    _this.hasSessionID = true;
                                });

                                global.browser.on('command', function (payload) {
                                    var command = {
                                        event: 'runner:command',
                                        cid: m.cid,
                                        specs: _this.specs,
                                        method: payload.method,
                                        uri: payload.uri,
                                        data: payload.data
                                    };
                                    process.send(_this.addTestDetails(command));
                                });

                                global.browser.on('result', function (payload) {
                                    var result = {
                                        event: 'runner:result',
                                        cid: m.cid,
                                        specs: _this.specs,
                                        requestData: payload.requestData,
                                        requestOptions: payload.requestOptions,
                                        body: payload.body // ToDo figure out if this slows down the execution time
                                    };
                                    process.send(_this.addTestDetails(result));

                                    /**
                                     * update sessionId property
                                     */
                                    if (payload.requestOptions && payload.requestOptions.method === 'POST' && payload.requestOptions.uri.path.match(/\/session$/)) {
                                        global.browser.sessionId = payload.body.sessionId;
                                    }
                                });

                                global.browser.on('screenshot', function (payload) {
                                    var details = {
                                        event: 'runner:screenshot',
                                        cid: m.cid,
                                        specs: _this.specs,
                                        filename: payload.filename,
                                        data: payload.data
                                    };
                                    process.send(_this.addTestDetails(details));
                                });

                                global.browser.on('log', function () {
                                    for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
                                        data[_key] = arguments[_key];
                                    }

                                    var details = {
                                        event: 'runner:log',
                                        cid: m.cid,
                                        specs: _this.specs,
                                        data: data
                                    };
                                    process.send(_this.addTestDetails(details));
                                });

                                process.on('test:start', function (test) {
                                    _this.currentTest = test;
                                });

                                global.browser.on('error', function (payload) {
                                    process.send({
                                        event: 'runner:error',
                                        cid: m.cid,
                                        specs: _this.specs,
                                        error: payload,
                                        capabilities: _this.caps
                                    });
                                });

                                this.haltSIGINT = true;
                                this.inWatchMode = Boolean(config.watch);

                                /**
                                 * register global helper method to fetch elements
                                 */
                                global.$ = function (selector) {
                                    return global.browser.element(selector);
                                };
                                global.$$ = function (selector) {
                                    return global.browser.elements(selector).value;
                                };

                                _context.prev = 28;
                                _context.next = 31;
                                return global.browser.init();

                            case 31:
                                res = _context.sent;

                                global.browser.sessionId = res.sessionId;
                                this.haltSIGINT = false;

                                /**
                                 * make sure init and end can't get called again
                                 */
                                global.browser.options.isWDIO = true;

                                /**
                                 * kill session of SIGINT signal showed up while trying to
                                 * get a session ID
                                 */

                                if (!this.sigintWasCalled) {
                                    _context.next = 41;
                                    break;
                                }

                                _context.next = 38;
                                return this.end(1);

                            case 38:
                                process.removeAllListeners();
                                global.browser.removeAllListeners();
                                return _context.abrupt('return');

                            case 41:
                                if (!this.inWatchMode) {
                                    _context.next = 43;
                                    break;
                                }

                                return _context.abrupt('return', this.runWatchMode(m.cid, config, m.specs));

                            case 43:
                                _context.next = 45;
                                return this.framework.run(m.cid, config, m.specs, this.caps);

                            case 45:
                                this.failures = _context.sent;
                                _context.next = 48;
                                return this.end(this.failures);

                            case 48:
                                _context.next = 50;
                                return this.runHook('afterSession', config, this.caps, this.specs);

                            case 50:
                                process.exit(this.failures === 0 ? 0 : 1);
                                _context.next = 61;
                                break;

                            case 53:
                                _context.prev = 53;
                                _context.t0 = _context['catch'](28);

                                process.send({
                                    event: 'error',
                                    cid: this.cid,
                                    specs: this.specs,
                                    capabilities: this.caps,
                                    error: {
                                        message: _context.t0.message,
                                        stack: _context.t0.stack
                                    }
                                });

                                _context.next = 58;
                                return this.end(1);

                            case 58:
                                process.removeAllListeners();
                                global.browser.removeAllListeners();
                                process.exit(1);

                            case 61:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[28, 53]]);
            }));

            function run(_x) {
                return _ref.apply(this, arguments);
            }

            return run;
        }()

        /**
         * end test runner instance and exit process
         */

    }, {
        key: 'end',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                var failures = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var inWatchMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.inWatchMode;
                var sendProcessEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(this.hasSessionID && !inWatchMode)) {
                                    _context2.next = 4;
                                    break;
                                }

                                global.browser.options.isWDIO = false;
                                _context2.next = 4;
                                return this.endSession();

                            case 4:
                                if (sendProcessEvent) {
                                    _context2.next = 6;
                                    break;
                                }

                                return _context2.abrupt('return');

                            case 6:

                                process.send({
                                    event: 'runner:end',
                                    failures: failures,
                                    cid: this.cid,
                                    specs: this.specs
                                });

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function end() {
                return _ref2.apply(this, arguments);
            }

            return end;
        }()

        /**
         * run watcher
         */

    }, {
        key: 'runWatchMode',
        value: function runWatchMode(cid, config, specs) {
            var _this2 = this;

            this.gaze = new _gaze2.default(specs, { interval: 1000 });

            console.log(WATCH_NOTIFICATION);
            this.gaze.on('changed', function () {
                var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(filepath) {
                    var failures;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    if (!_this2.isRunning) {
                                        _context3.next = 3;
                                        break;
                                    }

                                    _this2.fileTriggeredWhileRunning = filepath;
                                    return _context3.abrupt('return');

                                case 3:

                                    /**
                                     * check if file is in require.cache
                                     * this is required to run specs multiple times
                                     */
                                    if (require.cache[require.resolve(filepath)]) {
                                        delete require.cache[require.resolve(filepath)];
                                    }

                                    console.log('change detected, running ...');
                                    _this2.isRunning = true;
                                    _context3.next = 8;
                                    return _this2.framework.run(cid, config, [filepath], _this2.caps);

                                case 8:
                                    failures = _context3.sent;
                                    _context3.next = 11;
                                    return _this2.end(failures, true);

                                case 11:

                                    setTimeout(function () {
                                        _this2.isRunning = false;
                                        console.log(WATCH_NOTIFICATION);

                                        /**
                                         * retrigger onchange event if user has saved file while test
                                         * was running
                                         */
                                        if (_this2.fileTriggeredWhileRunning) {
                                            _this2.gaze.emit('changed', _this2.fileTriggeredWhileRunning);
                                            _this2.fileTriggeredWhileRunning = null;
                                        }
                                    }, 500);

                                case 12:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, _this2);
                }));

                return function (_x5) {
                    return _ref3.apply(this, arguments);
                };
            }());
        }
    }, {
        key: 'addTestDetails',
        value: function addTestDetails(payload) {
            if (this.currentTest) {
                payload.title = this.currentTest.title;
                payload.uid = this.currentTest.uid || this.currentTest.title;
                payload.parent = this.currentTest.parent;
                payload.parentUid = this.currentTest.parentUid || this.currentTest.parent;
            }
            return payload;
        }
    }, {
        key: 'addCommandHooks',
        value: function addCommandHooks(config) {
            var _this3 = this;

            config.beforeCommand.push(function (command, args) {
                var payload = {
                    event: 'runner:beforecommand',
                    cid: _this3.cid,
                    specs: _this3.specs,
                    command: command,
                    args: args
                };
                process.send(_this3.addTestDetails(payload));
            });
            config.afterCommand.push(function (command, args, result, err) {
                var payload = {
                    event: 'runner:aftercommand',
                    cid: _this3.cid,
                    specs: _this3.specs,
                    command: command,
                    args: args,
                    result: result,
                    err: err
                };
                process.send(_this3.addTestDetails(payload));
            });
        }
    }, {
        key: 'sigintHandler',
        value: function sigintHandler() {
            if (this.sigintWasCalled) {
                return;
            }

            this.sigintWasCalled = true;

            if (this.haltSIGINT) {
                return;
            }

            this.end(1, false, !this.inWatchMode);
            global.browser.removeAllListeners();
            process.removeAllListeners();

            if (this.gaze) {
                this.gaze.close();
            }
        }
    }, {
        key: 'initialiseFramework',
        value: function initialiseFramework(config) {
            if (typeof config.framework !== 'string') {
                throw new Error('You haven\'t defined a valid framework. ' + 'Please checkout http://webdriver.io/guide/testrunner/frameworks.html');
            }

            var frameworkLibrary = 'wdio-' + config.framework.toLowerCase() + '-framework';
            try {
                return require(frameworkLibrary).adapterFactory;
            } catch (e) {
                if (!e.message.match('Cannot find module \'' + frameworkLibrary + '\'')) {
                    throw new Error('Couldn\'t initialise framework "' + frameworkLibrary + '".\n' + e.stack);
                }

                throw new Error('Couldn\'t load "' + frameworkLibrary + '" framework. You need to install ' + ('it with `$ npm install ' + frameworkLibrary + '`!\n' + e.stack));
            }
        }
    }, {
        key: 'initialiseInstance',
        value: function initialiseInstance(isMultiremote, capabilities) {
            var config = this.configParser.getConfig();

            if (!isMultiremote) {
                config.desiredCapabilities = capabilities;
                return (0, _.remote)(config);
            }

            var options = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(capabilities)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var browserName = _step.value;

                    options[browserName] = (0, _deepmerge2.default)(config, capabilities[browserName]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var browser = (0, _.multiremote)(options);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(capabilities)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _browserName = _step2.value;

                    global[_browserName] = browser.select(_browserName);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            browser.isMultiremote = true;
            return browser;
        }

        /**
         * initialise WebdriverIO compliant plugins
         */

    }, {
        key: 'initialisePlugins',
        value: function initialisePlugins(config) {
            if (typeof config.plugins !== 'object') {
                return;
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(config.plugins)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var pluginName = _step3.value;

                    var plugin = void 0;

                    try {
                        plugin = require(pluginName);
                    } catch (e) {
                        if (!e.message.match('Cannot find module \'' + pluginName + '\'')) {
                            throw new Error('Couldn\'t initialise service "' + pluginName + '".\n' + e.stack);
                        }

                        throw new Error('Couldn\'t find plugin "' + pluginName + '". You need to install it ' + ('with `$ npm install ' + pluginName + '`!\n' + e.stack));
                    }

                    if (typeof plugin.init !== 'function') {
                        throw new Error('The plugin "' + pluginName + '" is not WebdriverIO compliant!');
                    }

                    plugin.init(global.browser, config.plugins[pluginName]);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        /**
         * initialise WebdriverIO compliant services
         */

    }, {
        key: 'initialiseServices',
        value: function initialiseServices(config) {
            if (!Array.isArray(config.services)) {
                return;
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)(config.services), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var serviceName = _step4.value;

                    var service = void 0;

                    /**
                     * allow custom services
                     */
                    if (typeof serviceName === 'object') {
                        this.configParser.addService(serviceName);
                        continue;
                    }

                    try {
                        service = require('wdio-' + serviceName + '-service');
                    } catch (e) {
                        if (!e.message.match('Cannot find module \'' + serviceName + '\'')) {
                            throw new Error('Couldn\'t initialise service "' + serviceName + '".\n' + e.stack);
                        }

                        throw new Error('Couldn\'t find service "' + serviceName + '". You need to install it ' + ('with `$ npm install wdio-' + serviceName + '-service`!'));
                    }

                    this.configParser.addService(service);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }

        /**
         * run before/after session hook
         */

    }, {
        key: 'runHook',
        value: function runHook(hookName, config, caps, specs) {
            var catchFn = function catchFn(e) {
                return console.error('Error in ' + hookName + ': ' + e.stack);
            };

            return _promise2.default.all(config[hookName].map(function (hook) {
                try {
                    return hook(config, caps, specs);
                } catch (e) {
                    return catchFn(e);
                }
            })).catch(catchFn);
        }
    }]);
    return Runner;
}();

var runner = new Runner();

process.on('message', function (m) {
    runner[m.command](m).catch(function (e) {
        /**
         * custom exit code to propagate initialisation error
         */
        process.send({
            event: 'runner:error',
            error: {
                message: e.message,
                stack: e.stack
            },
            capabilities: runner.configParser.getCapabilities(runner.cid),
            cid: runner.cid,
            specs: runner.specs
        });
        process.exit(1);
    });
});

/**
 * catches ctrl+c event
 */
process.on('SIGINT', function () {
    /**
     * force killing process when 2nd SIGINT comes in
     */
    if (runner.forceKillingProcess) {
        return process.exit(1);
    }

    runner.forceKillingProcess = true;
    runner.sigintHandler();
});