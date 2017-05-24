'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = submit;

var _ErrorHandler = require('../utils/ErrorHandler');

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Submit a FORM element. The submit command may also be applied to any element
 * that is a descendant of a FORM element. (Not part of the official Webdriver specification).
 *
 * @param {String} ID ID of a `<form />` WebElement JSON object to route the command to
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidsubmit
 * @type protocol
 *
 */

function submit(id) {
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new _ErrorHandler.ProtocolError('number or type of arguments don\'t agree with submit protocol command');
    }

    (0, _depcrecationWarning2.default)('submit');
    return this.requestHandler.create({
        path: '/session/:sessionId/element/' + id + '/submit',
        method: 'POST'
    });
}
module.exports = exports['default'];