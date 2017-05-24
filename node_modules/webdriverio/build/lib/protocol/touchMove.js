'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = touchMove;

var _ErrorHandler = require('../utils/ErrorHandler');

function touchMove(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with touchMove command');
    }

    return this.requestHandler.create('/session/:sessionId/touch/move', { x: x, y: y });
} /**
   *
   * Finger move on the screen. Depcrecated! Please use `touchPerform` instead.
   * Depcrecated! Please use `touchPerform` instead.
   *
   * @param {Number} x  coordinate on the screen
   * @param {Number} y  coordinate on the screen
   *
   * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchmove
   * @type protocol
   * @depcrecated
   *
   */

module.exports = exports['default'];