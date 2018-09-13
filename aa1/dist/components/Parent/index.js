'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../Son/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Parent() {}

Parent = _ReactWX2.default.miniCreateClass(Parent, _ReactWX2.default.Component, {
	componentDidMount: function () {
		/* eslint-disable */
		console.log('Parent did mount!');
	},
	render: function () {
		var h = _ReactWX2.default.createElement;

		return h('view', { 'class': 'parent' }, h('view', { 'class': 'title' }, '\u7B2C\u4E8C\u5C42\u7EC4\u4EF6'), h(_ReactWX2.default.template, { $$loop: 'data653', is: _index2.default }));;
	},
	classUid: 'c410'
}, {});

exports.default = Parent;