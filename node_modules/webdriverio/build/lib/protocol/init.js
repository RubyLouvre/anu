'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = init;

var _ErrorHandler = require('../utils/ErrorHandler');

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
    var desiredCapabilities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var lastCommand = this.commandList.slice(-4, -3);
    var isInternalCall = lastCommand.length && lastCommand[0].name === 'reload';

    /**
     * make sure we don't run this command within wdio test run
     */
    if (this.options.isWDIO && !isInternalCall) {
        throw new _ErrorHandler.CommandError('Don\'t call the \'init\' command when using the wdio test runner. ' + 'Your session will get initialised and closed automatically.');
    }

    /*!
     * check if session was already established
     */
    if (this.requestHandler.sessionID) {
        throw new _ErrorHandler.ProtocolError('Cannot init a new session, please end your current session first');
    }

    this.desiredCapabilities = (0, _deepmerge2.default)(this.desiredCapabilities, desiredCapabilities);
    if (desiredCapabilities.sessionId) {
        this.sessionId = desiredCapabilities.sessionId;
    }

    /**
     * report library identity to server
     * @see https://groups.google.com/forum/#!topic/selenium-developers/Zj1ikTz632o
     */
    this.desiredCapabilities = (0, _deepmerge2.default)(this.desiredCapabilities, {
        requestOrigins: {
            url: _package2.default.homepage,
            version: _package2.default.version,
            name: _package2.default.name
        }
    });

    return this.requestHandler.create({
        path: '/session',
        method: 'POST'
    }, {
        desiredCapabilities: this.desiredCapabilities
    });
} /**
   *
   * Create a new session. The server should attempt to create a session that most
   * closely matches the desired and required capabilities. Required capabilities
   * have higher priority than desired capabilities and must be set for the session
   * to be created.
   *
   * @param {Object} [capabilities] An object describing the session's [desired capabilities](https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities).
   *
   * @see  https://w3c.github.io/webdriver/webdriver-spec.html#dfn-new-session
   * @type protocol
   *
   */

module.exports = exports['default'];