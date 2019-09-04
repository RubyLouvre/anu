"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const config_1 = __importDefault(require("../../config/config"));
const postCssPluginTransformKeyFrames = postcss_1.default.plugin('postcss-plugin-transform-keyframes', function () {
    return function (root) {
        if (config_1.default.buildType !== 'quick') {
            return;
        }
        root.walkAtRules(atrule => {
            if (atrule.name === 'keyframes') {
                atrule.walkRules((rule) => {
                    const rules = rule.selector.split(/\s*,\s*/);
                    rules.forEach(r => {
                        rule.cloneBefore(postcss_1.default.rule({
                            selector: r,
                            nodes: rule.nodes
                        }));
                    });
                    rule.remove();
                });
            }
        });
    };
});
module.exports = postCssPluginTransformKeyFrames;
