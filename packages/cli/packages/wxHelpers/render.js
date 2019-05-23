/* eslint no-console: 0 */

const generate = require('@babel/generator').default;
const t = require('@babel/types');
const wxmlHelper = require('./wxml');
const babel = require('@babel/core');
const utils = require('../utils');
const config = require('../../config/config');
//const minifier = require('html-minifier').minify;
const xmlExt = config[config.buildType].xmlExt;
const path = require('path');
const cwd = process.cwd();

/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */
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

exports.exit = function(astPath, type, componentName, modules) {
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
        let jsx = generate(expr.argument).code;
        /**
         * [babel 6 to 7]
         * babel -> Options
         * babel7 default ast:false
         */
        let jsxAst = babel.transform(jsx, {
            configFile: false,
            comments: false,
            babelrc: false,
            plugins: [
                [require('@babel/plugin-transform-react-jsx'), { pragma: 'h' }]
            ],
            ast: true
        });
        expr.argument = jsxAst.ast.program.body[0];
        let wxml = wxmlHelper(`<block>{${jsx}}</block>`, modules).slice(7, -9); //去掉<block> </block>;

        //添加import语句产生的显式依赖
        for (let i in modules.importComponents) {
            if (modules.usedComponents[i]) {
                wxml = `<import src="${
                    modules.importComponents[i].source
                }.wxml" />\n${wxml}`;
            }
        }

        //支付宝的自定义组件机制实现有问题，必须要在json.usingComponents引入了这个类
        //这个类所在的JS 文件才会加入Component全局函数，否则会报Component不存在的BUG
        //一般来说，我们在页面引入了某个组件，它肯定在json.usingComponents中，只有少数间接引入的父类没有引入
        //因此在子类的json.usingComponents添加父类名
        // 好像支付宝小程序(0.25.1-beta.0)已经不需要添加父类了
        let relPath;
        if (/\/node_modules\//.test(modules.sourcePath.replace(/\\/g, '/'))) {
            relPath = 'npm/' + path.relative( path.join(cwd, 'node_modules'), modules.sourcePath);
        } else {
            relPath =  path.relative(path.resolve(cwd, 'source'), modules.sourcePath);
        }
        modules.queue.push({
            type: 'html',
            path: relPath,
            code: wxml
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
