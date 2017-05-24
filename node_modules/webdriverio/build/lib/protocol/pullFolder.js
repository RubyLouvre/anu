'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pullFolder;

var _ErrorHandler = require('../utils/ErrorHandler');

function pullFolder(path) {
    if (typeof path !== 'string') {
        throw new _ErrorHandler.ProtocolError('pullFolder requires a parameter (path to folder) from type string');
    }

    return this.requestHandler.create({
        path: '/session/:sessionId/appium/device/pull_folder',
        method: 'POST'
    }, { path: path });
} /**
   *
   * Pulls a folder from the device's file system.
   *
   * <example>
      :pullFolder.js
      browser.pullFolder('/data/local/tmp')
   * </example>
   *
   * @param {String} path  device path to folder
   *
   * @type mobile
   * @for ios, android
   *
   */

module.exports = exports['default'];