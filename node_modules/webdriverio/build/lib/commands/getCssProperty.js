'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _parseCSS = require('../helpers/parseCSS.js');

var _parseCSS2 = _interopRequireDefault(_parseCSS);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Get a css property from a DOM-element selected by given selector. The return value
 * is formatted to be testable. Colors gets parsed via [rgb2hex](https://www.npmjs.org/package/rgb2hex)
 * and all other properties get parsed via [css-value](https://www.npmjs.org/package/css-value).
 *
 * Note that shorthand CSS properties (e.g. background, font, border, margin, padding, list-style, outline,
 * pause, cue) are not returned, in accordance with the DOM CSS2 specification - you should directly access
 * the longhand properties (e.g. background-color) to access the desired values.
 *
 * <example>
    :example.html
    <label id="myLabel" for="input" style="color: #0088cc; font-family: helvetica, arial, freesans, clean, sans-serif, width: 100px">Some Label</label>

    :getCssProperty.js
    it('should demonstrate the getCssProperty command', function () {
        var elem = $('#myLabel')

        var color = elem.getCssProperty('color')
        console.log(color)
        // outputs the following:
        // {
        //     property: 'color',
        //     value: 'rgba(0, 136, 204, 1)',
        //     parsed: {
        //         hex: '#0088cc',
        //         alpha: 1,
        //         type: 'color',
        //         rgba: 'rgba(0, 136, 204, 1)'
        //     }
        // }

        var font = elem.getCssProperty('font-family')
        console.log(font)
        // outputs the following:
        // {
        //      property: 'font-family',
        //      value: 'helvetica',
        //      parsed: {
        //          value: [ 'helvetica', 'arial', 'freesans', 'clean', 'sans-serif' ],
        //          type: 'font',
        //          string: 'helvetica, arial, freesans, clean, sans-serif'
        //      }
        // }

        var width = elem.getCssProperty('width')
        console.log(width)
        // outputs the following:
        // {
        //     property: 'width',
        //     value: '100px',
        //     parsed: {
        //         type: 'number',
        //         string: '100px',
        //         unit: 'px',
        //         value: 100
        //     }
        // }
    })
 * </example>
 *
 * @alias browser.getCssProperty
 * @param {String} selector    element with requested style attribute
 * @param {String} cssProperty css property name
 * @uses protocol/elements, protocol/elementIdCssProperty
 * @type property
 *
 */

var getCssProperty = function getCssProperty(selector, cssProperty) {
    var _this = this;

    /*!
     * parameter check
     */
    if (typeof cssProperty !== 'string') {
        throw new _ErrorHandler.CommandError('number or type of arguments don\'t agree with getCssProperty command');
    }

    return this.elements(selector).then(function (res) {
        if (!res.value || res.value.length === 0) {
            // throw NoSuchElement error if no element was found
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var elementIdCssPropertyCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdCssPropertyCommands.push(_this.elementIdCssProperty(elem.ELEMENT, cssProperty));
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

        return _promise2.default.all(elementIdCssPropertyCommands);
    }).then(function (result) {
        /**
         * result already unwrapped when command was reran
         */
        if (!Array.isArray(result)) {
            return result;
        }

        return (0, _parseCSS2.default)(result, cssProperty);
    });
};

exports.default = getCssProperty;
module.exports = exports['default'];