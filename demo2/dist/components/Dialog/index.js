'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Dialog;

var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component(_ReactWX2.default.registerComponent(Dialog, 'Dialog')); // eslint-disable-next-line
function Dialog(props) {
    var h = _ReactWX2.default.createElement;

    return h('view', { style: 'background:#f3f3f3;border:2px solid #dadada;margin:3px;' }, h('view', null, props.children), h(_ReactWX2.default.useComponent, { a: 2018, b: 19, is: "Count" }));
}