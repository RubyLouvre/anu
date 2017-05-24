'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imeAvailableEngines;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function imeAvailableEngines() {
  (0, _depcrecationWarning2.default)('imeAvailableEngines');
  return this.requestHandler.create('/session/:sessionId/ime/available_engines');
} /**
   *
   * List all available engines on the machine. To use an engine, it has to be present
   * in this list. (Not part of the official Webdriver specification)
   *
   * @return {Object[]} engines   A list of available engines
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidimeavailable_engines
   * @type protocol
   *
   */

module.exports = exports['default'];