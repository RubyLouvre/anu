/* eslint no-console: 0 */
const syntaxJSX = require('babel-plugin-syntax-jsx');
const babel = require('babel-core');
const t = require('babel-types');
const generate = require('babel-generator').default;
const attrValueHelper = require('./attrValue');
const config = require('../config');
const logicSrc = '../' + config.buildType + 'Helpers/logic';
const attrNameSrc = '../' + config.buildType + 'Helpers/attrName';
const attrNameHelper = require(attrNameSrc);
const logicHelper = require(logicSrc);
const utils = require('../utils');

const quickTextContainer = {
    text: 1,
    a: 1,
    option: 1
};
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */

function wxml(code, modules) {
    let result = babel.transform(code, {
        babelrc: false,
        plugins: [
            function wxmlPlugin() {
                return {
                    inherits: syntaxJSX,
                    visitor: visitor,
                    manipulateOptions(opts) {
                        //解析每个文件前执行一次
                        opts.anu = modules;
                    }
                };
            }
        ]
    });
    return result.code.replace(/\\?(?:\\u)([\da-f]{4})/gi, function(a, b) {
        return unescape(`%u${b}`);
    });
}

let visitor = {
    JSXOpeningElement: {
        exit: function(astPath) {
            let openTag = astPath.node.name;
            if (
                openTag.type === 'JSXMemberExpression' &&
                openTag.object.name === 'React'
            ) {
                if (openTag.property.name === 'toRenderProps') {
                    let attributes = [];
                    //实现render props;
                    let template = utils.createElement(
                        'anu-render',
                        attributes,
                        []
                    );
                    attributes.push(
                        utils.createAttribute(
                            'renderUid',
                            '{{props.renderUid}}'
                        )
                    );
                    let children = astPath.parentPath.parentPath.node.children;
                    //去掉后面的{{this.props.render()}}
                    let i = children.indexOf(astPath.parentPath.node);
                    children.splice(i + 1, 1);
                    astPath.parentPath.replaceWith(template);
                } else if (openTag.property.name === 'useComponent') {
                    let is, instanceUid;
                    astPath.node.attributes.forEach(function(el) {
                        let attrName = el.name.name;
                        let attrValue = el.value.value;
                        if (/^\{\{.+\}\}/.test(attrValue)) {
                            attrValue = attrValue.slice(2, -2);
                        }

                        if (attrName === 'is') {
                            is = 'anu-' + attrValue.slice(1, -1).toLowerCase();
                        }
                        if (attrName === 'data-instance-uid') {
                            instanceUid = attrValue;
                        }
                    });
                    let attributes = [];
                    if (config.buildType == 'ali') {
                        attributes.push(
                            utils.createAttribute(
                                'instanceUid',
                                `{{${instanceUid}}}`
                            )
                        );
                    }
                    let template = utils.createElement(
                        is,
                        attributes,
                        astPath.parentPath.node.children
                    );
                    //将组件变成template标签
                    astPath.parentPath.replaceWith(template);
                }
            }
        }
    },
    JSXAttribute(astPath, state) {
        let attrName = astPath.node.name.name;
        if (attrName === 'key') {
            let node = astPath.node.value;
            let value;
            let modules = utils.getAnu(state);
            if (t.isStringLiteral(node)) {
                value = node.value;
            } else {
                if (/\./.test(node.expression.value)) {
                    value = '*this';
                } else {
                    value = `{{${generate(node.expression).code}}}`;
                }
            }
            modules.key = value;
            astPath.remove();
            return;
        }
        if (config.buildType === 'quick' && attrName === 'fixQuickButtonType') {
            astPath.node.name.name = 'type';
            var c = astPath.parentPath.parentPath.node.children;
            var valueString = c.map(function(el){
                if (el.type === 'JSXText'){
                    return el.value.trim();
                } else {
                    return  '{' + generate(el).code +'}';
                }
            }).join('');
            c.length = 0;
            astPath.parentPath.node.attributes.push(
                utils.createAttribute('value', valueString)
            );
        }

        attrNameHelper(astPath);
    },
    JSXText: {
        exit(astPath) {
            if (config.buildType == 'quick') {
                let parentNode = astPath.parentPath.node;
                let parentTag = parentNode.openingElement.name.name;
                let children = parentNode.children;
                if (!quickTextContainer[parentTag]) {
                    let index = children.indexOf(astPath.node);
                    let trimValue = astPath.node.value.trim();
                    if (trimValue == '') {
                        parentNode.children.splice(index, 1);
                    } else {
                        astPath.node.value = trimValue;
                        parentNode.children.splice(
                            index,
                            1,
                            utils.createElement('text', [], [astPath.node])
                        );
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
            } else if (
                expr.type === 'MemberExpression' &&
                /props\.children\s*$/.test(generate(expr).code)
            ) {
                let attributes = [];
                let template = utils.createElement('slot', attributes, []);
                astPath.replaceWith(template);
                //  console.warn("小程序暂时不支持{this.props.children}");
            } else {
                let modules = utils.getAnu(state);
                //返回block元素或template元素
                let block = logicHelper(expr, modules);
                try {
                    astPath.replaceWithMultiple(block);
                } catch (e) {
                    //快应用将文本节点包一层text，可能在这里引发BUG
                    astPath.replaceWith(block[0]);
                }
            }
        }
    }
};
module.exports = wxml;
