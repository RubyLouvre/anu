'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var getOrientation = function getOrientation() {
    if (!this.isMobile) {
        throw new _ErrorHandler.CommandError('getOrientation command is not supported on non mobile platforms');
    }

    return this.unify(this.orientation(), {
        lowercase: true,
        extractValue: true
    });
}; /**
    *
    * Get the current browser orientation. This command only works for mobile environments like Android Emulator,
    * iOS Simulator or on real devices.
    *
    * <example>
       :getOrientation.js
       it('should get the orientation of my mobile device', function () {
           var orientation = browser.getOrientation();
           console.log(orientation); // outputs: "landscape"
       });
    * </example>
    *
    * @alias browser.getOrientation
    * @return {String} device orientation (`landscape/portrait`)
    * @uses protocol/orientation
    * @for android, ios
    * @type mobile
    *
    */

exports.default = getOrientation;
module.exports = exports['default'];