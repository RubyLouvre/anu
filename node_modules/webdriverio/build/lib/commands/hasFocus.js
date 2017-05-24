'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var hasFocus = function hasFocus(selector) {
    var _this = this;

    return this.unify(this.elements(selector).then(function (res) {
        /**
         * check if element was found and throw error if not
         */
        if (!res.value || !res.value.length) {
            throw new _ErrorHandler.RuntimeError(7);
        }

        return res.value;
    }).then(function (elements) {
        return _this.execute(function (elemArray) {
            var focused = document.activeElement;
            if (!focused) {
                return false;
            }

            return elemArray.filter(function (elem) {
                return focused === elem;
            }).length > 0;
        }, elements);
    }), {
        extractValue: true
    });
}; /**
    *
    * Return true or false if the selected DOM-element currently has focus. If the selector matches
    * multiple elements, it will return true if one of the elements has focus.
    *
    * <example>
       :index.html
       <input name="login" autofocus="" />
   
       :hasFocus.js
       it('should detect the focus of an element', function () {
           browser.url('/');
   
           var loginInput = $('[name="login"]');
           console.log(loginInput.hasFocus()); // outputs: false
   
           loginInput.click();
           console.log(loginInput.hasFocus()); // outputs: true
       })
    * </example>
    *
    * @alias browser.hasFocus
    * @param {String} selector   selector for element(s) to test for focus
    * @return {Boolean}         true if one of the matching elements has focus
    * @uses protocol/execute protocol/elements
    * @type state
    *
    */

exports.default = hasFocus;
module.exports = exports['default'];