'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isEnabled = function isEnabled(selector) {
    var _this = this;

    return this.elements(selector).then(function (res) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!res.value || res.value.length === 0) {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var elementIdEnabledCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdEnabledCommands.push(_this.elementIdEnabled(elem.ELEMENT));
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

        return _this.unify(elementIdEnabledCommands, {
            extractValue: true
        });
    });
}; /**
    *
    * Return true or false if the selected DOM-element found by given selector is enabled.
    *
    * <example>
       :index.html
       <input type="text" name="inputField" class="input1">
       <input type="text" name="inputField" class="input2" disabled>
       <input type="text" name="inputField" class="input3" disabled="disabled">
   
       :isEnabled.js
       it('should detect if an element is enabled', function () {
           var isEnabled = browser.isEnabled('.input1');
           console.log(isEnabled); // outputs: true
   
           var isEnabled2 = browser.isEnabled('.input2');
           console.log(isEnabled2); // outputs: false
   
           var isEnabled3 = browser.isEnabled('.input3')
           console.log(isEnabled3); // outputs: false
       });
    * </example>
    *
    * @alias browser.isEnabled
    * @param   {String}             selector  DOM-element
    * @return {Boolean|Boolean[]}            true if element(s)* (is|are) enabled
    * @uses protocol/elements, protocol/elementIdEnabled
    * @type state
    *
    */

exports.default = isEnabled;
module.exports = exports['default'];