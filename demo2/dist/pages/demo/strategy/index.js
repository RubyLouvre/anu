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
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/strategy',
            success: function (data) {
                _ReactWX2.default.api.hideLoading();
                that.setState({ data: data.data });
            }
        });
    },
    fun_tip: function () {
        _ReactWX2.default.api.showModal({
            title: '提示',
            content: '该部分仅展示，无具体功能!',
            showCancel: false
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'strategy' }, this.state.data.map(function (item, index) {
            return h('view', { onTap: this.fun_tip.bind(this), 'class': 'strategy-item', key: index, 'data-tap-uid': 'e2327', 'data-class-uid': 'c2156', 'data-key': index }, h('image', { 'class': 'big-image', src: item.bigImage }), h('view', { 'class': 'strategy-item-content' }, h('view', { 'class': 'desc' }, item.desc), h('view', { 'class': 'date' }, item.date), h('view', { 'class': 'user-wrapper' }, h('view', { 'class': 'user-image' }, h('image', { src: item.userImage })), h('view', { 'class': 'user-name' }, item.userName))));
        }, this));
    },
    classUid: 'c2156'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/strategy/index'));

exports.default = P;