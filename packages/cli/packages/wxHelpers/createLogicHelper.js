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
const generator_1 = __importDefault(require("@babel/generator"));
const utils_1 = __importDefault(require("../utils"));
const chalk_1 = __importDefault(require("chalk"));
const { createElement, createAttribute } = utils_1.default;
const rexpr = /(^|[^\w.])this\./g;
function parseExpr(node) {
    return `{{${generator_1.default(node).code.replace(rexpr, '$1')}}}`;
}
function wrapText(node) {
    if (node.type !== 'JSXElement') {
        return t.jsxText(parseExpr(node));
    }
    return node;
}
function createLogicHelper(prefix, keyName, hasDefaultKey) {
    function logic(expr, modules, isText) {
        if (isText) {
            return [wrapText(expr)];
        }
        if (t.isConditionalExpression(expr) || t.isIfStatement(expr)) {
            return condition(expr.test, expr.consequent, expr.alternate, modules);
        }
        else if (t.isLogicalExpression(expr) && expr.operator === '&&') {
            return condition(expr.left, expr.right, null, modules);
        }
        else if (t.isCallExpression(expr) &&
            expr.callee.property && expr.callee.property.name === 'map') {
            if (expr.arguments[0].type === 'ArrowFunctionExpression') {
                return loop(expr.callee, expr.arguments[0], modules);
            }
            else if (expr.arguments[0] &&
                expr.arguments[0].type === 'FunctionExpression') {
                return loop(expr.callee, expr.arguments[0], modules);
            }
            else {
                throw generator_1.default(expr.callee.object).code +
                    '.map 后面的必须跟匿名函数或一个函数调用';
            }
        }
        else {
            return [wrapText(expr)];
        }
    }
    function condition(test, consequent, alternate, modules) {
        let ifNode = createElement('block', [createAttribute(prefix + 'if', parseExpr(test))], logic(consequent, modules));
        if (alternate && alternate.type !== 'NullLiteral') {
            let elseNode = createElement('block', [createAttribute(prefix + 'elif', 'true')], logic(alternate, modules));
            return [ifNode, elseNode];
        }
        return [ifNode];
    }
    function loop(callee, fn, modules) {
        const attrs = [];
        if (prefix) {
            attrs.push(createAttribute(prefix + 'for', parseExpr(callee.object)));
            attrs.push(createAttribute(prefix + 'for-item', fn.params[0].name));
            attrs.push(createAttribute(prefix + 'for-index', fn.params[1].name));
        }
        else {
            var forExpr = '(' + fn.params[1].name + ',' + fn.params[0].name + ') in ' + parseExpr(callee.object).slice(2, -2);
            attrs.push(createAttribute('for', forExpr));
        }
        ;
        if (Object.keys(modules.key || {}).length) {
            var calleeCode = generator_1.default(callee).code;
            prefix && attrs.push(createAttribute(keyName, utils_1.default.genKey(modules.key[calleeCode])));
            delete modules.key[calleeCode];
        }
        else if (hasDefaultKey) {
            attrs.push(createAttribute(keyName, '*this'));
        }
        const body = t.isBlockStatement(fn.body)
            ? fn.body.body.find(t.isReturnStatement)
            : fn.body;
        if (body) {
            let children = logic(t.isBlockStatement(fn.body) ? body.argument : body, modules);
            return [createElement('block', attrs, children)];
        }
        else {
            console.log(chalk_1.default `{cyan .map(fn)} 的函数中需要有 {cyan ReturnStatement}，在 ${generator_1.default(fn).code} 中未找到 {cyan ReturnStatement}`);
            throw new Error('Parse error');
        }
    }
    return logic;
}
;
module.exports = createLogicHelper;
exports.default = createLogicHelper;
