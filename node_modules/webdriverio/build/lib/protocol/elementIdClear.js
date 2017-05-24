'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdClear;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdClear(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdClear protocol command');
    }

    return this.requestHandler.create({
        path: '/session/:sessionId/element/' + id + '/clear',
        method: 'POST'
    });
} /**
   *
   * Clear a `TEXTAREA` or text `INPUT element's value.
   *
   * @param {String} ID ID of a WebElement JSON object to route the command to
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-element-clear
   * @type protocol
   *
   */

module.exports = exports['default'];