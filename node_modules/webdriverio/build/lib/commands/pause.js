"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Pauses execution for a specific amount of time. It is recommended to not use this command to wait for an
 * element to show up. In order to avoid flaky test results it is better to use commands like
 * [`waitforExist`](/api/utility/waitForExist.html) or other waitFor* commands.
 *
 * <example>
    :pause.js
    it('should pause the execution', function () {
        var starttime = new Date().getTime();
        browser.pause(3000);
        var endtime = new Date().getTime();
        console.log(endtime - starttime); // outputs: 3000
    });
 * </example>
 *
 * @alias browser.pause
 * @param {Number} milliseconds time in ms
 * @type utility
 *
 */

var pause = function pause() {
    var milliseconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

    return new _promise2.default(function (resolve) {
        return setTimeout(resolve, milliseconds);
    });
};

exports.default = pause;
module.exports = exports["default"];