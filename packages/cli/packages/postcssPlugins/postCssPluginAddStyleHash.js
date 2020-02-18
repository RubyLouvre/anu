"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const path = __importStar(require("path"));
const utils_1 = __importDefault(require("../utils"));
const postcss_selector_parser_1 = __importDefault(require("postcss-selector-parser"));
const postCssPluginAddStyleHash = postcss_1.default.plugin('postcss-plugin-add-style-hash', function () {
    return function (root, res) {
        const styleHash = utils_1.default.getStyleNamespace(path.dirname(res.opts.from));
        root.walkRules(rule => {
            if (rule.selector && rule.parent.type !== 'atrule') {
                rule.selector = postcss_selector_parser_1.default((selector) => {
                    selector.walk(s => {
                        if (s.type === 'selector' && s.parent.type !== 'pseudo') {
                            s.nodes.unshift(postcss_selector_parser_1.default.attribute({
                                attribute: styleHash
                            }));
                        }
                    });
                }).processSync(rule.selector, {
                    lossless: false
                });
            }
        });
    };
});
module.exports = postCssPluginAddStyleHash;
