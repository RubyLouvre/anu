'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = unlock;
/**
 *
 * Unlock the device.
 *
 * <example>
    :unlockIt.js
    it('demonstrate the lock and unlock command', function () {
        browser.lock();
        console.log(browser.isLocked()); // true

        browser.unlock();
        console.log(browser.isLocked()); // false
    });
 * </example>
 *
 * @type mobile
 * @for android
 *
 */

function unlock() {
    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/unlock',
        method: 'POST'
    });
}
module.exports = exports['default'];