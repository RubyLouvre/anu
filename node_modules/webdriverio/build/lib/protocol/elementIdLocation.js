'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdLocation;

var _ErrorHandler = require('../utils/ErrorHandler');

function elementIdLocation(id) {
    var _this = this;

    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdLocation protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/element/' + id + '/location').catch(function (err) {
        /**
         * jsonwire command not supported try webdriver endpoint
         */
        if (err.message.match(/did not match a known command/)) {
            return _this.elementIdRect(id).then(function (result) {
                var _result$value = result.value,
                    x = _result$value.x,
                    y = _result$value.y;

                result.value = { x: x, y: y };
                return result;
            });
        }

        throw err;
    });
} /**
   *
   * Determine an element's location on the page. The point (0, 0) refers to the
   * upper-left corner of the page. The element's coordinates are returned as a
   * JSON object with x and y properties.
   *
   * Depcrecated command, please use [`elementIdRect`](http://webdriver.io/api/protocol/elementIdRect.html).
   *
   * @param {String} ID ID of a WebElement JSON object to route the command to
   * @return {Object} The X and Y coordinates for the element on the page (`{x:number, y:number}`)
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidlocation
   * @type protocol
   * @deprecated
   *
   */

module.exports = exports['default'];