'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../../components/Calendar/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    handleShowDate: function (date) {
        wx.showModal({
            title: '提示',
            content: '选择日期为：' + date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
            success: e => {
                if (e.confirm) {
                    var app = _ReactWX2.default.getApp();
                    app.globalData.dateSelect = date;
                    wx.navigateBack();
                }
            }
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'calendar-containar' }, h(_ReactWX2.default.template, { handleTransmitDate: this.handleShowDate.bind(this), $$loop: 'data1462', is: _index2.default }));;
    },
    classUid: 'c888'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/calendar/index'));

exports.default = P;