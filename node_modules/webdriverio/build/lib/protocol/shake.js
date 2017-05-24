'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = shake;
/**
 *
 * Perform a shake action on the device.
 *
 * <example>
    :shakeIt.js
    browser.shake()
 * </example>
 *
 * @see  https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/appium-bindings.md#shake
 * @type mobile
 * @for ios
 *
 */

function shake() {
    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/shake',
        method: 'POST'
    });
}
module.exports = exports['default'];