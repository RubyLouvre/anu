'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = localStorageSize;
/**
 *
 * protocol bindings to get local_storage size. This command is not part of the official Webdriver
 * specification and might not be supported for your browser.
 *
 * @return {Number} The number of items in the storage.
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlocal_storagesize
 * @type protocol
 *
 */

function localStorageSize() {
  return this.requestHandler.create('/session/:sessionId/local_storage/size');
}
module.exports = exports['default'];