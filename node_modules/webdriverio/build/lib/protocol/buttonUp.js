'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonUp;

var _handleMouseButtonProtocol = require('../helpers/handleMouseButtonProtocol');

var _handleMouseButtonProtocol2 = _interopRequireDefault(_handleMouseButtonProtocol);

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Releases the mouse button previously held (where the mouse is currently at). Must
 * be called once for every buttondown command issued. See the note in click and
 * buttondown about implications of out-of-order commands.
 *
 * This command is depcrecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors.
 *
 * @param {Number} button  Which button, enum: *{LEFT = 0, MIDDLE = 1 , RIGHT = 2}*. Defaults to the left mouse button if not specified.
 *
 * @see  https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidbuttonup
 * @type protocol
 *
 */

function buttonUp(button) {
    (0, _depcrecationWarning2.default)('buttonUp');
    return _handleMouseButtonProtocol2.default.call(this, '/session/:sessionId/buttonup', button);
}
module.exports = exports['default'];