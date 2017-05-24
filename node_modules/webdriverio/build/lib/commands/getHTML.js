'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var _getHTML = require('../scripts/getHTML');

var _getHTML2 = _interopRequireDefault(_getHTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Get source code of specified DOM element by selector.
 *
 * <example>
    :index.html
    <div id="test">
        <span>Lorem ipsum dolor amet</span>
    </div>

    :getHTML.js
    it('should get html for certain elements', function () {
        var outerHTML = browser.getHTML('#test');
        console.log(outerHTML);
        // outputs:
        // "<div id="test"><span>Lorem ipsum dolor amet</span></div>"

        var innerHTML = browser.getHTML('#test', false);
        console.log(innerHTML);
        // outputs:
        // "<span>Lorem ipsum dolor amet</span>"
    });
 * </example>
 *
 * @alias browser.getHTML
 * @param {String}   selector           element to get the current DOM structure from
 * @param {Boolean=} includeSelectorTag if true it includes the selector element tag (default: true)
 * @uses action/selectorExecute
 * @type property
 *
 */

var getHTML = function getHTML(selector, includeSelectorTag) {
    var _this = this;

    /**
     * we can't use default values for function parameter here because this would
     * break the ability to chain the command with an element if includeSelectorTag is used
     */
    includeSelectorTag = typeof includeSelectorTag === 'boolean' ? includeSelectorTag : true;

    return this.selectorExecute(selector, _getHTML2.default, includeSelectorTag).then(function (html) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!html) {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        return html && html.length === 1 ? html[0] : html;
    });
};

exports.default = getHTML;
module.exports = exports['default'];