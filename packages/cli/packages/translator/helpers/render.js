const generate = require('babel-generator').default;
const prettifyXml = require('prettify-xml');
const t = require('babel-types');
const wxmlHelper = require('./wxml');
const babel = require('babel-core');
const queue = require('../queue');

/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} path ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */

exports.exit = function(path, type, componentName, modules) {
    const body = path.node.body.body;

    if (body.length > 1) {
        throw new Error(
            'render 函数中只能有一个 return 语句或者一个 if/else 分支'
        );
    }

    if (!body.length) return;

    const expr = body[0];

    switch (true) {
        case t.isReturnStatement(expr): {
            var needWrap = expr.argument.type !== 'JSXElement';
            var jsx = generate(expr.argument).code;
            var jsxAst = babel.transform(jsx, {
                babelrc: false,
                plugins: ['transform-react-jsx']
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
            wxml = prettifyXml(wxml, {
                indent: 2
            });
            for (var i in modules.importComponents) {
                if (modules.usedComponents[i]) {
                    wxml =
                        `<import src="${
                            modules.importComponents[i]
                        }.wxml" />\n` + wxml;
                }
            }

            queue.wxml.push({
                type: 'wxml',
                path: modules.sourcePath.replace(/\/src\//, '\/dist\/')
                                     .replace(/\.js$/, '.wxml'),
                code: wxml
            })
            
            
        }

        default:
            break;
    }
};

exports.enter = function(path, type, componentName, modules) {
    if (path.node.key.name !== 'render') return;

    const body = path.node.body.body;

    if (body.length > 1) {
        throw new Error(
            'render 函数中只能有一个 return 语句或者一个 if/else 分支'
        );
    }

    if (!body.length) return;

    const expr = body[0];

    switch (true) {
        case t.isIfStatement(expr):
            {
                path.traverse({
                    IfStatement(path) {
                        const { test, consequent, alternate } = path.node;

                        if (consequent.body.length > 1) {
                            throw new RangeError(
                                'if 分支只能有一个 return 语句'
                            );
                        }

                        if (alternate.body.length > 1) {
                            throw new RangeError(
                                'else 分支只能有一个 return 语句'
                            );
                        }

                        if (
                            consequent.body.length > 0 &&
                            t.assertReturnStatement(consequent.body[0])
                        ) {
                            throw new TypeError(
                                'if 分支只能有一个 return 语句'
                            );
                        }

                        if (
                            alternate.body.length > 0 &&
                            t.assertReturnStatement(alternate.body[0])
                        ) {
                            throw new TypeError(
                                'else 分支只能有一个 return 语句'
                            );
                        }

                        path.replaceWith(
                            t.returnStatement(
                                t.conditionalExpression(
                                    test,
                                    consequent.body[0].argument,
                                    alternate.body[0].argument
                                )
                            )
                        );
                    }
                });
            }
            break;
    }
};
