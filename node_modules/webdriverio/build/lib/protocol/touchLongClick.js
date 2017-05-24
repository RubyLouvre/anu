'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = touchLongClick;

var _ErrorHandler = require('../utils/ErrorHandler');

function touchLongClick(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with touchLongClick protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/touch/longclick', {
        element: id.toString()
    });
} /**
   *
   * Long press on the touch screen using finger motion events. Depcrecated! Please use `touchPerform` instead.
   *
   * @param {String} id ID of the element to long press on
   *
   * @see https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidtouchlongclick
   * @type protocol
   * @for android
   *
   */

module.exports = exports['default'];