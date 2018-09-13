'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../../../components/Super/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'mouti-compoent-wrapper' }, h(_ReactWX2.default.template, { $$loop: 'data503', is: _index2.default }));;
    },
    classUid: 'c367'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/multiple/index'));

exports.default = P;