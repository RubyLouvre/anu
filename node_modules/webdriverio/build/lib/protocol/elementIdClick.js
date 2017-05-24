'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdClick;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdClick(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdClick protocol command');
    }

    return this.requestHandler.create({
        path: '/session/:sessionId/element/' + id + '/click',
        method: 'POST'
    });
} /**
   *
   * Click on an element.
   *
   * @param {String} ID ID of a WebElement JSON object to route the command to
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-element-click
   * @type protocol
   *
   */

module.exports = exports['default'];