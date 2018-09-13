'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const formItemStyle = {
    marginBottom: '10px',
    textAlign: 'center',
    padding: '10px 10px 10px 10px',
    fontWeight: 'bold'
};

function Style() {
    this.state = {
        title: '使用 React 编写小程序',
        methodColor: {
            color: '#e44',
            bac: '#fee',
            radius: '4px'
        }
    };
}

Style = _ReactWX2.default.miniCreateClass(Style, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'inline-container' }, h('view', { 'class': 'item' }, '1. class \u6837\u5F0F'), h('view', { 'class': 'page_hd' }, this.state.title), h('view', { 'class': 'item' }, '2. \u4F20\u7EDF inlineStyle \u6837\u5F0F'), h('view', { style: _ReactWX2.default.collectStyle({ textAlign: 'center', padding: '10px 10px 10px 10px', fontWeight: 'bold', fontSize: '13px' }, this.props, "style2303") }, this.state.title), h('view', {
            'class': 'item' }, '3. props \u4E3A\u53C2\u6570 inlineStyle \u6837\u5F0F'), h('view', { style: _ReactWX2.default.collectStyle({ zIndex: this.props.studyTip === 0 ? 3 : 1 }, this.props, "style2913") }, this.state.title), h('view', {
            'class': 'item' }, '4. \u76F4\u63A5\u662Fobject \u4E3A\u53C2\u6570 inlineStyle \u6837\u5F0F'), h('view', { style: _ReactWX2.default.collectStyle(formItemStyle, this.props, "style3301") }, this.state.title), h('view', { 'class': 'item' }, '5. state \u4E3A\u53C2\u6570 inlineStyle \u6837\u5F0F'), h('view', { style: _ReactWX2.default.collectStyle({ color: this.state.methodColor.color, backgroundColor: this.state.methodColor.bac }, this.props, "style3752") }, this.state.title));;
    },
    classUid: 'c2263'
}, {
    defaultProps: { studyTip: 1
    }
});
Page(_ReactWX2.default.createPage(Style, 'pages/demo/syntax/inlineStyle/index'));

exports.default = Style;