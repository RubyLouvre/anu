'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _request2 = require('request');

var _request3 = _interopRequireDefault(_request2);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _constants = require('../helpers/constants');

var _ErrorHandler = require('./ErrorHandler');

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * RequestHandler
 */
var RequestHandler = function () {
    function RequestHandler(options, eventHandler, logger) {
        (0, _classCallCheck3.default)(this, RequestHandler);

        this.sessionID = null;
        this.startPath = options.path === '/' ? '' : options.path || '/wd/hub';
        this.gridApiStartPath = '/grid/api';
        this.eventHandler = eventHandler;
        this.logger = logger;
        this.defaultOptions = options;

        /**
         * actually host is `hostname:port` but to keep config properties
         * short we abuse host as hostname
         */
        if (options.host !== undefined) {
            options.hostname = options.host;
            delete options.host;
        }

        /**
         * set auth from user and password configs
         */
        if (this.defaultOptions.user && this.defaultOptions.key) {
            this.auth = {
                user: this.defaultOptions.user,
                pass: this.defaultOptions.key
            };

            delete this.defaultOptions.user;
            delete this.defaultOptions.key;
        }
    }

    /**
     * merges default options with request options
     *
     * @param  {Object} requestOptions  request options
     */


    (0, _createClass3.default)(RequestHandler, [{
        key: 'createOptions',
        value: function createOptions(requestOptions, data) {
            var newOptions = {};

            /**
             * if we don't have a session id we set it here, unless we call commands that don't require session ids, for
             * example /sessions. The call to /sessions is not connected to a session itself and it therefore doesn't
             * require it
             */
            if (requestOptions.path.match(/:sessionId/) && !this.sessionID && requestOptions.requiresSession !== false) {
                // throw session id error
                throw new _ErrorHandler.RuntimeError(101);
            }

            // Add query parameters to request options if it is an object
            if (typeof this.defaultOptions.queryParams === 'object') {
                newOptions.qs = this.defaultOptions.queryParams;
            }

            newOptions.uri = _url2.default.parse(this.defaultOptions.protocol + '://' + this.defaultOptions.hostname + ':' + this.defaultOptions.port + (requestOptions.gridCommand ? this.gridApiStartPath : this.startPath) + requestOptions.path.replace(':sessionId', this.sessionID || ''));

            // send authentication credentials only when creating new session
            if (requestOptions.path === '/session' && this.auth !== undefined) {
                newOptions.auth = this.auth;
            }

            if (requestOptions.method) {
                newOptions.method = requestOptions.method;
            }

            if (requestOptions.gridCommand) {
                newOptions.gridCommand = requestOptions.gridCommand;
            }

            newOptions.json = true;
            newOptions.followAllRedirects = true;

            newOptions.headers = {
                'Connection': 'keep-alive',
                'Accept': 'application/json',
                'User-Agent': 'webdriverio/webdriverio/' + _package2.default.version
            };

            if ((0, _keys2.default)(data).length > 0) {
                newOptions.json = data;
                newOptions.method = 'POST';
                newOptions.headers = (0, _deepmerge2.default)(newOptions.headers, {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Content-Length': Buffer.byteLength((0, _stringify2.default)(data), 'UTF-8')
                });
            } else if (requestOptions.method === 'POST') {
                newOptions.json = {};
            }

            newOptions.timeout = this.defaultOptions.connectionRetryTimeout;

            return newOptions;
        }

        /**
         * creates a http request with its given options and send the protocol
         * command to the webdriver server
         *
         * @param  {Object}   requestOptions  defines url, method and other request options
         * @param  {Object}   data            contains request data
         */

    }, {
        key: 'create',
        value: function create(requestOptions, data) {
            var _this = this;

            data = data || {};

            /**
             * allow to pass a string as shorthand argument
             */
            if (typeof requestOptions === 'string') {
                requestOptions = {
                    path: requestOptions
                };
            }

            var fullRequestOptions = this.createOptions(requestOptions, data);

            this.eventHandler.emit('command', {
                method: fullRequestOptions.method || 'GET',
                uri: fullRequestOptions.uri,
                data: data
            });

            return this.request(fullRequestOptions, this.defaultOptions.connectionRetryCount).then(function (_ref) {
                var body = _ref.body,
                    response = _ref.response;

                /**
                 * if no session id was set before we've called the init command
                 */
                if (_this.sessionID === null && requestOptions.requiresSession !== false) {
                    _this.sessionID = body.sessionId || body.value.sessionId;

                    _this.eventHandler.emit('init', {
                        sessionID: _this.sessionID,
                        options: body.value,
                        desiredCapabilities: data.desiredCapabilities
                    });

                    _this.eventHandler.emit('info', 'SET SESSION ID ' + _this.sessionID);
                }

                if (body === undefined) {
                    body = {
                        status: 0,
                        orgStatusMessage: _constants.ERROR_CODES[0].message
                    };
                }

                _this.eventHandler.emit('result', {
                    requestData: data,
                    requestOptions: fullRequestOptions,
                    response: response,
                    body: body
                });

                return body;
            }, function (err) {
                _this.eventHandler.emit('result', {
                    requestData: data,
                    requestOptions: fullRequestOptions,
                    body: err
                });
                throw err;
            });
        }
    }, {
        key: 'request',
        value: function request(fullRequestOptions, totalRetryCount) {
            var _this2 = this;

            var retryCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            return new _promise2.default(function (resolve, reject) {
                (0, _request3.default)(fullRequestOptions, function (err, response, body) {
                    /**
                     * Resolve with a healthy response
                     */
                    if (!err && body && (body.status === 0 || body.value && !body.status && !(body.value.error || body.value.stackTrace))) {
                        return resolve({ body: body, response: response });
                    }

                    if (fullRequestOptions.gridCommand) {
                        if (body.success) {
                            return resolve({ body: body, response: response });
                        }

                        return reject(new _ErrorHandler.RuntimeError({
                            status: 102,
                            type: _constants.ERROR_CODES[102].id,
                            message: _constants.ERROR_CODES[102].message,
                            orgStatusMessage: body.msg || 'unknown'
                        }));
                    }

                    /**
                     * in Appium you find sometimes more exact error messages in origValue
                     */
                    if (body && body.value && typeof body.value.origValue === 'string' && typeof body.value.message === 'string') {
                        body.value.message += ' ' + body.value.origValue;
                    }

                    if (body && typeof body === 'string') {
                        return reject(new _ErrorHandler.RuntimeError(body));
                    }

                    if (body) {
                        var errorCode = _constants.ERROR_CODES[body.status] || _constants.ERROR_CODES[body.value.error] || _constants.ERROR_CODES[-1];
                        var error = {
                            status: body.status || errorCode.status || -1,
                            type: errorCode ? errorCode.id : 'unknown',
                            message: errorCode ? errorCode.message : 'unknown',
                            orgStatusMessage: body.value ? body.value.message : ''
                        };
                        var screenshot = body.value && body.value.screen;

                        if (screenshot) {
                            error.screenshot = screenshot;
                        }

                        return reject(new _ErrorHandler.RuntimeError(error));
                    }

                    if (retryCount >= totalRetryCount) {
                        var _error = null;

                        if (err && err.message.indexOf('Nock') > -1) {
                            // for better unit test error output
                            _error = err;
                        } else {
                            _error = new _ErrorHandler.RuntimeError({
                                status: -1,
                                type: err.code || 'ECONNREFUSED',
                                message: 'Couldn\'t connect to selenium server',
                                orgStatusMessage: err.message
                            });
                        }

                        return reject(_error);
                    }

                    _this2.request(fullRequestOptions, totalRetryCount, ++retryCount).then(resolve).catch(reject);
                });
            });
        }
    }]);
    return RequestHandler;
}();

exports.default = RequestHandler;
module.exports = exports['default'];