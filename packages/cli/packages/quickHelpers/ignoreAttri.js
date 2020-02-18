"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
module.exports = function ignoreAttri(astPath, nodeName) {
    if (attributes[nodeName]) {
        astPath.node.attributes = astPath.node.attributes.filter(function (el) {
            const ignoreRule = attributes[nodeName].rules;
            const ignoreFunc = attributes[nodeName].ruleFunc;
            const attriName = el.name.name.toLowerCase();
            if (ignoreRule.includes(attriName)) {
                return false;
            }
            if (typeof ignoreFunc === 'function') {
                return ignoreFunc(attriName, el.value);
            }
            return true;
        });
    }
};
const attributes = {
    list: {
        rules: ['scroll-y', 'scroll-x', 'scroll-into-view', 'scroll-left', 'lower-threshold', 'enable-back-to-top', 'scroll-with-animation'],
    },
    'list-item': {
        rules: ['animation']
    },
    text: {
        rules: ['animation', 'size', 'content', 'decode', 'color', 'open-type']
    },
    switch: {
        rules: ['color']
    },
    stack: {
        rules: ['animation'],
        ruleFunc: function (props, node) {
            if (config_1.default.huawei) {
                var inValidProps = {
                    onmouseup: 1,
                    onmousemove: 1,
                    onmousedown: 1,
                    catchmousemove: 1,
                    catchmousedown: 1,
                    catchmouseup: 1
                };
                if (inValidProps[props]) {
                    return false;
                }
            }
            return true;
        }
    },
    div: {
        rules: ['animation', 'hover-class', 'formtype', 'type', 'open-type', 'src', 'action', 'submit', 'onchange', 'ongetuserinfo', 'onscale', 'getphonenumber'],
        ruleFunc: function (props, node) {
            if (config_1.default.huawei) {
                const invalidProps = {
                    onscale: 1,
                    onend: 1,
                    onerror: 1,
                    onpause: 1,
                    onchange: 1,
                    onplay: 1,
                    ongetuserinfo: 1
                };
                if (invalidProps[props]) {
                    return false;
                }
            }
            return true;
        }
    },
    input: {
        rules: ['placeholder-style', 'placeholder-class'],
        ruleFunc: function (props, node) {
            if (config_1.default.huawei) {
                if (props === 'type') {
                    const validValues = ['button', 'checkbox', 'radio', 'text', 'email', 'date', 'time', 'number', 'password'];
                    if (node.type !== 'StringLiteral' || !validValues.includes(node.value)) {
                        return false;
                    }
                }
            }
            return true;
        }
    },
    image: {
        rules: ['mode', 'width', 'height', 'confirm', 'focus', 'confirm-type'],
        ruleFunc: function (props, node) {
            if (config_1.default.huawei) {
                if (props === 'onload') {
                    return false;
                }
            }
            return true;
        }
    },
    swiper: {
        rules: ['indicator-dots', 'duration', 'indicator-active-color', 'indicator-color', 'circular']
    },
    video: {
        rules: ['show-center-play-btn', 'objectfit,show-play-btn', 'direction']
    },
    textarea: {
        rules: ['placeholder-class', 'show-confirm-bar', 'focus', 'value', 'cursor-spacing'],
        ruleFunc: function (props, node) {
            if (config_1.default.huawei) {
                if (props === 'onlinechange') {
                    return false;
                }
            }
            return true;
        }
    }
};
