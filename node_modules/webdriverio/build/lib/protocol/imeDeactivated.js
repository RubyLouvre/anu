'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imeDeactivated;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function imeDeactivated() {
  (0, _depcrecationWarning2.default)('imeDeactivated');
  return this.requestHandler.create('/session/:sessionId/ime/deactivated');
} /**
   *
   * De-activates the currently-active IME engine. (Not part of the official Webdriver specification)
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimedeactivate
   * @type protocol
   *
   */

module.exports = exports['default'];