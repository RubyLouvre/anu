'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementIdElement;

var _ErrorHandler = require('../utils/ErrorHandler');

var _findElementStrategy = require('../helpers/findElementStrategy');

var _findElementStrategy2 = _interopRequireDefault(_findElementStrategy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Search for an element on the page, starting from an element.
 * The located element will be returned as a WebElement JSON object.
 * The table below lists the locator strategies that each server should support.
 * Each locator must return the first matching element located in the DOM.
 *
 * @param {String} ID ID of a WebElement JSON object to route the command to
 * @param {String} selector selector to query the element
 * @return {String} A WebElement JSON object for the located element.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#find-element-from-element
 * @type protocol
 *
 */

function elementIdElement(id, selector) {
    var _this = this;

    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdElement protocol command');
    }

    var found = (0, _findElementStrategy2.default)(selector, true);
    return this.requestHandler.create('/session/:sessionId/element/' + id + '/element', {
        using: found.using,
        value: found.value
    }).then(function (result) {
        result.selector = selector;

        /**
         * W3C webdriver protocol has changed element identifier from `ELEMENT` to
         * `element-6066-11e4-a52e-4f735466cecf`. Let's make sure both identifier
         * are supported.
         */
        var elemValue = result.value.ELEMENT || result.value['element-6066-11e4-a52e-4f735466cecf'];
        result.value = {
            ELEMENT: elemValue,
            'element-6066-11e4-a52e-4f735466cecf': elemValue
        };

        return result;
    }, function (e) {
        var result = e.seleniumStack;

        /**
         * if error is not NoSuchElement throw it
         */
        if (!result || result.type !== 'NoSuchElement') {
            throw e;
        }

        result.state = 'failure';
        result.sessionId = _this.requestHandler.sessionID;
        result.value = null;
        result.selector = selector;
        delete result.orgStatusMessage;
        return result;
    });
}
module.exports = exports['default'];