'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function P() {
	this.state = {};
}

P = _ReactWX2.default.toClass(
	P,
	_ReactWX2.default.Component,
	{
		render: function() {
			var h = _ReactWX2.default.createElement;

			return h(
				'view',
				null,
				h(_ReactWX2.default.useComponent, {
					render: state => {
						return h(
							'view',
							null,
							'render props ',
							h(_ReactWX2.default.useComponent, { mouse: state, is: 'Cursor' })
						);
					},
					is: 'MouseTracker',
					renderUid: 'render888',
				})
			);
		},
		classUid: 'c743',
	},
	{}
);
Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/renderprops/index'));

exports.default = P;
