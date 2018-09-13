"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Count;

var _ReactWX = require("../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Count(props) {
    var h = _ReactWX2.default.createElement;

    return h("view", null, props.a, "+", props.b, "=", props.a + props.b);;
} // eslint-disable-next-line