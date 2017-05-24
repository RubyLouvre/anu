'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cursor = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _tty = require('tty');

var _tty2 = _interopRequireDefault(_tty);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _supportsColor = require('supports-color');

var _supportsColor2 = _interopRequireDefault(_supportsColor);

var _sanitize = require('../helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _ReporterStats = require('./ReporterStats');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ISATTY = _tty2.default.isatty(1) && _tty2.default.isatty(2);

var COLORS = {
    'pass': 90,
    'fail': 31,
    'bright pass': 92,
    'bright fail': 91,
    'bright yellow': 93,
    'pending': 36,
    'suite': 0,
    'error title': 0,
    'error message': 31,
    'error stack': 90,
    'checkmark': 32,
    'fast': 90,
    'medium': 33,
    'slow': 31,
    'green': 32,
    'light': 90,
    'diff gutter': 90,
    'diff added': 32,
    'diff removed': 31
};

var SYMBOLS_WIN = {
    ok: '\u221A',
    err: '\xD7',
    dot: '.',
    error: 'F'
};

var SYMBOLS = {
    ok: '✓',
    err: '✖',
    dot: '․',
    error: 'F'
};

var BaseReporter = function (_events$EventEmitter) {
    (0, _inherits3.default)(BaseReporter, _events$EventEmitter);

    function BaseReporter() {
        (0, _classCallCheck3.default)(this, BaseReporter);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BaseReporter.__proto__ || (0, _getPrototypeOf2.default)(BaseReporter)).call(this));

        _this.reporters = [];
        _this.printEpilogue = true;
        _this.cursor = new Cursor();
        _this.stats = new _ReporterStats.ReporterStats();

        _this.on('start', function () {});

        _this.on('runner:start', function (runner) {
            _this.stats.runnerStart(runner);
            _this.stats.specStart(runner);
        });

        _this.on('runner:init', function (runner) {
            _this.stats.setSessionId(runner);
        });

        _this.on('runner:beforecommand', function (command) {
            _this.stats.output('beforecommand', command);
        });

        _this.on('runner:command', function (command) {
            _this.stats.output('command', command);
        });

        _this.on('runner:aftercommand', function (command) {
            _this.stats.output('aftercommand', command);
        });

        _this.on('runner:result', function (result) {
            _this.stats.output('result', result);
        });

        _this.on('runner:screenshot', function (screenshot) {
            _this.stats.output('screenshot', screenshot);
        });

        _this.on('runner:log', function (log) {
            _this.stats.output('log', log);
        });

        _this.on('suite:start', function (suite) {
            _this.stats.suiteStart(suite);
        });

        _this.on('hook:start', function (hook) {
            _this.stats.hookStart(hook);
        });

        _this.on('hook:end', function (hook) {
            _this.stats.hookEnd(hook);
        });

        _this.on('test:start', function (test) {
            _this.stats.testStart(test);
        });

        _this.on('test:pass', function (test) {
            _this.stats.testPass(test);
        });

        _this.on('test:fail', function (test) {
            _this.stats.testFail(test);
        });

        _this.on('test:pending', function (test) {
            _this.stats.testPending(test);
        });

        _this.on('test:end', function (test) {
            _this.stats.testEnd(test);
        });

        _this.on('suite:end', function (runner) {
            _this.stats.suiteEnd(runner);
        });

        _this.on('error', function (runner) {
            _this.printEpilogue = false;

            var fmt = _this.color('error message', 'ERROR: %s');
            console.log(fmt, runner.error.message);

            fmt = _this.color('bright yellow', _sanitize2.default.caps(runner.capabilities));
            console.log(fmt);

            if (runner.error.stack) {
                fmt = _this.color('error stack', runner.error.stack.replace('Error: ' + runner.error.message + '\n', ''));
            } else {
                fmt = _this.color('error stack', '    no stack available');
            }
            console.log(fmt);
        });

        _this.on('runner:end', function (runner) {
            _this.stats.runnerEnd(runner);
        });

        _this.on('end', function (args) {
            _this.stats.complete();
            _this.printEpilogue = _this.printEpilogue && !args.sigint;
        });
        return _this;
    }

    /**
     * Color `str` with the given `type`,
     * allowing colors to be disabled,
     * as well as user-defined color
     * schemes.
     *
     * @param {String} type
     * @param {String} str
     * @return {String}
     * @api private
     */


    (0, _createClass3.default)(BaseReporter, [{
        key: 'color',
        value: function color(type, str) {
            if (!_supportsColor2.default) return String(str);
            return '\x1B[' + COLORS[type] + 'm' + str + '\x1B[0m';
        }
    }, {
        key: 'limit',
        value: function limit(val) {
            return _sanitize2.default.limit(val);
        }

        /**
         * Output common epilogue used by many of
         * the bundled reporters.
         *
         * @api public
         */

    }, {
        key: 'epilogue',
        value: function epilogue() {
            if (!this.printEpilogue) {
                return;
            }

            var counts = this.stats.getCounts();

            console.log('\n');

            // passes
            var fmt = this.color('green', '%d passing') + this.color('light', ' (%ss)');
            console.log(fmt, counts.passes || 0, (Math.round(this.stats.duration / 100) / 10).toFixed(2));

            // pending
            if (counts.pending) {
                fmt = this.color('pending', '%d skipped');
                console.log(fmt, counts.pending);
            }

            // failures
            if (counts.failures) {
                fmt = this.color('fail', '%d failing');
                console.log(fmt, counts.failures);
                this.listFailures();
            }

            console.log();

            this.printEpilogue = false;
        }

        /**
         * Outut the given failures as a list
         */

    }, {
        key: 'listFailures',
        value: function listFailures() {
            var _this2 = this;

            console.log();
            this.stats.getFailures().forEach(function (test, i) {
                var fmt = _this2.color('error title', '%s) %s:\n') + _this2.color('error message', '%s') + _this2.color('bright yellow', '%s') + _this2.color('error stack', '\n%s\n');
                var title = typeof test.fullTitle !== 'undefined' ? test.fullTitle : typeof test.parent !== 'undefined' ? test.parent + ' ' + test.title : test.title;
                console.log(fmt, i + 1, title, test.err.message, test.runningBrowser, test.err.stack);
            });
        }
    }, {
        key: 'add',
        value: function add(reporter) {
            this.reporters.push(reporter);
        }

        // Although BaseReporter is an eventemitter, handleEvent() is called instead of emit()
        // so that every event can be propagated to attached reporters

    }, {
        key: 'handleEvent',
        value: function handleEvent() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (this.listeners(args[0]).length) {
                this.emit.apply(this, args);
            }

            if (this.reporters.length === 0) {
                return;
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.reporters), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var reporter = _step.value;

                    /**
                     * skip reporter if
                     *  - he isn't an eventemitter
                     *  - event is not registered
                     */
                    if (typeof reporter.emit !== 'function' || !reporter.listeners(args[0]).length) {
                        continue;
                    }

                    reporter.emit.apply(reporter, args);
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
        }

        /**
         * Default color map.
         */

    }, {
        key: 'colors',
        get: function get() {
            return COLORS;
        }

        /**
         * Default symbol map.
         */

    }, {
        key: 'symbols',
        get: function get() {
            /**
             * With node.js on Windows: use symbols available in terminal default fonts
             */
            if (process.platform === 'win32') {
                return SYMBOLS_WIN;
            }

            return SYMBOLS;
        }
    }]);
    return BaseReporter;
}(_events2.default.EventEmitter);

/**
 * Expose some basic cursor interactions
 * that are common among reporters.
 */


var Cursor = function () {
    function Cursor() {
        (0, _classCallCheck3.default)(this, Cursor);
    }

    (0, _createClass3.default)(Cursor, [{
        key: 'hide',
        value: function hide() {
            ISATTY && process.stdout.write('\x1B[?25l');
        }
    }, {
        key: 'show',
        value: function show() {
            ISATTY && process.stdout.write('\x1B[?25h');
        }
    }, {
        key: 'deleteLine',
        value: function deleteLine() {
            ISATTY && process.stdout.write('\x1B[2K');
        }
    }, {
        key: 'beginningOfLine',
        value: function beginningOfLine() {
            ISATTY && process.stdout.write('\x1B[0G');
        }
    }, {
        key: 'CR',
        value: function CR() {
            if (ISATTY) {
                this.deleteLine();
                this.beginningOfLine();
            } else {
                process.stdout.write('\r');
            }
        }
    }, {
        key: 'isatty',
        get: function get() {
            return ISATTY;
        }
    }]);
    return Cursor;
}();

exports.default = BaseReporter;
exports.Cursor = Cursor;