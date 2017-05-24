'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var selectByVisibleText = function selectByVisibleText(selector, text) {
    var _this = this;

    /**
     * get select element
     */
    return this.element(selector).then(function (res) {
        /**
         * check if element was found and throw error if not
         */
        if (!res.value) {
            throw new _ErrorHandler.RuntimeError(7);
        }

        /**
         * find option elem using xpath
         */
        var formatted = '"' + text.trim() + '"';

        if (/"/.test(text)) {
            formatted = 'concat("' + text.trim().split('"').join('", \'"\', "') + '")'; // escape quotes
        }

        var normalized = '[normalize-space(.) = ' + formatted + ']';
        return _this.elementIdElement(res.value.ELEMENT, './option' + normalized + '|./optgroup/option' + normalized);
    }).then(function (res) {
        /**
         * check if element was found and throw error if not
         */
        if (!res.value) {
            throw new _ErrorHandler.RuntimeError(7);
        }

        /**
         * select option
         */
        return _this.elementIdClick(res.value.ELEMENT);
    });
}; /**
    *
    * Select option which's displayed text matches the argument.
    *
    * <example>
       :example.html
       <select id="selectbox">
           <option value="someValue0">uno</option>
           <option value="someValue1">dos</option>
           <option value="someValue2">tres</option>
           <option value="someValue3">cuatro</option>
           <option value="someValue4">cinco</option>
           <option value="someValue5">seis</option>
       </select>
   
       :selectByVisibleText.js
       it('demonstrate the selectByVisibleText command', function () {
           var selectBox = $('#selectbox');
           console.log(selectBox.getText('option:checked')); // returns "uno"
   
           selectBox.selectByVisibleText('cuatro');
           console.log(selectBox.getText('option:checked')); // returns "cuatro"
       })
    * </example>
    *
    * @alias browser.selectByVisibleText
    * @param {String} selector   select element that contains the options
    * @param {String} text       text of option element to get selected
    * @uses protocol/element, protocol/elementIdClick, protocol/elementIdElement
    * @type action
    *
    */

exports.default = selectByVisibleText;
module.exports = exports['default'];