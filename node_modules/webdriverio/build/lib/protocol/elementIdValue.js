'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = elementIdValue;

var _constants = require('../helpers/constants');

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Send a sequence of key strokes to an element.
 *
 * @param {String} ID              ID of a WebElement JSON object to route the command to
 * @param {String|String[]} value  The sequence of keys to type. An array must be provided. The server should flatten the array items to a single string to be typed.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#element-send-keys
 * @type protocol
 *
 */

function elementIdValue(id, value) {
    var key = [];

    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdValue protocol command');
    }

    /**
     * replace key with corresponding unicode character
     */
    if (typeof value === 'string') {
        key = checkUnicode(value);
    } else if (value instanceof Array) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var charSet = _step.value;

                key = key.concat(checkUnicode(charSet));
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
    } else {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with elementIdValue protocol command');
    }

    return this.requestHandler.create('/session/:sessionId/element/' + id + '/value', {
        value: key, // json wire conform way: `['f', 'o', 'o']`
        text: key.join('') // webdriver conform way: `foo`
    });
}

/*!
 * check for unicode character or split string into literals
 * @param  {String} value  text
 * @return {Array}         set of characters or unicode symbols
 */
function checkUnicode(value) {
    return _constants.UNICODE_CHARACTERS.hasOwnProperty(value) ? [_constants.UNICODE_CHARACTERS[value]] : (0, _from2.default)(value);
}
module.exports = exports['default'];