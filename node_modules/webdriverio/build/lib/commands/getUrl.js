"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * Get the url of current opened website.
 *
 * <example>
    :getUrl.js
    it('should get the url of the current page', function () {
        browser.url('http://webdriver.io');

        var url = browser.getUrl();
        console.log(url);
        // outputs the following:
        // "http://webdriver.io"
    });
 * </example>
 *
 * @alias browser.getUrl
 * @return {String} current page url
 * @uses protocol/url
 * @type property
 *
 */

var getUrl = function getUrl() {
    return this.unify(this.url(), {
        extractValue: true
    });
};

exports.default = getUrl;
module.exports = exports["default"];