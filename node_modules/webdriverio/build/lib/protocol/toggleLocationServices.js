'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = toggleLocationServices;
/**
 *
 * Switch the state (enabled/disabled) of the location service.
 *
 * <example>
    :toggleLocationServices.js
    browser.toggleLocationServices();
 * </example>
 *
 * @type mobile
 * @for android
 *
 */

function toggleLocationServices() {
    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/toggle_location_services',
        method: 'POST'
    });
}
module.exports = exports['default'];