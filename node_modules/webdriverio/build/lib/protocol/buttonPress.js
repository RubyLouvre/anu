'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buttonPress;

var _handleMouseButtonProtocol = require('../helpers/handleMouseButtonProtocol');

var _handleMouseButtonProtocol2 = _interopRequireDefault(_handleMouseButtonProtocol);

var _depcrecationWarning = require('../helpers/depcrecationWarning');

var _depcrecationWarning2 = _interopRequireDefault(_depcrecationWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Click any mouse button (at the coordinates set by the last moveto command). Note
 * that calling this command after calling buttondown and before calling button up
 * (or any out-of-order interactions sequence) will yield undefined behaviour.
 *
 * This command is depcrecated and will be removed soon. Make sure you don't use it in your
 * automation/test scripts anymore to avoid errors.
 *
 * @param {Number} button  Which button, enum: *{LEFT = 0, MIDDLE = 1 , RIGHT = 2}*. Defaults to the left mouse button if not specified.
 * @type protocol
 *
 */

function buttonPress(button) {
    (0, _depcrecationWarning2.default)('buttonPress');
    return _handleMouseButtonProtocol2.default.call(this, '/session/:sessionId/click', button);
}
module.exports = exports['default'];