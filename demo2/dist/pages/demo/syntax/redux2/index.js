'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', null, '\u67E5\u770Bstore\u91CC\u9762\u7684\u6570\u636E'), h('view', null, this.props.count));
    },
    classUid: 'c222'
}, {});

// eslint-disable-next-line

Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/redux2/index'));
exports.default = P;