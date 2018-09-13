'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../../../components/Dog/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', null, '\u7C7B\u7EE7\u627F\u7684\u6F14\u793A'), h(_ReactWX2.default.template, { age: 12, $$loop: 'data424', is: _index2.default }));;
    },
    classUid: 'c328'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/extend/index'));

exports.default = P;