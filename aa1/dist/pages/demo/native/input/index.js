'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        focus: false,
        inputValue: ''
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    bindButtonTap: function () {
        this.setState({
            focus: true
        });
    },
    bindKeyInput: function (e) {
        this.setState({
            inputValue: e.value.trim()
        });
    },
    bindReplaceInput: function (e) {
        // eslint-disable-next-line
        console.log(e);
        var value = e.value;
        var pos = e.cursor;
        if (pos != -1) {
            //光标在中间
            var left = e.value.slice(0, pos);
            //计算光标的位置
            pos = left;
        }

        // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        // issues: input无法接受函数handler返回值？
        return {
            value: value.replace(/11/g, '2'),
            cursor: pos
        };
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', { 'class': 'page-body' }, h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u53EF\u4EE5\u81EA\u52A8\u805A\u7126\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', 'auto-focus': true, placeholder: '\\u5C06\\u4F1A\\u83B7\\u53D6\\u7126\\u70B9' })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u63A7\u5236\u6700\u5927\u8F93\u5165\u957F\u5EA6\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', maxlength: '10', placeholder: '\\u6700\\u5927\\u8F93\\u5165\\u957F\\u5EA6\\u4E3A10' })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u5B9E\u65F6\u83B7\u53D6\u8F93\u5165\u503C\uFF1A', this.state.inputValue), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', maxlength: '10', onInput: this.bindKeyInput, placeholder: '\\u8F93\\u5165\\u540C\\u6B65\\u5230view\\u4E2D', 'data-input-uid': 'e5653', 'data-class-uid': 'c7472', 'data-instance-uid': this.props.instanceUid })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u63A7\u5236\u8F93\u5165\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', onInput: this.bindReplaceInput, placeholder: '\\u8FDE\\u7EED\\u7684\\u4E24\\u4E2A1\\u4F1A\\u53D8\\u62102', 'data-input-uid': 'e6885', 'data-class-uid': 'c7472', 'data-instance-uid': this.props.instanceUid })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u63A7\u5236\u952E\u76D8\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', {
            'class': 'weui-input', onInput: this.bindHideKeyboard,
            placeholder: '\\u8F93\\u5165123\\u81EA\\u52A8\\u6536\\u8D77\\u952E\\u76D8', 'data-input-uid': 'e8121',
            'data-class-uid': 'c7472', 'data-instance-uid': this.props.instanceUid })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u6570\u5B57\u8F93\u5165\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', type: 'number', placeholder: '\\u8FD9\\u662F\\u4E00\\u4E2A\\u6570\\u5B57\\u8F93\\u5165\\u6846' })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u5BC6\u7801\u8F93\u5165\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', password: true, type: 'text', placeholder: '\\u8FD9\\u662F\\u4E00\\u4E2A\\u5BC6\\u7801\\u8F93\\u5165\\u6846' })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u5E26\u5C0F\u6570\u70B9\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', type: 'digit', placeholder: '\\u5E26\\u5C0F\\u6570\\u70B9\\u7684\\u6570\\u5B57\\u952E\\u76D8' })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u8EAB\u4EFD\u8BC1\u8F93\u5165\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', type: 'idcard', placeholder: '\\u8EAB\\u4EFD\\u8BC1\\u8F93\\u5165\\u952E\\u76D8' })))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'weui-cells__title' }, '\u63A7\u5236\u5360\u4F4D\u7B26\u989C\u8272\u7684input'), h('view', { 'class': 'weui-cells weui-cells_after-title' }, h('view', { 'class': 'weui-cell weui-cell_input' }, h('input', { 'class': 'weui-input', 'placeholder-style': 'color:#F76260', placeholder: '\\u5360\\u4F4D\\u7B26\\u5B57\\u4F53\\u662F\\u7EA2\\u8272\\u7684' }))))));;
    },
    classUid: 'c7472'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/input/index'));

exports.default = P;