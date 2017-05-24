'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

var setOrientation = function setOrientation(orientation) {
    /*!
     * parameter check
     */
    if (typeof orientation !== 'string') {
        throw new _ErrorHandler.CommandError('number or type of arguments don\'t agree with setOrientation command');
    }

    return this.orientation(orientation.toUpperCase());
}; /**
    *
    * Set a device orientation.
    *
    * <example>
       :setOrientation.js
       it('should set a geo location for the device', function () {
           browser.setOrientation('landscape');
   
           var orientation = browser.getOrientation();
           console.log(orientation); // outputs: "landscape"
       });
    * </example>
    *
    * @alias browser.setOrientation
    * @param {String} orientation the new browser orientation (`landscape/portrait`)
    * @uses protocol/orientation
    * @type mobile
    * @for android, ios
    *
    */

exports.default = setOrientation;
module.exports = exports['default'];