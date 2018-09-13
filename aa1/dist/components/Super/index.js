'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../Parent/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Super() {}

Super = _ReactWX2.default.miniCreateClass(Super, _ReactWX2.default.Component, {
	componentDidMount: function () {
		/* eslint-disable */
		console.log('Super did mount!');
	},
	render: function () {
		var h = _ReactWX2.default.createElement;

		return h('view', { 'class': 'super' }, h('view', { 'class': 'title' }, '\u6700\u5916\u5C42\u7EC4\u4EF6'), h(_ReactWX2.default.template, { $$loop: 'data662', is: _index2.default }));;
	},
	classUid: 'c422'
}, {});

exports.default = Super;