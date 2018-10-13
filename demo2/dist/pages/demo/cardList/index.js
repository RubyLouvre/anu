'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        data: []
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    componentDidMount: function () {
        let that = this;
        _ReactWX2.default.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        _ReactWX2.default.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/cardList',
            success: function (data) {
                _ReactWX2.default.api.hideLoading();
                that.setState({ data: data.data });
            }
        });
    },
    onReachBottom: function () {
        let that = this;
        _ReactWX2.default.api.showLoading({
            title: '获取资源中',
            mask: true
        });
        _ReactWX2.default.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/cardList',
            success: function (data) {
                _ReactWX2.default.api.hideLoading();
                that.setState({ data: [...that.state.data, ...data.data] });
            }
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'cardList' }, h('view', { 'class': 'wrapper' }, this.state.data.map(function (item, index) {
            return index % 2 === 0 && h('view', { key: index, 'class': 'item' }, h('image', { src: item.image }), h('text', null, item.text));
        }, this)), h('view', { 'class': 'wrapper' }, this.state.data.map(function (item, index) {
            return index % 2 !== 0 && h('view', { key: index, 'class': 'item' }, h('image', { src: item.image }), h('text', null, item.text));
        }, this)));
    },
    classUid: 'c2522'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/cardList/index'));

exports.default = P;