const syntaxJSX = require('babel-plugin-syntax-jsx');
const babel = require('babel-core');
const t = require('babel-types');
const generate = require('babel-generator').default;
const attrValueHelper = require('./attrValue');
const attrNameHelper = require('./attrName');
const logicHelper = require('./logic');
const jsx = require('../utils');
const chineseHelper = require('./chinese');
const slotHelper = require('./slot');

var chineseHack = chineseHelper();
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function wxml(code, modules) {
    var result = babel.transform(code, {
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
    var html = result.code;
    if (chineseHack.unicodeNumber) {
        return chineseHack.recovery(html);
    }
    return html;
}
var visitor = {
    JSXOpeningElement: {
        exit: function(astPath, state) {
            var openTag = astPath.node.name;
            if (
                openTag.type === 'JSXMemberExpression' &&
                openTag.object.name === 'React' &&
                openTag.property.name === 'template'
            ) {
                var modules = jsx.getAnu(state);
                var array, is, key;
                astPath.node.attributes.forEach(function(el) {
                    var attrName = el.name.name;
                    var attrValue = el.value.value;
                    if (/^\{\{.+\}\}/.test(attrValue)) {
                        attrValue = attrValue.slice(2, -2);
                    }
                    if (attrName === 'fragmentUid') {
                        slotHelper(
                            astPath.parentPath.node.children,
                            el.value.value,
                            modules,
                            wxml
                        );
                        // console.log('fragmentUid');
                    } else if (attrName === 'templatedata') {
                        array = attrValue;
                    } else if (attrName === 'is') {
                        is = attrValue;
                    } else if (attrName === 'wx:key') {
                        key = attrValue;
                    } else if (attrName === 'key') {
                        key = attrValue;
                    }
                });
                var attributes = [];
                var template = jsx.createElement('template', attributes, []);
                template.key = key;
                var p = astPath.parentPath.parentPath,
                    inLoop,
                    dataName = 'data';
                while (p.parentPath) {
                    p = p.parentPath;
                    if (p.type === 'CallExpression') {
                        inLoop = p.node.callee.property.name === 'map';
                        dataName = p.node.arguments[0].params[0].name;
                        break;
                    }
                }
                //将组件变成template标签
                if (!inLoop) {
                    attributes.push(
                        jsx.createAttribute('is', is),
                        jsx.createAttribute('data', `{{...${dataName}}}`),
                        jsx.createAttribute('wx:for', `{{${array}}}`),
                        jsx.createAttribute('wx:for-item', dataName),
                        jsx.createAttribute('wx:for-index', 'index'),
                        jsx.createAttribute('wx:key', '*this')
                    );
                } else {
                    attributes.push(
                        jsx.createAttribute('is', is),
                        jsx.createAttribute('wx:if', `{{${array}[index]}}`),
                        jsx.createAttribute('data', `{{...${array}[index]}}`)
                    );
                }

                astPath.parentPath.replaceWith(template);
            }
        }
    },
    JSXAttribute(astPath) {
        chineseHack.collect(astPath);
        if (astPath.node.name.name === 'key') {
            let node = astPath.node.value;
            let value;

            if (t.isStringLiteral(node)) {
                value = node.value;
            } else {
                if (/\./.test(node.expression.value)) {
                    value = '*this';
                } else {
                    value = `{{${generate(node.expression).code}}}`;
                }
            }
            astPath.parentPath.node.attributes.push(
                jsx.createAttribute('wx:key', value)
            );
            astPath.remove();
            return;
        }
        attrNameHelper(astPath);
    },

    JSXExpressionContainer: {
        enter() {},
        exit(astPath, state) {
            var modules = state.file.opts.anu;
            var expr = astPath.node.expression;
            if (t.isJSXAttribute(astPath.parent)) {
                attrValueHelper(astPath);
            } else if (
                expr.type === 'MemberExpression' &&
                /props\.children/.test(generate(expr).code)
            ) {
                var attributes = [];
                var template = jsx.createElement('template', attributes, []);
                attributes.push(
                    jsx.createAttribute('is', '{{props.fragmentUid}}'),
                    jsx.createAttribute('data', '{{...props.fragmentData}}')
                );
                astPath.replaceWith(template);
                //  console.warn("小程序暂时不支持{this.props.children}");
            } else {
                //返回block元素或template元素
                var block = logicHelper(expr, modules);
                astPath.replaceWith(block);
            }
        }
    }
};
module.exports = wxml;