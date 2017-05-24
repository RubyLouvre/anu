'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setValue = function setValue(selector, value) {
    var _this = this;

    /*!
     * parameter check
     */
    if (typeof value === 'number') {
        value = value.toString();
    }

    if (typeof value !== 'string' && !Array.isArray(value)) {
        throw new _ErrorHandler.CommandError('number or type of arguments don\'t agree with setValue command');
    }

    return this.elements(selector).then(function (res) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!res.value || res.value.length === 0) {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var elementIdValueCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdValueCommands.push(_this.elementIdClear(elem.ELEMENT).elementIdValue(elem.ELEMENT, value));
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

        return _this.unify(elementIdValueCommands);
    });
}; /**
    *
    * Send a sequence of key strokes to an element (clears value before). You can also use
    * unicode characters like Left arrow or Back space. WebdriverIO will take care of
    * translating them into unicode characters. You’ll find all supported characters
    * [here](https://w3c.github.io/webdriver/webdriver-spec.html#dfn-character-types).
    * To do that, the value has to correspond to a key from the table.
    *
    * <example>
       :setValue.js
       it('should set value for a certain element', function () {
           var input = $('.input');
           input.setValue('test123');
   
           // same as
           browser.setValue('.input', 'test123');
   
           console.log(input.getValue()); // outputs: 'test123'
       });
    * </example>
    *
    * @alias browser.setValue
    * @param {String}              selector   Input element
    * @param {String|Number|Array} values     Input element
    * @uses protocol/elements, protocol/elementIdClear, protocol/elementIdValue
    * @type action
    *
    */

exports.default = setValue;
module.exports = exports['default'];