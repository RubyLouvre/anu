const generate = require('babel-generator').default;
const t = require('babel-types');
const wxmlHelper = require('./wxml');
const babel = require('babel-core');
const queue = require('../queue');
const path = require('path');
const utils = require('../utils');
const templateExt = '.ux';

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
    let expr;

    if (!body.length) return;
    for (let i  = 0, n = body.length; i < n; i++){
        expr = body[i];
        if (t.isReturnStatement(expr)){
            break;
        }
    }

    //  const expr = body[0];
    //  console.log(body);

    switch (true) {
        case t.isReturnStatement(expr):
            var needWrap = expr.argument.type !== 'JSXElement';
            var jsx = generate(expr.argument).code;
            var jsxAst = babel.transform(jsx, {
                babelrc: false,
                plugins: [
                    [
                        'transform-react-jsx',
                        { pragma: 'h' }
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
                deps[componentName] = deps[componentName] || {
                    set: new Set()
                };
            }

            //如果这个JSX的主体是一个组件，那么它肯定在deps里面
            var dep = deps[componentName];
            //添加import语句产生的显式依赖
            for (var i in modules.importComponents) {
                if (modules.usedComponents[i]) {
                    wxml = `<import src="${
                        modules.importComponents[i]
                    }.axml" />\n${wxml}`;
                }
            }
            var enqueueData = {
                type: 'wxml',
                path: modules.sourcePath
                    .replace(/\/src\//, '/dist/')
                    .replace(/\.js$/, templateExt),
                code: wxml //prettifyXml(wxml, { indent: 2 })
            };
            //添加组件标签包含其他标签时（如<Dialog><p>xxx</p></Dialog>）产生的隐式依赖
            if (dep && !dep.addImportTag) {
                dep.data = enqueueData; //表明它已经放入列队，不要重复添加
                dep.addImportTag = addImportTag;
                dep.dirPath = path.dirname(modules.sourcePath);
                dep.set.forEach(function(fragmentUid) {
                    dep.set.delete(fragmentUid);
                    dep.addImportTag(fragmentUid);
                });
            }
            queue.push(enqueueData);
            utils.emit('build');
            break;
        default:
            break;
    }
};

function addImportTag(fragmentUid) {
    var src = path.relative(
        this.dirPath,
        path.join(
            process.cwd(),
            'src',
            'components',
            'Fragments',
            fragmentUid + templateExt
        )
    );
    src = process.platform === 'win32' ? src.replace(/\\/g, '/') : src;
    var wxml = `<import src="${src}" />\n${this.data.code}`;
    return (this.data.code = wxml);
}
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