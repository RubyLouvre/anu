'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../components/MouseTracker/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../components/Cursor/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {};
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h(_ReactWX2.default.template, { render: state => {
                return h("view", null, "render props", h(_ReactWX2.default.template, { mouse: state, $$loop: "data784", is: _index4.default }));;
            }, $$loop: 'data736', is: _index2.default, renderUid: 'render747' }));;
    },
    classUid: 'c605'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/index'));

exports.default = P;