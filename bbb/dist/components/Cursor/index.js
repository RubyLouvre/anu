'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Cursor() {}

Cursor = _ReactWX2.default.miniCreateClass(Cursor, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { src: 'https://www.baidu.com/img/baidu_jgylogo3.gif', style: _ReactWX2.default.collectStyle({ position: 'absolute', left: this.props.mouse.x, top: this.props.mouse.y }, this.props, "style559") }, 'cursor');;
    },
    classUid: 'c433'
}, {});

exports.default = Cursor;