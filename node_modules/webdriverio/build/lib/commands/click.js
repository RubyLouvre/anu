'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var click = function click(selector) {
    var _this = this;

    return this.element(selector).then(function (elem) {
        /**
         * check if element was found and throw error if not
         */
        if (!elem.value) {
            throw new _ErrorHandler.RuntimeError(7);
        }

        return _this.elementIdClick(elem.value.ELEMENT);
    });
}; /**
    *
    * Click on an element based on given selector.
    *
    * <example>
       :example.html
       <button id="myButton" onclick="document.getElementById('someText').innerHTML='I was clicked'">Click me</button>
       <div id="someText">I was not clicked</div>
   
       :click.js
       it('should demonstrate the click command', function () {
           var myButton = $('#myButton')
           myButton.click()
           // or
           browser.click('#myButton')
   
           var text = browser.getText('#someText');
           assert(text === 'I was clicked'); // true
       })
   
       :example.js
       it('should fetch menu links and visit each page', function () {
           links = $$('#menu a');
   
           links.forEach(function (link) {
               link.click();
           });
       });
    * </example>
    *
    * @alias browser.click
    * @param {String} selector element to click on. If it matches with more than one DOM-element it automatically clicks on the first element
    * @uses protocol/element, protocol/elementIdClick
    * @type action
    *
    */

exports.default = click;
module.exports = exports['default'];