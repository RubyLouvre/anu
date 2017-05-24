'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdCssProperty;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdCssProperty(id, cssPropertyName) {
    if (typeof id !== 'string' && typeof id !== 'number' || typeof cssPropertyName !== 'string') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdCssProperty protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/element/' + id + '/css/' + cssPropertyName);
} /**
   *
   * Query the value of an element's computed CSS property. The CSS property to query
   * should be specified using the CSS property name, not the JavaScript property name
   * (e.g. background-color instead of backgroundColor).
   *
   * @param {String} ID                ID of a WebElement JSON object to route the command to
   * @param  {String} cssPropertyName  CSS property
   *
   * @return {String} The value of the specified CSS property.
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#get-element-property
   * @type protocol
   *
   */

module.exports = exports['default'];