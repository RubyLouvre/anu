const syntaxJSX = require('babel-plugin-syntax-jsx');
const babel = require('babel-core');
const t = require('babel-types');
const generate = require('babel-generator').default;
const attrValueHelper = require('./attrValue');
const attrNameHelper = require('./attrName');
const logicHelper = require('./logic');
const utils = require('../utils');
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
                openTag.object.name === 'React' ){
                if ( openTag.property.name === 'toRenderProps'){
                    var attributes = [];
                    //实现render props;
                    var template = utils.createElement('template', attributes, []);
                    attributes.push(
                        utils.createAttribute('is', '{{props.renderUid}}'),
                        utils.createAttribute('data', '{{...renderData}}')
                    );
                    var children = astPath.parentPath.parentPath.node.children;
                    //去掉后面的{{this.props.render()}}
                    var i = children.indexOf(astPath.parentPath.node);
                    children.splice(i+1, 1);
                    astPath.parentPath.replaceWith(template);
                    
                } else if (openTag.property.name === 'toComponent'){
                    var modules = utils.getAnu(state);
                    var array,
                        is,
                        key = '',
                        indexArr;
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
                        } else if (attrName === '$$loop') {
                            array = attrValue;
                        } else if (attrName === 'is') {
                            is = attrValue;
                        } else if (attrName === 's-key') {
                            key = attrValue;
                        } else if (attrName === 'key') {
                            key = attrValue;
                        } else if (attrName == '$$index') {
                            indexArr = attrValue;
                        }
                    });
                    attributes = [];
                    template = utils.createElement('template', attributes, []);
                    //将组件变成template标签
                    if (!indexArr) {
                        attributes.push(
                            utils.createAttribute('is', is),
                            utils.createAttribute('data', '{{...data}}'),
                            utils.createAttribute('s-for', `{{components.${array}}}`),
                            utils.createAttribute('s-for-item', 'data'),
                            utils.createAttribute('s-for-index', 'index'),
                            utils.createAttribute('s-key', utils.genKey(key))
                        );
                    } else {
                        attributes.push(
                            utils.createAttribute('is', is),
                            utils.createAttribute(
                                's-for',
                                `{{components['${array}'+${indexArr} ]}}`
                            ),
                            utils.createAttribute('s-for-item', 'data'),
                            utils.createAttribute('data', '{{...data}}'),
                            utils.createAttribute('s-key', utils.genKey(key))
                        );
                    }
                    astPath.parentPath.replaceWith(template);
                }

            }
            
        }
    },
    JSXAttribute(astPath, state) {
        chineseHack.collect(astPath);
        if (astPath.node.name.name === 'key') {
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
        attrNameHelper(astPath);
    },

    JSXExpressionContainer: {
        exit(astPath, state) {
            var expr = astPath.node.expression;
            if (t.isJSXAttribute(astPath.parent)) {
                attrValueHelper(astPath);
            } else if (
                expr.type === 'MemberExpression' &&
                /props\.children/.test(generate(expr).code)
            ) {
                var attributes = [];
                var template = utils.createElement('template', attributes, []);
                attributes.push(
                    utils.createAttribute('is', '{{props.fragmentUid}}'),
                    utils.createAttribute('data', '{{...props.fragmentData}}')
                );
                astPath.replaceWith(template);
                //  console.warn("小程序暂时不支持{this.props.children}");
            } else {
                var modules = utils.getAnu(state);
                //返回block元素或template元素
                var block = logicHelper(expr, modules);
                astPath.replaceWith(block);
            }
        }
    }
};
module.exports = wxml;
