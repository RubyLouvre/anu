'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        iconSize: [20, 30, 40, 50, 60, 70],
        iconColor: ['red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'],
        iconType: ['success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'],
        text: 'this is first line\nthis is second line'
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    add: function () {
        this.setState({
            text: this.state.text + '\nthis is new line'
        });
    },
    remove: function () {
        var textAry = this.state.text.split('\n');
        if (!textAry.length) return;
        textAry.pop();

        this.setState({
            text: textAry.join('\n')
        });
    },
    componentWillMount: function () {
        // eslint-disable-next-line
        console.log('base componentWillMount');
    },
    componentDidMount: function () {
        // eslint-disable-next-line
        console.log('base componentDidMount');
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('view', { 'class': 'item-list' }, h('view', { 'class': 'item-list-hd' }, 'Icon'), h('view', { 'class': 'group' }, this.state.iconSize.map(function (item, i1529) {
            return h('icon', { type: 'success', size: item });
        }, this)), h('view', { 'class': 'group' }, this.state.iconType.map(function (item, i1763) {
            return h('icon', { type: item, size: '40' });
        }, this)), h('view', { 'class': 'group' }, this.state.iconColor.map(function (item, i1992) {
            return h('icon', { type: 'success', size: '40', color: item, style: _ReactWX2.default.collectStyle({ margin: '1rpx', border: '1px solid ' + item }, this.props, "style4345" + i1992) });
        }, this))), h('view', { 'class': 'item' }, h('view', { 'class': 'item-list-hd' }, 'text'), h('view', { 'class': 'btn-area' }, h('view', { 'class': 'body-div' }, h('text', null, this.state.text), h('button', { onTap: this.add, 'data-tap-uid': 'e5192', 'data-class-uid': 'c3312', 'data-instance-uid': this.props.instanceUid }, 'add line'), h('button', { onTap: this.remove, 'data-tap-uid': 'e5337', 'data-class-uid': 'c3312', 'data-instance-uid': this.props.instanceUid }, 'remove line')))), h('view', { 'class': 'item' }, h('view', { 'class': 'item-list-hd' }, 'progress'), h('view', { 'class': 'btn-area' }, h('progress', { percent: '20', 'show-info': true }), h('progress', { percent: '40', 'show-info': true, 'stroke-width': '12' }), h('progress', { percent: '60', 'show-info': true,
            color: 'pink' }), h('progress', { percent: '80', 'show-info': true, active: true }))));;
    },
    classUid: 'c3312'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/base/index'));

exports.default = P;