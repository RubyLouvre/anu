"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * Retrieve a list of all window handles available in the session. You can use these handles to switch
 * to a different tab.
 *
 * <example>
    :getTabIds.js
    it('should get the source of the html document', function () {
        browser.url('http://webdriver.io');

        var tabIds = browser.getTabIds();
        console.log(tabIds); // outputs: ['f9b387e0-99bd-11e6-8881-d3174a61fdce']

        browser.newWindow('http://google.com');
        tabIds = browser.getTabIds();
        console.log(tabIds); // outputs: ['f9b387e0-99bd-11e6-8881-d3174a61fdce', 'fb4e9a40-99bd-11e6-8881-d3174a61fdce' ]
    });
 * </example>
 *
 * @alias browser.getTabIds
 * @return {String[]} a list of window handles
 * @uses protocol/windowHandles
 * @type window
 *
 */

var getTabIds = function getTabIds() {
    return this.unify(this.windowHandles(), {
        extractValue: true
    });
};

exports.default = getTabIds;
module.exports = exports["default"];