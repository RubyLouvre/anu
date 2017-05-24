'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLocationInView = function getLocationInView(selector, prop) {
    var _this = this;

    return this.elements(selector).then(function (res) {
        /**
         * throw NoSuchElement error if no element was found
         */
        if (!res.value || res.value.length === 0) {
            throw new _ErrorHandler.CommandError(7, selector || _this.lastResult.selector);
        }

        var elementIdLocationInViewCommands = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(res.value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var elem = _step.value;

                elementIdLocationInViewCommands.push(_this.elementIdLocationInView(elem.ELEMENT));
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

        return _promise2.default.all(elementIdLocationInViewCommands);
    }).then(function (locations) {
        /**
         * result already unwrapped when command was reran
         */
        if (!Array.isArray(locations)) {
            return locations;
        }

        locations = locations.map(function (location) {
            if (typeof prop === 'string' && prop.match(/(x|y)/)) {
                return location.value[prop];
            }

            return {
                x: location.value.x,
                y: location.value.y
            };
        });

        return locations.length === 1 ? locations[0] : locations;
    });
}; /**
    *
    * Determine an element’s location on the screen once it has been scrolled into view.
    *
    * <example>
       :getLocationInView.js
       it('should get the location of one or multiple elements in view', function () {
           browser.url('http://github.com');
   
           var location = browser.getLocationInView('.octicon-mark-github');
           console.log(location); // outputs: { x: 150, y: 20 }
   
           var xLocation = browser.getLocationInView('.octicon-mark-github', 'x')
           console.log(xLocation); // outputs: 150
   
           var yLocation = browser.getLocationInView('.octicon-mark-github', 'y')
           console.log(yLocation); // outputs: 20
       });
    * </example>
    *
    * @alias browser.getLocationInView
    * @param {String} selector    element with requested position offset
    * @return {Object|Object[]}  The X and Y coordinates for the element on the page (`{x:number, y:number}`)
    *
    * @uses protocol/elements, protocol/elementIdLocationInView
    * @type property
    *
    */

exports.default = getLocationInView;
module.exports = exports['default'];