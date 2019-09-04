/* eslint no-console: 0 */
import * as t from '@babel/types';
import { transform, NodePath } from '@babel/core';
import * as path from 'path';
import generate from '@babel/generator';
import utils from '../utils';
import quickFiles from './quickFiles';
import config from '../../config/config';
const wxmlHelper = require('./wxml');

var wrapperPath = path.join(process.cwd(), config.sourceDir, 'components', 'PageWrapper', 'index.ux');
/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */

exports.exit = function (astPath: NodePath<t.ClassMethod>, type: string, componentName: string, modules: any) {
    const body = astPath.node.body.body;
    let expr: any;

    if (!body.length) return;
    for (let i = 0, n = body.length; i < n; i++) {
        expr = body[i];
        if (t.isReturnStatement(expr)) {
            break;
        }
    }

    switch (true) {
        case t.isReturnStatement(expr):
            var needWrap = (expr as t.ReturnStatement).argument.type !== 'JSXElement';
            var jsx = generate((expr as t.ReturnStatement).argument).code;
            /**
             * [babel 6 to 7]
             * babel -> Options
             * babel7 default ast:false
             */
            var jsxAst = transform(jsx, {
                configFile: false,
                comments: false,
                babelrc: false,
                plugins: [[require('@babel/plugin-transform-react-jsx'), { pragma: 'h' }]],
                ast: true
            });

            expr.argument = jsxAst.ast.program.body[0];
            jsx = needWrap ? `<block>{${jsx}}</block>` : jsx;

            var wxml = wxmlHelper(jsx, modules);

            if (needWrap) {
                wxml = wxml.slice(7, -9); //去掉<block> </block>;
            } else {
                wxml = wxml.slice(0, -1); //去掉最后的;
            }

            //如果这个JSX的主体是一个组件，那么它肯定在deps里面
            //添加import语句产生的显式依赖
            for (let i in modules.importComponents) {
                if (modules.usedComponents[i]) {
                    wxml = `<import src="${ modules.importComponents[i]}.ux" />\n${wxml}`;
                }
            }
            var quickFile = quickFiles[utils.fixWinPath(modules.sourcePath)];
            if (quickFile) {
                if (modules.componentType === 'Page') {
                    let pageWraperPath = path.relative(path.dirname(modules.sourcePath), wrapperPath);
                    if (utils.isWin()) {
                        pageWraperPath = utils.fixWinPath(pageWraperPath);
                    }
                    quickFile.template = `
<import name="anu-page-wrapper" src="${pageWraperPath}"></import>
<template>
   <anu-page-wrapper>
     ${wxml}
   </anu-page-wrapper>
</template>`;
                    if (config.huawei) {
                        quickFile.template = `
<import name="anu-page-wrapper" src="${pageWraperPath}"></import>
<template>
   <div>
   <anu-page-wrapper>
     ${wxml}
   </anu-page-wrapper>
   </div>
</template>`;
                    }
                } else {
                    quickFile.template = `
<template>
${wxml}
</template>`;
                }
            }
            break;
        default:
            break;
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

exports.enter = function (astPath: NodePath<t.ClassMethod>) {
    if ((astPath.node.key as t.Identifier).name === 'render') {
        astPath.traverse({
            IfStatement: {
                enter(path: NodePath<t.IfStatement>) {
                    const nextPath = path.getSibling(path.key as any + 1);
                    if (t.isReturnStatement(nextPath)) {
                        if (path.node.alternate == null) {
                            path.node.alternate = nextPath.node as any;
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
