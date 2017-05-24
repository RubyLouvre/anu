'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contexts;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function contexts() {
  (0, _depcrecationWarning2.default)('contexts');
  return this.requestHandler.create('/session/:sessionId/contexts');
} /**
   *
   * Returns an object with a value field containing the list of all available contexts
   *
   * @see http://appium.io/slate/en/v1.1.0/?javascript#automating-hybrid-ios-apps
   * @see https://github.com/admc/wd/blob/master/lib/commands.js#L279
   * @type mobile
   * @for android, ios
   *
   */

module.exports = exports['default'];