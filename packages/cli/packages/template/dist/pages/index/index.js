"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require("../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const var1 = "游离变量";

function P(props) {
    this.state = {
        name: "欢迎使用React转小程序",
        array: [{ name: "dog1", text: "text1", age: 11 }, { name: "dog2", text: "text2", age: 8 }, { name: "dog3", text: "text3", age: 6 }]
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    onClick: function () {
        console.log('click event trigger from container...');
    },
    onKeyDown: function () {
        console.log("test keydown");
    },
    render: function () {
        return _ReactWX2.default.createElement("view", { "class": "container", onTap: this.onClick, onKeyDown: this.onKeyDown }, _ReactWX2.default.createElement("view", { "class": "page_hd" }, this.state.name), _ReactWX2.default.createElement("view", { "class": "page_bd" }, _ReactWX2.default.createElement("view", { "class": "navigation" }, _ReactWX2.default.createElement("navigator", { "open-type": "navigate", "class": "item",
            "hover-class": "navigator-hover", url: "/pages/otherPage1/index" }, "\u7EC4\u4EF6\u5316"), _ReactWX2.default.createElement("navigator", { "open-type": "navigate",
            "class": "item", "hover-class": "navigator-hover", url: "/pages/otherPage2/index" }, "\u4E8B\u4EF6"), _ReactWX2.default.createElement("navigator", { "open-type": "navigate", "class": "item", "hover-class": "navigator-hover", url: "/pages/demo/form/index/index" }, "form"), _ReactWX2.default.createElement("navigator", { "open-type": "navigate", "class": "item", "hover-class": "navigator-hover", url: "/pages/test/index" }, "for a test"))));;
    },
    classCode: "c5706137641758695"
}, {});

Page(_ReactWX2.default.createPage(P, "pages/index/index"));
exports.default = P;