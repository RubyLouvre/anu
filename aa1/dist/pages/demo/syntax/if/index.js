'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        condition1: true,
        condition2: true
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    toggleCondition2: function () {
        this.setState({
            condition2: !this.state.condition2
        });
    },
    toggleCondition1: function () {
        this.setState({
            condition1: !this.state.condition1
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;
        return this.state.condition1 ? this.state.condition2 ? h('view', null, h('view', null, 'Condition1 active'), h('button', { onTap: this.toggleCondition1.bind(this), 'data-tap-uid': 'e1358',

            'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Inactive Condition1'), h('view', null, 'Condition2 active'), h('button', { onTap: this.toggleCondition2.bind(this), 'data-tap-uid': 'e1776', 'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Inactive Condition2')) : h('view', null, h('view', null, 'Condition1 active'), h('button', { onTap: this.toggleCondition1.bind(this), 'data-tap-uid': 'e2430', 'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Inactive Condition1'), h('view', null, 'Condition2 inactive'), h('button', {
            onTap: this.toggleCondition2.bind(this), 'data-tap-uid': 'e2852', 'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Active Condition2')) : this.state.condition2 ? h('view', null, h('view', null, 'Condition1 inactive'), h('button', { onTap: this.toggleCondition1.bind(this), 'data-tap-uid': 'e3608', 'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Active Condition1'), h('view', null, 'Condition2 active'), h('button', { onTap: this.toggleCondition2.bind(this), 'data-tap-uid': 'e4022', 'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Inactive Condition2')) : h('view', null, h('view', null, 'Condition1 inactive'), h('button', { onTap: this.toggleCondition1.bind(this), 'data-tap-uid': 'e4680', 'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Active Condition1'), h('view', null, 'Condition2 inactive'), h('button', { onTap: this.toggleCondition2.bind(this), 'data-tap-uid': 'e5098', 'data-class-uid': 'c2757', 'data-instance-uid': this.props.instanceUid }, 'Active Condition2'));;
    },
    classUid: 'c2757'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/if/index'));

exports.default = P;