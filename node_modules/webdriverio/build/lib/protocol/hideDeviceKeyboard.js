'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = hideDeviceKeyboard;
/**
 *
 * Hide the keyboard.
 *
 * <example>
    :hideKeyboard.js
    it('should hide keyboard by tapping outside of it', function () {
        browser.hideDeviceKeyboard(); // taps outside to hide keyboard per default
        browser.hideDeviceKeyboard('tapOutside');
    });

    it('should hide keyboard by pressing done', function () {
        browser.hideDeviceKeyboard('pressKey', 'Done');
    });
 * </example>
 *
 * @param {String} strategy  desired strategy to close keyboard ('tapOutside' or 'pressKey')
 *
 * @see  https://github.com/appium/appium/blob/master/docs/en/appium-bindings.md#hide-keyboard-ios-only
 * @type mobile
 * @for ios, android
 *
 */

function hideDeviceKeyboard() {
    var strategy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tapOutside';
    var key = arguments[1];

    var args = { strategy: strategy };

    if (key) {
        args.key = key;
    }

    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/hide_keyboard',
        method: 'POST'
    }, args);
}
module.exports = exports['default'];