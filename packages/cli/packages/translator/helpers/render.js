const generate = require('babel-generator').default;
const prettifyXml = require('prettify-xml');
const t = require('babel-types');
const wxmlHelper = require('./wxml');
const babel = require('babel-core');
const queue = require('../queue');
const path = require('path');
const functionAliasConig = require('./functionNameAliasConfig');
const { sepForRegex } = require('../utils');

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
                    plugins: [
                        ['transform-react-jsx', {'pragma':  functionAliasConig.h.variableDeclarator }]
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
                    //注意，这里只要目录名
                    var relativePath = path
                        .normalize(modules.sourcePath)
                        .split('src')[1]
                        .replace(new RegExp(`[^${sepForRegex}]+.js`), '');
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
                fragmentPath = '/components/Fragments/';
                //注意，这里只要目录名
                relativePath = path
                    .normalize(modules.sourcePath)
                    .split('src')[1]
                    .replace(new RegExp(`[^${sepForRegex}]+.js`), '');
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
                path: path
                    .normalize(modules.sourcePath)
                    .replace(
                        new RegExp(`${sepForRegex}src${sepForRegex}`),
                        `${sepForRegex}dist${sepForRegex}`
                    )
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
                                alternate.body[0].argument ||
                                    t.stringLiteral('')
                            )
                        )
                    );
                }
            }
        });
    }
};
