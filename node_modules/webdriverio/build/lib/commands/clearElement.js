'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clearElement = function clearElement(selector) {
    var _this = this;

    return this.elements(selector).then(function (res) {
        if (!res.value || res.value.length === 0) {
            // throw NoSuchElement error if no element was found
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var elementIdClearCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdClearCommands.push(_this.elementIdClear(elem.ELEMENT, 'value'));
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

        return _this.unify(elementIdClearCommands);
    });
}; /**
    *
    * Clear a `<textarea>` or text `<input>` element’s value. Make sure you can interact with the
    * element before using this command. You can't clear an input element that is disabled or in
    * readonly mode.
    *
    * <example>
       :clearElement.js
       it('should demonstrate the clearElement command', function () {
           var input = $('.input')
           input.setValue('test123')
           console.log(input.getValue()) // returns 'test123'
   
           input.clearElement()
           // or
           browser.clearElement('.input')
   
           var value = browser.getValue('.input')
           assert(value === ''); // true
       })
    * </example>
    *
    * @alias browser.clearElement
    * @param {String} selector input element
    * @uses protocol/elements, protocol/elementIdClear
    * @type action
    *
    */

exports.default = clearElement;
module.exports = exports['default'];