'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdSize;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdSize(id) {
    var _this = this;

    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdSize protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/element/' + id + '/size').catch(function (err) {
        /**
         * jsonwire command not supported try webdriver endpoint
         */
        if (err.message.match(/did not match a known command/)) {
            return _this.elementIdRect(id).then(function (result) {
                var _result$value = result.value,
                    width = _result$value.width,
                    height = _result$value.height;

                result.value = { width: width, height: height };
                return result;
            });
        }

        throw err;
    });
} /**
   *
   * Determine an element's size in pixels. The size will be returned as a JSON object
   * with width and height properties.
   *
   * Depcrecated command, please use [`elementIdRect`](http://webdriver.io/api/protocol/elementIdRect.html).
   *
   * @param {String} ID ID of a WebElement JSON object to route the command to
   * @return {Object} The width and height of the element, in pixels (`{width:number, height:number}`)
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidsize
   * @type protocol
   * @deprecated
   *
   */

module.exports = exports['default'];