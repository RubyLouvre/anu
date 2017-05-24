'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _findElementStrategy = require('../helpers/findElementStrategy');

var _findElementStrategy2 = _interopRequireDefault(_findElementStrategy);

var _hasElementResultHelper = require('../helpers/hasElementResultHelper');

var _hasElementResultHelper2 = _interopRequireDefault(_hasElementResultHelper);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Search for multiple elements on the page, starting from the document root. The located
 * elements will be returned as a WebElement JSON objects. The table below lists the
 * locator strategies that each server should support. Elements should be returned in
 * the order located in the DOM.
 *
 * The array of elements can be retrieved  using the 'response.value' which is a
 * collection of element ID's and can be accessed in the subsequent commands
 * using the '.ELEMENT' method.
 *
 * @param {String} selector selector to query the elements
 * @return {Object[]} A list of WebElement JSON objects for the located elements.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#find-elements
 * @type protocol
 *
 */

var elements = function elements(selector) {
    var requestPath = '/session/:sessionId/elements';
    var lastPromise = this.lastResult ? (0, _q2.default)(this.lastResult).inspect() : this.lastPromise.inspect();
    var relative = false;
    var elementResult = (0, _hasElementResultHelper2.default)(lastPromise.value);

    if (lastPromise.state === 'fulfilled' && elementResult) {
        if (!selector) {
            var newSelector = (0, _assign2.default)({}, lastPromise.value);
            /**
             * if last result was an element result transform result into an array
             */
            newSelector.value = Array.isArray(newSelector.value) ? newSelector.value : newSelector.value !== null ? [newSelector.value] : [];

            /**
             * Only return new selector if existing otherwise fetch again for selector.
             * This is important in cases you do a waitForExist and use the same element
             * variable again after the element has appeared.
             */
            if (newSelector.value.length === 0) {
                this.lastResult = null;
                return elements.call(this, newSelector.selector);
            }

            return newSelector;
        }

        /**
         * only run elementIdElement if lastPromise was an element command
         */
        if (elementResult === 1) {
            if (lastPromise.value.value === null) {
                throw new _ErrorHandler.CommandError(7, lastPromise.value.selector);
            }

            /**
             * format xpath selector (global -> relative)
             */
            if (selector.slice(0, 2) === '//') {
                selector = '.' + selector.slice(1);
            }

            var elem = lastPromise.value.value.ELEMENT;
            relative = true;
            requestPath = '/session/:sessionId/element/' + elem + '/elements';
        }
    }

    var found = (0, _findElementStrategy2.default)(selector, relative);
    return this.requestHandler.create(requestPath, {
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
    }, function (err) {
        if (err.message === 'no such element') {
            return [];
        }

        throw err;
    });
};

exports.default = elements;
module.exports = exports['default'];