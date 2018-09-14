'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Brand() {
    this.state = {
        brandList: {
            brand: []
        }
    };
}

Brand = _ReactWX2.default.miniCreateClass(Brand, _ReactWX2.default.Component, {
    componentWillMount: function () {
        //sliderList
        var that = this;
        wx.request({
            url: 'http://yapi.demo.qunar.com/mock/17668/wemall/venues/getBrandAndType',
            method: 'GET',
            data: {},
            header: {
                Accept: 'application/json'
            },
            success: function (res) {
                that.setState({
                    brandList: res.data
                });
            }
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'chat-container' }, this.state.brandList.brand.map(function (item, i998) {
            return h('view', {
                className: 'brand_item' }, h('navigator', { url: '../list/index?brand=' + 11 + '&typeid=' + 12 }, h('image', { src: item.pic, className: 'pic' }), h('view', { className: 'right_cont' }, h('text', { className: 'name' }, item.chinesename), h('text', { className: 'brief' }, item.brief), h('text', { className: 'price' }, '                    \uFFE5', item.minprice, '                    \u5143/\u4EF6\u8D77                                  '))));
        }, this));;
    },
    classUid: 'c512020'
}, {});
Page(_ReactWX2.default.createPage(Brand, 'pages/brand/index'));

exports.default = Brand;