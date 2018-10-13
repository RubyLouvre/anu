'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        title: '语法相关',
        pages: [{
            title: 'API',
            url: '/pages/demo/syntax/api/index'
        }, {
            title: '继承',
            url: '/pages/demo/syntax/extend/index'
        }, {
            title: '无状态组件',
            url: '/pages/demo/syntax/stateless/index'
        }, {
            title: '条件语句',
            url: '/pages/demo/syntax/if/index'
        }, {
            title: '一重循环',
            url: '/pages/demo/syntax/loop/index'
        }, {
            title: '二重循环',
            url: '/pages/demo/syntax/loop2/index'
        }, {
            title: '三重循环',
            url: '/pages/demo/syntax/loop3/index'
        }, {
            title: '循环里面交替使用两种不同组件（对话形式）',
            url: '/pages/demo/syntax/loop4/index'
        }, {
            title: '行内样式',
            url: '/pages/demo/syntax/inlineStyle/index'
        }, {
            title: '组件套嵌内容',
            url: '/pages/demo/syntax/children/index'
        }, {
            title: 'async/await',
            url: '/pages/demo/syntax/await/index'
        }, {
            title: '组件嵌套组件',
            url: '/pages/demo/syntax/multiple/index'
        }, {
            title: 'Render Props',
            url: '/pages/demo/syntax/renderprops/index'
        }, {
            title: 'Redux',
            url: '/pages/demo/syntax/redux/index'
        }, {
            title: 'Redux只是显示数据',
            url: '/pages/demo/syntax/redux2/index'
        }, {
            title: '数据请求',
            url: '/pages/demo/syntax/request/index'
        }]
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    componentWillMount: function () {
        // eslint-disable-next-line
        console.log('syntax componentWillMount');
    },
    componentDidMount: function () {
        // eslint-disable-next-line
        console.log('syntax componentDidMount');
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('view', { 'class': 'page_hd' }, this.state.title), h('view', { 'class': 'page_bd' }, h('view', { 'class': 'navigation' }, this.state.pages.map(function (page) {
            return h('navigator', { 'open-type': 'navigate', 'class': 'item', 'hover-class': 'navigator-hover', url: page.url }, page.title);
        }, this))));
    },
    classUid: 'c3440'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/index'));

exports.default = P;