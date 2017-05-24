'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = source;
/**
 *
 * Get the current page source.
 *
 * @return {String} The current page source.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#get-page-source
 * @type protocol
 *
 */

function source() {
  return this.requestHandler.create('/session/:sessionId/source');
}
module.exports = exports['default'];