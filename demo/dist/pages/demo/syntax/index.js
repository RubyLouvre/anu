'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Express() {
    this.state = {
        title: '语法相关'
    };
}

Express = _ReactWX2.default.toClass(Express, _ReactWX2.default.Component, {
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

        return h('view', { 'class': 'container' }, h('view', { 'class': 'page_hd' }, this.state.title), h(_ReactWX2.default.useComponent, { name: 'aaa', age: 16, is: "Animal" }));
    },
    classUid: 'c974'
}, {});
Page(_ReactWX2.default.registerPage(Express, 'pages/demo/syntax/index'));

exports.default = Express;