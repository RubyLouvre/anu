"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ReactWX = require("../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Dog() {}

Dog = _ReactWX2.default.miniCreateClass(Dog, _ReactWX2.default.Component, {
  render: function () {
    return _ReactWX2.default.createElement("view", null, this.props.name, "-", this.props.children);;
  },
  classCode: "c2621172510422225"
}, {});

exports.default = Dog;