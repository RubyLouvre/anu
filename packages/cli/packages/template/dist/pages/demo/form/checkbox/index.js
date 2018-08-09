'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P(props) {
    this.state = {
        items: [{ name: 'USA', value: '美国' }, { name: 'CHN', value: '中国', checked: 'true' }, { name: 'BRA', value: '巴西' }, { name: 'JPN', value: '日本' }, { name: 'ENG', value: '英国' }, { name: 'TUR', value: '法国' }]
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    },
    render: function () {
        return _ReactWX2.default.createElement('view', { 'class': 'container' }, _ReactWX2.default.createElement('view', { onChange: this.checkboxChange }, this.state.items.map(function (item) {
            return _ReactWX2.default.createElement('label', null, _ReactWX2.default.createElement('checkbox', { value: item.name, checked: item.checked }), item.value);
        })));;
    },
    classCode: 'c5306781795701643'
}, {});

Page(_ReactWX2.default.createPage(P, "pages/demo/form/checkbox/index"));
exports.default = P;