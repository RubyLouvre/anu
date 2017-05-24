'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSelected = function isSelected(selector) {
    var _this = this;

    return this.elements(selector).then(function (res) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!res.value || res.value.length === 0) {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var elementIdSelectedCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdSelectedCommands.push(_this.elementIdSelected(elem.ELEMENT));
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

        return _this.unify(elementIdSelectedCommands, {
            extractValue: true
        });
    });
}; /**
    *
    * Return true or false if an `<option>` element, or an `<input>` element of type
    * checkbox or radio is currently selected found by given selector.
    *
    * <example>
       :index.html
       <select name="selectbox" id="selectbox">
           <option value="John Doe">John Doe</option>
           <option value="Layla Terry" selected="selected">Layla Terry</option>
           <option value="Bill Gilbert">Bill Gilbert"</option>
       </select>
   
       :isSelected.js
       it('should detect if an element is selected', function () {
           var element = $('[value="Layla Terry"]');
           console.log(element.isSelected()); // outputs: true
   
           browser.selectByValue('#selectbox', 'Bill Gilbert');
           console.log(element.isSelected()); // outputs: false
       });
    * </example>
    *
    * @alias browser.isSelected
    * @param   {String}             selector  option element or input of type checkbox or radio
    * @return {Boolean|Boolean[]}            true if element is selected
    * @uses protocol/elements, protocol/elementIdSelected
    * @type state
    *
    */

exports.default = isSelected;
module.exports = exports['default'];