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

//const chineseHelper = require('./chinese');

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
    return result.code.replace(/\\?(?:\\u)([\da-f]{4})/ig, function (a, b) {
        return unescape(`%u${b}`);
    });
}

var visitor = {
    JSXOpeningElement: {
        exit: function (astPath) {
            var openTag = astPath.node.name;
            if (
                openTag.type === 'JSXMemberExpression' &&
                openTag.object.name === 'React'
            ) {
                if (openTag.property.name === 'toRenderProps') {
                    var attributes = [];
                    //实现render props;
                    var template = utils.createElement(
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
                    var children = astPath.parentPath.parentPath.node.children;
                    //去掉后面的{{this.props.render()}}
                    var i = children.indexOf(astPath.parentPath.node);
                    children.splice(i + 1, 1);
                    astPath.parentPath.replaceWith(template);
                } else if (openTag.property.name === 'useComponent') {
                    var is;
                    astPath.node.attributes.forEach(function (el) {
                        var attrName = el.name.name;
                        var attrValue = el.value.value;
                        if (/^\{\{.+\}\}/.test(attrValue)) {
                            attrValue = attrValue.slice(2, -2);
                        }

                        if (attrName === 'is') {
                            is = 'anu-' + attrValue.slice(1, -1).toLowerCase();
                        }
                    });
                    attributes = [];
                    template = utils.createElement(
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
                /props\.children\s*$/.test(generate(expr).code)
            ) {
                var attributes = [];
                var template = utils.createElement('slot', attributes, []);
                astPath.replaceWith(template);
                //  console.warn("小程序暂时不支持{this.props.children}");
            } else {
                var modules = utils.getAnu(state);
                //返回block元素或template元素
                var block = logicHelper(expr, modules);
                astPath.replaceWithMultiple(block);
            }
        }
    }
};
module.exports = wxml;
