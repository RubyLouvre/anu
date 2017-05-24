'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Launcher = exports.ErrorHandler = exports.VERSION = exports.multiremote = exports.remote = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _webdriverio = require('./lib/webdriverio');

var _webdriverio2 = _interopRequireDefault(_webdriverio);

var _multibrowser = require('./lib/multibrowser');

var _multibrowser2 = _interopRequireDefault(_multibrowser);

var _ErrorHandler = require('./lib/utils/ErrorHandler');

var _ErrorHandler2 = _interopRequireDefault(_ErrorHandler);

var _getImplementedCommands = require('./lib/helpers/getImplementedCommands');

var _getImplementedCommands2 = _interopRequireDefault(_getImplementedCommands);

var _launcher = require('./lib/launcher');

var _launcher2 = _interopRequireDefault(_launcher);

var _package = require('./package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * webdriverio
 * https://github.com/Camme/webdriverio
 *
 * A WebDriver module for nodejs. Either use the super easy help commands or use the base
 * Webdriver wire protocol commands. Its totally inspired by jellyfishs webdriver, but the
 * goal is to make all the webdriver protocol items available, as near the original as possible.
 *
 * Copyright (c) 2013 Camilo Tapia <camilo.tapia@gmail.com>
 * Licensed under the MIT license.
 *
 * Contributors:
 *     Dan Jenkins <dan.jenkins@holidayextras.com>
 *     Christian Bromann <mail@christian-bromann.com>
 *     Vincent Voyer <vincent@zeroload.net>
 */

var IMPLEMENTED_COMMANDS = (0, _getImplementedCommands2.default)();
var VERSION = _package2.default.version;

var remote = function remote() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var modifier = arguments[1];

    /**
     * initialise monad
     */
    var wdio = (0, _webdriverio2.default)(options, modifier);

    /**
     * build prototype: commands
     */
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(IMPLEMENTED_COMMANDS)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var commandName = _step.value;

            wdio.lift(commandName, IMPLEMENTED_COMMANDS[commandName]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var prototype = wdio();
    prototype.defer.resolve();
    return prototype;
};

var multiremote = function multiremote(options) {
    var multibrowser = new _multibrowser2.default();

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(options)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var browserName = _step2.value;

            multibrowser.addInstance(browserName, remote(options[browserName], multibrowser.getInstanceModifier()));
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return remote(options, multibrowser.getModifier());
};

exports.remote = remote;
exports.multiremote = multiremote;
exports.VERSION = VERSION;
exports.ErrorHandler = _ErrorHandler2.default;
exports.Launcher = _launcher2.default;
