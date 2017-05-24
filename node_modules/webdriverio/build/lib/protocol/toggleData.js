'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = toggleData;
/**
 *
 * Switch the state (enabled/disabled) of data service.
 *
 * <example>
    :toggleData.js
    browser.toggleData()
 * </example>
 *
 * @type mobile
 * @for android
 *
 */

function toggleData() {
    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/toggle_data',
        method: 'POST'
    });
}
module.exports = exports['default'];