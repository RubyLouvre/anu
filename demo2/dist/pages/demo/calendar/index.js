'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    handleShowDate: function (date) {
        _ReactWX2.default.api.showModal({
            title: '提示',
            content: '选择日期为：' + date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
            success: e => {
                if (e.confirm) {
                    var app = _ReactWX2.default.getApp();
                    app.globalData.dateSelect = date;
                    _ReactWX2.default.api.navigateBack();
                }
            }
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'calendar-containar' }, h(_ReactWX2.default.useComponent, { handleTransmitDate: this.handleShowDate.bind(this), is: "Calendar" }));
    },
    classUid: 'c902'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/calendar/index'));

exports.default = P;