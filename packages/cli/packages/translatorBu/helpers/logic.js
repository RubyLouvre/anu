const t = require('babel-types');
const generate = require('babel-generator').default;
const jsx = require('../utils');
const chalk = require('chalk');
const { createElement, createAttribute } = jsx;
/**
 * 本模板将array.map(fn)变成<block wx:for="{{}}"></block>
 * 将if(xxx){}变成<block wx:if="{{xxx}}"></block>
 * 将xxx? aaa: bbb变成<block wx:if="aaa">aaa</block>
 * <block wx:if="!xxx">bbb</block>
 */
const rexpr = /(^|[^\w.])this\./g;

function parseExpr(node) {
    return `{{${generate(node).code.replace(rexpr, '$1')}}}`;
}

function wrapText(node) {
    if (node.type !== 'JSXElement') {
        return t.JSXText(parseExpr(node));
    }
    return node;
}

function logic(expr, modules) {
    // 处理条件指令
    if (t.isConditionalExpression(expr) || t.isIfStatement(expr)) {
        return condition(expr.test, expr.consequent, expr.alternate, modules);
    } else if (t.isLogicalExpression(expr) && expr.operator === '&&') {
        return condition(expr.left, expr.right, null, modules);
    } else if (
        t.isCallExpression(expr) &&
        expr.callee.property.name === 'map'
    ) {
        // 处理列表指令
        if (expr.arguments[0].type === 'ArrowFunctionExpression') {
            return loop(expr.callee, expr.arguments[0], modules);
        } else if (
            expr.arguments[0] &&
            expr.arguments[0].type === 'FunctionExpression'
        ) {
            return loop(expr.callee, expr.arguments[0], modules);
        } else {
            throw generate(expr.callee.object).code +
                '.map 后面的必须跟匿名函数或一个函数调用';
        }
    } else {
        return wrapText(expr);
    }
}

// 处理 test ? consequent: alternate 或 test && consequent
function condition(test, consequent, alternate, modules) {
    var ifNode = createElement(
        'block',
        [createAttribute('s-if', parseExpr(test))],
        [logic(consequent, modules) || wrapText(consequent)]
    );
    var ret = ifNode;
    // null就不用创建一个<block>元素了，&&表达式也不需要创建<block>元素
    if (alternate && alternate.type !== 'NullLiteral') {
        // 如果存在if分支，那么就再包一层，一共三个block,
        // <block><block wx:if /><block wx:else /></block>
        ret = createElement('block', [], [ifNode]);

        var elseNode = createElement(
            'block',
            [createAttribute('s-elif', 'true')],
            [logic(alternate, modules) || wrapText(alternate)]
        );
        ret.children.push(elseNode);
    }
    return ret;
}

// 处理 callee.map(fn)
function loop(callee, fn, modules) {
    const attrs = [];

    attrs.push(createAttribute('s-for', parseExpr(callee.object)));
    attrs.push(createAttribute('s-for-item', fn.params[0].name));
    attrs.push(createAttribute('s-for-index', fn.params[1].name));
    if (modules.key) {
        attrs.push(createAttribute('wx:key', jsx.genKey(modules.key)));

        modules.key = null;
    } else {
        attrs.push(createAttribute('wx:key', '*this'));
        // console.log( fn.params[1].name);
    }

    const body = t.isBlockStatement(fn.body)
        ? fn.body.body.find(t.isReturnStatement)
        : fn.body;

    if (body) {
        // 循环内部存在循环或条件
        var child = logic(
            t.isBlockStatement(fn.body) ? body.argument : body,
            modules
        );

        var blockElement = createElement('block', attrs, [child]);
        modules.insideTheLoopIsComponent =
            child.openingElement.name.name === 'template';
        return blockElement;
    } else {
        // eslint-disable-next-line
        console.log(
            chalk`{cyan .map(fn)} 的函数中需要有 {cyan ReturnStatement}，在 ${
                generate(fn).code
            } 中未找到 {cyan ReturnStatement}`
        );
        throw new Error('Parse error');
    }
}

module.exports = logic;
