/* eslint no-console: 0 */
const syntaxJSX = require('babel-plugin-syntax-jsx');
const babel = require('babel-core');
const t = require('babel-types');
const generate = require('babel-generator').default;
const utils = require('../utils');
const config = require('../config');
const buildType = config.buildType;
const attrNameHelper = require(`../${buildType}Helpers/attrName`);
const attrValueHelper = require(`../${buildType}Helpers/attrValue`);
const logicHelper = require(`../${buildType}Helpers/logic`);

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
            if (openTag.type === 'JSXMemberExpression' && openTag.object.name === 'React') {
                if (openTag.property.name === 'toRenderProps') {
                    //在使用了render props的组件中添加<anu-render />
                    let attributes = [];
                    //实现render props;
                    let template = utils.createElement('anu-render', attributes, []);
                    attributes.push(utils.createAttribute('renderUid', '{{props.renderUid}}'));
                    let children = astPath.parentPath.parentPath.node.children;
                    //去掉后面的{{this.props.render()}}
                    let i = children.indexOf(astPath.parentPath.node);
                    children.splice(i + 1, 1);
                    astPath.parentPath.replaceWith(template);
                } else if (openTag.property.name === 'useComponent') {
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

        if (attrName === 'key') {
            let node = astPath.node.value;
            let value;
            let modules = utils.getAnu(state);
            if (t.isStringLiteral(node)) {
                value = node.value;
            } else {
                value = generate(node.expression).code;
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
