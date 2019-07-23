"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const postCssPluginRemoveRules = postcss_1.default.plugin('postcss-plugin-remove-rules', function () {
    return function (root) {
        root.each(node => {
            if (node.type === 'rule') {
                node.remove();
            }
            if (node.type === 'atrule' && node.name === 'keyframes') {
                node.remove();
            }
        });
    };
});
module.exports = postCssPluginRemoveRules;
