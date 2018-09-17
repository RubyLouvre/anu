'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function List() {
    this.state = {
        list: []
    };
}

List = _ReactWX2.default.miniCreateClass(List, _ReactWX2.default.Component, {
    componentWillMount: function () {
        var that = this;
        // console.log(this.props.query)
        wx.request({
            url: 'http://yapi.demo.qunar.com/mock/17668/wemall/goods/inqGoodsByTypeBrand?brand=' + this.props.query.brand + '&typeid=' + this.props.query.brand,
            method: 'GET',
            data: {},
            header: {
                Accept: 'application/json'
            },
            success: function (res) {
                that.setState({
                    list: res.data
                });
            }
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'chat-container' }, this.state.list.map(function (item, i1079) {
            return h('navigator', {
                key: item.id, url: '../details/index?id=' + item.id }, h('view', { 'class': 'brand_item' }, h('image', { src: item.goodspics, 'class': 'pic' }), h('view', { 'class': 'right_cont' }, h('view', { 'class': 'country' }, item.country, '\u76F4\u91C7 ', item.bigname, '\u53D1\u8D27'), h('view', { 'class': 'name' }, item.title), h('view', { 'class': 'price' }, h('text', { 'class': 'marketprice' }, '                      \uFFE5', item.marketprice, '.00                                      '), h('text', { 'class': 'discount' }, '8\u6298'), h('text', { 'class': 'ourprice' }, '                      \uFFE5', item.ourprice, '.00                                      ')))));
        }, this));;
    },
    classUid: 'c512339'
}, {});
Page(_ReactWX2.default.createPage(List, 'pages/list/index'));

exports.default = List;