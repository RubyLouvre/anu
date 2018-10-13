'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Son() {}

Son = _ReactWX2.default.toClass(Son, _ReactWX2.default.Component, {
    componentDidMount: function () {
        /* eslint-disable */
        console.log('Son did mount!');
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'son' }, '\u6700\u5185\u5C42\u7EC4\u4EF6');
    },
    classUid: 'c284'
}, {});
Component(_ReactWX2.default.registerComponent(Son, 'Son'));

exports.default = Son;