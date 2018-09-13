'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Express() {
    this.state = {
        title: '语法相关',
        pages: [
        /*
        {
            title: 'API',
            url: '/pages/demo/syntax/api/index'
        },
        {
            title: '继承',
            url: '/pages/demo/syntax/extend/index'
        },
        {
            title: '无状态组件',
            url: '/pages/demo/syntax/stateless/index'
        },
        {
            title: '条件语句',
            url: '/pages/demo/syntax/if/index'
        },
        {
            title: '一重循环',
            url: '/pages/demo/syntax/loop/index'
        },
        */
        {
            title: '二重循环',
            url: '/pages/demo/syntax/loop2/index'
        }]
    };
}

Express = _ReactWX2.default.miniCreateClass(Express, _ReactWX2.default.Component, {
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

        return h('view', { 'class': 'container' }, h('view', { 'class': 'page_hd' }, this.state.title), h('view', { 'class': 'page_bd' }, h('view', { 'class': 'navigation' }, this.state.pages.map(function (page, i2644) {
            return h('navigator', { 'open-type': 'navigate', 'class': 'item', 'hover-class': 'navigator-hover', url: page.url }, page.title);
        }, this))));;
    },
    classUid: 'c3009'
}, {});
Page(_ReactWX2.default.createPage(Express, 'pages/demo/syntax/index'));

exports.default = Express;