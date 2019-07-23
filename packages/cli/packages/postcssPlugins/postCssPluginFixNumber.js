"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
function fround(value, numPrecision) {
    return (numPrecision) ? Number((value + 2e-16).toFixed(numPrecision)) : value;
}
function fixNumber(value) {
    return value.replace(/(\s|^)(-?\d*\.?\d+)(\s|$)/g, function (match, before, numberStr, after) {
        const numPrecision = 8;
        const number = fround(Number(numberStr.trim()), numPrecision);
        return before + number + after;
    });
}
const postCssPluginFixNumber = postcss_1.default.plugin('postcss-plugin-fix-number', () => {
    return (root) => {
        root.walkAtRules(atrule => {
            if (atrule.name === 'media') {
                atrule.params = fixNumber(atrule.params);
            }
        });
        root.walkDecls(decl => {
            decl.value = fixNumber(decl.value);
        });
    };
});
module.exports = postCssPluginFixNumber;
