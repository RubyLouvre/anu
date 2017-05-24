'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = log;

var _ErrorHandler = require('../utils/ErrorHandler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logTypes = void 0; /**
                        *
                        * Get the log for a given log type. Log buffer is reset after each request.
                        * (Not part of the official Webdriver specification).
                        *
                        * @param {String} type  The [log type](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#log-type). This must be provided.
                        * @return {Object[]} The list of [log entries](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#log-entry-json-object)
                        *
                        * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidlog
                        * @type protocol
                        *
                        */

function getLogTypes() {
    return logTypes ? _promise2.default.resolve(logTypes) : this.logTypes().then(function (types) {
        logTypes = types;
        return logTypes;
    });
}

function log(type) {
    var _this = this;

    if (typeof type !== 'string' || type === '') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with log command');
    }

    return getLogTypes.call(this).then(function (types) {
        if (types.value.indexOf(type) === -1) {
            throw new _ErrorHandler.ProtocolError('this log type ("' + type + '") is not available for this browser/device');
        }

        return _this.requestHandler.create('/session/:sessionId/log', {
            type: type
        });
    });
}
module.exports = exports['default'];