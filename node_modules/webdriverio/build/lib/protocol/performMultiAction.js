'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = performMultiAction;
/**
 *
 * Perform multi touch action
 *
 * @param {Object} touchAttr contains attributes of touch gesture (e.g. `element`, `x` and `y`)
 *
 * @see  https://github.com/appium/appium/blob/master/docs/en/appium-bindings.md#touchaction--multitouchaction
 * @type mobile
 * @for android, ios
 *
 */

function performMultiAction() {
    var multiTouchAction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return this.requestHandler.create({
        path: '/session/:sessionId/touch/multi/perform',
        method: 'POST'
    }, multiTouchAction);
}
module.exports = exports['default'];