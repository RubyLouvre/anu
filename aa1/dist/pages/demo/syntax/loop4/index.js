'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../../../components/Cat/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../../../components/Fish/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
var type = "Cat";

function P() {
    this.state = {
        input: '',
        idCounter: 3,
        msgList: [{
            id: 0,
            type: 'Cat',
            content: 'xxxx'
        }, {
            id: 1,
            type: 'Cat',
            content: '4324343'
        }, {
            id: 2,
            type: 'Fish',
            content: 'sdfsdf'
        }, {
            id: 3,
            type: 'Cat',
            content: 'erewre'
        }]
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    sendMsg: function () {
        if (!this.state.value) {
            // eslint-disable-next-line
            console.warn('没有内容');
            return;
        }
        let msgList = [...this.state.msgList];
        let id = this.state.idCounter + 1;
        msgList.push({
            id: id + '',
            type: type,
            content: this.state.value
        });
        this.setState({
            value: '',
            msgList,
            idCounter: id
        });
    },
    onSelect: function (e) {
        type = e.value;
    },
    onInput: function (e) {
        this.setState({
            value: e.target.value
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'page' }, h('view', null, '\u5FAA\u73AF\u91CC\u9762\u4EA4\u66FF\u4F7F\u7528\u4E24\u5229\u4E0D\u540C\u7684\u7EC4\u4EF6'), h('view', null, this.state.msgList.map(function (msg, i1657) {
            return h('view', { className: 'msg-container clearfix', key: msg.id }, msg.type === 'Cat' && h(_ReactWX2.default.template, { id: msg.id, content: msg.content, $$loop: 'data3849', is: _index2.default, $$index: 'i1657', $$indexValue: i1657 }), msg.type === 'Fish' && h(_ReactWX2.default.template, { id: msg.id, content: msg.content, $$loop: 'data4192', is: _index4.default, $$index: 'i1657', $$indexValue: i1657 }));
        }, this)), h('radio-group', { 'class': 'radio-group', onChange: this.onSelect.bind(this), 'data-change-uid': 'e4653', 'data-class-uid': 'c2885', 'data-instance-uid': this.props.instanceUid }, h('radio', { value: 'Cat'
        }), 'Cat', h('radio', { value: 'Fish' }), 'Fish'), h('textarea', { value: this.state.value, 'auto-height': true, onInput: this.onInput.bind(this), style: 'border:1px solid grey;', 'data-input-uid': 'e5113', 'data-class-uid': 'c2885', 'data-instance-uid': this.props.instanceUid }), h('button', { type: 'button', onTap: this.sendMsg.bind(this), 'data-tap-uid': 'e5323', 'data-class-uid': 'c2885', 'data-instance-uid': this.props.instanceUid }, '\u6DFB\u52A0'));;
    },
    classUid: 'c2885'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/loop4/index'));

exports.default = P;