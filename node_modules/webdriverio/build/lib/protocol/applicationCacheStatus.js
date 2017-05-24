'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applicationCacheStatus;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function applicationCacheStatus() {
  (0, _depcrecationWarning2.default)('applicationCacheStatus');
  return this.requestHandler.create('/session/:sessionId/application_cache/status');
} /**
   *
   * Get the status of the html5 application cache.
   *
   * This command is depcrecated and will be removed soon. Make sure you don't use it in your
   * automation/test scripts anymore to avoid errors.
   *
   * @return {Number} Status code for application cache: **{UNCACHED = 0, IDLE = 1, CHECKING = 2, DOWNLOADING = 3, UPDATE_READY = 4, OBSOLETE = 5}**
   *
   * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidapplication_cachestatus
   * @type protocol
   *
   */

module.exports = exports['default'];