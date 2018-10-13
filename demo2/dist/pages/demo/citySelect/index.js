'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        data: [],
        isSearch: false,
        searchResult: []
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
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/city',
            success: function (data) {
                _ReactWX2.default.api.hideLoading();
                let curData = that.cleanData(data.data);
                that.setState({ data: curData });
            }
        });
    },
    cleanData: function (data) {
        let result = [];
        let obj = {};

        data.map(item => {
            if (/[A-Z]/.test(item)) {
                if (item !== 'A') {
                    result.push(obj);
                }
                obj = {};
                obj.title = item;
                obj.data = [];
            } else {
                obj.data.push(item);
            }
        });
        result.push(obj);
        return result;
    },
    itemClick: function (city) {
        _ReactWX2.default.api.showModal({
            title: '提示',
            content: '当前选择城市为：' + city,
            success: e => {
                if (e.confirm) {
                    var app = _ReactWX2.default.getApp();
                    app.globalData.citySelect = city;
                    _ReactWX2.default.api.navigateBack();
                }
            }
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'city-select' }, h('view', { 'class': 'search-wrapper' }, h('input', { type: 'text', placeholder: '\\u641C\\u7D22\\u76EE\\u7684\\u5730' }), h('image', { src: '../../../assets/image/search.png' })), this.state.isSearch ? h('view', { 'class': 'search-container' }, this.state.searchResult.map(function (item, index) {
            return h('view', { 'class': 'search-result-item', key: index }, item);
        }, this)) : h('view', { 'class': 'city-wrapper' }, this.state.data.map(function (item, i2431) {
            return h('view', { 'class': 'city-item-wrapper' }, h('view', { 'class': 'title' }, item.title), h('view', { 'class': 'city-item' }, item.data.map(function (item, index) {
                return h('view', { onTap: this.itemClick.bind(this, item), 'class': 'item ' + ((index + 1) % 4 === 0 ? 'no-margin-left' : ''), key: index, 'data-tap-uid': 'e5932', 'data-class-uid': 'c3518', 'data-key': i2431 + '-' + index }, item);
            }, this)));
        }, this)));
    },
    classUid: 'c3518'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/citySelect/index'));

exports.default = P;