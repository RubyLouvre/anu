"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require("../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _dog = require("../../components/dog/dog");

var _dog2 = _interopRequireDefault(_dog);

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
        console.log("test click1" + var1);
        this.setState({
            name: new Date() - 0
        });
    },
    onKeyDown: function () {
        console.log("test keydown");
    },
    render: function () {
        return _ReactWX2.default.createElement("view", { onTap: this.onClick, onKeyDown: this.onKeyDown }, _ReactWX2.default.createElement("view", null, this.state.name), _ReactWX2.default.createElement("view", null, this.state.array.map(function (el) {
            return _ReactWX2.default.createElement(_ReactWX2.default.template, { key: el.name, name: el.name, age: el.age, templatedata: "data6412929555607421", is: _dog2.default }, el.text);
        }, true)), _ReactWX2.default.createElement(_ReactWX2.default.template, { name: this.state.name, templatedata: "data20643159717846626", is: _dog2.default }, "\u6B22\u8FCE"));;
    },
    classCode: "c7675471903928701"
}, {});

Page(_ReactWX2.default.createPage(P, "pages/index/index"));
exports.default = P;