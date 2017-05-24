'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementActive;
/**
 *
 * Get the element on the page that currently has focus. The element will be returned as a WebElement JSON object.
 *
 * @return {String} A WebElement JSON object for the active element.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#get-active-element
 * @type protocol
 *
 */

function elementActive() {
    var _this = this;

    var requestOptions = {
        path: '/session/:sessionId/element/active',
        method: 'POST'
    };

    return this.requestHandler.create(requestOptions).catch(function (err) {
        /**
         * jsonwire command not supported try webdriver endpoint
         */
        if (err.message.match(/did not match a known command/)) {
            requestOptions.method = 'GET';
            return _this.requestHandler.create(requestOptions);
        }

        throw err;
    });
}
module.exports = exports['default'];