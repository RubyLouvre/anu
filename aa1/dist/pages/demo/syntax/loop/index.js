'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../../../components/Dog/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        array: [{
            name: '狗1'
        }, {
            name: '狗2'
        }, {
            name: '狗3'
        }]
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    changeNumbers: function () {
        // eslint-disable-next-line
        console.log('change');
        this.setState({
            array: [{
                name: '狗1'
            }, {
                name: '狗3'
            }, {
                name: '狗4'
            }, {
                name: '狗5'
            }]
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', { onTap: this.changeNumbers.bind(this), 'data-tap-uid': 'e1895', 'data-class-uid': 'c1698', 'data-instance-uid': this.props.instanceUid }, '\u6F14\u793A\u5355\u91CD\u5FAA\u73AF\uFF0C\u70B9\u8FD9\u91CC\u6539\u53D8\u6570\u7EC4\u7684\u4E2A\u6570'), h('view', null, this.state.array.map((el, i1072) => h(_ReactWX2.default.template, { name: el.name, key: el.name, $$loop: 'data2284', is: _index2.default, $$index: 'i1072', $$indexValue: i1072 }))), h('view', null, this.state.array.map((el, i1250) => {
            return h(_ReactWX2.default.template, { name: el.name, key: el.name, $$loop: 'data2656', is: _index2.default, $$index: 'i1250', $$indexValue: i1250 });
        })), h('view', null, this.state.array.map(function (el, i1438) {
            return h(_ReactWX2.default.template, { name: el.name, key: el.name, $$loop: 'data3048', is: _index2.default, $$index: 'i1438', $$indexValue: i1438 });
        }, this)));;
    },
    classUid: 'c1698'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/loop/index'));

exports.default = P;