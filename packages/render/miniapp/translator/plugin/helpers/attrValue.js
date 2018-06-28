//将<view aaa={this.state.xxx}> 转换成 <view aaa="{{xxx}}">
const t = require("babel-types");
const generate = require("babel-generator").default;

module.exports = function(path) {
  var expr = path.node.expression;
  var attrName = path.parent.name.name;
  var isEvent = /^bind/.test(attrName);
  var attrValue = generate(expr).code;
  switch (path.node.expression.type) {
    case "NumericLiteral": //11
    case "StringLiteral": // "string"
    case "BinaryExpression": // 1+ 2
    case "Identifier": // kkk undefined
    case "NullLiteral":
    case "BooleanLiteral":
      if (isEvent) {
        throwEventValue(attrName, attrValue);
      }
      replaceWithExpr(path, attrValue);
      break;
    case "MemberExpression":
      replaceWithExpr(path, attrValue.replace(/^\s*this\./, ""));
      break;
    case "CallExpression":
      if (isEvent) {
        var match = attrValue.match(/this\.(\w+)\.bind/);
        if (match && match[1]) {
          replaceWithExpr(path, match[1]);
        } else {
          throwEventValue(attrName, attrValue);
        }
      } else {
        replaceWithExpr(path, attrValue);
      }
      break;
    case "ObjectExpression":
      if (attrName === "style") {
        var styleValue = expr.properties
          .map(function(node) {
            console.log(generate(node).code);
          })
          .join(" ;");
        replaceWithExpr(path, styleValue);
        console.log(expr.properties);
      } else if (isEvent) {
        throwEventValue(attrName, attrValue);
      }
      break;
  }
};

function throwEventValue(attrName, attrValue) {
  throw `${attrName}的值必须是一个函数名，如this.xxx或this.xxx.bind(this),
    但现在的值是${attrValue}`;
}

function replaceWithExpr(path, value) {
  path.replaceWith(t.stringLiteral(`{{${value}}`));
}
