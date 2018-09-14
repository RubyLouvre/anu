'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Detail() {
    this.state = {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1200,
        imgUrls: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg', 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg', 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'],
        shopppingDetails: {
            title: 'Aveeno艾诺维宝宝天然燕麦体验装！带去旅行真是太方便了，¥50一套 洗发沐浴露100ml.+身体乳',
            reason: 'Aveeno艾惟诺,美国婴幼儿专家及肌肤专家力荐品牌,燕麦活萃,天然呵护!Aveeno艾惟诺中国商城-Aveeno海外旗舰店,100%正品保证,原装进口.'
        }
    };
}

Detail = _ReactWX2.default.miniCreateClass(Detail, _ReactWX2.default.Component, {
    componentWillMount: function () {
        // eslint-disable-next-line
        console.log('query', this.props.query.id);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'chat-container' }, h('view', null, h('swiper', { className: 'swiper_box', 'indicator-dots': this.state.indicatorDots, vertical: this.state.vertical, autoplay: this.state.autoplay, interval: this.state.interval, duration: this.state.duration, onChange: this.swiperchange, 'data-change-uid': 'e16821710', 'data-class-uid': 'c512371', 'data-instance-uid': this.props.instanceUid }, this.state.imgUrls.map(function (item, i1754) {
            return h('swiper-item', null, h('image', { src: item, className: 'slide-image', key: item }));
        }, this))), h('view', { 'class': 'shopping_container' }, h('view', { 'class': 'title' }, this.state.shopppingDetails.title), h('view', { 'class': 'reason' }, this.state.shopppingDetails.reason)));;
    },
    classUid: 'c512371'
}, {});
Page(_ReactWX2.default.createPage(Detail, 'pages/details/index'));

exports.default = Detail;