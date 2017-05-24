'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getElementSize = function getElementSize(selector, prop) {
    return this.elements(selector).then(function (res) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!res.value || res.value.length === 0) {
            throw new _ErrorHandler.CommandError(7, selector || this.lastResult.selector);
        }

        var elementIdSizeCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdSizeCommands.push(this.elementIdSize(elem.ELEMENT));
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

        return _promise2.default.all(elementIdSizeCommands);
    }).then(function (sizes) {
        /**
         * result already unwrapped when command was reran
         */
        if (!Array.isArray(sizes)) {
            return sizes;
        }

        sizes = sizes.map(function (size) {
            if (typeof prop === 'string' && prop.match(/(width|height)/)) {
                return size.value[prop];
            }

            return {
                width: size.value.width,
                height: size.value.height
            };
        });

        return sizes.length === 1 ? sizes[0] : sizes;
    });
}; /**
    *
    * Get the width and height for an DOM-element based given selector.
    *
    * <example>
       :getElementSize.js
       it('should give me the size of an element', function () {
           browser.url('http://github.com')
           var logo = $('.octicon-mark-github')
   
           var size = logo.getElementSize()
           // or
           size = browser.getElementSize('.octicon-mark-github')
           console.log(size) // outputs: { width: 32, height: 32 }
   
           var width = logo.getElementSize('width')
           // or
           width = browser.getElementSize('.octicon-mark-github', 'width')
           console.log(width) // outputs: 32
   
           var height = logo.getElementSize('height')
           // or
           height = browser.getElementSize('.octicon-mark-github', 'height')
           console.log(height) // outputs: 32
       })
    * </example>
    *
    * @alias browser.getElementSize
    * @param   {String}  selector element with requested size
    * @param   {String*} prop     size to receive (optional "width|height")
    * @return {Object|Number}    requested element size (`{ width: <Number>, height: <Number> }`) or actual width/height as number if prop param is given
    * @uses protocol/elements, protocol/elementIdSize
    * @type property
    *
    */

exports.default = getElementSize;
module.exports = exports['default'];