'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = file;
/**
 *
 * Uploads a base64 data object. (not documented, not part of Webdriver specs)
 *
 * @param {Object} data base64 data object
 *
 * @type protocol
 *
 */

function file(base64data) {
    return this.requestHandler.create('/session/:sessionId/file', {
        file: base64data
    });
}
module.exports = exports['default'];