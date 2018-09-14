'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PageIndex() {
    this.state = {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        imgUrls: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg', 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg']
    };
}

PageIndex = _ReactWX2.default.miniCreateClass(PageIndex, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'chat-container ' }, h('view', null, h('swiper', { className: 'swiper_box', 'indicator-dots': this.state.indicatorDots, vertical: this.state.vertical, autoplay: this.state.autoplay, interval: this.state.interval, duration: this.state.duration, onChange: this.swiperchange, 'data-change-uid': 'e11431171', 'data-class-uid': 'c283240', 'data-instance-uid': this.props.instanceUid }, this.state.imgUrls.map(function (item, i1215) {
            return h('swiper-item', null, h('image', { src: item, className: 'slide-image', key: item }));
        }, this))), h('view', { className: 'text' }, h('view', { className: 'line_flag' }), h('view', null, '\u4E3B\u9898\u9986')), h('view', { className: 'venues_box' }, h('view', { className: 'venues_list' }, this.props.indexPageIcons.map(function (item, i1826) {
            return h('view', { 'class': 'venues_item', key: item.bizIndex }, h('navigator', { url: '../pages/brand/index?id=' + item.bizIndex }, h('image', { src: item.logoSrc, className: 'slide-image-2' })));
        }, this))), h('view', { className: 'text' }, h('view', { className: 'line_flag'
        }), h('view', null, '\u5168\u7403\u7CBE\u9009')), h('view', { className: 'venues_box' }, h('view', { className: 'venues_list' }, this.props.choiceItems.map(function (item, i2608) {
            return h('view', { 'class': 'venues_item', key: item.bizIndex }, h('navigator', { url: '../pages/details/index?id=' + item.bizIndex }, h('image', { src: item.logoSrc, className: 'slide-image-1' })));
        }, this))), h('loading', { hidden: this.props.loadingHidden }, '\u52A0\u8F7D\u4E2D...'));;
    },
    classUid: 'c283240'
}, {});

exports.default = PageIndex;