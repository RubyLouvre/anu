'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdRect;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdRect(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdRect protocol command');
    }

    return this.requestHandler.create({
        path: '/session/:sessionId/element/' + id + '/rect',
        method: 'GET'
    });
} /**
   *
   * The Get Element Rect command returns the dimensions and coordinates of the given web element.
   * The returned value is a dictionary with `x`. `y`, `width` and `height` properties.
   *
   * Note: this command was recently added to the official Webdriver protocol and might not be
   * working with current Selenium driver.
   *
   * @param {String} ID ID of a WebElement JSON object to route the command to
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#get-element-rect
   * @type protocol
   *
   */

module.exports = exports['default'];