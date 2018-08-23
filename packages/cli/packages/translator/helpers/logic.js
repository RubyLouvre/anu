const t = require("babel-types");
const generate = require("babel-generator").default;
const jsx = require("../utils");
const { createElement, createAttribute } = jsx;
/**
 * 本模板将array.map(fn)变成<block wx:for="{{}}"></block>
 * 将if(xxx){}变成<block wx:if="{{xxx}}"></block>
 * 将xxx? aaa: bbb变成<block wx:if="aaa">aaa</block>
 * <block wx:if="!xxx">bbb</block>
 */
var rexpr = /(^|[^\w\.])this\./g;
function parseExpr(node) {
    return `{{${generate(node).code.replace(rexpr, "$1")}}}`;
}
function wrapText(node) {
    if (node.type !== "JSXElement") {
        return t.JSXText(parseExpr(node));
    }
    return node;
}

function logic(expr, modules) {
    //处理条件指令
    if (t.isConditionalExpression(expr) || t.isIfStatement(expr)) {
        return condition(expr.test, expr.consequent, expr.alternate, modules);
    } else if (expr.type === "LogicalExpression" && expr.operator === "&&") {
        return condition(expr.left, expr.right, null, modules);
    } else if (
        expr.type === "CallExpression" &&
        expr.callee.property.name === "map"
    ) {
        //处理列表指令
        if (expr.arguments.type === "ArrowFunctionExpression") {
            return loop(expr.callee, expr.arguments, modules);
        } else if (
            expr.arguments[0] &&
            expr.arguments[0].type === "FunctionExpression"
        ) {
            return loop(expr.callee, expr.arguments[0], modules);
        } else {
            throw generate(expr.callee.object).code +
                ".map 后面的必须跟匿名函数或一个函数调用";
        }
    } else {
        return wrapText(expr);
    }
}
//处理test ? consequent: alternate 或 test && consequent
function condition(test, consequent, alternate, modules) {
    var ifNode = createElement(
        "block",
        [createAttribute("wx:if", parseExpr(test))],
        [logic(consequent, modules) || wrapText(consequent)]
    );
    var ret = ifNode;
    // null就不用创建一个<block>元素了，&&表达式也不需要创建<block>元素
    if (alternate && alternate.type !== "NullLiteral") {
        //如果存在if分支，那么就再包一层，一共三个block,
        // <block><block wx:if /><block wx:else /></block>
        ret = createElement("block", [], [ifNode]);

        var elseNode = createElement(
            "block",
            [createAttribute("wx:else", "true")],
            [logic(alternate, modules) || wrapText(alternate)]
        );
        ret.children.push(elseNode);
    }
    return ret;
}

//处理 callee.map(fn)
function loop(callee, fn, modules) {
    var attrs = [];
    attrs.push(createAttribute("wx:for", parseExpr(callee.object)));
    attrs.push(createAttribute("wx:for-item", fn.params[0].name));
    if (fn.params[1]) {
        modules.indexName = fn.params[1].name;
        attrs.push(createAttribute("wx:for-index", fn.params[1].name));
    }
    var body = fn.body.body.find(i => i.type === "ReturnStatement");
    if (body) {
        //循环内部存在循环或条件
        var child = logic(body.argument, modules);
        //如果数组的map迭代器的returnt第一个标签是组件，并且组件有key
        if (child.key) { 
            attrs.push(
                createAttribute(
                    "wx:key",
                    child.key.indexOf(".") > 0
                        ? child.key.split(".").pop()
                        : "*this"
                )
            );
        }
        var blockElement = createElement("block", attrs, [child]);
        return blockElement;
    }else{
        //这里可能有if分支，需要优化

    }
}

module.exports = logic;
