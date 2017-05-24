'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = refresh;
/**
 *
 * Refresh the current page.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#refresh
 * @type protocol
 *
 */

function refresh() {
    return this.requestHandler.create({
        path: '/session/:sessionId/refresh',
        method: 'POST'
    });
}
module.exports = exports['default'];