'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = touchDown;

var _ErrorHandler = require('../utils/ErrorHandler');

function touchDown(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with touchDown command');
    }

    return this.requestHandler.create('/session/:sessionId/touch/down', { x: x, y: y });
} /**
   *
   * Finger down on the screen. Depcrecated! Please use `touchPerform` instead.
   *
   * @param {Number} x  X coordinate on the screen
   * @param {Number} y  Y coordinate on the screen
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchdown
   * @type protocol
   *
   */

module.exports = exports['default'];