'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLocation = function getLocation(selector, prop) {
    var _this = this;

    return this.elements(selector).then(function (res) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!res.value || res.value.length === 0) {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var results = [];
        var that = _this;
        return new _promise2.default(function (resolve, reject) {
            var hasError = false;

            function processNext() {
                var current = res.value.pop();

                return that.elementIdLocation(current.ELEMENT).catch(function (err) {
                    hasError = true;
                    reject(err);
                }).then(function (location) {
                    if (hasError) {
                        return;
                    }

                    if (prop === 'x' || prop === 'y') {
                        results.push(location.value[prop]);
                    } else {
                        results.push({
                            x: location.value.x,
                            y: location.value.y
                        });
                    }

                    if (res.value.length) {
                        return processNext();
                    } else {
                        resolve(results.length === 1 ? results[0] : results);
                    }
                });
            }

            return processNext();
        });
    });
}; /**
    *
    * Determine an element’s location on the page. The point (0, 0) refers to
    * the upper-left corner of the page.
    *
    * <example>
       :getLocation.js
       it('should get the location of one or multiple elements', function () {
           browser.url('http://github.com');
   
           var location = browser.getLocation('.octicon-mark-github');
           console.log(location); // outputs: { x: 150, y: 20 }
   
           var xLocation = browser.getLocation('.octicon-mark-github', 'x')
           console.log(xLocation); // outputs: 150
   
           var yLocation = browser.getLocation('.octicon-mark-github', 'y')
           console.log(yLocation); // outputs: 20
       });
    * </example>
    *
    * @alias browser.getLocation
    * @param {String} selector    element with requested position offset
    * @param {String} property    can be "x" or "y" to get a result value directly for easier assertions
    * @return {Object|Object[]}  The X and Y coordinates for the element on the page (`{x:number, y:number}`)
    * @uses protocol/elements, protocol/elementIdLocation
    * @type property
    *
    */

exports.default = getLocation;
module.exports = exports['default'];