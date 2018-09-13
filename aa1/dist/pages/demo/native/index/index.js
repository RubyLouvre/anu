'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    const ROOT_PATH = '/pages/demo/native';
    this.state = {
        array: 'button,checkbox,input,slider,picker,radio,textarea,label,audio,camera,image,video'.split(',').map(function (name) {
            return {
                url: ROOT_PATH + '/' + name + '/index',
                name: name
            };
        })
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    componentWillMount: function () {
        // eslint-disable-next-line
        console.log('native componentWillMount');
    },
    componentDidMount: function () {
        // eslint-disable-next-line
        console.log('native componentDidMount');
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('view', { 'class': 'item-list' }, this.state.array.map(function (item, i1114) {
            return h('view', { 'class': 'item' }, h('navigator', { 'open-type': 'navigate', 'hover-class': 'navigator-hover', url: item.url }, item.name));
        }, true)));;
    },
    classUid: 'c1753'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/index/index'));

exports.default = P;