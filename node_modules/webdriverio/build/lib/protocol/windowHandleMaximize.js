'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *
 * Maximize the specified window if not already maximized. If the :windowHandle URL parameter is "current",
 * the currently active window will be maximized.
 *
 * @param {String=} windowHandle window to maximize (if parameter is falsy the currently active window will be maximized)
 *
 * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-maximize-window
 * @type protocol
 *
 */

var windowHandleMaximize = function windowHandleMaximize() {
    var _this = this;

    var windowHandle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'current';

    var requestOptions = {
        path: '/session/:sessionId/window/' + windowHandle + '/maximize',
        method: 'POST'
    };

    return this.requestHandler.create(requestOptions).catch(function () {
        /**
         * use W3C path if old path failed
         */
        requestOptions.path = '/session/:sessionId/window/maximize';
        return _this.requestHandler.create(requestOptions);
    });
};

exports.default = windowHandleMaximize;
module.exports = exports['default'];