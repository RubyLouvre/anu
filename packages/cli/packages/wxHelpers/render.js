"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = __importDefault(require("@babel/generator"));
const t = __importStar(require("@babel/types"));
const path = __importStar(require("path"));
const core_1 = require("@babel/core");
const config_1 = __importDefault(require("../../config/config"));
const xmlExt = config_1.default[config_1.default.buildType].xmlExt;
const cwd = process.cwd();
const wxmlHelper = require('./wxml');
exports.enter = function (astPath) {
    if (astPath.node.key.name === 'render') {
        astPath.traverse({
            IfStatement: {
                enter(path) {
                    const nextPath = path.getSibling(+path.key + 1);
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
        let jsx = generator_1.default(expr.argument).code;
        let jsxAst = core_1.transform(jsx, {
            configFile: false,
            comments: false,
            babelrc: false,
            plugins: [
                [require('@babel/plugin-transform-react-jsx'), { pragma: 'h' }]
            ],
            ast: true
        });
        expr.argument = jsxAst.ast.program.body[0];
        let wxml = wxmlHelper(`<block>{${jsx}}</block>`, modules).slice(7, -9);
        for (let i in modules.importComponents) {
            if (modules.usedComponents[i]) {
                wxml = `<import src="${modules.importComponents[i].source}.wxml" />\n${wxml}`;
            }
        }
        let relPath;
        if (/\/node_modules\//.test(modules.sourcePath.replace(/\\/g, '/'))) {
            relPath = 'npm/' + path.relative(path.join(cwd, 'node_modules'), modules.sourcePath);
        }
        else {
            relPath = path.relative(path.resolve(cwd, 'source'), modules.sourcePath);
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
