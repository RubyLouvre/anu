'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        checkboxItems: [{ name: 'USA', value: '美国' }, { name: 'CHN', value: '中国', checked: 'true' }, { name: 'BRA', value: '巴西' }, { name: 'JPN', value: '日本', checked: 'true' }, { name: 'ENG', value: '英国' }, { name: 'TUR', value: '法国' }],
        radioItems: [{ name: 'USA', value: '美国' }, { name: 'CHN', value: '中国', checked: 'true' }, { name: 'BRA', value: '巴西' }, { name: 'JPN', value: '日本' }, { name: 'ENG', value: '英国' }, { name: 'TUR', value: '法国' }],
        hidden: false
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    checkboxChange: function (e) {
        //待调试
        var checked = e.value;
        var changed = {};
        for (var i = 0; i < this.state.checkboxItems.length; i++) {
            if (checked.indexOf(this.state.checkboxItems[i].name) !== -1) {
                changed['checkboxItems[' + i + '].checked'] = true;
            } else {
                changed['checkboxItems[' + i + '].checked'] = false;
            }
        }
        // eslint-disable-next-line
        console.log(changed);
        this.setState(changed);
    },
    radioChange: function (e) {
        var checked = e.value;
        var changed = {};
        for (var i = 0; i < this.state.radioItems.length; i++) {
            if (checked.indexOf(this.state.radioItems[i].name) !== -1) {
                changed['radioItems[' + i + '].checked'] = true;
            } else {
                changed['radioItems[' + i + '].checked'] = false;
            }
        }
        // eslint-disable-next-line
        console.log(changed);
        this.setState(changed);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, this.a, h('view', { 'class': 'section section_gap' }, h('view', { 'class': 'section__title' }, '\u8868\u5355\u7EC4\u4EF6\u5728label\u5185'), h('checkbox-group', { 'class': 'group',
            onChange: this.checkboxChange, 'data-change-uid': 'e4444', 'data-class-uid': 'c5384', 'data-instance-uid': this.props.instanceUid }, this.state.checkboxItems.map(function (item, i2285) {
            return h('view', { 'class': 'label-1' }, h('label', null, h('checkbox', { hidden: true, value: item.name, checked: item.checked }), h('view', {
                'class': 'label-1__icon' }, h('view', { 'class': 'label-1__icon-checked', style: _ReactWX2.default.collectStyle({ opacity: item.checked ? 1 : 0 }, this.props, "style6223" + i2285) })), h('text', { 'class': 'label-1__text' }, '                                            ', item.value, '                                        ')));
        }, this))), h('view', { 'class': 'section section_gap' }, h('view', { 'class': 'section__title' }, 'label\u7528for\u6807\u8BC6\u8868\u5355\u7EC4\u4EF6'), h('radio-group', { 'class': 'group', onChange: this.radioChange, 'data-change-uid': 'e7797', 'data-class-uid': 'c5384', 'data-instance-uid': this.props.instanceUid }, this.state.radioItems.map(function (item, i3939) {
            return h('view', { 'class': 'label-2' }, h('radio', { id: item.name, hidden: true, value: item.name, checked: item.checked }), h('view', { 'class': 'label-2__icon' }, h('view', { 'class': 'label-2__icon-checked', style: _ReactWX2.default.collectStyle({ opacity: item.checked ? 1 : 0 }, this.props, "style9349" + i3939) })), h('label', { 'class': 'label-2__text', 'for': item.name }, h('text', null, item.name)));
        }, this))));;
    },
    classUid: 'c5384'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/label/index'));

exports.default = P;