'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WaitUntilTimeoutError = exports.WaitForTimeoutError = exports.RuntimeError = exports.ProtocolError = exports.CommandError = exports.ErrorHandler = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _constants = require('../helpers/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorHandler = function (_Error) {
    (0, _inherits3.default)(ErrorHandler, _Error);

    function ErrorHandler(type, msg, details) {
        (0, _classCallCheck3.default)(this, ErrorHandler);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ErrorHandler.__proto__ || (0, _getPrototypeOf2.default)(ErrorHandler)).call(this));

        Error.captureStackTrace(_this, _this.constructor);

        if (typeof msg === 'number') {
            // if ID is not known error throw UnknownError
            if (!_constants.ERROR_CODES[msg]) {
                msg = 13;
            }

            _this.type = _constants.ERROR_CODES[msg].id;
            _this.message = _constants.ERROR_CODES[msg].message;

            if (msg === 7 && details) {
                _this.message = _this.message.slice(0, -1) + ' ("' + details + '").';
            }
        } else if (arguments.length === 2) {
            _this.message = msg;
            _this.type = type;
        } else if (arguments.length === 1) {
            _this.type = 'WebdriverIOError';
            _this.message = type;
        }

        if (typeof _this.message === 'object') {
            var seleniumStack = _this.message;

            if (seleniumStack.screenshot) {
                _this.screenshot = seleniumStack.screenshot;
                delete seleniumStack.screenshot;
            }

            if (seleniumStack.message && seleniumStack.type && seleniumStack.status) {
                if (typeof seleniumStack.orgStatusMessage === 'string' && seleniumStack.orgStatusMessage.match(/"errorMessage":"NoSuchElement"/)) {
                    seleniumStack.type = 'NoSuchElement';
                    seleniumStack.status = 7;
                    seleniumStack.message = _constants.ERROR_CODES['7'].message;
                }

                _this.message = seleniumStack.message + ' (' + seleniumStack.type + ':' + seleniumStack.status + ')';
            }

            if (typeof seleniumStack.orgStatusMessage === 'string') {
                var reqPos = seleniumStack.orgStatusMessage.indexOf(',"request"');
                var problem = '';

                if (reqPos > 0) {
                    problem = JSON.parse(seleniumStack.orgStatusMessage.slice(0, reqPos) + '}').errorMessage;
                } else {
                    problem = seleniumStack.orgStatusMessage;
                }

                if (problem.indexOf('No enum constant org.openqa.selenium.Platform') > -1) {
                    problem = 'The Selenium backend you\'ve chosen doesn\'t support the desired platform (' + problem.slice(46) + ')';
                }

                // truncate errorMessage
                if (problem.indexOf('(Session info:') > -1) {
                    problem = problem.slice(0, problem.indexOf('(Session info:')).trim();
                }

                // make assumption based on experience on certain error messages
                if (problem.indexOf('unknown error: path is not absolute') !== -1) {
                    problem = 'You are trying to set a value to an input field with type="file", use the `uploadFile` command instead (Selenium error: ' + problem + ')';
                }

                _this.message = problem;
                _this.seleniumStack = seleniumStack;
            }
        }
        return _this;
    }

    /**
     * make stack loggable
     * @return {Object} error log
     */


    (0, _createClass3.default)(ErrorHandler, [{
        key: 'toJSON',
        value: function toJSON() {
            return {
                name: this.type,
                message: this.message
            };
        }
    }]);
    return ErrorHandler;
}(Error);

var CommandError = function CommandError(msg, details) {
    return new ErrorHandler('CommandError', msg, details);
};
var ProtocolError = function ProtocolError(msg) {
    return new ErrorHandler('ProtocolError', msg);
};
var RuntimeError = function RuntimeError(msg) {
    return new ErrorHandler('RuntimeError', msg);
};
var WaitForTimeoutError = function WaitForTimeoutError(msg) {
    return new ErrorHandler('WaitForTimeoutError', msg);
};
var WaitUntilTimeoutError = function WaitUntilTimeoutError(msg) {
    return new ErrorHandler('WaitUntilTimeoutError', msg);
};

exports.ErrorHandler = ErrorHandler;
exports.CommandError = CommandError;
exports.ProtocolError = ProtocolError;
exports.RuntimeError = RuntimeError;
exports.WaitForTimeoutError = WaitForTimeoutError;
exports.WaitUntilTimeoutError = WaitUntilTimeoutError;
exports.default = ErrorHandler;