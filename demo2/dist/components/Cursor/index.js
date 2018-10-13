'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Cursor() {}

Cursor = _ReactWX2.default.toClass(Cursor, _ReactWX2.default.Component, {
  
    render: function () {
        console.log("执行Cursor")
        var h = _ReactWX2.default.createElement;

        return h('view', { src: 'https://www.baidu.com/img/baidu_jgylogo3.gif', style: _ReactWX2.default.toStyle({ position: 'absolute', color: 'red', left: this.props.mouse.x + 'rpx', top: this.props.mouse.y + 'rpx' }, this.props, 'style609') }, 'cursor');
    },
    classUid: 'c483'
}, {});
Component(_ReactWX2.default.registerComponent(Cursor, 'Cursor'));

exports.default = Cursor;