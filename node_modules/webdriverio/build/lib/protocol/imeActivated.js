'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imeActivated;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function imeActivated() {
  (0, _depcrecationWarning2.default)('imeActivated');
  return this.requestHandler.create('/session/:sessionId/ime/activated');
} /**
   *
   * Indicates whether IME input is active at the moment (not if it's available.
   * (Not part of the official Webdriver specification)
   *
   * @return {boolean}  true if IME input is available and currently active, false otherwise
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeactivated
   * @type protocol
   *
   */

module.exports = exports['default'];