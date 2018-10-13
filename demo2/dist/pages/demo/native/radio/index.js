'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        items: [{ name: 'USA', value: '美国' }, { name: 'CHN', value: '中国', checked: 'true' }, { name: 'BRA', value: '巴西' }, { name: 'JPN', value: '日本' }, { name: 'ENG', value: '英国' }, { name: 'TUR', value: '法国' }]
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    radioChange: function (e) {
        // eslint-disable-next-line
        console.log('radio发生change事件，携带value值为：', e.value);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('radio-group', { 'class': 'radio-group', onChange: this.radioChange, 'data-change-uid': 'e1443', 'data-class-uid': 'c1295' }, this.state.items.map(function (item) {
            return h('label', { 'class': 'radio' }, h('radio', { value: item.name, checked: item.checked }), item.value);
        }, this)));
    },
    classUid: 'c1295'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/native/radio/index'));

exports.default = P;