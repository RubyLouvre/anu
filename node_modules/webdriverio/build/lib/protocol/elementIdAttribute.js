'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdAttribute;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdAttribute(id, attributeName) {
    if (typeof id !== 'string' && typeof id !== 'number' || typeof attributeName !== 'string') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdAttribute protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/element/' + id + '/attribute/' + attributeName);
} /**
   *
   * Get the value of an element's attribute.
   *
   * @param {String} ID             ID of a WebElement JSON object to route the command to
   * @param {String} attributeName  attribute name of element you want to receive
   *
   * @return {String|null} The value of the attribute, or null if it is not set on the element.
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-get-element-attribute
   * @type protocol
   *
   */

module.exports = exports['default'];