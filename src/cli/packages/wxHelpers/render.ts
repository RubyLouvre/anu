/* eslint no-console: 0 */
import generate from '@babel/generator';
import * as t from '@babel/types';
import * as path from 'path';
import { transform, NodePath } from '@babel/core';
import config from '../../config/config';
//const minifier = require('html-minifier').minify;
const xmlExt = config[config.buildType].xmlExt;
const cwd = process.cwd();
const wxmlHelper = require('./wxml');
/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */
exports.enter = function(astPath: NodePath<t.ClassMethod>) {
    if ((astPath.node.key as t.Identifier).name === 'render') {
        astPath.traverse({
            IfStatement: {
                enter(path: NodePath<t.IfStatement>) {
                    const nextPath = path.getSibling(+path.key + 1);
                    if (t.isReturnStatement(nextPath)) {
                        if (path.node.alternate == null) {
                            path.node.alternate = nextPath.node as any; // tsc todo
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

exports.exit = function(astPath: NodePath<t.ClassMethod>, type: string, componentName: string, modules: any) {
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
        let jsxAst = transform(jsx, {
            configFile: false,
            comments: false,
            babelrc: false,
            plugins: [
                [require('@babel/plugin-transform-react-jsx'), { pragma: 'h' }]
            ],
            ast: true
        });
        (expr as any).argument = jsxAst.ast.program.body[0];
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


function transformIfStatementToConditionalExpression(node: any): any {
    const { test, consequent, alternate } = node;
    return t.conditionalExpression(
        test,
        transformConsequent(consequent),
        transformAlternate(alternate)
    );
}

function transformNonNullConsequentOrAlternate(node: any) {
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

function transformConsequent(node: any) {
    if (t.isReturnStatement(node)) return node.argument;
    return transformNonNullConsequentOrAlternate(node);
}

function transformAlternate(node: any) {
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
