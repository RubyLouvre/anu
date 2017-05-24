'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = imeActivate;

var _ErrorHandler = require('../utils/ErrorHandler');

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Make an engines that is available (appears on the list returned by getAvailableEngines) active.
 * After this call, the engine will be added to the list of engines loaded in the IME daemon and the
 * input sent using sendKeys will be converted by the active engine. Note that this is a
 * platform-independent method of activating IME (the platform-specific way being using keyboard shortcuts.
 * (Not part of the official Webdriver specification)
 *
 * @param {String} engine   Name of the engine to activate.
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeactive_engine
 * @type protocol
 *
 */

function imeActivate(engine) {
    if (typeof engine !== 'string') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with imeActivate protocol command');
    }

    (0, _depcrecationWarning2.default)('imeActivate');
    return this.requestHandler.create('/session/:sessionId/ime/activate', { engine: engine });
}
module.exports = exports['default'];