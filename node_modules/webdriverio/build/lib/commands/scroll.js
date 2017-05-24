'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _ErrorHandler = require('../utils/ErrorHandler');

var _scroll = require('../scripts/scroll');

var _scroll2 = _interopRequireDefault(_scroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Scroll to a specific element. You can also append/pass two offset values as parameter
 * to scroll to a specific position.
 *
 * <example>
    :scroll.js
    it('should demonstrate the scroll command', function () {
        var elem = $('#myElement');

        // scroll to specific element
        elem.scroll();

        // scroll to specific element with offset
        // scroll offset will be added to elements position
        elem.scroll(100, 100);

        // scroll to specific x and y position
        browser.scroll(0, 250);
    });
 * </example>
 *
 * @alias browser.scroll
 * @param {String=}  selector  element to scroll to
 * @param {Number=}   xoffset   x offset to scroll to
 * @param {Number=}   yoffset   y offset to scroll to
 * @uses protocol/element, protocol/elementIdLocation, protocol/touchScroll, protocol/execute
 * @type utility
 *
 */

var scroll = function scroll(selector, xoffset, yoffset) {
    var _this = this;

    /**
     * we can't use default values for function parameter here because this would
     * break the ability to chain the command with an element if an offset is used
     */
    xoffset = typeof xoffset === 'number' ? xoffset : 0;
    yoffset = typeof yoffset === 'number' ? yoffset : 0;

    if (typeof selector === 'number' && typeof xoffset === 'number') {
        yoffset = xoffset;
        xoffset = selector;
        selector = null;
    }

    if (this.isMobile) {
        var queue = _promise2.default.resolve();

        if (selector) {
            queue = this.element(selector);
        }

        return queue.then(function (res) {
            /**
             * check if element was found and throw error if not
             */
            if (res && !res.value) {
                throw new _ErrorHandler.RuntimeError(7);
            }

            if (typeof res !== 'undefined') {
                selector = res.value.ELEMENT;
            }

            return _this.touchScroll(selector, xoffset, yoffset);
        });
    }

    if (selector) {
        return this.element(selector).then(function (res) {
            /**
             * check if element was found and throw error if not
             */
            if (!res.value) {
                throw new _ErrorHandler.RuntimeError(7);
            }

            return _this.elementIdLocation(res.value.ELEMENT);
        }).then(function (location) {
            return _this.execute(_scroll2.default, location.value.x + xoffset, location.value.y + yoffset);
        });
    }

    return this.execute(_scroll2.default, xoffset, yoffset);
};

exports.default = scroll;
module.exports = exports['default'];