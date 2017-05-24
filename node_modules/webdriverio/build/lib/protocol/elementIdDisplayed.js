'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdDisplayed;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdDisplayed(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdDisplayed protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/element/' + id + '/displayed');
} /**
   *
   * Determine if an element is currently displayed.
   *
   * @param {String} ID ID of a WebElement JSON object to route the command to
   * @return {Boolean} true if the element is displayed
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#element-displayedness
   * @type protocol
   *
   */

module.exports = exports['default'];