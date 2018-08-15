const t = require("babel-types");
const generate = require("babel-generator").default;
const modules = require("../modules");
const jsx = require("../jsx/jsx");
const { createElement, createAttribute } = jsx;

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

function logic(expr) {
    //处理条件指令
    if (expr.type === "ConditionalExpression") {
        return condition(expr.test, expr.consequent, expr.alternate);
    } else if (expr.type === "LogicalExpression" && expr.operator === "&&") {
        return condition(expr.left, expr.right);
    } else if (
        expr.type === "CallExpression" &&
        expr.callee.property.name === "map"
    ) {
        //处理列表指令
        if (expr.arguments.type === "ArrowFunctionExpression") {
            return loop(expr.callee, expr.arguments);
        } else if (
            expr.arguments[0] &&
            expr.arguments[0].type === "FunctionExpression"
        ) {
            return loop(expr.callee, expr.arguments[0]);
        } else {
            throw generate(expr.callee.object).code +
                ".map 后面的必须跟匿名函数或一个函数调用";
        }
    } else {
        return wrapText(expr);
    }
}
//处理test ? consequent: alternate 或 test && consequent
function condition(test, consequent, alternate) {
    var ifNode = createElement(
        "block",
        [createAttribute("wx:if", parseExpr(test))],
        [logic(consequent) || wrapText(consequent)]
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
            [logic(alternate) || wrapText(alternate)]
        );
        ret.children.push(elseNode);
    }
    return ret;
}

//处理 callee.map(fn)
function loop(callee, fn) {
    var attrs = [];
    attrs.push(createAttribute("wx:for", parseExpr(callee.object)));
    attrs.push(createAttribute("wx:for-item", fn.params[0].name));
    if (fn.params[1]) {
        // 用于将key={index}改成wx:key="*this"
        modules.indexName = fn.params[1].name;
        attrs.push(createAttribute("wx:for-index", fn.params[1].name));
    }

    var body = fn.body.body.find(i => i.type === "ReturnStatement");
    if (body) {
        //循环内部存在循环或条件
        var child = logic(body.argument);
        //  var childNodeName = child.openingElement.name.name;
        // if (child.type == "JSXElement" && modules.importComponents[childNodeName]) {

        //   attrs.unshift(createAttribute("is", childNodeName));
        //   attrs.push(createAttribute("data", `{{...${fn.params[0].name}}}`));

        //   var origAttrs = child.openingElement.attributes.map(function(el){
        //     if(el.name.name === "key"){
        //       el.name.name = "wx:key"
        //     }
        //     return el
        //   })
        //   var templateElement = createElement("template", attrs.concat(origAttrs), child.children);
        //   return templateElement;
        // } else {
        var blockElement = createElement("block", attrs, [child]);
        return blockElement;
        // }
    }

    // return loopNode;
}

module.exports = logic;
