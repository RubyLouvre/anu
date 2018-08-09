"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require("../../../../ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P(props) {
    this.state = {
        focus: false,
        inputValue: ''
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    bindButtonTap: function () {
        this.setState({
            focus: true
        });
    },
    bindKeyInput: function (e) {
        this.setState({
            inputValue: e.value.trim()
        });
    },
    bindReplaceInput: function (e) {
        // var value = e.detail.value
        // var pos = e.detail.cursor
        // if(pos != -1){
        //     //光标在中间
        //     var left = e.detail.value.slice(0,pos)
        //     //计算光标的位置
        //     pos = left.replace(/11/g,'2').length
        // }

        // //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        // return {
        //     value: value.replace(/11/g,'2'),
        //     cursor: pos
        // }

    },
    render: function () {
        return _ReactWX2.default.createElement("view", { "class": "container" }, _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { placeholder: "sdfsd22_\\u8FD9\\u662F\\u4E00\\u4E2A\\u53EF\\u4EE5\\u81EA\\u52A8\\u805A\\u7126\\u7684input", "auto-focus": true })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { placeholder: "\\u8FD9\\u4E2A\\u53EA\\u6709\\u5728\\u6309\\u94AE\\u70B9\\u51FB\\u7684\\u65F6\\u5019\\u624D\\u805A\\u7126", focus: this.state.focus }), _ReactWX2.default.createElement("view", { "class": "btn-area" }, _ReactWX2.default.createElement("button", { onTap: this.bindButtonTap }, "\u4F7F\u5F97\u8F93\u5165\u6846\u83B7\u53D6\u7126\u70B9"))), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { maxlength: "10", placeholder: "\\u6700\\u5927\\u8F93\\u5165\\u957F\\u5EA610" })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("view", { "class": "section__title" }, "\u4F60\u8F93\u5165\u7684\u662F: ", this.state.inputValue), _ReactWX2.default.createElement("input", { onInput: this.bindKeyInput, placeholder: "\\u8F93\\u5165\\u540C\\u6B65\\u5230div\\u4E2D" })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { onInput: this.bindReplaceInput, placeholder: "\\u8FDE\\u7EED\\u7684\\u4E24\\u4E2A1\\u4F1A\\u53D8\\u62102" })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { password: true, type: "number" })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { password: true, type: "text" })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { type: "digit", placeholder: "\\u5E26\\u5C0F\\u6570\\u70B9\\u7684\\u6570\\u5B57\\u952E\\u76D8" })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { type: "idcard", placeholder: "\\u8EAB\\u4EFD\\u8BC1\\u8F93\\u5165\\u952E\\u76D8" })), _ReactWX2.default.createElement("view", { "class": "section" }, _ReactWX2.default.createElement("input", { "placeholder-style": "color:red", placeholder: "\\u5360\\u4F4D\\u7B26\\u5B57\\u4F53\\u662F\\u7EA2\\u8272\\u7684" })));;
    },
    classCode: "c7222120785851909"
}, {});

Page(_ReactWX2.default.createPage(P, "pages/demo/form/input/index"));
exports.default = P;