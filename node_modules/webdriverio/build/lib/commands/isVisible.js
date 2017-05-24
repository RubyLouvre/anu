"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Return true if the selected DOM-element found by given selector is visible. Returns an array if multiple DOM-elements are found for the given selector.
 *
 * <example>
    :index.html
    <div id="notDisplayed" style="display: none"></div>
    <div id="notVisible" style="visibility: hidden"></div>
    <div id="notInViewport" style="position:absolute; left: 9999999"></div>
    <div id="zeroOpacity" style="opacity: 0"></div>

    :isVisible.js
    it('should detect if an element is visible', function () {
        var isVisible = browser.isVisible('#notDisplayed');
        console.log(isVisible); // outputs: false

        isVisible = browser.isVisible('#notVisible');
        console.log(isVisible); // outputs: false

        isVisible = browser.isVisible('#notExisting');
        console.log(isVisible); // outputs: false

        isVisible = browser.isVisible('#notInViewport');
        console.log(isVisible); // outputs: true

        isVisible = browser.isVisible('#zeroOpacity');
        console.log(isVisible); // outputs: true
    });
 * </example>
 *
 * @alias browser.isVisible
 * @param   {String}             selector  DOM-element
 * @return {Boolean|Boolean[]}            true if element(s)* [is|are] visible
 * @uses protocol/elements, protocol/elementIdDisplayed
 * @type state
 *
 */

var isVisible = function isVisible(selector) {
    var _this = this;

    return this.elements(selector).then(function (res) {
        /**
         * if element does not exist it is automatically not visible ;-)
         */
        if (!res.value || res.value.length === 0) {
            return false;
        }

        var elementIdDisplayedCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdDisplayedCommands.push(_this.elementIdDisplayed(elem.ELEMENT));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return _this.unify(elementIdDisplayedCommands, {
            extractValue: true
        });
    });
};

exports.default = isVisible;
module.exports = exports["default"];