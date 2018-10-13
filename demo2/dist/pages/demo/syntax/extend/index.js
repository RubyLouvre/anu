'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
	componentWillMount: function () {
		console.log('P componentWillMount');
	},
	componentDidMount: function () {
		console.log('P componentDidMount');
	},
	render: function () {
		var h = _ReactWX2.default.createElement;

		return h('view', null, h('view', null, '\u7C7B\u7EE7\u627F\u7684\u6F14\u793A'), h(_ReactWX2.default.useComponent, { age: 12, is: "Dog" }));
	},
	classUid: 'c398'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/extend/index'));

exports.default = P;