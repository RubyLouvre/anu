'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Wait for an element (selected by css selector) for the provided amount of
 * milliseconds to have text/content. If multiple elements get queryied by given
 * selector, it returns true (or false if reverse flag is set) if at least one
 * element has text/content.
 *
 * <example>
    :index.html
    <div id="elem"></div>
    <script type="text/javascript">
        setTimeout(function () {
            document.getElementById('elem').innerHTML = 'some text';
        }, 2000);
    </script>

    :waitForTextExample.js
    it('should detect when element has text', function () {
        browser.waitForText('#elem', 3000);

        // same as
        elem = $('#elem');
        elem.waitForText(3000)
    });
 * </example>
 *
 * @alias browser.waitForText
 * @param {String}   selector element to wait for
 * @param {Number=}  ms       time in ms (default: 500)
 * @param {Boolean=} reverse  if true it waits for the opposite (default: false)
 * @uses utility/waitUntil, property/getText
 * @type utility
 *
 */

var waitForText = function waitForText(selector, ms, reverse) {
    var _this = this;

    /**
     * we can't use default values for function parameter here because this would
     * break the ability to chain the command with an element if reverse is used, like
     *
     * ```js
     * var elem = $('#elem');
     * elem.waitForXXX(10000, true);
     * ```
     */
    reverse = typeof reverse === 'boolean' ? reverse : false;

    /*!
     * ensure that ms is set properly
     */
    if (typeof ms !== 'number') {
        ms = this.options.waitforTimeout;
    }

    var isReversed = reverse ? 'with' : 'without';
    var errorMsg = 'element ("' + (selector || this.lastResult.selector) + '") still ' + isReversed + ' text after ' + ms + 'ms';

    return this.waitUntil(function () {
        return _this.getText(selector).then(function (text) {
            if (!Array.isArray(text)) {
                return text !== '' !== reverse;
            }

            var result = reverse;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(text), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var val = _step.value;

                    if (!reverse) {
                        result = result || val !== '';
                    } else {
                        result = result && val === '';
                    }
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

            return result !== reverse;
        });
    }, ms, errorMsg);
};

exports.default = waitForText;
module.exports = exports['default'];