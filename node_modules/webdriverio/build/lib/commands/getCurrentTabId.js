"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * Retrieve the current window handle.
 *
 * <example>
    :getCurrenteTabId.js
    it('should return the current tab id', function () {
        browser.url('http://webdriver.io')

        var tabId = browser.getCurrentTabId()
        console.log(tabid)
        // outputs something like the following:
        // "CDwindow-C43FB686-949D-4232-828B-583398FBD0C0"
    })
 * </example>
 *
 * @alias browser.getCurrentTabId
 * @return {String} the window handle URL of the current focused window
 * @uses protocol/windowHandle
 * @type window
 *
 */

var getCurrentTabId = function getCurrentTabId() {
    return this.unify(this.windowHandle(), {
        extractValue: true
    });
};

exports.default = getCurrentTabId;
module.exports = exports["default"];