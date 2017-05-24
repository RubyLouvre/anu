'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = lock;
/**
 *
 * Lock the device.
 *
 * <example>
    :lockIt.js
    it('demonstrate the lock and unlock command', function () {
        browser.lock();
        console.log(browser.isLocked()); // true

        browser.unlock();
        console.log(browser.isLocked()); // false
    });
 * </example>
 *
 * @param {Number} seconds  wait in seconds until lock screen
 *
 * @see  https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/appium-bindings.md#lock
 * @type mobile
 * @for android
 *
 */

function lock() {
    var seconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/lock',
        method: 'POST'
    }, { seconds: seconds });
}
module.exports = exports['default'];