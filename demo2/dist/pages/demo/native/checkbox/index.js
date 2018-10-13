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
    checkboxChange: function (e) {
        // eslint-disable-next-line
        console.log('checkbox发生change事件，携带value值为：', e.target.value);
        _ReactWX2.default.api.showModal({
            title: '提示',
            content: JSON.stringify(e.target.value)
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('checkbox-group', { onChange: this.checkboxChange, 'data-change-uid': 'e2144', 'data-class-uid': 'c1639' }, this.state.items.map(function (item) {
            return h('label', null, h('checkbox', { value: item.name, checked: item.checked }), item.value);
        }, this)));
    },
    classUid: 'c1639'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/native/checkbox/index'));

exports.default = P;