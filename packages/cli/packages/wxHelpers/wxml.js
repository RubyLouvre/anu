/* eslint no-console: 0 */
const babel = require('@babel/core');
const t = require('@babel/types');
const generate = require('@babel/generator').default;
const beautify = require('js-beautify');
//const he = require('he');//转义库
const utils = require('../utils');
const config = require('../config');
const buildType = config.buildType;
const attrNameHelper = require(`../${buildType}Helpers/attrName`);
const attrValueHelper = require(`../${buildType}Helpers/attrValue`);
const logicHelper = require(`../${buildType}Helpers/logic`);

function beautifyXml(code){
    return beautify.html(code, {
        indent: 4
    });
}

const quickTextContainer = {
    text: 1,
    a: 1,
    span: 1,
    label: 1,
    option: 1
};
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */

function wxml(code, modules) {
    let result = babel.transform(code, {
        configFile: false,
        babelrc: false,
        plugins: [
            require('@babel/plugin-syntax-jsx'),
            function wxmlPlugin() {
                return {
                    visitor: visitor,
                    manipulateOptions(opts) {
                        //解析每个文件前执行一次
                        opts.anu = modules;
                    }
                };
            }
        ]
    });
    var text = result.code.replace(/\\?(?:\\u)([\da-f]{4})/gi, function(a, b) {
       return unescape(`%u${b}`);
    });
    return beautifyXml(text).trim();
}

let visitor = {
    JSXOpeningElement: {
        exit: function(astPath) {
            let openTag = astPath.node.name;
            if (openTag.type === 'JSXMemberExpression' && openTag.object.name === 'React') {
                if (openTag.property.name === 'useComponent') {
                    let is, instanceUid;
                    let attributes = [];
                    astPath.node.attributes.forEach(function(el) {
                        let attrName = el.name.name;
                        if (!el.value) {
                            //如果用户只写属性名，不写属性值，默认为true
                            el.value = {
                                type: 'StringLiteral',
                                value: '{{true}}',
                                trailingComments: [],
                                leadingComments: [],
                                innerComments: []
                            };
                        }
                        let attrValue = el.value.value; //这里要重构
                        if (/^\{\{.+\}\}/.test(attrValue)) {
                            attrValue = attrValue.slice(2, -2);
                        }

                        if (attrName === 'is') {
                            is = 'anu-' + attrValue.slice(1, -1).toLowerCase();
                        }
                        if (attrName === 'data-instance-uid') {
                            instanceUid = attrValue;
                            attributes.push(utils.createAttribute('data-instance-uid', `{{${instanceUid}}}`));
                        }
                    });

                    let template = utils.createElement(is, attributes, astPath.parentPath.node.children);
                    //将组件变成template标签
                    astPath.parentPath.replaceWith(template);
                }
            } 
        }
    },
    JSXAttribute(astPath, state) {
        let attrName = astPath.node.name.name;
        let attrValue = astPath.node.value;
        if (attrName === 'key') {
            let value;
            let modules = utils.getAnu(state);
            if (t.isStringLiteral(attrValue)) {
                value = attrValue.value;
            } else {
                value = generate(attrValue.expression).code;
            }
            modules.key = value;
            astPath.remove();
            return;
        }
        attrNameHelper(astPath, attrName, astPath.parentPath.node.name.name);
    },
    JSXText: {
        exit(astPath) {
            if (buildType == 'quick') {
                let textNode = astPath.node, children, parentTag;
                let hasBlockTag = false;
                //快应用文本节点必须放在特定标签的问题
                // 情况1. <div><span>xxx</span></div>  --> <div><text>xxx</text></div>
                // 情况2. <div><strong>xxx</strong></div>  --> <div><text>xxx</text></div>
                // 情况3. <div><b>xxx</b></div>  --> <div><text>xxx</text></div>
                // 情况4. <div><s>xxx</s></div>  --> <div><text>xxx</text></div>
                // 1~4是将除a, option, label外的内联元素全部变成text标签
                // 情况5. <div>yyy</div>  --> <div><text>yyy</text></div>
                // 块状元素下直接放文本，需要插入一个text标签
                // 情况6. <div><span><block if="true">yyy</block></span></div>  --> 
                //    <div><text><block if="true"><span>yyy</span></block></text></div>
                // if for指令所在的block标签下的文本需要包一个span标签
                while (astPath.parentPath){
                    let parentNode = astPath.parentPath.node;
                    if (!children){
                        children = parentNode.children;
                    }
                    if (!parentNode.openingElement){
                        astPath = astPath.parentPath;
                        continue;
                    }
                    parentTag = parentNode.openingElement.name.name;
                    if (parentTag === 'block'){
                        astPath = astPath.parentPath;
                        hasBlockTag = true;
                    } else {
                        break;
                    }
                }
                //如果文本节点的父节点不是text, a, option, span并且不是组件, 我们在外面生成一个text
                if (hasBlockTag || !quickTextContainer[parentTag] && !/^anu-/.test(parentTag)) {
                    let index = children.indexOf(textNode);
                    let trimValue = textNode.value.trim();
                    if (trimValue == '') {
                        children.splice(index, 1);
                    } else {
                        textNode.value = trimValue;
                        children.splice(index, 1, utils.createElement(hasBlockTag ? 'span' : 'text', [], [textNode]));
                    }
                }
            }
        }
    },
    JSXExpressionContainer: {
        exit(astPath, state) {
            let expr = astPath.node.expression;
            //如果是位于属性中
            if (t.isJSXAttribute(astPath.parent)) {
                attrValueHelper(astPath);
            } else if (
                expr.type === 'MemberExpression' &&
        /props\.children\s*$/.test(generate(expr).code)
            ) {
                let attributes = [];
                let template = utils.createElement('slot', attributes, []);
                astPath.replaceWith(template);
            } else {
                let modules = utils.getAnu(state);
                //返回block元素或template元素
                let isWrapText = false;
                if (astPath.parentPath.type === 'JSXElement'){
                    let tag = astPath.parentPath.node.openingElement;
                    let tagName = tag && tag.name && tag.name.name;
                    //对<text>{aaa ? 111: 2}</text>的情况进行优化，不插入block标签
                    //只是将单花括号变成双花括号
                    if (tagName === 'text' || tagName === 'span'){
                        if (t.isConditionalExpression(expr) || t.isLogicalExpression(expr)) {
                            var hasTag = /<[^>]+>/.test( generate(expr).code);
                            isWrapText = !hasTag;
                        } 
                    }
                }
                let block = logicHelper(expr, modules, isWrapText);
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

