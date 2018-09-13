'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.bind();
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    bind: function () {
        for (let i = 1; i < 5; i++) {
            let index = i + 1;
            this['slider' + index + 'change'] = function (e) {
                // eslint-disable-next-line
                console.log('slider' + 'index' + '发生 change 事件，携带值为', e.value);
            };
        }
    },
    switch1Change: function (e) {
        // eslint-disable-next-line
        console.log('switch1 发生 change 事件，携带值为', e.value);
    },
    switch2Change: function (e) {
        // eslint-disable-next-line
        console.log('switch2 发生 change 事件，携带值为', e.value);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('view', { 'class': 'section section_gap' }, h('text', { 'class': 'section__title' }, '\u8BBE\u7F6Estep'), h('view', { 'class': 'body-div' }, h('slider', { onChange: this.slider2change, step: '5', 'data-change-uid': 'e2011', 'data-class-uid': 'c2076', 'data-instance-uid': this.props.instanceUid
        }))), h('view', { 'class': 'section section_gap' }, h('text', { 'class': 'section__title' }, '\u663E\u793A\u5F53\u524Dvalue'), h('view', { 'class': 'body-div' }, h('slider', { onChange: this.slider3change, 'show-value': true, 'data-change-uid': 'e2577', 'data-class-uid': 'c2076', 'data-instance-uid': this.props.instanceUid }))), h('view', { 'class': 'section section_gap' }, h('text', { 'class': 'section__title' }, '\u8BBE\u7F6E\u6700\u5C0F/\u6700\u5927\u503C'), h('view', { 'class': 'body-div' }, h('slider', { onChange: this.slider4change, min: '50', max: '200', 'show-value': true, 'data-change-uid': 'e3203', 'data-class-uid': 'c2076', 'data-instance-uid': this.props.instanceUid }))), h('view', { 'class': 'section section_gap' }, h('switch', { checked: true, onChange: this.switch1Change, 'data-change-uid': 'e3817', 'data-class-uid': 'c2076', 'data-instance-uid': this.props.instanceUid }), h('switch', { onChange: this.switch2Change, 'data-change-uid': 'e3939', 'data-class-uid': 'c2076', 'data-instance-uid': this.props.instanceUid })));;
    },
    classUid: 'c2076'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/slider/index'));

exports.default = P;