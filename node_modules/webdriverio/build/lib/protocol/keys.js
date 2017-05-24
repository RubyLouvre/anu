'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _constants = require('../helpers/constants');

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function keys(value) {
    var key = [];

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
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with keys protocol command');
    }

    (0, _depcrecationWarning2.default)('keys');
    return this.requestHandler.create('/session/:sessionId/keys', {
        'value': key
    });
};

/*!
 * check for unicode character or split string into literals
 * @param  {String} value  text
 * @return {Array}         set of characters or unicode symbols
 */
/**
 *
 * Send a sequence of key strokes to the active element. This command is similar to the
 * send keys command in every aspect except the implicit termination: The modifiers are
 * *not* released at the end of the call. Rather, the state of the modifier keys is kept
 * between calls, so mouse interactions can be performed while modifier keys are depressed.
 *
 * You can also use characters like "Left arrow" or "Back space". WebdriverIO will take
 * care of translating them into unicode characters. You’ll find all supported characters
 * [here](https://w3c.github.io/webdriver/webdriver-spec.html#keyboard-actions).
 * To do that, the value has to correspond to a key from the table.
 *
 * @param {String|String[]} value  The sequence of keys to type. An array must be provided. The server should flatten the array items to a single string to be typed.
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidkeys
 * @type protocol
 * @deprecated
 *
 */

function checkUnicode(value) {
    return _constants.UNICODE_CHARACTERS.hasOwnProperty(value) ? [_constants.UNICODE_CHARACTERS[value]] : value.split('');
}