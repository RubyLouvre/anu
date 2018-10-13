'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        menu: [{
            title: '全部订单',
            isArrow: true
        }, {
            title: '会员中心',
            isArrow: true
        }, {
            title: '优惠券',
            isArrow: true
        }, {
            title: '常用旅客',
            isArrow: true
        }, {
            title: '联系客服',
            isArrow: true
        }, {
            title: '退出登录',
            isArrow: false
        }]
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    menuItemClick: function (type) {
        switch (type) {
            case 0:
                this.fun_tip();
                break;
            case 1:
                this.fun_tip();
                break;
            case 2:
                this.fun_tip();
                break;
            case 3:
                this.fun_tip();
                break;
            case 4:
                _ReactWX2.default.api.showModal({
                    title: '请拨打客服电话',
                    content: '95117',
                    showCancel: true,
                    cancelColor: '#69c0ff',
                    confirmText: '拨打',
                    confirmColor: '#69c0ff'
                });
                break;
            case 5:
                _ReactWX2.default.api.showModal({
                    title: '确认退出登录',
                    showCancel: true,
                    confirmColor: '#73d13d'
                });
                break;
            default:
                break;
        }
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

        return h('view', { 'class': 'user-center' }, h('view', { 'class': 'user-information' }, h('image', { src: 'https://s.qunarzz.com/wechatapp/common/images/my/unLogin.png', 'class': 'user-image' }), h('text', { 'class': 'user-name' }, '\u6388\u6743\u767B\u5F55')), h('view', { onTap: this.fun_tip.bind(this), 'class': 'qunar-information', 'data-tap-uid': 'e4787', 'data-class-uid': 'c3493' }, h('text', null, '\u5173\u6CE8\u516C\u4F17\u53F7'), h('view', { 'class': 'right-content' }, h('text', { 'class': 'right-message' }, '\u53BB\u5173\u6CE8'), h('image', { src: '../../../assets/image/arrow.png' }))), this.state.menu.map(function (item, index) {
            return h('view', { onTap: this.menuItemClick.bind(this, index), 'class': 'menu-item', key: index, 'data-tap-uid': 'e5755', 'data-class-uid': 'c3493', 'data-key': index }, h('view', { 'class': 'menu-item-title ' + (item.isArrow ? '' : 'high-light') }, item.title), item.isArrow ? h('image', { src: '../../../assets/image/arrow.png' }) : '');
        }, this));
    },
    classUid: 'c3493'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/userCenter/index'));

exports.default = P;