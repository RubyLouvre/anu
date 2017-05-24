'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Wait for an option or radio/checkbox element (selected by css selector) for the provided amount of
 * milliseconds to be (un)selected or (un)checked. If multiple elements get queryied by given
 * selector, it returns true (or false if reverse flag is set) if at least one element is (un)selected.
 *
 * <example>
    :index.html
    <select>
        <option value="1" id="option1">1</option>
        <option value="2" id="option2" selected="selected">2</option>
        <option value="3" id="option3">3</option>
    </select>
    <script type="text/javascript">
        setTimeout(function () {
            document.getElementById('option1').selected = true;
        }, 2000);
    </script>

    :waitForSelectedExample.js
    it('should detect when an option is selected', function () {
        browser.waitForSelected('#option1', 3000);

        // same as
        elem = $('#option1');
        elem.waitForSelected(3000)
    });
 * </example>
 *
 * @alias browser.waitForSelected
 * @param {String}   selector element to wait for
 * @param {Number=}  ms       time in ms (default: 500)
 * @param {Boolean=} reverse  if true it waits for the opposite (default: false)
 * @uses utility/waitUntil, state/isSelected
 * @type utility
 *
 */

var waitForSelected = function waitForSelected(selector, ms, reverse) {
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

    var isReversed = reverse ? '' : 'not';
    var errorMsg = 'element ("' + (selector || this.lastResult.selector) + '") still ' + isReversed + ' selected after ' + ms + 'ms';

    return this.waitUntil(function () {
        return _this.isSelected(selector).then(function (isSelected) {
            if (!Array.isArray(isSelected)) {
                return isSelected !== reverse;
            }

            var result = reverse;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(isSelected), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var val = _step.value;

                    if (!reverse) {
                        result = result || val;
                    } else {
                        result = result && val;
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

exports.default = waitForSelected;
module.exports = exports['default'];