"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const t = __importStar(require("@babel/types"));
const core_1 = require("@babel/core");
const path = __importStar(require("path"));
const generator_1 = __importDefault(require("@babel/generator"));
const utils_1 = __importDefault(require("../utils"));
const quickFiles_1 = __importDefault(require("./quickFiles"));
const config_1 = __importDefault(require("../../config/config"));
const wxmlHelper = require('./wxml');
var wrapperPath = path.join(process.cwd(), config_1.default.sourceDir, 'components', 'PageWrapper', 'index.ux');
exports.exit = function (astPath, type, componentName, modules) {
    const body = astPath.node.body.body;
    let expr;
    if (!body.length)
        return;
    for (let i = 0, n = body.length; i < n; i++) {
        expr = body[i];
        if (t.isReturnStatement(expr)) {
            break;
        }
    }
    switch (true) {
        case t.isReturnStatement(expr):
            var needWrap = expr.argument.type !== 'JSXElement';
            var jsx = generator_1.default(expr.argument).code;
            var jsxAst = core_1.transform(jsx, {
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
                wxml = wxml.slice(7, -9);
            }
            else {
                wxml = wxml.slice(0, -1);
            }
            for (let i in modules.importComponents) {
                if (modules.usedComponents[i]) {
                    wxml = `<import src="${modules.importComponents[i]}.ux" />\n${wxml}`;
                }
            }
            var quickFile = quickFiles_1.default[utils_1.default.fixWinPath(modules.sourcePath)];
            if (quickFile) {
                if (modules.componentType === 'Page') {
                    let pageWraperPath = path.relative(path.dirname(modules.sourcePath), wrapperPath);
                    if (utils_1.default.isWin()) {
                        pageWraperPath = utils_1.default.fixWinPath(pageWraperPath);
                    }
                    quickFile.template = `
<import name="anu-page-wrapper" src="${pageWraperPath}"></import>
<template>
   <anu-page-wrapper>
     ${wxml}
   </anu-page-wrapper>
</template>`;
                    if (config_1.default.huawei) {
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
                }
                else {
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
function transformIfStatementToConditionalExpression(node) {
    const { test, consequent, alternate } = node;
    return t.conditionalExpression(test, transformConsequent(consequent), transformAlternate(alternate));
}
function transformNonNullConsequentOrAlternate(node) {
    if (t.isIfStatement(node))
        return transformIfStatementToConditionalExpression(node);
    if (t.isBlockStatement(node)) {
        const item = node.body[0];
        if (t.isReturnStatement(item))
            return item.argument;
        if (t.isIfStatement(item))
            return transformIfStatementToConditionalExpression(item);
        throw new Error('Invalid consequent or alternate node');
    }
    return t.nullLiteral();
}
function transformConsequent(node) {
    if (t.isReturnStatement(node))
        return node.argument;
    return transformNonNullConsequentOrAlternate(node);
}
function transformAlternate(node) {
    if (node == null)
        return t.nullLiteral();
    if (t.isReturnStatement(node))
        return node.argument;
    return transformNonNullConsequentOrAlternate(node);
}
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
                        }
                        else {
                            throw new Error('如果 render 方法中根节点同时存在 if 和 return 语句，则 if 语句不应有 else 分支');
                        }
                    }
                    path.replaceWith(t.returnStatement(transformIfStatementToConditionalExpression(path.node)));
                }
            }
        });
    }
};
