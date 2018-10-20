/* eslint no-console: 0 */

const generate = require('babel-generator').default;
const t = require('babel-types');
const wxmlHelper = require('./wxml');
const babel = require('babel-core');
const queue = require('../queue');
const utils = require('../utils');
const config = require('../config');
const beautify = require('js-beautify');
const xmlExt = config[config.buildType].xmlExt;
/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */
const deps = [];
exports.enter = function (astPath) {
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
                    path.replaceWith(t.returnStatement(transformIfStatementToConditionalExpression(path.node)));
                },
            },
        });
    }
};

exports.exit = function (astPath, type, componentName, modules) {
    const body = astPath.node.body.body;
    let expr;

    if (!body.length) {
        return;
    }
    for (let i = 0, n = body.length; i < n; i++) {
        expr = body[i];
        if (t.isReturnStatement(expr)) {
            break;
        }
    }

    if (t.isReturnStatement(expr)) {
        var jsx = generate(expr.argument).code;
        var jsxAst = babel.transform(jsx, {
            babelrc: false,
            plugins: [['transform-react-jsx', { pragma: 'h' }]],
        });

        expr.argument = jsxAst.ast.program.body[0];
        var wxml = wxmlHelper(`<block>{${jsx}}</block>`, modules).slice(7, -9); //去掉<block> </block>;

        //添加import语句产生的显式依赖
        for (var i in modules.importComponents) {
            if (modules.usedComponents[i]) {
                wxml = `<import src="${modules.importComponents[i].source}.wxml" />\n${wxml}`;
            }
        }
        if (type == 'RenderProps') {
            handleRenderProps(wxml, componentName, modules);
        } else if (modules.componentType === 'Component') {
            //  wxml = `<template name="${componentName}">${wxml}</template>`;
            deps[componentName] = deps[componentName] || {
                set: new Set(),
            };
        }
        //支付宝的自定义组件机制实现有问题，必须要在json.usingComponents引入了这个类
        //这个类所在的JS 文件才会加入Component全局函数，否则会报Component不存在的BUG
        //一般来说，我们在页面引入了某个组件，它肯定在json.usingComponents中，只有少数间接引入的父类没有引入
        //因此在子类的json.usingComponents添加父类名
        const parentClass = modules.parentName;
        if (parentClass && parentClass.indexOf(".") == -1 && config.buildType === "ali") {
            const config = modules.config;
            const using = config.usingComponents || (config.usingComponents = {});
            using['anu-' + parentClass.toLowerCase()] = '/components/' + parentClass + "/index";
        }
        queue.push({
            path: utils.updatePath(modules.sourcePath, 'src', 'dist', xmlExt),
            code: beautify.html(wxml,{
                indent: 4,
                'wrap-line-length': 100
            })
        });
        utils.emit('build');
    }
};

function handleRenderProps(wxml, componentName, modules) {
    queue.push({
        path: utils.updatePath(modules.sourcePath, 'src', 'dist'),
        code: renderText
    });
    utils.emit('build');
    var dep =
        deps['renderProps'] ||
        (deps['renderProps'] = {
            json: {
                component: true,
                usingComponents: {},
            },
            wxml: '',
        });

    //生成render props的模板
    dep.wxml = dep.wxml + `<block wx:if="{{renderUid === '${componentName}'}}">${wxml}</block>`;
    //生成render props的json
    for (let i in modules.importComponents) {
        dep.json.usingComponents['anu-' + i.toLowerCase()] = '/components/' + i + '/index';
    }
    queue.push({
        path: utils.updatePath(modules.sourcePath, 'src', 'dist', 'json'),
        code: JSON.stringify(dep.json, null, 4), //prettifyXml(wxml, { indent: 2 })
    });
    utils.emit('build');
}

function transformIfStatementToConditionalExpression(node) {
    const { test, consequent, alternate } = node;
    return t.conditionalExpression(test, transformConsequent(consequent), transformAlternate(alternate));
}

function transformNonNullConsequentOrAlternate(node) {
    if (t.isIfStatement(node)) return transformIfStatementToConditionalExpression(node);
    if (t.isBlockStatement(node)) {
        const item = node.body[0];
        if (t.isReturnStatement(item)) return item.argument;
        if (t.isIfStatement(item)) return transformIfStatementToConditionalExpression(item);
        throw new Error('Invalid consequent or alternate node');
    }
    return t.nullLiteral();
}

function transformConsequent(node) {
    if (t.isReturnStatement(node)) return node.argument;
    return transformNonNullConsequentOrAlternate(node);
}

function transformAlternate(node) {
    if (node == null) return t.nullLiteral();
    if (t.isReturnStatement(node)) return node.argument;
    return transformNonNullConsequentOrAlternate(node);
}

const renderText = `
Component({
    properties: {
        renderUid: String,
        props: Object,
        state: Object,
        context: Object
    },
    data: {},
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () { },
        detached: function () { },
    }
})`;