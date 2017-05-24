'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alertAccept;
/**
 *
 * Accepts the currently displayed alert dialog. Usually, this is equivalent to
 * clicking on the 'OK' button in the dialog.
 *
 * <example>
    :alertAccept.js
    it('demonstrate the alertAccept command', function () {
        if (browser.alertText()) {
            browser.alertAccept();
        }
        // ...
    });
 * </example>
 *
 * @throws {RuntimeError}   If no alert is present. The seleniumStack.type parameter will equal 'NoAlertOpenError'.
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#accept-alert
 * @type protocol
 *
 */

function alertAccept() {
    var _this = this;

    var requestOptions = {
        path: '/session/:sessionId/accept_alert',
        method: 'POST'
    };

    return this.requestHandler.create(requestOptions).catch(function (err) {
        /**
         * jsonwire command not supported try webdriver endpoint
         */
        if (err.message.match(/did not match a known command/)) {
            requestOptions.path = '/session/:sessionId/alert/accept';
            return _this.requestHandler.create(requestOptions);
        }

        throw err;
    });
}
module.exports = exports['default'];