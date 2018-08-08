"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require("../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _dog = require("../../components/dog/dog");

var _dog2 = _interopRequireDefault(_dog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P(props) {
    this.state = {
        name: '我是一个组件'
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    tapEventHandler: function () {
        console.log('event from parent component');
    },
    render: function () {
        return _ReactWX2.default.createElement("view", { "class": "container" }, _ReactWX2.default.createElement(_ReactWX2.default.template, { eventTapHandler: this.tapEventHandler, name: this.state.name, templatedata: "data7107365634267293", is: _dog2.default }, "\u6211\u662F\u4E00\u4E2A\u7EC4\u4EF6"));;
    },
    classCode: "c4022392193674651"
}, {});

Page(_ReactWX2.default.createPage(P, "pages/otherPage1/index"));
exports.default = P;