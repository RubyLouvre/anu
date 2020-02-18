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
const generator_1 = __importDefault(require("@babel/generator"));
const t = __importStar(require("@babel/types"));
const chalk_1 = __importDefault(require("chalk"));
const core_1 = require("@babel/core");
const utils_1 = __importDefault(require("../utils"));
const config_1 = __importDefault(require("../../config/config"));
const js_beautify_1 = __importDefault(require("js-beautify"));
const buildType = config_1.default.buildType;
const helper = config_1.default[buildType].helpers;
const attrNameHelper = require(`../${helper}/attrName`);
const attrValueHelper = require(`../${helper}/attrValue`);
const logicHelper = require(`../${helper}/logic`);
function beautifyXml(code) {
    return js_beautify_1.default.html(code, {
        indent: 4
    });
}
const rcomponentName = /^[A-Z].+/;
const quickTextContainer = {
    text: 1,
    a: 1,
    span: 1,
    label: 1,
    option: 1
};
function wxml(code, modules) {
    let result = core_1.transform(code, {
        configFile: false,
        comments: false,
        babelrc: false,
        plugins: [
            require('@babel/plugin-syntax-jsx'),
            function wxmlPlugin() {
                return {
                    visitor: visitor,
                    manipulateOptions(opts) {
                        opts.anu = modules;
                    }
                };
            }
        ]
    });
    var text = result.code.replace(/\\?(?:\\u)([\da-f]{4})/gi, function (a, b) {
        return unescape(`%u${b}`);
    });
    return beautifyXml(text).trim();
}
let visitor = {
    CallExpression: {
        exit: function (astPath, state) {
            var callee = astPath.node.callee;
            let modules = utils_1.default.getAnu(state);
            if (modules.isInAttribute) {
                if (!modules.isInTag) {
                    return;
                }
                if (modules.isInAttribute == 'style' || /^(on|catch|style)/.test(modules.isInAttribute)) {
                    return;
                }
                console.warn(chalk_1.default.red("请不要在JSX中的 " + modules.isInAttribute, " 属性中调用函数 " + generator_1.default(astPath.node).code + "\n\n"));
                return;
            }
            if (callee.type === 'MemberExpression' && callee.property.name === 'map') {
            }
            else {
                console.log(chalk_1.default.red("请不要在JSX中调用函数 " + generator_1.default(astPath.node).code + "\n\n"));
            }
        }
    },
    JSXOpeningElement: {
        enter: function (astPath, state) {
            let modules = utils_1.default.getAnu(state);
            modules.isInTag = astPath.node.name.name;
        },
        exit: function (astPath, state) {
            let modules = utils_1.default.getAnu(state);
            modules.isInTag = false;
            let openTag = astPath.node.name, newTagName = false, attributes = [], childNodes = astPath.parentPath.node.children;
            if (openTag.type === 'JSXMemberExpression') {
                if (openTag.object.name === 'React' && openTag.property.name === 'useComponent') {
                    let instanceUid;
                    astPath.node.attributes.forEach(function (el) {
                        let attrName = el.name.name;
                        if (!el.value) {
                            el.value = {
                                type: 'StringLiteral',
                                value: '{{true}}',
                                trailingComments: [],
                                leadingComments: [],
                                innerComments: []
                            };
                        }
                        let attrValue = el.value.value;
                        if (/^\{\{.+\}\}/.test(attrValue)) {
                            attrValue = attrValue.slice(2, -2);
                        }
                        if (attrName === 'is') {
                            newTagName = 'anu-' + attrValue.slice(1, -1).toLowerCase();
                        }
                        if (attrName === 'data-instance-uid') {
                            instanceUid = attrValue;
                            attributes.push(utils_1.default.createAttribute('data-instance-uid', `{{${instanceUid}}}`));
                        }
                    });
                }
                else {
                    newTagName = 'block';
                }
            }
            else if (openTag.type === 'JSXIdentifier' && rcomponentName.test(openTag.name)) {
                newTagName = 'block';
            }
            if (newTagName) {
                let container = utils_1.default.createElement(newTagName, attributes, childNodes);
                astPath.parentPath.replaceWith(container);
            }
        }
    },
    JSXAttribute: {
        enter: function (astPath, state) {
            let attrName = astPath.node.name.name;
            let attrValue = astPath.node.value;
            let modules = utils_1.default.getAnu(state);
            modules.isInAttribute = attrName;
            if (attrName === 'key') {
                let value;
                if (t.isStringLiteral(attrValue)) {
                    value = attrValue.value;
                }
                else {
                    value = generator_1.default(attrValue.expression).code;
                    if ((buildType === 'qq' || buildType === 'wx') && value.indexOf('+') > 0) {
                        var fixKey = value.replace(/\+.+/, '').trim();
                        console.log(chalk_1.default.cyan(`微信/QQ小程序的key不支持加号表达式${value}-->${fixKey}`));
                        value = fixKey;
                    }
                }
                var CallExpression = astPath.findParent(t.isCallExpression);
                if (CallExpression) {
                    var callee = CallExpression.node.callee;
                    modules.key = modules.key || {};
                    let calleeCode = generator_1.default(callee).code;
                    modules.key[calleeCode] = value;
                    astPath.remove();
                }
                return;
            }
            attrNameHelper(astPath, attrName, astPath.parentPath.node.name.name);
        },
        exit: function (astPath, state) {
            let modules = utils_1.default.getAnu(state);
            modules.isInAttribute = false;
        },
    },
    JSXText: {
        exit(astPath) {
            if (buildType == 'quick') {
                let textNode = astPath.node, children, parentTag;
                let hasBlockTag = false;
                while (astPath.parentPath) {
                    let parentNode = astPath.parentPath.node;
                    if (!children) {
                        children = parentNode.children;
                    }
                    if (!parentNode.openingElement) {
                        astPath = astPath.parentPath;
                        continue;
                    }
                    parentTag = parentNode.openingElement.name.name;
                    if (parentTag === 'block') {
                        astPath = astPath.parentPath;
                        hasBlockTag = true;
                    }
                    else {
                        break;
                    }
                }
                if (hasBlockTag || !quickTextContainer[parentTag] && !/^anu-/.test(parentTag)) {
                    let index = children.indexOf(textNode);
                    let trimValue = textNode.value.trim();
                    if (trimValue == '') {
                        children.splice(index, 1);
                    }
                    else {
                        textNode.value = trimValue;
                        children.splice(index, 1, utils_1.default.createElement(hasBlockTag ? 'span' : 'text', [], [textNode]));
                    }
                }
            }
        }
    },
    JSXExpressionContainer: {
        exit(astPath, state) {
            let expr = astPath.node.expression;
            if (t.isJSXAttribute(astPath.parent)) {
                attrValueHelper(astPath);
                if (astPath.node.type === 'StringLiteral') {
                    astPath.node.value = astPath.node.value.replace(/"/g, "'");
                }
            }
            else if (expr.type === 'MemberExpression' &&
                /props\.children\s*$/.test(generator_1.default(expr).code)) {
                let attributes = [];
                let template = utils_1.default.createElement('slot', attributes, []);
                astPath.replaceWith(template);
            }
            else {
                let modules = utils_1.default.getAnu(state);
                let isWrapText = false;
                if (astPath.parentPath.type === 'JSXElement') {
                    let tag = astPath.parentPath.node.openingElement;
                    let tagName = tag && tag.name && tag.name.name;
                    if (tagName === 'text' || tagName === 'span') {
                        if (t.isConditionalExpression(expr) || t.isLogicalExpression(expr)) {
                            var hasTag = /<[^>]+>/.test(generator_1.default(expr).code);
                            isWrapText = !hasTag;
                        }
                    }
                }
                let block = logicHelper(expr, modules, isWrapText);
                try {
                    astPath.replaceWithMultiple(block);
                }
                catch (e) {
                    astPath.replaceWith(block[0]);
                }
            }
        }
    }
};
module.exports = wxml;
