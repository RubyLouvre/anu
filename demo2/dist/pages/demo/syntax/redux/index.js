'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { connect } from 'react-redux';
//import store from '../../../../store/index';
/*
const mapState = state => ({
    count: state.count
});
  
const mapDispatch = ({ count: { increment, incrementAsync }}) => ({
    increment: () => increment(1),
    incrementAsync: () => incrementAsync(1)
});
*/

function P(props) {
    this.increment = props.increment || function () {};

    this.incrementAsync = props.incrementAsync;
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', null, '\u8BF7\u5148\u5B89\u88C5@rematch/core redux react-redux'), h('view', null, this.props.count), h('button', { onTap: this.increment, 'data-click-uid': 'e1396', 'data-class-uid': 'c1079' }, '+1'));
    },
    classUid: 'c1079'
}, {});

// eslint-disable-next-line
//P = connect(mapState, mapDispatch)(P);

Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/redux/index'));
exports.default = P;