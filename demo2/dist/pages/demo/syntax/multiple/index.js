'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'mouti-compoent-wrapper' }, h(_ReactWX2.default.useComponent, { is: "Super" }));
    },
    classUid: 'c367'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/multiple/index'));

exports.default = P;