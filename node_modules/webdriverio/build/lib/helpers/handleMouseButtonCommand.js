'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ErrorHandler = require('../utils/ErrorHandler');

/**
 * call must be scoped to the webdriverio client
 */
var handleMouseButtonCommand = function handleMouseButtonCommand(selector, button, xoffset, yoffset) {
    var _this = this;

    /**
     * mobile only supports simple clicks
     */
    if (this.isMobile) {
        return this.click(selector);
    }

    /**
     * just press button if no selector is given
     */
    if (selector === undefined) {
        return this.buttonPress(button);
    }

    return this.element(selector).then(function (res) {
        /**
         * check if element was found and throw error if not
         */
        if (!res.value) {
            throw new _ErrorHandler.RuntimeError(7);
        }

        /**
         * simulate event in safari
         */
        if (_this.desiredCapabilities.browserName === 'safari') {
            return _this.moveTo(res.value.ELEMENT, xoffset, yoffset).execute(function (elem, x, y, button) {
                return window._wdio_simulate(elem, 'mousedown', 0, 0, button) && window._wdio_simulate(elem, 'mouseup', 0, 0, button);
            }, res.value, xoffset, yoffset, button);
        }

        return _this.moveTo(res.value.ELEMENT, xoffset, yoffset).buttonPress(button);
    });
};

exports.default = handleMouseButtonCommand;
module.exports = exports['default'];