'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isAppInstalled;

var _ErrorHandler = require('../utils/ErrorHandler');

function isAppInstalled(bundleId) {
    if (typeof bundleId !== 'string') {
        throw new _ErrorHandler.ProtocolError('isAppInstalled command requires bundleId parameter from type string');
    }

    return this.unify(this.requestHandler.create({
        path: '/session/:sessionId/appium/device/app_installed',
        method: 'POST'
    }, { bundleId: bundleId }));
} /**
   *
   * Check if an app is installed.
   *
   * <example>
      :isAppInstalled.js
      it('should check if app is installed', function () {
          var isAppInstalled = browser.isAppInstalled('com.example.android.apis');
          console.log(isAppInstalled); // outputs: true
      });
   * </example>
   *
   * @param {String} bundleId  ID of bundled app
   *
   * @see  https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/appium-bindings.md#is-installed
   * @type mobile
   * @for android
   *
   */

module.exports = exports['default'];