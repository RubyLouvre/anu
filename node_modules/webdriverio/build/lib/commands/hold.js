'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var hold = function hold(selector) {
    var _this = this;

    return this.element(selector).then(function (res) {
        /**
         * check if element was found and throw error if not
         */
        if (!res.value) {
            throw new _ErrorHandler.RuntimeError(7);
        }

        return _this.touchLongClick(res.value.ELEMENT);
    });
}; /**
    *
    * Long press on an element using finger motion events. This command works only in a
    * mobile context.
    *
    * @alias browser.hold
    * @param {String} selector element to hold on
    * @uses protocol/element, protocol/touchLongClick
    * @type mobile
    *
    */

exports.default = hold;
module.exports = exports['default'];