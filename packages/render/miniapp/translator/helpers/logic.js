const t = require("babel-types");
const generate = require("babel-generator").default;

var rexpr = /(^|[^\w\.])this\./g
function parseExpr(node){
  return `{{${generate(node).code.replace(rexpr, "$1")}}}`
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
  }else {
     return wrapText(expr);
  }
}
//处理test ? consequent: alternate 或 test && consequent
function condition(test, consequent, alternate) {
  var ifAttr = t.JSXAttribute(
    t.JSXIdentifier("wx:if"),
    t.stringLiteral(parseExpr(test))
  );
  var ifNode = t.JSXElement(
    t.JSXOpeningElement(t.JSXIdentifier("block"), [ifAttr], false),
    t.jSXClosingElement(t.JSXIdentifier("block")),
    [logic(consequent) || wrapText(consequent)]
  );
  var ret = ifNode;
  // null就不用创建一个<block>元素了，&&表达式也不需要创建<block>元素
  if (alternate && alternate.type !== "NullLiteral") {
    //如果存在if分支，那么就再包一层，一共三个block,
    // <block><block wx:if /><block wx:else /></block>
    ret = t.JSXElement(
      t.JSXOpeningElement(t.JSXIdentifier("block"), [], false),
      t.jSXClosingElement(t.JSXIdentifier("block")),
      []
    );
    ret.children.push(ifNode);
    var elseAttr = t.JSXAttribute(
      t.JSXIdentifier("wx:else"),
      t.stringLiteral("true")
    );
    var elseNode = t.JSXElement(
      t.JSXOpeningElement(t.JSXIdentifier("block"), [elseAttr], false),
      t.JSXClosingElement(t.JSXIdentifier("block")),
      [logic(alternate) || wrapText(alternate)]
    );
    ret.children.push(elseNode);
  }
  return ret;
}

//处理 callee.map(fn)
function loop(callee, fn) {
  var attrs = [];
  attrs.push(
    t.JSXAttribute(
      t.JSXIdentifier("wx:for"),
      t.stringLiteral(parseExpr(callee.object))
    )
  );
  attrs.push(
    t.JSXAttribute(
      t.JSXIdentifier("wx:for-item"),
      t.stringLiteral(fn.params[0].name)
    )
  );
  if (fn.params[1]) {
    attrs.push(
      t.JSXAttribute(
        t.JSXIdentifier("wx:for-index"),
        t.stringLiteral(fn.params[1].name)
      )
    );
  }

  var loopNode = t.JSXElement(
    t.JSXOpeningElement(t.JSXIdentifier("block"), attrs, false),
    t.jSXClosingElement(t.JSXIdentifier("block")),
    []
  );

  var body = fn.body.body.find(i => i.type === "ReturnStatement");
  if (body) {
    //循环内部存在循环或条件
    var block = logic(body.argument);
    if (block) {
      loopNode.children.push(block);
    } else {
      loopNode.children.push(wrapText(body.argument));
    }
  }

  return loopNode;
}

module.exports = logic;
