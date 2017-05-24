'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = context;

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function context(id) {
    var data = {};
    var requestOptions = {
        path: '/session/:sessionId/context',
        method: 'GET'
    };

    if (typeof id === 'string') {
        requestOptions.method = 'POST';
        data.name = id;
    }

    (0, _depcrecationWarning2.default)('context');
    return this.requestHandler.create(requestOptions, data);
} /**
   *
   * Retrieve current context or switch to the specified context
   *
   * @param {String=} id the context to switch to
   *
   * @see http://appium.io/slate/en/v1.1.0/?javascript#automating-hybrid-ios-apps
   * @see https://github.com/admc/wd/blob/master/lib/commands.js#L279
   * @type mobile
   * @for android, ios
   *
   */

module.exports = exports['default'];