'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = openNotifications;
/**
 *
 * Open the notifications pane on the device.
 *
 * <example>
    :openNotificationsSync.js
    browser.openNotifications();
 * </example>
 *
 * @type mobile
 * @for android
 *
 */

function openNotifications() {
    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/open_notifications',
        method: 'POST'
    });
}
module.exports = exports['default'];