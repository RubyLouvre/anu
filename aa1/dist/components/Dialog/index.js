'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Dialog;

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../Count/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
function Dialog(props) {
    var h = _ReactWX2.default.createElement;

    return h('view', { style: 'background:#f3f3f3;border:2px solid #dadada;margin:3px;' }, h('view', null, props.children), h(_ReactWX2.default.template, { a: 2018, b: 19, $$loop: 'data567', is: _index2.default }));;
}