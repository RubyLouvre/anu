"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Count;

var _ReactWX = require("../../ReactWX.js");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component(_ReactWX2.default.registerComponent(Count, "Count")); // eslint-disable-next-line
function Count(props) {
    var h = _ReactWX2.default.createElement;

    return h("view", null, props.a, "+", props.b, "=", props.a + props.b);
}