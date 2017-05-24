'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (condition, timeout, timeoutMsg, interval) {
    /*!
     * ensure that timeout and interval are set properly
     */
    if (typeof timeout !== 'number') {
        timeout = this.options.waitforTimeout;
    }

    if (typeof interval !== 'number') {
        interval = this.options.waitforInterval;
    }

    var fn = void 0;

    if (typeof condition === 'function') {
        fn = condition.bind(this);
    } else {
        fn = function fn() {
            return _promise2.default.resolve(condition);
        };
    }

    var isSync = this.options.sync;
    var timer = new _Timer2.default(interval, timeout, fn, true, isSync);

    return timer.catch(function (e) {
        if (e.message === 'timeout' && typeof timeoutMsg === 'string') {
            throw new _ErrorHandler.WaitUntilTimeoutError(timeoutMsg);
        }

        if (e.type === 'NoSuchElement') {
            throw new _ErrorHandler.WaitUntilTimeoutError(e.message);
        }

        throw new _ErrorHandler.WaitUntilTimeoutError('Promise was rejected with the following reason: ' + e.message);
    });
};

var _ErrorHandler = require('../utils/ErrorHandler');

var _Timer = require('../utils/Timer');

var _Timer2 = _interopRequireDefault(_Timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default']; /**
                                      *
                                      * This wait command is your universal weapon if you want to wait on something. It expects a condition
                                      * and waits until that condition is fulfilled with a truthy value. A condition can be either a promise
                                      * or a command result. The commands within the condition are getting executed synchronously like in
                                      * your test.
                                      *
                                      * A common example is to wait until a certain element contains a certain text (see example).
                                      *
                                      * <example>
                                         :example.html
                                         <div id="someText">I am some text</div>
                                         <script>
                                           setTimeout(function() {
                                             $('#someText').html('I am now different');
                                           }, 1000);
                                         </script>
                                     
                                         :waitUntil.js
                                         it('should wait until text has changed', function () {
                                             browser.waitUntil(function () {
                                               return browser.getText('#someText') === 'I am now different'
                                             }, 5000, 'expected text to be different after 5s');
                                         });
                                      * </example>
                                      *
                                      *
                                      * @alias browser.waitUntil
                                      * @param {Function|Promise} condition  condition to wait on
                                      * @param {Number=}          timeout    timeout in ms (default: 500)
                                      * @param {String=}          timeoutMsg error message to throw when waitUntil times out
                                      * @param {Number=}          interval   interval between condition checks (default: 500)
                                      * @uses utility/pause
                                      * @type utility
                                      *
                                      */