'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
 *
 * <example>
    :alertText.js
    it('demonstrate the alertDismiss command', function () {
        if (browser.alertText()) {
            browser.alertDismiss();
        }
        // ...
    });
 * </example>
 *
 * @param {String=} text  Keystrokes to send to the prompt() dialog.
 * @return {String}      The text of the currently displayed alert.
 * @throws {RuntimeError}   If no alert is present. The seleniumStack.type parameter will equal 'NoAlertOpenError'.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#get-alert-text
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#send-alert-text
 * @type protocol
 *
 */

var alertText = function alertText(text) {
    var _this = this;

    var requestOptions = {
        path: '/session/:sessionId/alert_text',
        method: 'GET'
    };
    var data = {};

    if (typeof text === 'string') {
        requestOptions.method = 'POST';
        data.text = text;
    }

    var request = this.requestHandler.create(requestOptions, data).catch(function (err) {
        /**
         * jsonwire command not supported try webdriver endpoint
         */
        if (err.message.match(/did not match a known command/)) {
            requestOptions.path = '/session/:sessionId/alert/text';
            return _this.requestHandler.create(requestOptions, data);
        }

        throw err;
    });

    return this.unify(request, {
        extractValue: true
    });
};

exports.default = alertText;
module.exports = exports['default'];