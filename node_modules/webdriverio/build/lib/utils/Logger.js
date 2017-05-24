'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _constants = require('../helpers/constants');

var _sanitize = require('../helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Logger module
 *
 * A Logger helper with fancy colors
 */
var Logger = function () {
    function Logger(options, eventHandler) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Logger);

        /**
         * log level
         * silent : no logs
         * command : command only
         * result : result only
         * error : error only
         * verbose : command + data + result
         */
        this.logLevel = options.logLevel;

        this.setupWriteStream(options);

        /**
         * disable colors if coloredLogs is set to false or if we pipe output into files
         */
        if (!JSON.parse(process.env.WEBDRIVERIO_COLORED_LOGS) || this.writeStream) {
            (0, _keys2.default)(_constants.COLORS).forEach(function (colorName) {
                _constants.COLORS[colorName] = '';
            });
        }

        // register event handler to log command events
        eventHandler.on('command', function (data) {
            if (_this.logLevel === 'command' || _this.logLevel === 'verbose') {
                _this.command(data.method, data.uri.path);
            }
            if (_this.logLevel === 'data' || _this.logLevel === 'verbose') {
                _this.data(data.data);
            }
        });

        eventHandler.on('info', function (msg) {
            if (_this.logLevel === 'verbose') {
                _this.info(msg);
            }
        });

        // register event handler to log result events
        eventHandler.on('result', function (data) {
            // only log result events if they got executed successfully
            if (data.body && data.body.value && (_this.logLevel === 'result' || _this.logLevel === 'verbose')) {
                _this.result(data.body.value ? data.body.value : data.body.orgStatusMessage);
            }
        });

        // register event handler to log error events
        eventHandler.on('error', function (data) {
            if (data.err && data.err.code === 'ECONNREFUSED') {
                _this.error('Couldn\'t find a running selenium server instance on ' + data.requestOptions.uri);
            } else if (data.err && data.err.code === 'ENOTFOUND') {
                _this.error('Couldn\'t resolve hostname ' + data.requestOptions.uri);
            } else if (data.err && data.err.code === 'NOSESSIONID') {
                _this.error('Couldn\'t get a session ID - ' + data.err.message);
            } else if (_this.logLevel === 'error' || _this.logLevel === 'verbose') {
                if (data.body && _constants.ERROR_CODES[data.body.status]) {
                    _this.error(_constants.ERROR_CODES[data.body.status].id + '\t' + _constants.ERROR_CODES[data.body.status].message + '\n\t\t\t' + data.body.value.message);
                } else if (typeof data.message === 'string') {
                    _this.error('ServerError\t' + data.message);
                } else {
                    _this.error(_constants.ERROR_CODES['-1'].id + '\t' + _constants.ERROR_CODES['-1'].message);
                }
            }
        });
    }

    /**
     * creates log file name and directories if not existing
     * @param  {Object} caps          capabilities (required to create filename)
     * @param  {String} logOutputPath specified log directory
     * @return {Buffer}               log file buffer stream
     */


    (0, _createClass3.default)(Logger, [{
        key: 'getLogfile',
        value: function getLogfile(caps, logOutputPath) {
            logOutputPath = _path2.default.isAbsolute(logOutputPath) ? logOutputPath : _path2.default.join(process.cwd(), logOutputPath);

            /**
             * create directory if not existing
             */
            try {
                _fs2.default.statSync(logOutputPath);
            } catch (e) {
                _mkdirp2.default.sync(logOutputPath);
            }

            var newDate = new Date();
            var dateString = newDate.toISOString().split(/\./)[0].replace(/:/g, '-');
            var filename = _sanitize2.default.caps(caps) + '.' + dateString + '.' + process.pid + '.log';

            return _fs2.default.createWriteStream(_path2.default.join(logOutputPath, filename));
        }

        /**
         * create write stream if logOutput is a string
         */

    }, {
        key: 'setupWriteStream',
        value: function setupWriteStream(options) {
            if (typeof options.logOutput === 'string') {
                this.writeStream = this.getLogfile(options.desiredCapabilities, options.logOutput);
                this.logLevel = this.logLevel === 'silent' ? 'verbose' : this.logLevel;
            } else if (typeof options.logOutput === 'object' && options.logOutput.writable) {
                this.writeStream = options.logOutput;
                this.logLevel = this.logLevel === 'silent' ? 'verbose' : this.logLevel;
            }
        }
    }, {
        key: 'write',
        value: function write() {
            for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
                messages[_key] = arguments[_key];
            }

            var msgString = messages.join(' ');

            if (this.writeStream) {
                this.writeStream.write(msgString + '\n');
            } else {
                console.log(msgString);
            }
        }

        /**
         * main log function
         */

    }, {
        key: 'log',
        value: function log(message, content) {
            if (!this.logLevel || this.logLevel === 'silent') {
                return;
            }

            var currentDate = new Date();
            var dateString = currentDate.toString().match(/\d\d:\d\d:\d\d/)[0];
            var preamble = _constants.COLORS.dkgray + '[' + dateString + '] ' + _constants.COLORS.reset;

            if (!content) {
                this.write(preamble, message);
            } else {
                this.write(preamble, message, '\t', (0, _stringify2.default)(_sanitize2.default.limit(content)));
            }
        }

        /**
         * logs command messages
         * @param  {String} method  method of command request
         * @param  {String} path    path of command request
         */

    }, {
        key: 'command',
        value: function command(method, path) {
            if (method && path) {
                this.log(_constants.COLORS.violet + 'COMMAND\t' + _constants.COLORS.reset + method, path);
            }
        }

        /**
         * debugger info message
         */

    }, {
        key: 'debug',
        value: function debug() {
            this.write('');
            this.log(_constants.COLORS.yellow + 'DEBUG\t' + _constants.COLORS.reset + 'Queue has stopped!');
            this.log(_constants.COLORS.yellow + 'DEBUG\t' + _constants.COLORS.reset + 'You can now go into the browser or use the command line as REPL');
            this.log(_constants.COLORS.yellow + 'DEBUG\t' + _constants.COLORS.dkgray + '(To exit, press ^C again or type .exit)' + _constants.COLORS.reset + '\n');
        }

        /**
         * logs data messages
         * @param  {Object} data  data object
         */

    }, {
        key: 'data',
        value: function data(_data) {
            _data = (0, _stringify2.default)(_sanitize2.default.limit(_data));
            if (_data && (this.logLevel === 'data' || this.logLevel === 'verbose')) {
                this.log(_constants.COLORS.brown + 'DATA\t\t' + _constants.COLORS.reset + _data);
            }
        }

        /**
         * logs info messages
         * @param  {String} msg  message
         */

    }, {
        key: 'info',
        value: function info(msg) {
            this.log(_constants.COLORS.blue + 'INFO\t' + _constants.COLORS.reset + msg);
        }

        /**
         * logs result messages
         * @param  {Object} result  result object
         */

    }, {
        key: 'result',
        value: function result(_result) {
            _result = _sanitize2.default.limit((0, _stringify2.default)(_result));
            this.log(_constants.COLORS.teal + 'RESULT\t\t' + _constants.COLORS.reset + _result);
        }

        /**
         * logs error messages
         * @param  {String} msg  error message
         */

    }, {
        key: 'error',
        value: function error(msg) {
            if (msg && typeof msg === 'string' && msg.indexOf('caused by Request') !== -1) {
                msg = msg.substr(0, msg.indexOf('caused by Request') - 2);
            }

            if (msg && typeof msg === 'string' && msg.indexOf('Command duration or timeout') !== -1) {
                msg = msg.substr(0, msg.indexOf('Command duration or timeout'));
            }

            if (msg && typeof msg === 'string' && msg.indexOf('ID does not correspond to an open view') !== -1) {
                msg = msg.substr(0, msg.indexOf('ID does not correspond to an open view'));
                msg += 'NOTE: you probably try to continue your tests after closing a tab/window. Please set the focus on a current opened tab/window to continue. Use the window protocol command to do so.';
            }

            if (msg) {
                this.log(_constants.COLORS.red + 'ERROR\t' + _constants.COLORS.reset + msg, null);
            }
        }

        /**
         * print exception if command fails
         * @param {String}   type        error type
         * @param {String}   message     error message
         * @param {String[]} stacktrace  error stacktrace
         */

    }], [{
        key: 'printException',
        value: function printException(type, message, stacktrace) {
            stacktrace = stacktrace.map(function (trace) {
                return '    at ' + trace;
            });
            this.write(_constants.COLORS.dkred + (type || 'Error') + ': ' + message + _constants.COLORS.reset, null);
            this.write(_constants.COLORS.dkgray + stacktrace.reverse().join('\n') + _constants.COLORS.reset, null);
        }
    }]);
    return Logger;
}();

exports.default = Logger;
module.exports = exports['default'];