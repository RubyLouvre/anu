'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = cookie;
/**
 * Protocol binding to operate with cookies on the current page.
 *
 * <example>
    :cookie.js
    it('should get/set cookies using protocol command', function () {
        // get all cookies
        var cookies = browser.cookie();
        console.log(cookies); // outputs: [{ name: 'test', value: '123' }]

        // set cookie
        browser.cookie('post', {
            name: 'myCookie',
            value: 'some content'
        });

        // delete cookie (sync)
        browser.cookie('delete','myCookie');
    })
 * </example>
 *
 * @param {String=}         method  request method
 * @param {Object=|String=} args    contains cookie information if you want to set a cookie or contains name of cookie if you want to delete it
 *
 * @return {Object}  cookie data
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#cookies
 * @type protocol
 *
 */

function cookie() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
    var args = arguments[1];

    var data = {};
    var requestOptions = {
        path: '/session/:sessionId/cookie',
        method: method
    };

    /**
     * set cookie param for POST method
     */
    if (method.toUpperCase() === 'POST' && typeof args === 'object') {
        data.cookie = args;
    }

    /**
     * add cookie name tp path URL to delete a specific cookie object
     */
    if (method.toUpperCase() === 'DELETE' && typeof args === 'string') {
        requestOptions.path += '/' + args;
    }

    return this.requestHandler.create(requestOptions, data);
}
module.exports = exports['default'];