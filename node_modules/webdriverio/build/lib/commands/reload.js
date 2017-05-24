"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Creates a new Selenium session with your current capabilities. This is useful if you
 * test highly stateful application where you need to clean the browser session between
 * the tests in your spec file to avoid creating hundreds of single test files with WDIO.
 * Be careful though, this command affects your test time tremendously since spawning
 * new Selenium sessions is very time consuming especially when using cloud services.
 *
 * <example>
    :reloadSync.js
    it('should reload my session', function () {
        console.log(browser.sessionId); // outputs: e042b3f3cd5a479da4e171825e96e655
        browser.reload();
        console.log(browser.sessionId); // outputs: 9a0d9bf9d4864160aa982c50cf18a573
    })
 * </example>
 *
 * @alias browser.reload
 * @type utility
 *
 */

var reload = function reload() {
    var _this = this;

    var oldSessionId = this.requestHandler.sessionID;

    return this.end().init().then(function (res) {
        var newSessionId = _this.requestHandler.sessionID;

        if (!Array.isArray(_this.options.onReload)) {
            return _promise2.default.resolve();
        }

        return _promise2.default.all(_this.options.onReload.map(function (hook) {
            return hook(oldSessionId, newSessionId);
        }));
    }).catch(function (e) {
        console.log("Error in onReload hook: \"" + e.stack + "\"");
    });
};

exports.default = reload;
module.exports = exports["default"];