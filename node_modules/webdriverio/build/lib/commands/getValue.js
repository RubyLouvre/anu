'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getValue = function getValue(selector) {
    var _this = this;

    return this.elements(selector).then(function (res) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!res.value || res.value.length === 0) {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var elementIdAttributeCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdAttributeCommands.push(_this.elementIdAttribute(elem.ELEMENT, 'value'));
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

        return _this.unify(elementIdAttributeCommands, {
            extractValue: true
        });
    });
}; /**
    *
    * Get the value of a `<textarea>`, `<select>` or text `<input>` found by given selector.
    *
    * <example>
       :index.html
       <input type="text" value="John Doe" id="username">
   
       :getValue.js
       it('should demonstrate the getValue command', function () {
           var inputUser = $('#username');
   
           var value = inputUser.getValue();
           console.log(value); // outputs: "John Doe"
       });
    * </example>
    *
    * @alias browser.getValue
    * @param   {String} selector input, textarea, or select element
    * @return {String}          requested input value
    * @uses protocol/elements, protocol/elementIdAttribute
    * @type property
    *
    */

exports.default = getValue;
module.exports = exports['default'];