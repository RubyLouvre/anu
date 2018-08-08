'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P(props) {
    this.state = {
        name: '一段文本...'
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    updateText: function () {
        this.setState({
            name: '李四'
        });
    },
    resetText: function () {
        this.setState({
            name: '一段文本...'
        });
    },
    render: function () {
        return _ReactWX2.default.createElement("view", { "class": "container" }, _ReactWX2.default.createElement("view", { "class": "page-guide-text" }, this.state.name), _ReactWX2.default.createElement("button", { "class": "btn", onTap: this.updateText }, "\u66F4\u6539\u6587\u5B57"), _ReactWX2.default.createElement("button", { "class": "btn", onTap: this.resetText }, "\u91CD\u7F6E"));;
    },
    classCode: "c3018475813957737"
}, {});

Page(_ReactWX2.default.createPage(P, "pages/otherPage2/index"));
exports.default = P;