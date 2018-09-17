'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Dialog() {
    this.state = {
        title: '弹窗',
        content: '弹窗内容1111',
        cancelText: '取消',
        okText: '确定'
    };
}

Dialog = _ReactWX2.default.miniCreateClass(Dialog, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { hidden: this.props.visible }, h('view', { className: 'ys-mask' }), h('view', { className: 'ys-dialog' }, h('view', { className: 'ys-dialog-title' }, this.state.title), h('view', { className: 'ys-dialog-content' }, this.state.content), h('view', { className: 'ys-dialog-bottom' }, h('button', { 'class': 'ys-dialog-btn', onTap: this.props.onCanel, 'data-tap-uid': 'e695721', 'data-class-uid': 'c29960', 'data-instance-uid': this.props.instanceUid }, this.state.cancelText), h('view', { 'class': 'ys-dialog-btn ys-dialog-ok-btn', onTap: this.props.onOk, 'data-tap-uid': 'e823846', 'data-class-uid': 'c29960', 'data-instance-uid': this.props.instanceUid }, this.state.okText))));;
    },
    classUid: 'c29960'
}, {});

exports.default = Dialog;