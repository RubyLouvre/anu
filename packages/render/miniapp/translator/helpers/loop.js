const t = require("babel-types");
const generate = require("babel-generator").default;
const wrapText = require("./wrapText");

module.exports = function loop(path, callee, fn) {
  // var isPath = !!path.parentPath
  // var expr = path.node.expression;

  var attrs = [];
  attrs.push(
    t.JSXAttribute(
      t.JSXIdentifier("wx:for"),
      t.stringLiteral(`{{${generate(callee.object).code}}}`)
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
    if (body.argument.type === "CallExpression") {
      console.log(body.argument.callee);
      var innLoop = loop(
        {
          replaceWith: function() {}
        },
        body.argument.callee,
        body.argument.arguments[0]
      );
      loopNode.children.push(innLoop);
    } else {
      // console.log(body.argument.type)
      loopNode.children.push(wrapText(body.argument));
    }
  }

  path.replaceWith(loopNode);
  return loopNode;
};
