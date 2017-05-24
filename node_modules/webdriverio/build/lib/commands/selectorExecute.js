'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ensureClientSideSelectorSupport = require('../helpers/ensureClientSideSelectorSupport');

var _ensureClientSideSelectorSupport2 = _interopRequireDefault(_ensureClientSideSelectorSupport);

var _createSelectorScript = require('../scripts/createSelectorScript');

var _createSelectorScript2 = _interopRequireDefault(_createSelectorScript);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectorExecute = function selectorExecute(selector, script) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    /**
     * if selectorExecute gets executed with element as first citizen like
     *
     * ```js
     * var elem = $('#elem');
     * elem.selectorExecute(function () {...}, some, args);
     * ```
     */
    if (typeof selector === 'function' && this.lastResult && typeof this.lastResult.selector === 'string') {
        args.unshift(script);
        script = selector;
        selector = [this.lastResult.selector];

        /**
         * if selectorExecute gets executed by getHTML
         */
    } else if (selector === null) {
        selector = [this.lastResult.selector];
    }

    if (typeof selector === 'string') {
        selector = [selector];
    }

    if (!Array.isArray(selector)) {
        throw new _ErrorHandler.CommandError('Argument \'selector\' must be string or array of strings.');
    }
    if (!/string|function/.test(typeof script)) {
        throw new _ErrorHandler.CommandError('Argument \'script\' must be a function or string.');
    }

    var fullScript = _createSelectorScript2.default.call(this, script, selector, args);
    return _ensureClientSideSelectorSupport2.default.call(this).execute(fullScript).then(function (res) {
        var result = res && res.value;

        if (result && result.message === 'NoSuchElement') {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        return result;
    });
}; /**
    * Works just like execute, only you can use selectors to pass html elements to
    * the function you wish to execute in the browser.
    *
    * The function fn will receive every resolved selector as an array of html elements,
    * even if there is only one result, or no result.
    * These arrays are the first arguments the function fn receives.
    * If you pass an array of selectors, the resulting html element arrays are returned in the same order.
    *
    * All arguments you append after function fn are added as the arguments after the html arrays.
    * You can use any JSON value or a function as such an argument.
    *
    * <example>
       :selectorExecute.js
       it('it inject JavaScript to the page', function () {
           var divCount = browser.selectorExecute("//div", function(divs, message) {
               return divs.length + message;
           }, " divs on the page");
           console.log(divCount); // returns, for example, "68 divs on the page"
   
           var divLinkCount = browser.selectorExecute(["//div", "=Read Post"], function(divs, links) {
               var message = 'There are ';
   
               message += divs.length + ' divs on the page';
               message += ' and ';
               message += links.length + ' links with an link text "' + links[0].text + '"';
   
               return message;
           });
           console.log(divLinkCount); // returns, for example, "There are 68 divs on the page and 42 links with an link text 'Read Post'"
       });
    * </example>
    *
    * @alias browser.selectorExecute
    * @param {String|Array.<String>} selectors                  single selector or array of selectors
    * @param {Function}              script                     function to get executed in the browser
    * @param {...*}                  [argument1,...,argumentN]  arguments added to fn. Can be any JSON value or function
    * @uses protocol/execute
    * @type action
    */

exports.default = selectorExecute;
module.exports = exports['default'];