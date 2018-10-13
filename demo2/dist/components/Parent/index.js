'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Parent() {}

Parent = _ReactWX2.default.toClass(Parent, _ReactWX2.default.Component, {
	componentDidMount: function () {
		/* eslint-disable */
		console.log('Parent did mount!');
	},
	render: function () {
		var h = _ReactWX2.default.createElement;

		return h('view', { 'class': 'parent' }, h('view', { 'class': 'title' }, '\u7B2C\u4E8C\u5C42\u7EC4\u4EF6'), h(_ReactWX2.default.useComponent, { is: "Son" }));
	},
	classUid: 'c410'
}, {});
Component(_ReactWX2.default.registerComponent(Parent, 'Parent'));

exports.default = Parent;