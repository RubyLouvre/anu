'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIMEOUT_ERROR = 'timeout';

/**
 * Promise-based Timer. Execute fn every tick.
 * When fn is resolved — timer will stop
 * @param {Number} delay - delay between ticks
 * @param {Number} timeout - after that time timer will stop
 * @param {Function} fn - function that returns promise. will execute every tick
 * @param {Boolean} leading - should be function invoked on start
 * @param {Boolean} isSync - true if test runner runs commands synchronously
 * @return {promise} Promise-based Timer.
 */

var Timer = function () {
    function Timer(delay, timeout, fn, leading, isSync) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Timer);

        this._delay = delay;
        this._timeout = timeout;
        this._fn = fn;
        this._leading = leading;
        this._conditionExecutedCnt = 0;

        /**
         * execute commands synchronously if method name is not async
         */
        if (isSync && typeof global.wdioSync === 'function' && fn.name.match(/^(bound )*async$/) === null) {
            this._fn = function () {
                return new _promise2.default(function (resolve) {
                    return global.wdioSync(fn, resolve)();
                });
            };
        }

        var retPromise = new _promise2.default(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });

        this.start();

        return retPromise;
    }

    (0, _createClass3.default)(Timer, [{
        key: 'start',
        value: function start() {
            var _this2 = this;

            this._start = Date.now();
            this._ticks = 0;
            if (this._leading) {
                this.tick();
            } else {
                this._timeoutId = setTimeout(this.tick.bind(this), this._delay);
            }

            this._mainTimeoutId = setTimeout(function () {
                /**
                 * make sure that condition was executed at least once
                 */
                if (!_this2.wasConditionExecuted()) {
                    return;
                }

                var reason = _this2.lastError || new Error(TIMEOUT_ERROR);
                _this2._reject(reason);
                _this2.stop();
            }, this._timeout);
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this._timeoutId) {
                clearTimeout(this._timeoutId);
            }
            this._timeoutId = null;
        }
    }, {
        key: 'stopMain',
        value: function stopMain() {
            clearTimeout(this._mainTimeoutId);
        }
    }, {
        key: 'tick',
        value: function tick() {
            var _this3 = this;

            var result = this._fn();

            if (typeof result.then !== 'function') {
                this.stop();
                this.stopMain();
                return this._reject('Expected a promise as return value but got "' + result + '"');
            }

            result.then(function (res) {
                return _this3.checkCondition(null, res);
            }, function (err) {
                return _this3.checkCondition(err);
            });
        }
    }, {
        key: 'checkCondition',
        value: function checkCondition(err, res) {
            ++this._conditionExecutedCnt;
            this.lastError = err;

            // resolve timer only on truthy values
            if (res) {
                this._resolve(res);
                this.stop();
                this.stopMain();
                return;
            }

            // autocorrect timer
            var diff = Date.now() - this._start - this._ticks++ * this._delay;
            var delay = Math.max(0, this._delay - diff);

            // clear old timeoutID
            this.stop();

            // check if we have time to one more tick
            if (this.hasTime(delay)) {
                this._timeoutId = setTimeout(this.tick.bind(this), delay);
            } else {
                this.stopMain();
                var reason = this.lastError || new Error(TIMEOUT_ERROR);
                this._reject(reason);
            }
        }
    }, {
        key: 'hasTime',
        value: function hasTime(delay) {
            return Date.now() - this._start + delay <= this._timeout;
        }
    }, {
        key: 'wasConditionExecuted',
        value: function wasConditionExecuted() {
            return this._conditionExecutedCnt > 0;
        }
    }]);
    return Timer;
}();

exports.default = Timer;
module.exports = exports['default'];