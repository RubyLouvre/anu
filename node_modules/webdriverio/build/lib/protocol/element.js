'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = element;

var _findElementStrategy = require('../helpers/findElementStrategy');

var _findElementStrategy2 = _interopRequireDefault(_findElementStrategy);

var _hasElementResultHelper = require('../helpers/hasElementResultHelper');

var _hasElementResultHelper2 = _interopRequireDefault(_hasElementResultHelper);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function element(selector) {
    var _this = this;

    var requestPath = '/session/:sessionId/element';
    var lastPromise = this.lastResult ? (0, _q2.default)(this.lastResult).inspect() : this.lastPromise.inspect();
    var relative = false;

    if (lastPromise.state === 'fulfilled' && (0, _hasElementResultHelper2.default)(lastPromise.value) === 1) {
        if (!selector) {
            return lastPromise.value;
        }

        /**
         * format xpath selector (global -> relative)
         */
        if (selector.slice(0, 2) === '//') {
            selector = '.' + selector.slice(1);
        }

        var elem = lastPromise.value.value.ELEMENT;
        relative = true;
        requestPath = '/session/:sessionId/element/' + elem + '/element';
    }

    var found = (0, _findElementStrategy2.default)(selector, relative);
    return this.requestHandler.create(requestPath, { using: found.using, value: found.value }).then(function (result) {
        result.selector = selector;

        /**
         * W3C webdriver protocol has changed element identifier from `ELEMENT` to
         * `element-6066-11e4-a52e-4f735466cecf`. Let's make sure both identifier
         * are supported.
         */
        var elemValue = result.value.ELEMENT || result.value['element-6066-11e4-a52e-4f735466cecf'];
        if (elemValue) {
            result.value = {
                ELEMENT: elemValue,
                'element-6066-11e4-a52e-4f735466cecf': elemValue
            };
        }

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
} /**
   * Search for an element on the page, starting from the document root.
   * The located element will be returned as a WebElement JSON object.
   * The table below lists the locator strategies that each server should support.
   * Each locator must return the first matching element located in the DOM.
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#find-element
   *
   * @param {String} selector selector to query the element
   * @return {String} A WebElement JSON object for the located element.
   *
   * @type protocol
   *
   */

module.exports = exports['default'];