'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../../../components/Count/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        a: 111,
        b: 222
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    changeA: function (e) {
        this.setState({
            a: ~~e.target.value
        });
    },
    changeB: function (e) {
        this.setState({
            b: ~~e.target.value
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', null, '\u65E0\u72C0\u6001\u7EC4\u4EF6'), h('view', null, '\u8F93\u5165a(\u7ED1\u5B9AonInput\u4E8B\u4EF6)', h('input', { type: 'number', style: 'border: 1px solid gray;width:50%', value: this.state.a, onChange: this.changeA.bind(this), 'data-change-uid': 'e1498', 'data-class-uid': 'c1351', 'data-instance-uid': this.props.instanceUid })), h('view', null, '\u8F93\u5165b(\u7ED1\u5B9AonChange\u4E8B\u4EF6)', h('input', { type: 'number', style: 'border: 1px solid gray;width:50%', value: this.state.b, onChange: this.changeB.bind(this), 'data-change-uid': 'e2140', 'data-class-uid': 'c1351', 'data-instance-uid': this.props.instanceUid })), h('view', null, h(_ReactWX2.default.template, { a: this.state.a, b: this.state.b, $$loop: 'data2391', is: _index2.default })));;
    },
    classUid: 'c1351'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/stateless/index'));

exports.default = P;