"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const postcss_selector_parser_1 = __importDefault(require("postcss-selector-parser"));
const config_1 = __importDefault(require("../../config/config"));
const ignoreCss = require('../quickHelpers/ignoreCss');
const postCssPluginValidateStyle = postcss_1.default.plugin('postcss-plugin-validate-style', () => {
    return (root, result) => {
        const from = result.opts.from;
        function removeCss(declaration) {
            let value = declaration.value;
            let prop = declaration.prop;
            let webkitReg = /^-webkit|^-moz|^-ms/i;
            var isRemove = false;
            if (ignoreCss[prop] && ignoreCss[prop] === true) {
                isRemove = true;
            }
            else if (ignoreCss[prop] && ignoreCss[prop](value)) {
                isRemove = true;
            }
            else if (webkitReg.test(prop)) {
                isRemove = true;
            }
            if (isRemove) {
                declaration.remove();
            }
        }
        function findInvalidateRule(css, { invalidatePseudos }) {
            const selectorReg = /^tag|class|id$/;
            let find = false;
            postcss_selector_parser_1.default((selector) => {
                if (selector.nodes && selector.nodes.length) {
                    for (var i = 0, length = selector.nodes.length; i < length; i++) {
                        find = selector.nodes[i].nodes.some((node) => {
                            if (node.type === 'pseudo' && node.value.match(new RegExp(invalidatePseudos.join('|')))) {
                                return true;
                            }
                            if (selectorReg.test(node.type)) {
                                const next = node.next();
                                if (next && selectorReg.test(next.type)) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (find) {
                            return;
                        }
                    }
                }
            }).processSync(css, {
                lossless: false
            });
            return find;
        }
        function rpxToPx(value) {
            return value.replace(/(-?\d*\.?\d+)(r?px)/g, function (match, numberStr, unit) {
                const number = Number(numberStr.trim());
                if (unit === 'rpx') {
                    return `${number}px`;
                }
                else {
                    return `${number * 2}px`;
                }
            });
        }
        function splitBorder(decl) {
            if (decl.value === 'none') {
                decl.value = '0';
            }
            const properties = ['width', 'style', 'color'];
            let values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
            if (values) {
                if (values.length > 3) {
                    values = values.slice(0, 3);
                }
                values.map((value, index) => {
                    const res = {};
                    let prop = decl.prop + '-' + properties[index];
                    if (properties[index] === 'style') {
                        prop = 'border-style';
                    }
                    res[prop] = value;
                    decl.cloneBefore(postcss_1.default.decl({
                        prop,
                        value
                    }));
                });
                decl.remove();
            }
        }
        function generateConflictDeclarations(declName, conflictRegex) {
            return (decl) => {
                const parent = decl.parent;
                parent.each((node) => {
                    if (conflictRegex.test(node.prop)) {
                        node.remove();
                    }
                });
            };
        }
        function transformBorderRadius(decl) {
            const props = [
                'border-top-left-radius',
                'border-top-right-radius',
                'border-bottom-right-radius',
                'border-bottom-left-radius'
            ];
            const values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
            let res = values;
            if (values.length > 4) {
                return;
            }
            switch (values.length) {
                case 1:
                    res = transformSingle(values);
                    break;
                case 2:
                    res = transformDouble(values);
                    break;
                case 3:
                    res = transformTriple(values);
                    break;
                default:
                    break;
            }
            res.forEach((value, index) => {
                decl.cloneBefore(postcss_1.default.decl({
                    prop: props[index],
                    value
                }));
            });
            decl.remove();
        }
        function transformBackground(decl) {
            const value = decl.value;
            if (+value == 0) {
                decl.remove();
            }
            let match = [
                /^#[a-zA-Z0-9]{3,6}$/i,
                /^[a-z]{3,}$/i
            ];
            for (let i = 0; i < match.length; i++) {
                if (match[i].test(value)) {
                    decl.prop = 'background-color';
                    break;
                }
            }
        }
        function transformSingle(values) {
            return [values[0], values[0], values[0], values[0]];
        }
        function transformDouble(values) {
            return [values[0], values[1], values[0], values[1]];
        }
        function transformTriple(values) {
            return [values[0], values[1], values[2], values[1]];
        }
        const visitors = {
            'border-style'(decl) {
                const match = decl.value.match(/[a-z]+/gi);
                if (match && match.length > 1) {
                    decl.value = match[0];
                }
            },
            'border'(decl) {
                if (decl.value === 'none') {
                    decl.value = '0';
                }
            },
            'border-radius'(decl) {
                generateConflictDeclarations('border-radius', /border-(left|bottom|right|top)-(color|width)/i)(decl);
                transformBorderRadius(decl);
            },
            'background': (decl) => {
                generateConflictDeclarations('background', /(background|border)-color/i)(decl);
                transformBackground(decl);
            },
            'background-image'(decl) {
                if (config_1.default.huawei) {
                    decl.value = decl.value.replace(/\(([^)]+)\)/, function (match, uri) {
                        uri = uri.trim();
                        if (!/^['"]/.test(uri)) {
                            uri = `("${uri}")`;
                        }
                        return uri;
                    });
                }
                generateConflictDeclarations('background-image', /(background|border)-color/i)(decl);
            },
            'border-left': splitBorder,
            'border-right': splitBorder,
            'border-bottom': splitBorder,
            'border-top': splitBorder,
            'animation': (declaration) => {
                generateConflictDeclarations('animation', /animation-(name|duration|timing-function|delay|iteration-count|direction)/i)(declaration);
                transformAnimation(declaration);
            }
        };
        let transformAnimation = (declaration) => {
            const properties = [{
                    name: 'name',
                    reg: /[a-zA-Z0-9]/gi
                },
                {
                    name: 'duration',
                    reg: /(\d[\d\.]*)(m?s)/i
                },
                {
                    name: 'timing-function',
                    reg: /linear|ease|ease-in|ease-out|ease-in-out/i
                },
                {
                    name: 'delay',
                    reg: /(\d[\d\.]*)(m?s)/i
                },
                {
                    name: 'iteration-count',
                    reg: /^\d|infinite/i
                },
                {
                    name: 'fill-mode',
                    reg: /none|forwards/i
                }
            ];
            let decl = declaration.value.split(',')[0];
            let values = decl.replace(/(,\s+)/g, ',').trim().split(/\s+/);
            let index = 0;
            for (let i = 0; i < properties.length; i++) {
                const { name, reg } = properties[i];
                const res = {};
                let value = values[index];
                if (!reg.test(value)) {
                    if (i === properties.length - 1) {
                        i = index;
                        index++;
                    }
                    continue;
                }
                const prop = declaration.prop + '-' + name;
                value = value.replace(/^(\d+(?:\.\d+)?)s$/, (match, value) => value * 1000 + 'ms');
                res[prop] = value;
                declaration.cloneBefore(postcss_1.default.decl({
                    prop,
                    value
                }));
                index++;
            }
            declaration.remove();
        };
        if (config_1.default.buildType === 'quick') {
            root.walkAtRules(atrule => {
                if (atrule.name === 'media') {
                    atrule.params = rpxToPx(atrule.params);
                }
            });
            root.walkDecls(decl => {
                if (visitors[decl.prop]) {
                    visitors[decl.prop](decl);
                }
            });
            root.walkDecls(decl => {
                decl.value = rpxToPx(decl.value);
                if (decl.important) {
                    decl.important = false;
                }
            });
            root.walkDecls(decl => {
                removeCss(decl);
            });
            const invalidatePseudos = ['after', 'before', 'hover', 'first-child', 'active', 'last-child'];
            root.walkRules(rule => {
                const find = findInvalidateRule(rule.selector, { invalidatePseudos });
                if (find) {
                    rule.remove();
                }
            });
        }
    };
});
module.exports = postCssPluginValidateStyle;
