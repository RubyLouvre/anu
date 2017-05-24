'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAttribute = function getAttribute(selector, attributeName) {
    var _this = this;

    /*!
     * parameter check
     */
    if (typeof attributeName !== 'string') {
        throw new _ErrorHandler.CommandError('number or type of arguments don\'t agree with getAttribute command');
    }

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

                elementIdAttributeCommands.push(_this.elementIdAttribute(elem.ELEMENT, attributeName));
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
    * Get an attribute from an DOM-element based on the selector and attribute name.
    * Returns a list of attribute values if selector matches multiple elements.
    *
    * <example>
       :index.html
       <form action="/submit" method="post" class="loginForm">
           <input type="text" name="name" placeholder="username"></input>
           <input type="text" name="password" placeholder="password"></input>
           <input type="submit" name="submit" value="submit"></input>
       </form>
   
       :getAttribute.js
       it('should demonstrate the getAttribute command', function () {
           var form = $('form')
   
           var attr = form.getAttribute('method')
           console.log(attr) // outputs: "post"
           // or
           console.log(browser.getAttribute('form', 'method')) // outputs: "post"
   
           // if your selector matches multiple elements it returns an array of results
           var allInputs = $$('.loginForm input')
           console.log(allInputs.map(function(el) { return el.getAttribute('name'); })) // outputs: ['name', 'password', 'submit']
       })
    * </example>
    *
    * @alias browser.getAttribute
    * @param {String} selector      element with requested attribute
    * @param {String} attributeName requested attribute
    * @return {String|String[]|null} The value of the attribute(s), or null if it is not set on the element.
    * @uses protocol/elements, protocol/elementIdAttribute
    * @type property
    *
    */

exports.default = getAttribute;
module.exports = exports['default'];