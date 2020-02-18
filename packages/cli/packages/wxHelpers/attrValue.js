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
const config_1 = __importDefault(require("../../config/config"));
const calculateStyleString_1 = __importDefault(require("../utils/calculateStyleString"));
const buildType = config_1.default.buildType;
module.exports = function (astPath) {
    let expr = astPath.node.expression;
    let attrName = astPath.parent.name.name;
    let isEventRegex = buildType == 'ali' || buildType == 'quick'
        ? /^(on|catch)/
        : /^(bind|catch)/;
    let isEvent = isEventRegex.test(attrName);
    if (isEvent) {
        return bindEvent(astPath, attrName, expr);
    }
    astPath.traverse({
        ThisExpression(nodePath) {
            if (t.isMemberExpression(nodePath.parentPath)) {
                nodePath.parentPath.replaceWith(t.identifier(nodePath.parent.property.name));
            }
        }
    });
    var attrValue = generator_1.default(expr).code;
    switch (expr.type) {
        case 'ArrayExpression':
        case 'NumericLiteral':
        case 'StringLiteral':
        case 'Identifier':
        case 'NullLiteral':
        case 'BooleanLiteral':
        case 'LogicalExpression':
        case 'UnaryExpression':
        case 'ConditionalExpression':
        case 'MemberExpression':
            replaceWithExpr(astPath, attrValue);
            break;
        case 'CallExpression':
            if (attrName === 'style' &&
                attrValue.indexOf('React.toStyle') > -1) {
                let start = attrValue.indexOf('\'style');
                let end = attrValue.lastIndexOf(')');
                let styleID = attrValue.slice(start, end);
                replaceWithExpr(astPath, `props[${styleID}] `);
            }
            else {
                replaceWithExpr(astPath, attrValue);
            }
            break;
        case 'ObjectExpression':
            if (attrName === 'style') {
                replaceWithExpr(astPath, calculateStyleString_1.default(expr), true);
            }
            if (['wx', 'qq', 'tt'].includes(buildType)) {
                if (expr.properties.every(function (prop) {
                    return prop.type === 'SpreadElement' || prop.type === 'ObjectProperty';
                })) {
                    let value = '{' + attrValue.replace(/\n/g, '') + '}';
                    astPath.replaceWith(t.stringLiteral(value));
                }
            }
            break;
        case 'BinaryExpression': {
            if (attrName === 'class' || attrName === 'className') {
                let { left, right } = expr;
                if (t.isStringLiteral(left) || t.isStringLiteral(right)) {
                    let className = `${toString(expr.left)}${toString(expr.right)}`;
                    astPath.replaceWith(t.stringLiteral(className));
                    return;
                }
            }
            replaceWithExpr(astPath, attrValue);
            break;
        }
    }
};
function throwEventValue(attrName, attrValue) {
    throw `${attrName}的值必须是一个函数名，如 this.xxx 或 this.xxx.bind(this),
    但现在的值是${attrValue}`;
}
function replaceWithExpr(astPath, value, noBracket) {
    let v = noBracket ? value : '{{' + value + '}}';
    astPath.replaceWith(t.stringLiteral(v));
}
function bindEvent(astPath, attrName, expr) {
    if (expr.type === 'ArrowFunctionExpression') {
        replaceWithExpr(astPath, 'dispatchEvent', true);
    }
    else {
        let eventHandle = generator_1.default(expr).code;
        if (!/^\s*\w+\./.test(eventHandle)) {
            throwEventValue(attrName, eventHandle);
        }
        if (buildType == 'quick') {
            let n = attrName.charAt(0) === 'o' ? 2 : 5;
            astPath.parent.name.name = 'on' + attrName.slice(n).toLowerCase();
        }
        replaceWithExpr(astPath, 'dispatchEvent', true);
    }
}
function toString(node) {
    if (t.isStringLiteral(node))
        return node.value;
    if (t.isMemberExpression)
        return `{{${generator_1.default(node).code}}}`;
}
