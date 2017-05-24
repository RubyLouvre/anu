'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = installApp;

var _ErrorHandler = require('../utils/ErrorHandler');

function installApp(appPath) {
    if (typeof appPath !== 'string') {
        throw new _ErrorHandler.ProtocolError('installApp command requires appPath parameter from type string');
    }

    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/install_app',
        method: 'POST'
    }, { appPath: appPath });
} /**
   *
   * Install an app on device.
   *
   * <example>
      :installApp.js
      it('should install app from file system', function () {
          browser.installApp('/path/to/my/App.app');
      });
   * </example>
   *
   * @param {String} path  path to Android application
   *
   * @see  https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/appium-bindings.md#install-app
   * @type mobile
   * @for android
   *
   */

module.exports = exports['default'];