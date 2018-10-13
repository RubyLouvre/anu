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

        return h('view', { 'class': 'container' }, h('view', { 'class': 'section' }, h('view', {
            'class': 'section__title' }, 'flex-direction: row'), h('view', { 'class': 'flex-wrp', style: 'flex-direction:row;' }, h('view', { 'class': 'flex-item bc_green' }, '1'), h('view', { 'class': 'flex-item bc_red' }, '2'), h('view', { 'class': 'flex-item bc_blue' }, '3'))), h('view', { 'class': 'section' }, h('view', { 'class': 'section__title' }, 'flex-direction: column'), h('view', { 'class': 'flex-wrp', style: 'height: 300px;flex-direction:column;' }, h('view', { 'class': 'flex-item bc_green' }, '1'), h('view', { 'class': 'flex-item bc_red' }, '2'), h('view', { 'class': 'flex-item bc_blue' }, '3'))));
    },
    classUid: 'c1440'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/native/view/index'));

exports.default = P;