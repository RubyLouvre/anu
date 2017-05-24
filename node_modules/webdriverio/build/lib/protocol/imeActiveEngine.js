'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imeActiveEngine;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function imeActiveEngine() {
  (0, _depcrecationWarning2.default)('imeActiveEngine');
  return this.requestHandler.create('/session/:sessionId/ime/active_engine');
} /**
   *
   * Get the name of the active IME engine. The name string is platform specific. (Not part of the
   * official Webdriver specification)
   *
   * @return {String} engine   The name of the active IME engine.
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeactive_engine
   * @type protocol
   *
   */

module.exports = exports['default'];