'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isLocked;
/**
 *
 * Check whether the device is locked or not.
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
 * @type mobile
 * @for android
 *
 */

function isLocked() {
    return this.unify(this.requestHandler.create({
        path: '/session/:sessionId/appium/device/is_locked',
        method: 'POST'
    }));
}
module.exports = exports['default'];