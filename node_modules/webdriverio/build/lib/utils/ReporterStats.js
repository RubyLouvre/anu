'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReporterStats = exports.TestStats = exports.SuiteStats = exports.SpecStats = exports.RunnerStats = exports.RunnableStats = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _sanitize = require('../helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RunnableStats = function () {
    function RunnableStats(type) {
        (0, _classCallCheck3.default)(this, RunnableStats);

        this.type = type;
        this.start = new Date();
        this._duration = 0;
    }

    (0, _createClass3.default)(RunnableStats, [{
        key: 'complete',
        value: function complete() {
            this.end = new Date();
            this._duration = this.end - this.start;
        }
    }, {
        key: 'duration',
        get: function get() {
            if (this.end) {
                return this._duration;
            }
            return new Date() - this.start;
        }
    }]);
    return RunnableStats;
}();

var RunnerStats = function (_RunnableStats) {
    (0, _inherits3.default)(RunnerStats, _RunnableStats);

    function RunnerStats(runner) {
        (0, _classCallCheck3.default)(this, RunnerStats);

        var _this = (0, _possibleConstructorReturn3.default)(this, (RunnerStats.__proto__ || (0, _getPrototypeOf2.default)(RunnerStats)).call(this, 'runner'));

        _this.uid = ReporterStats.getIdentifier(runner);
        _this.cid = runner.cid;
        _this.capabilities = runner.capabilities;
        _this.sanitizedCapabilities = runner.capabilities && _sanitize2.default.caps(runner.capabilities);
        _this.config = runner.config;
        _this.specs = {};
        return _this;
    }

    return RunnerStats;
}(RunnableStats);

var SpecStats = function (_RunnableStats2) {
    (0, _inherits3.default)(SpecStats, _RunnableStats2);

    function SpecStats(runner) {
        (0, _classCallCheck3.default)(this, SpecStats);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (SpecStats.__proto__ || (0, _getPrototypeOf2.default)(SpecStats)).call(this, 'spec'));

        _this2.uid = ReporterStats.getIdentifier(runner);
        _this2.files = runner.specs;
        _this2.specHash = runner.specHash;
        _this2.suites = {};
        _this2.output = [];
        return _this2;
    }

    return SpecStats;
}(RunnableStats);

var SuiteStats = function (_RunnableStats3) {
    (0, _inherits3.default)(SuiteStats, _RunnableStats3);

    function SuiteStats(runner) {
        (0, _classCallCheck3.default)(this, SuiteStats);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (SuiteStats.__proto__ || (0, _getPrototypeOf2.default)(SuiteStats)).call(this, 'suite'));

        _this3.uid = ReporterStats.getIdentifier(runner);
        _this3.title = runner.title;
        _this3.tests = {};
        _this3.hooks = {};
        return _this3;
    }

    return SuiteStats;
}(RunnableStats);

var TestStats = function (_RunnableStats4) {
    (0, _inherits3.default)(TestStats, _RunnableStats4);

    function TestStats(runner) {
        (0, _classCallCheck3.default)(this, TestStats);

        var _this4 = (0, _possibleConstructorReturn3.default)(this, (TestStats.__proto__ || (0, _getPrototypeOf2.default)(TestStats)).call(this, 'test'));

        _this4.uid = ReporterStats.getIdentifier(runner);
        _this4.title = runner.title;
        _this4.state = '';
        _this4.screenshots = [];
        _this4.output = [];
        return _this4;
    }

    return TestStats;
}(RunnableStats);

var HookStats = function (_RunnableStats5) {
    (0, _inherits3.default)(HookStats, _RunnableStats5);

    function HookStats(runner) {
        (0, _classCallCheck3.default)(this, HookStats);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (HookStats.__proto__ || (0, _getPrototypeOf2.default)(HookStats)).call(this, 'hook'));

        _this5.uid = ReporterStats.getIdentifier(runner);
        _this5.title = runner.title;
        _this5.parent = runner.parent;
        _this5.parenUid = runner.parentUid || runner.parent;
        _this5.currentTest = runner.currentTest;
        return _this5;
    }

    return HookStats;
}(RunnableStats);

var ReporterStats = function (_RunnableStats6) {
    (0, _inherits3.default)(ReporterStats, _RunnableStats6);

    function ReporterStats() {
        (0, _classCallCheck3.default)(this, ReporterStats);

        var _this6 = (0, _possibleConstructorReturn3.default)(this, (ReporterStats.__proto__ || (0, _getPrototypeOf2.default)(ReporterStats)).call(this, 'base'));

        _this6.runners = {};

        _this6.reset();
        return _this6;
    }

    (0, _createClass3.default)(ReporterStats, [{
        key: 'reset',
        value: function reset() {
            this.counts = {
                suites: 0,
                tests: 0,
                hooks: 0,
                passes: 0,
                pending: 0,
                failures: 0
            };
            this.failures = [];
        }
    }, {
        key: 'getCounts',
        value: function getCounts() {
            return this.counts;
        }
    }, {
        key: 'getFailures',
        value: function getFailures() {
            var _this7 = this;

            return this.failures.map(function (test) {
                test.runningBrowser = '';
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(test.runner)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var pid = _step.value;

                        var caps = test.runner[pid];
                        test.runningBrowser += '\nrunning';

                        if (caps.browserName) {
                            test.runningBrowser += ' ' + caps.browserName;
                        }
                        if (caps.version) {
                            test.runningBrowser += ' (v' + caps.version + ')';
                        }
                        if (caps.platform) {
                            test.runningBrowser += ' on ' + caps.platform;
                        }

                        var host = _this7.runners[pid].config.host;
                        if (host && host.indexOf('saucelabs') > -1) {
                            test.runningBrowser += '\nCheck out job at https://saucelabs.com/tests/' + _this7.runners[pid].sessionID;
                        }
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

                return test;
            });
        }
    }, {
        key: 'runnerStart',
        value: function runnerStart(runner) {
            if (!this.runners[runner.cid]) {
                this.runners[runner.cid] = new RunnerStats(runner);
            }
        }
    }, {
        key: 'getRunnerStats',
        value: function getRunnerStats(runner) {
            if (!this.runners[runner.cid]) throw Error('Unrecognised runner [' + runner.cid + ']');
            return this.runners[runner.cid];
        }
    }, {
        key: 'getSpecHash',
        value: function getSpecHash(runner) {
            if (!runner.specHash) {
                if (!runner.specs) throw Error('Cannot generate spec hash for runner with no \'specs\' key');
                runner.specHash = _crypto2.default.createHash('md5').update(runner.specs.join('')).digest('hex');
            }
            return runner.specHash;
        }
    }, {
        key: 'specStart',
        value: function specStart(runner) {
            var specHash = this.getSpecHash(runner);
            this.getRunnerStats(runner).specs[specHash] = new SpecStats(runner);
        }
    }, {
        key: 'getSpecStats',
        value: function getSpecStats(runner) {
            var runnerStats = this.getRunnerStats(runner);
            var specHash = this.getSpecHash(runner);
            if (!runnerStats.specs[specHash]) throw Error('Unrecognised spec [' + specHash + '] for runner [' + runner.cid + ']');
            return runnerStats.specs[specHash];
        }
    }, {
        key: 'setSessionId',
        value: function setSessionId(runner) {
            this.getRunnerStats(runner).sessionID = runner.sessionID;
        }
    }, {
        key: 'suiteStart',
        value: function suiteStart(runner) {
            this.getSpecStats(runner).suites[ReporterStats.getIdentifier(runner)] = new SuiteStats(runner);
            this.counts.suites++;
        }
    }, {
        key: 'getSuiteStats',
        value: function getSuiteStats(runner, suiteTitle) {
            var specStats = this.getSpecStats(runner);

            /**
             * if error occurs in root level hooks we haven't created any suites yet, so
             * create one here if so
             */
            if (!specStats.suites[suiteTitle]) {
                this.suiteStart((0, _deepmerge2.default)(runner, { title: runner.parent }));
                specStats = this.getSpecStats(runner);
            }

            return specStats.suites[suiteTitle];
        }
    }, {
        key: 'hookStart',
        value: function hookStart(runner) {
            var suiteStat = this.getSuiteStats(runner, runner.parentUid || runner.parent);

            if (!suiteStat) {
                return;
            }

            suiteStat.hooks[ReporterStats.getIdentifier(runner)] = new HookStats(runner);
        }
    }, {
        key: 'hookEnd',
        value: function hookEnd(runner) {
            var hookStats = this.getHookStats(runner);

            if (!hookStats) {
                return;
            }

            hookStats.complete();
            this.counts.hooks++;
        }
    }, {
        key: 'testStart',
        value: function testStart(runner) {
            this.getSuiteStats(runner, runner.parentUid || runner.parent).tests[ReporterStats.getIdentifier(runner)] = new TestStats(runner);
        }
    }, {
        key: 'getHookStats',
        value: function getHookStats(runner) {
            var suiteStats = this.getSuiteStats(runner, runner.parentUid || runner.parent);

            if (!suiteStats) {
                return;
            }

            // Errors encountered inside hooks (e.g. beforeEach) can be identified by looking
            // at the currentTest param (currently only applicable to the Mocha adapter).
            var uid = runner.currentTest || ReporterStats.getIdentifier(runner);
            if (!suiteStats.hooks[uid]) {
                uid = ReporterStats.getIdentifier(runner);
            }

            if (!suiteStats.hooks[uid]) throw Error('Unrecognised hook [' + runner.title + '] for suite [' + runner.parent + ']');
            return suiteStats.hooks[uid];
        }
    }, {
        key: 'getTestStats',
        value: function getTestStats(runner) {
            var suiteStats = this.getSuiteStats(runner, runner.parentUid || runner.parent);

            if (!suiteStats) {
                return;
            }

            // Errors encountered inside hooks (e.g. beforeEach) can be identified by looking
            // at the currentTest param (currently only applicable to the Mocha adapter).
            var uid = runner.currentTest || ReporterStats.getIdentifier(runner);
            if (!suiteStats.tests[uid]) {
                uid = ReporterStats.getIdentifier(runner);
            }

            if (!suiteStats.tests[uid]) throw Error('Unrecognised test [' + runner.title + '] for suite [' + runner.parent + ']');
            return suiteStats.tests[uid];
        }
    }, {
        key: 'output',
        value: function output(type, runner) {
            runner.time = new Date();
            // Remove the screenshot data to reduce RAM usage on the parent process
            if (type === 'screenshot') {
                runner.data = null;
            }
            if (ReporterStats.getIdentifier(runner) && runner.parent) {
                this.getTestStats(runner).output.push({
                    type: type,
                    payload: runner
                });
            } else {
                // Log commands, results and screenshots executed outside of a test
                this.getSpecStats(runner).output.push({
                    type: type,
                    payload: runner
                });
            }
        }
    }, {
        key: 'testPass',
        value: function testPass(runner) {
            this.getTestStats(runner).state = 'pass';
            this.counts.passes++;
        }
    }, {
        key: 'testPending',
        value: function testPending(runner) {
            // Pending tests don't actually start, so won't yet be registered
            this.testStart(runner);
            this.testEnd(runner);
            this.getTestStats(runner).state = 'pending';
            this.counts.pending++;
        }
    }, {
        key: 'testFail',
        value: function testFail(runner) {
            var testStats = void 0;

            /**
             * replace "Ensure the done() callback is being called in this test." with more meaningful
             * message
             */
            var message = 'Ensure the done() callback is being called in this test.';
            if (runner.err && runner.err.message && runner.err.message.indexOf(message) > -1) {
                var replacement = 'The execution in the test "' + runner.parent + ' ' + runner.title + '" took ' + 'too long. Try to reduce the run time or increase your timeout for ' + 'test specs (http://webdriver.io/guide/testrunner/timeouts.html).';
                runner.err.message = runner.err.message.replace(message, replacement);
                runner.err.stack = runner.err.stack.replace(message, replacement);
            }

            message = 'For async tests and hooks, ensure "done()" is called;';
            if (runner.err && runner.err.message && runner.err.message.indexOf(message) > -1) {
                var _replacement = 'Try to reduce the run time or increase your timeout for ' + 'test specs (http://webdriver.io/guide/testrunner/timeouts.html);';
                runner.err.message = runner.err.message.replace(message, _replacement);
                runner.err.stack = runner.err.stack.replace(message, _replacement);
            }

            try {
                testStats = this.getTestStats(runner);
            } catch (e) {
                // If a test fails during the before() or beforeEach() hook, it will not yet
                // have been 'started', so start now
                this.testStart(runner);
                testStats = this.getTestStats(runner);
            }

            testStats.state = 'fail';
            testStats.error = runner.err;
            this.counts.failures++;

            /**
             * check if error also happened in other runners
             */
            var duplicateError = false;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(this.failures), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var failure = _step2.value;

                    if (runner.err.message !== failure.err.message || ReporterStats.getIdentifier(failure) !== ReporterStats.getIdentifier(runner)) {
                        continue;
                    }
                    duplicateError = true;
                    failure.runner[runner.cid] = runner.runner[runner.cid];
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

            if (!duplicateError) {
                this.failures.push(runner);
            }
        }
    }, {
        key: 'testEnd',
        value: function testEnd(runner) {
            this.getTestStats(runner).complete();
            this.counts.tests++;
        }
    }, {
        key: 'suiteEnd',
        value: function suiteEnd(runner) {
            this.getSuiteStats(runner, ReporterStats.getIdentifier(runner)).complete();
        }
    }, {
        key: 'runnerEnd',
        value: function runnerEnd(runner) {
            this.getSpecStats(runner).complete();
        }
    }], [{
        key: 'getIdentifier',
        value: function getIdentifier(runner) {
            return runner.uid || runner.title;
        }
    }]);
    return ReporterStats;
}(RunnableStats);

exports.RunnableStats = RunnableStats;
exports.RunnerStats = RunnerStats;
exports.SpecStats = SpecStats;
exports.SuiteStats = SuiteStats;
exports.TestStats = TestStats;
exports.ReporterStats = ReporterStats;