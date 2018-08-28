const generate = require('babel-generator').default;
const prettifyXml = require('prettify-xml');
const t = require('babel-types');
const wxmlHelper = require('./wxml');
const babel = require('babel-core');
const queue = require('../queue');
const path = require('path');

/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */
const deps = require('../deps');

exports.exit = function(astPath, type, componentName, modules) {
    const body = astPath.node.body.body;

    if (body.length > 1) {
        throw new Error(
            'render 函数中只能有一个 return 语句或者一个 if/else 分支'
        );
    }

    if (!body.length) return;

    const expr = body[0];

    switch (true) {
        case t.isReturnStatement(expr):
            {
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

                for (var i in modules.importComponents) {
                    if (modules.usedComponents[i]) {
                        wxml = `<import src="${
                            modules.importComponents[i]
                        }.wxml" />\n${wxml}`;
                    }
                }
                var set = deps[componentName];
                if (set) {
                    const sep = path.sep;
                    var fragmentPath = `${sep}components${sep}Fragments${sep}`;
                    //注意，这里只要目录名
                    var relativePath = modules.sourcePath
                        .split('src')[1]
                        .replace(new RegExp(`[^${path.sep}]+.js`), '');
                    set.forEach(function(el) {
                        var src = path.relative(
                            relativePath,
                            fragmentPath + el + '.wxml'
                        );
                        wxml = `<import src="${src}" />\n${wxml}`;
                    });
                }
            }
            set = deps[componentName];
            if (set) {
                const sep = path.sep;
                fragmentPath = `${sep}components${sep}Fragments${sep}`;
                //注意，这里只要目录名
                relativePath = modules.sourcePath
                    .split('src')[1]
                    .replace(new RegExp(`[^${path.sep}]+.js`), '');
                set.forEach(function(el) {
                    var src = path.relative(
                        relativePath,
                        fragmentPath + el + '.wxml'
                    );
                    wxml = `<import src="${src}" />\n${wxml}`;
                });
            }

            queue.wxml.push({
                type: 'wxml',
                path: modules.sourcePath
                    .replace(new RegExp(`${path.sep}src${path.sep}`), `${path.sep}dist${path.sep}`)
                    .replace(/\.js$/, '.wxml'),
                code: prettifyXml(wxml, { indent: 2 })
            });
            break;

        default:
            break;
    }
};

exports.enter = function(astPath) {
    if (astPath.node.key.name !== 'render') return;

    const body = astPath.node.body.body;

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
                astPath.traverse({
                    IfStatement(astPath) {
                        const { test, consequent, alternate } = astPath.node;

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

                        astPath.replaceWith(
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
