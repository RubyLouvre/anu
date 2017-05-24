'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getAppStrings;
/**
 *
 * Get all defined Strings from an app for the default language.
 *
 * @param {String} language  strings language code
 *
 * @see  https://github.com/appium/appium/blob/master/docs/en/appium-bindings.md#app-strings
 * @type mobile
 * @for android
 *
 */

function getAppStrings(language) {
    var requestOptions = {
        path: '/session/:sessionId/appium/app/strings',
        method: 'POST'
    };

    return this.requestHandler.create(requestOptions, { language: language });
}
module.exports = exports['default'];