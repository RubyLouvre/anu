'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = screenshot;
/**
 *
 * Take a screenshot of the current viewport. To get the screenshot of the whole page
 * use the action command `saveScreenshot`
 *
 * @return {String} screenshot   The screenshot as a base64 encoded PNG.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#take-screenshot
 * @type protocol
 *
 */

function screenshot() {
  return this.requestHandler.create('/session/:sessionId/screenshot');
}
module.exports = exports['default'];