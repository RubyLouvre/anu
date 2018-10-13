'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        focus: false
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    bindTextAreaBlur: function (e) {
        // eslint-disable-next-line
        console.log(e.value);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'page-body' }, h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, '\u8F93\u5165\u533A\u57DF\u9AD8\u5EA6\u81EA\u9002\u5E94\uFF0C\u4E0D\u4F1A\u51FA\u73B0\u6EDA\u52A8\u6761'), h('view', { 'class': 'textarea-wrp' }, h('textarea', { onBlur: this.bindTextAreaBlur, 'auto-height': true, 'data-blur-uid': 'e1242', 'data-class-uid': 'c1139' }))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, '\u8FD9\u662F\u4E00\u4E2A\u53EF\u4EE5\u81EA\u52A8\u805A\u7126\u7684textarea'), h('view', { 'class': 'textarea-wrp' }, h('textarea', { 'auto-focus': 'true', style: 'height: 3em' }))));
    },
    classUid: 'c1139'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/native/textarea/index'));

exports.default = P;