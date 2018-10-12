'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        indexPageIcons: [{
            class: 'radius-top-left',
            bizTitle: '基础内容',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/hotel2.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/base/index'
        }, {
            class: '',
            bizTitle: '内置组件',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/flight1.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/native/index/index'
        }, {
            class: 'radius-top-right',
            bizTitle: '语法',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/train2.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/syntax/index'
        }, {
            class: '',
            bizTitle: '车票搜索',
            businessUrl: '/common/pages/search/index?from=home&bizType=bus',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/bus1.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/ticketSearch/index'
        }, {
            class: '',
            bizTitle: '日期选择',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/car1.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/calendar/index'
        }, {
            class: '',
            bizTitle: '船票',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/ship1.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/boat/index'
        }, {
            class: 'radius-bottom-left',
            bizTitle: '瀑布流',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/vacation2.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/cardList/index'
        }, {
            class: '',
            bizTitle: '景点·门票',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/ticket1.png',
            showSpecialLogo: false,
            specialText: '',
            url: '../../pages/demo/scenic/index'
        }, {
            class: 'radius-bottom-right',
            bizTitle: '攻略',
            logoSrc: 'https://s.qunarzz.com/wechatapp/home/business/travel2.png',
            showSpecialLogo: false,
            specialText: 'if测试',
            url: '../../pages/demo/strategy/index'
        }],

        toolData: [{
            url: 'https://source.qunarzz.com/site/images/wap/home/recommend/dainifei.png',
            title: '带你飞'
        }, {
            url: 'https://s.qunarzz.com/wechatapp/home/toolbars/book.png',
            title: '旅行账本'
        }, {
            url: 'https://source.qunarzz.com/site/images/wap/home/recommend/xingchengzhushou.png',
            title: '行程助手'
        }, {
            url: 'https://source.qunarzz.com/site/images/wap/home/recommend/hangbandongtai.png',
            title: '航班动态'
        }],
        specialOfferData: [{
            url: 'http://s.qunarzz.com/wechatapp/home/special/flight.jpg',
            title: '特价机票'
        }, {
            url: 'http://s.qunarzz.com/wechatapp/home/special/ticket.jpg',
            title: '优惠门票'
        }, {
            url: 'http://s.qunarzz.com/wechatapp/home/special/vacation.jpg',
            title: '旅行特价'
        }, {
            url: 'http://s.qunarzz.com/wechatapp/home/special/flight.jpg',
            title: '特价机票1'
        }, {
            url: 'http://s.qunarzz.com/wechatapp/home/special/ticket.jpg',
            title: '优惠门票1'
        }, {
            url: 'http://s.qunarzz.com/wechatapp/home/special/vacation.jpg',
            title: '旅行特价1'
        }]
    };
}

// eslint-disable-next-line
P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    gotoSome: function (url) {
        if (url) {
            _ReactWX2.default.api.navigateTo({ url });
        } else {
            this.fun_tip();
        }
    },
    componentDidMount: function () {
        // eslint-disable-next-line
        console.log('page did mount!');
    },
    componentWillMount: function () {
        // eslint-disable-next-line
        console.log('page will mount!');
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

        return h('view', { 'class': 'page' }, h('image', { mode: 'aspectFit', 'class': 'top-image', src: 'https://s.qunarzz.com/wechatapp/home/banner0510-002.png' }), h('view', { 'class': 'nav-wrapper' }, this.state.indexPageIcons.map(function (item, index) {
            return h('view', { 'class': 'item-wrapper ' + item.class, key: index, onTap: this.gotoSome.bind(this, item.url), 'data-tap-uid': 'e12622', 'data-class-uid': 'c9951', 'data-key': index }, h('image', { src: item.logoSrc, 'class': 'itemBgc' }), h('text', { 'class': 'title' }, item.bizTitle), item.showSpecialLogo && item.specialText.length ? h('view', { 'class': 'special-text' }, item.specialText) : '');
        }, this)), h('view', { 'class': 'tool-wrapper' }, this.state.toolData.map(function (item, index) {
            return h('view', { onTap: this.fun_tip, 'class': 'tool-item', key: index, 'data-tap-uid': 'e14128', 'data-class-uid': 'c9951', 'data-key': index }, h('image', { src: item.url }), h('text', null, item.title));
        }, this)), h('view', { 'class': 'special-offer' }, h('view', { 'class': 'title' }, '\u7279\u4EF7\u4E13\u533A'), h('swiper', { 'class': 'special-offer-wrapper', interval: '2500', autoplay: 'true', 'display-multiple-items': '3' }, this.state.specialOfferData.map(function (item, index) {
            return h('block', { key: index }, h('swiper-item', { onTap: this.fun_tip, 'class': 'special-offer-item', 'data-tap-uid': 'e15704', 'data-class-uid': 'c9951', 'data-key': index }, h('image', { src: item.url }), h('text', null, item.title)));
        }, this))), h('view', { 'class': 'activity' }, h('view', { 'class': 'title' }, '\u6D3B\u52A8\u4E13\u533A'), h('view', { 'class': 'activity-wrapper' }, h('view', { onTap: this.fun_tip, 'class': 'left-content', 'data-tap-uid': 'e16764', 'data-class-uid': 'c9951' }, h('image', { src: 'https://img1.qunarzz.com/order/comp/1808/c3/dda9c77c3b1d8802.png' }), h('view', { 'class': 'content' }, h('text', { 'class': 'title' }, '\u4F55\u65F6\u98DE'), h('text', { 'class': 'desc' }, '\u673A\u7968\u8D8B\u52BF\u65E9\u77E5\u9053'))), h('view', { 'class': 'right-content' }, h('view', { onTap: this.fun_tip, 'class': 'right-content-wrapper', 'data-tap-uid': 'e17696', 'data-class-uid': 'c9951' }, h('image', { src: 'https://img1.qunarzz.com/order/comp/1808/3b/fd717d94ed8b6102.jpg\\n' }), h('view', { 'class': 'content' }, h('text', { 'class': 'title' }, '\u4EBA\u683C\u6D4B\u8BD5'), h('text', { 'class': 'desc' }, '\u7B80\u76F4\u60CA\u609A'))), h('view', { onTap: this.fun_tip, 'class': 'right-content-wrapper', 'data-tap-uid': 'e18720', 'data-class-uid': 'c9951' }, h('image', { src: 'https://img1.qunarzz.com/order/comp/1806/1c/61cd118da20ec702.jpg' }), h('view', { 'class': 'content' }, h('text', { 'class': 'title' }, '\u98DE\u884C\u5B9D\u8D1D'), h('text', { 'class': 'desc' }, '\u699C\u5355\u6709\u793C')))))));
    },
    classUid: 'c9951'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/index/index'));

exports.default = P;