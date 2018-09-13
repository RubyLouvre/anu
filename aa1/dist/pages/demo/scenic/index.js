'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        data: []
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    componentDidMount: function () {
        let that = this;
        wx.showLoading({
            title: '获取资源中',
            mask: true
        });
        wx.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/scenic',
            success: function (data) {
                wx.hideLoading();
                that.setState({ data: data.data });
            }
        });
    },
    fun_tip: function () {
        wx.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'scenic' }, h('view', { 'class': 'input-wrapper' }, h('input', { placeholder: '\\u8BF7\\u8F93\\u5165\\u57CE\\u5E02\\u6216\\u666F\\u70B9', type: 'text' })), h('view', { 'class': 'scenic-content' }, this.state.data.map(function (item, index) {
            return h('view', { 'class': 'item', key: index }, h('view', { 'class': 'title-wrapper' }, h('view', { 'class': 'mark' }), h('view', { 'class': 'title' }, item.title)), item.data.map(function (item, index) {
                return h('view', { onTap: this.fun_tip.bind(this), 'class': 'scenic-item', key: index, 'data-tap-uid': 'e3783', 'data-class-uid': 'c3251',
                    'data-instance-uid': this.props.instanceUid, 'data-key': index + '-' + index }, h('image', { 'class': 'left-content', src: item.url }), h('view', { 'class': 'right-content' }, h('view', { 'class': 'scenic-name' }, item.name), h('view', { 'class': 'desc' }, item.desc), h('view', { 'class': 'comment' }, item.comment + '评论'), h('view', { 'class': 'price-distance' }, h('view', { 'class': 'price' }, '￥' + item.price), h('view', { 'class': 'distance' }, item.distance + 'km'))));
            }, this));
        }, this)));;
    },
    classUid: 'c3251'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/scenic/index'));

exports.default = P;