'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

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
        _ReactWX2.default.api.request({
            url: 'http://yapi.demo.qunar.com/mock/18752/qunar/city',
            success: function (data) {
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
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'city-select' }, h('view', null, '\u5C31\u662F\u4F7F\u7528React.api.request,\u5BF9wx .request\u505A\u4E86\u5E76\u53D1\u5904\u7406'), h('view', null, 'https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html'), this.state.data.map(function (el) {
            return h('view', null, el.title, '-------', h('view', null, el.data.map(function (elem) {
                return h('view', null, elem);
            }, this)));
        }, this));
    },
    classUid: 'c1602'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/request/index'));

exports.default = P;