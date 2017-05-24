'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdElements;

var _ErrorHandler = require('../utils/ErrorHandler');

var _findElementStrategy = require('../helpers/findElementStrategy');

var _findElementStrategy2 = _interopRequireDefault(_findElementStrategy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Search for multiple elements on the page, starting from an element. The located
 * elements will be returned as a WebElement JSON objects. The table below lists the
 * locator strategies that each server should support. Elements should be returned in
 * the order located in the DOM.
 *
 * @param {String} ID ID of a WebElement JSON object to route the command to
 * @param {String} selector selector to query the elements
 * @return {Object[]} A list of WebElement JSON objects for the located elements.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#find-elements-from-element
 * @type protocol
 *
 */

function elementIdElements(id, selector) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdElements protocol command');
    }

    var found = (0, _findElementStrategy2.default)(selector, true);
    return this.requestHandler.create('/session/:sessionId/element/' + id + '/elements', {
        using: found.using,
        value: found.value
    }).then(function (result) {
        result.selector = selector;

        /**
         * W3C webdriver protocol has changed element identifier from `ELEMENT` to
         * `element-6066-11e4-a52e-4f735466cecf`. Let's make sure both identifier
         * are supported.
         */
        result.value = result.value.map(function (elem) {
            var elemValue = elem.ELEMENT || elem['element-6066-11e4-a52e-4f735466cecf'];
            return {
                ELEMENT: elemValue,
                'element-6066-11e4-a52e-4f735466cecf': elemValue
            };
        });

        return result;
    });
}
module.exports = exports['default'];