const path = require('path');
const t = require('babel-types');
const babel = require('babel-core');
const prettifyXml = require('prettify-xml');
const generate = require('babel-generator').default;
const deps = require('../deps');
const queue = require('../queue');
const utils = require('../utils');
const wxmlHelper = require('./wxml');
const functionAliasConfig = require('./functionNameAliasConfig');

/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */
const srcFragment = path.sep + 'src' + path.sep;
exports.exit = function(astPath, type, componentName, modules) {
    const body = astPath.node.body.body;

    if (!body.length) return;

    const expr = body[0];

    if (t.isReturnStatement(expr)) {
        var needWrap = expr.argument.type !== 'JSXElement';
        var jsx = generate(expr.argument).code;
        var jsxAst = babel.transform(jsx, {
            babelrc: false,
            plugins: [
                [
                    'transform-react-jsx',
                    { pragma: functionAliasConfig.h.variableDeclarator }
                ]
            ]
        });

        expr.argument = jsxAst.ast.program.body[0];
        jsx = needWrap ? `<block>{${jsx}}</block>` : jsx;

        var wxml = wxmlHelper(jsx, modules);

        if (needWrap) {
            wxml = wxml.slice(7, -9); //去掉<block> </block>;
        } else {
            wxml = wxml.slice(0, -1); //去掉最后的;
        }

        if (modules.componentType === 'Component') {
            wxml = `<template name="${componentName}">${wxml}</template>`;
        }

        for (var i in modules.importComponents) {
            if (modules.usedComponents[i]) {
                wxml = `<import src="${
                    modules.importComponents[i]
                }.wxml" />\n${wxml}`;
            }
        }

        var set = deps[componentName];

        if (set) {
            var fragmentPath = '/components/Fragments/';
            // 注意，这里只要目录名
            var relativePath =
                path.sep +
                path
                    .normalize(modules.sourcePath)
                    .split(srcFragment)[1]
                    .replace(new RegExp(`[^${utils.sepForRegex}]+.js`), '');
            set.forEach(function(el) {
                set.delete(el);
                var src = path.relative(
                    relativePath,
                    fragmentPath + el + '.wxml'
                );
                wxml = `<import src="${src}" />\n${wxml}`;
            });
        }

        queue.wxml.push({
            type: 'wxml',
            path: path
                .normalize(modules.sourcePath)
                .replace(srcFragment, `${path.sep}dist${path.sep}`)
                .replace(/\.js$/, '.wxml'),
            code: prettifyXml(wxml, { indent: 2 })
        });
    }
};

function transformIfStatementToConditionalExpression(node) {
    const { test, consequent, alternate } = node;
    return t.conditionalExpression(
        test,
        transformConsequent(consequent),
        transformAlternate(alternate)
    );
}

function transformNonNullConsequentOrAlternate(node) {
    if (t.isIfStatement(node))
        return transformIfStatementToConditionalExpression(node);
    if (t.isBlockStatement(node)) {
        const item = node.body[0];
        if (t.isReturnStatement(item)) return item.argument;
        if (t.isIfStatement(item))
            return transformIfStatementToConditionalExpression(item);
        throw new Error('Invalid consequent or alternate node');
    }
    return t.nullLiteral();
}

function transformConsequent(node) {
    if (t.isReturnStatement(node)) return node.argument;
    return transformNonNullConsequentOrAlternate(node);
}

function transformAlternate(node) {
    if (node == null) return t.returnStatement(t.nullLiteral());
    if (t.isReturnStatement(node)) return node.argument;
    return transformNonNullConsequentOrAlternate(node);
}

exports.enter = function(astPath) {
    if (astPath.node.key.name === 'render') {
        astPath.traverse({
            IfStatement: {
                enter(path) {
                    const nextPath = path.getSibling(path.key + 1);

                    if (t.isReturnStatement(nextPath)) {
                        if (path.node.alternate == null) {
                            path.node.alternate = nextPath.node;
                            nextPath.remove();
                        } else {
                            throw new Error(
                                '如果 render 方法中根节点同时存在 if 和 return 语句，则 if 语句不应有 else 分支'
                            );
                        }
                    }

                    path.replaceWith(
                        t.returnStatement(
                            transformIfStatementToConditionalExpression(
                                path.node
                            )
                        )
                    );
                }
            }
        });
    }
};
