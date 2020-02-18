"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
function rpxToRem(value) {
    return value.replace(/(-?\d*\.?\d+)rpx/g, function (match, numberStr) {
        const number = Number(numberStr.trim());
        return `${number / 100}rem`;
    });
}
const postCssPluginRpxToRem = postcss_1.default.plugin('postcss-plugin-rpx-to-rem', () => {
    return (root) => {
        root.walkAtRules(atrule => {
            if (atrule.name === 'media') {
                atrule.params = rpxToRem(atrule.params);
            }
        });
        root.walkDecls(decl => {
            decl.value = rpxToRem(decl.value);
        });
    };
});
module.exports = postCssPluginRpxToRem;
