const t = require("babel-types");
const generate = require("babel-generator").default;

module.exports = function loop(path, fn) {
  var expr = path.node.expression;

  var attrs = [];
  attrs.push(
    t.JSXAttribute(
      t.JSXIdentifier("wx:for"),
      t.stringLiteral(`{{${generate(expr.callee.object).code}}}`)
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


  console.log(fn.body);

  var loopNode = t.JSXElement(
    t.JSXOpeningElement(t.JSXIdentifier("block"), attrs, false),
    t.jSXClosingElement(t.JSXIdentifier("block")),
    []
  );

  path.replaceWith(loopNode);
};
//确保是文本节点，用JSXText包一下
function wrapText(node) {
  if (node.type !== "JSXElement") {
    return t.JSXText(generate(node).code);
  }
  return node;
}
