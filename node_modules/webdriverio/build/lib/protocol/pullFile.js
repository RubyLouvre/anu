'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pullFile;

var _ErrorHandler = require('../utils/ErrorHandler');

function pullFile(path) {
    if (typeof path !== 'string') {
        throw new _ErrorHandler.ProtocolError('pullFile requires a parameter (path to file) from type string');
    }

    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/pull_file',
        method: 'POST'
    }, { path: path });
} /**
   *
   * Pulls a file from the device.
   *
   * <example>
      :pullFile.js
      browser.pullFile('/data/local/tmp/file.txt')
   * </example>
   *
   * @param {String} path  device path to file
   *
   * @see  https://github.com/appium/appium/blob/master/docs/en/appium-bindings.md#pull-file
   * @type mobile
   * @for ios, android
   *
   */

module.exports = exports['default'];