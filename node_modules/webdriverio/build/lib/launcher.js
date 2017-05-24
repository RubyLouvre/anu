'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _ConfigParser = require('./utils/ConfigParser');

var _ConfigParser2 = _interopRequireDefault(_ConfigParser);

var _BaseReporter = require('./utils/BaseReporter');

var _BaseReporter2 = _interopRequireDefault(_BaseReporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Launcher = function () {
    function Launcher(configFile, argv) {
        (0, _classCallCheck3.default)(this, Launcher);

        this.configParser = new _ConfigParser2.default();
        this.configParser.addConfigFile(configFile);
        this.configParser.merge(argv);

        this.reporters = this.initReporters();

        this.argv = argv;
        this.configFile = configFile;

        this.exitCode = 0;
        this.hasTriggeredExitRoutine = false;
        this.hasStartedAnyProcess = false;
        this.processes = [];
        this.schedule = [];
        this.rid = [];
        this.processesStarted = 0;
        this.runnerFailed = 0;
    }

    /**
     * check if multiremote or wdio test
     */


    (0, _createClass3.default)(Launcher, [{
        key: 'isMultiremote',
        value: function isMultiremote() {
            var caps = this.configParser.getCapabilities();
            return !Array.isArray(caps);
        }

        /**
         * initialise reporters
         */

    }, {
        key: 'initReporters',
        value: function initReporters() {
            var reporter = new _BaseReporter2.default();
            var config = this.configParser.getConfig();

            /**
             * if no reporter is set or config property is in a wrong format
             * just use the dot reporter
             */
            if (!config.reporters || !Array.isArray(config.reporters) || !config.reporters.length) {
                config.reporters = ['dot'];
            }

            var reporters = {};

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(config.reporters), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var reporterName = _step.value;

                    var Reporter = void 0;
                    if (typeof reporterName === 'function') {
                        Reporter = reporterName;
                        if (!Reporter.reporterName) {
                            throw new Error('Custom reporters must export a unique \'reporterName\' property');
                        }
                        reporters[Reporter.reporterName] = Reporter;
                    } else if (typeof reporterName === 'string') {
                        try {
                            Reporter = require('wdio-' + reporterName + '-reporter');
                        } catch (e) {
                            throw new Error('reporter "wdio-' + reporterName + '-reporter" is not installed. Error: ' + e.stack);
                        }
                        reporters[reporterName] = Reporter;
                    }
                    if (!Reporter) {
                        throw new Error('config.reporters must be an array of strings or functions, but got \'' + typeof reporterName + '\': ' + reporterName);
                    }
                }

                /**
                 * if no reporter options are set or property is in a wrong format default to
                 * empty object
                 */
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

            if (!config.reporterOptions || typeof config.reporterOptions !== 'object') {
                config.reporterOptions = {};
            }

            for (var _reporterName in reporters) {
                var Reporter = reporters[_reporterName];
                var reporterOptions = {};
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(config.reporterOptions)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var option = _step2.value;

                        if (option === _reporterName && typeof config.reporterOptions[_reporterName] === 'object') {
                            // Copy over options specifically for this reporter type
                            reporterOptions = (0, _assign2.default)(reporterOptions, config.reporterOptions[_reporterName]);
                        } else if (reporters[option]) {
                            // Don't copy options for other reporters
                            continue;
                        } else {
                            // Copy over generic options
                            reporterOptions[option] = config.reporterOptions[option];
                        }
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

                reporter.add(new Reporter(reporter, config, reporterOptions));
            }

            return reporter;
        }

        /**
         * run sequence
         * @return  {Promise} that only gets resolves with either an exitCode or an error
         */

    }, {
        key: 'run',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var _this = this;

                var config, caps, launcher, _exitCode, cid, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, capabilities, exitCode;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                config = this.configParser.getConfig();
                                caps = this.configParser.getCapabilities();
                                launcher = this.getLauncher(config);


                                this.reporters.handleEvent('start', {
                                    isMultiremote: this.isMultiremote(),
                                    capabilities: caps,
                                    config: config
                                });

                                /**
                                 * run onPrepare hook
                                 */
                                _context.next = 6;
                                return config.onPrepare(config, caps);

                            case 6:
                                _context.next = 8;
                                return this.runServiceHook(launcher, 'onPrepare', config, caps);

                            case 8:
                                if (!this.isMultiremote()) {
                                    _context.next = 17;
                                    break;
                                }

                                _context.next = 11;
                                return new _promise2.default(function (resolve) {
                                    _this.resolve = resolve;
                                    _this.startInstance(_this.configParser.getSpecs(), caps, 0);
                                });

                            case 11:
                                _exitCode = _context.sent;
                                _context.next = 14;
                                return this.runServiceHook(launcher, 'onComplete', _exitCode, config, caps);

                            case 14:
                                _context.next = 16;
                                return config.onComplete(_exitCode, config, caps);

                            case 16:
                                return _context.abrupt('return', _exitCode);

                            case 17:

                                /**
                                 * schedule test runs
                                 */
                                cid = 0;
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context.prev = 21;

                                for (_iterator3 = (0, _getIterator3.default)(caps); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    capabilities = _step3.value;

                                    this.schedule.push({
                                        cid: cid++,
                                        caps: capabilities,
                                        specs: this.configParser.getSpecs(capabilities.specs, capabilities.exclude),
                                        availableInstances: capabilities.maxInstances || config.maxInstancesPerCapability,
                                        runningInstances: 0,
                                        seleniumServer: { host: config.host, port: config.port, protocol: config.protocol }
                                    });
                                }

                                /**
                                 * catches ctrl+c event
                                 */
                                _context.next = 29;
                                break;

                            case 25:
                                _context.prev = 25;
                                _context.t0 = _context['catch'](21);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context.t0;

                            case 29:
                                _context.prev = 29;
                                _context.prev = 30;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 32:
                                _context.prev = 32;

                                if (!_didIteratorError3) {
                                    _context.next = 35;
                                    break;
                                }

                                throw _iteratorError3;

                            case 35:
                                return _context.finish(32);

                            case 36:
                                return _context.finish(29);

                            case 37:
                                process.on('SIGINT', this.exitHandler.bind(this));

                                /**
                                 * make sure the program will not close instantly
                                 */
                                if (process.stdin.isPaused()) {
                                    process.stdin.resume();
                                }

                                _context.next = 41;
                                return new _promise2.default(function (resolve) {
                                    _this.resolve = resolve;

                                    /**
                                     * return immediatelly if no spec was run
                                     */
                                    if (_this.runSpecs()) {
                                        resolve(0);
                                    }
                                });

                            case 41:
                                exitCode = _context.sent;
                                _context.next = 44;
                                return this.runServiceHook(launcher, 'onComplete', exitCode, config, caps);

                            case 44:
                                _context.next = 46;
                                return config.onComplete(exitCode, config, caps);

                            case 46:
                                return _context.abrupt('return', exitCode);

                            case 47:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[21, 25, 29, 37], [30,, 32, 36]]);
            }));

            function run() {
                return _ref.apply(this, arguments);
            }

            return run;
        }()

        /**
         * run service launch sequences
         */

    }, {
        key: 'runServiceHook',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(launcher, hookName) {
                for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    args[_key - 2] = arguments[_key];
                }

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _context2.next = 3;
                                return _promise2.default.all(launcher.map(function (service) {
                                    if (typeof service[hookName] === 'function') {
                                        return service[hookName].apply(service, args);
                                    }
                                }));

                            case 3:
                                return _context2.abrupt('return', _context2.sent);

                            case 6:
                                _context2.prev = 6;
                                _context2.t0 = _context2['catch'](0);

                                console.error('A service failed in the \'' + hookName + '\' hook\n' + _context2.t0.stack + '\n\nContinue...');

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 6]]);
            }));

            function runServiceHook(_x, _x2) {
                return _ref2.apply(this, arguments);
            }

            return runServiceHook;
        }()

        /**
         * run multiple single remote tests
         * @return {Boolean} true if all specs have been run and all instances have finished
         */

    }, {
        key: 'runSpecs',
        value: function runSpecs() {
            var _this2 = this;

            var config = this.configParser.getConfig();

            /**
             * stop spawning new processes when CTRL+C was triggered
             */
            if (this.hasTriggeredExitRoutine) {
                return true;
            }

            while (this.getNumberOfRunningInstances() < config.maxInstances) {
                var schedulableCaps = this.schedule
                /**
                 * bail if number of errors exceeds allowed
                 */
                .filter(function () {
                    var filter = typeof config.bail !== 'number' || config.bail < 1 || config.bail > _this2.runnerFailed;

                    /**
                     * clear number of specs when filter is false
                     */
                    if (!filter) {
                        _this2.schedule.forEach(function (t) {
                            t.specs = [];
                        });
                    }

                    return filter;
                })
                /**
                 * make sure complete number of running instances is not higher than general maxInstances number
                 */
                .filter(function (a) {
                    return _this2.getNumberOfRunningInstances() < config.maxInstances;
                })
                /**
                 * make sure the capabiltiy has available capacities
                 */
                .filter(function (a) {
                    return a.availableInstances > 0;
                })
                /**
                 * make sure capabiltiy has still caps to run
                 */
                .filter(function (a) {
                    return a.specs.length > 0;
                })
                /**
                 * make sure we are running caps with less running instances first
                 */
                .sort(function (a, b) {
                    return a.runningInstances > b.runningInstances;
                });

                /**
                 * continue if no capabiltiy were schedulable
                 */
                if (schedulableCaps.length === 0) {
                    break;
                }

                this.startInstance([schedulableCaps[0].specs.shift()], schedulableCaps[0].caps, schedulableCaps[0].cid, schedulableCaps[0].seleniumServer);
                schedulableCaps[0].availableInstances--;
                schedulableCaps[0].runningInstances++;
            }

            return this.getNumberOfRunningInstances() === 0 && this.getNumberOfSpecsLeft() === 0;
        }

        /**
         * gets number of all running instances
         * @return {number} number of running instances
         */

    }, {
        key: 'getNumberOfRunningInstances',
        value: function getNumberOfRunningInstances() {
            return this.schedule.map(function (a) {
                return a.runningInstances;
            }).reduce(function (a, b) {
                return a + b;
            });
        }

        /**
         * get number of total specs left to complete whole suites
         * @return {number} specs left to complete suite
         */

    }, {
        key: 'getNumberOfSpecsLeft',
        value: function getNumberOfSpecsLeft() {
            return this.schedule.map(function (a) {
                return a.specs.length;
            }).reduce(function (a, b) {
                return a + b;
            });
        }

        /**
         * Start instance in a child process.
         * @param  {Array} specs  Specs to run
         * @param  {Number} cid  Capabilities ID
         */

    }, {
        key: 'startInstance',
        value: function startInstance(specs, caps, cid, server) {
            var config = this.configParser.getConfig();
            var debug = caps.debug || config.debug;
            cid = this.getRunnerId(cid);
            var processNumber = this.processesStarted + 1;

            // process.debugPort defaults to 5858 and is set even when process
            // is not being debugged.
            var debugArgs = debug ? ['--debug=' + (process.debugPort + processNumber)] : [];

            // if you would like to add --debug-brk, use a different port, etc...
            var capExecArgs = [].concat((0, _toConsumableArray3.default)(config.execArgv || []), (0, _toConsumableArray3.default)(caps.execArgv || []));

            // The default value for child.fork execArgs is process.execArgs,
            // so continue to use this unless another value is specified in config.
            var defaultArgs = capExecArgs.length ? process.execArgv : [];

            // If an arg appears multiple times the last occurence is used
            var execArgv = [].concat((0, _toConsumableArray3.default)(defaultArgs), debugArgs, (0, _toConsumableArray3.default)(capExecArgs));

            var childProcess = _child_process2.default.fork(_path2.default.join(__dirname, '/runner.js'), process.argv.slice(2), {
                cwd: process.cwd(),
                execArgv: execArgv
            });

            this.processes.push(childProcess);

            childProcess.on('message', this.messageHandler.bind(this, cid)).on('exit', this.endHandler.bind(this, cid));

            childProcess.send({
                cid: cid,
                command: 'run',
                configFile: this.configFile,
                argv: this.argv,
                caps: caps,
                processNumber: processNumber,
                specs: specs,
                server: server,
                isMultiremote: this.isMultiremote()
            });

            this.processesStarted++;
        }

        /**
         * generates a runner id
         * @param  {Number} cid capability id (unique identifier for a capability)
         * @return {String}     runner id (combination of cid and test id e.g. 0a, 0b, 1a, 1b ...)
         */

    }, {
        key: 'getRunnerId',
        value: function getRunnerId(cid) {
            if (!this.rid[cid]) {
                this.rid[cid] = 0;
            }
            return cid + '-' + this.rid[cid]++;
        }

        /**
         * emit event from child process to reporter
         * @param  {String} cid
         * @param  {Object} m event object
         */

    }, {
        key: 'messageHandler',
        value: function messageHandler(cid, m) {
            this.hasStartedAnyProcess = true;

            if (!m.cid) {
                m.cid = cid;
            }

            if (m.event === 'runner:error') {
                this.reporters.handleEvent('error', m);
            }

            this.reporters.handleEvent(m.event, m);
        }

        /**
         * Close test runner process once all child processes have exited
         * @param  {Number} cid  Capabilities ID
         * @param  {Number} childProcessExitCode  exit code of child process
         */

    }, {
        key: 'endHandler',
        value: function endHandler(cid, childProcessExitCode) {
            this.exitCode = this.exitCode || childProcessExitCode;
            this.runnerFailed += childProcessExitCode !== 0 ? 1 : 0;

            // Update schedule now this process has ended
            if (!this.isMultiremote()) {
                // get cid (capability id) from rid (runner id)
                cid = parseInt(cid, 10);

                this.schedule[cid].availableInstances++;
                this.schedule[cid].runningInstances--;
            }

            if (!this.isMultiremote() && !this.runSpecs()) {
                return;
            }

            this.reporters.handleEvent('end', {
                sigint: this.hasTriggeredExitRoutine,
                exitCode: this.exitCode,
                isMultiremote: this.isMultiremote(),
                capabilities: this.configParser.getCapabilities(),
                config: this.configParser.getConfig()
            });

            if (this.exitCode === 0) {
                return this.resolve(this.exitCode);
            }

            /**
             * finish with exit code 1
             */
            return this.resolve(1);
        }

        /**
         * Make sure all started selenium sessions get closed properly and prevent
         * having dead driver processes. To do so let the runner end its Selenium
         * session first before killing
         */

    }, {
        key: 'exitHandler',
        value: function exitHandler() {
            if (this.hasTriggeredExitRoutine || !this.hasStartedAnyProcess) {
                console.log('\nKilling process, bye!');

                // When spawned as a subprocess,
                // SIGINT will not be forwarded to childs.
                // Thus for the child to exit cleanly, we must force send SIGINT
                if (!process.stdin.isTTY) {
                    this.processes.forEach(function (p) {
                        return p.kill('SIGINT');
                    });
                }

                /**
                 * finish with exit code 1
                 */
                return this.resolve(1);
            }

            // When spawned as a subprocess,
            // SIGINT will not be forwarded to childs.
            // Thus for the child to exit cleanly, we must force send SIGINT
            if (!process.stdin.isTTY) {
                this.processes.forEach(function (p) {
                    return p.kill('SIGINT');
                });
            }

            console.log('\n\nEnd selenium sessions properly ...\n(press ctrl+c again to hard kill the runner)\n');

            this.hasTriggeredExitRoutine = true;
        }

        /**
         * loads launch services
         */

    }, {
        key: 'getLauncher',
        value: function getLauncher(config) {
            var launchServices = [];

            if (!Array.isArray(config.services)) {
                return launchServices;
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
                        launchServices.push(serviceName);
                        continue;
                    }

                    try {
                        service = require('wdio-' + serviceName + '-service/launcher');
                    } catch (e) {
                        if (!e.message.match('Cannot find module \'wdio-' + serviceName + '-service/launcher\'')) {
                            throw new Error('Couldn\'t initialise launcher from service "' + serviceName + '".\n' + e.stack);
                        }
                    }

                    if (service && typeof service.onPrepare === 'function') {
                        launchServices.push(service);
                    }
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

            return launchServices;
        }
    }]);
    return Launcher;
}();

exports.default = Launcher;
module.exports = exports['default'];