const generate = require('babel-generator').default;
const prettifyXml = require('prettify-xml');
const t = require('babel-types');
const wxmlHelper = require('./wxml');
const babel = require('babel-core');
const queue = require('../queue');
const path = require('path');
const functionAliasConfig = require('./functionNameAliasConfig');
const utils = require('../utils');

/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */
const deps = require('../deps');
const srcFragment = path.sep + 'src' + path.sep;
exports.exit = function(astPath, type, componentName, modules) {
    const body = astPath.node.body.body;

    if (!body.length) return;

    const expr = body[0];

    switch (true) {
        case t.isReturnStatement(expr):
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
            break;

        default:
            break;
    }
};

exports.enter = function(astPath) {
    if (astPath.node.key.name === 'render') {
        astPath.traverse({
            IfStatement: {
                enter(path) {
                    const { test, consequent, alternate } = path.node;

                    path.replaceWith(
                        t.returnStatement(
                            t.conditionalExpression(
                                test,
                                consequent.body[0].argument ||
                                    t.stringLiteral(''),
                                alternate.body
                                    ? alternate.body[0].argument
                                    : t.stringLiteral('')
                            )
                        )
                    );
                }
            },
            BlockStatement: {
                enter(path) {
                    if (path.node.body.length > 2)
                        throw new Error(
                            'render 方法中至多拥有两个节点，类型限定为 IfStatement 或者 ReturnStatement'
                        );

                    const [firstNode, secondeNode] = path.node.body;

                    if (path.node.body.length > 1) {
                        if (!t.isIfStatement(firstNode))
                            throw new Error(
                                '当 render 方法中含有两个节点时，第一个节点必须是 IfStatement'
                            );
                        if (!t.isReturnStatement(secondeNode))
                            throw new Error(
                                '当 render 方法中含有两个节点时，第二个节点必须是 ReturnStatement'
                            );
                        if (firstNode.alternate)
                            throw new Error(
                                '如果 render 方法第一个节点为 IfStatement，' +
                                    '第二个节点为 ReturnStatement 则该 IfStatement 中不能有 else 分支'
                            );

                        firstNode.alternate = secondeNode.argument;
                        path.node.body = path.node.body.slice(0, 1);
                    }
                }
            }
        });
    }
};
