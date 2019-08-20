"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const postCssPluginRemoveComments = postcss_1.default.plugin('postcss-plugin-remove-comments', function () {
    return function (root) {
        root.walkComments(function (node) {
            node.remove();
        });
    };
});
module.exports = postCssPluginRemoveComments;
