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
    case "NullLiteral": // null
    case "BooleanLiteral":
      if (isEvent) {
        throwEventValue(attrName, attrValue);
      }
      replaceWithExpr(path, attrValue);
      break;
    case "MemberExpression":
      replaceWithExpr(path, attrValue.replace(/^\s*this\./, ""), isEvent);
      break;
    case "CallExpression":
      if (isEvent) {
        var match = attrValue.match(/this\.(\w+)\.bind/);
        if (match && match[1]) {
          replaceWithExpr(path, match[1], true);
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
            return hyphen(node.key.name) +
              ": " +
             ( /Expression|Identifier/.test(node.value.type)
              ? `{{${generate(node.value).code}}}`
              : node.value.value);
          })
          .join(" ;");
        replaceWithExpr(path, styleValue, true);
      } else if (isEvent) {
        throwEventValue(attrName, attrValue);
      }
      break;
  }
};

function hyphen(target) {
  //转换为连字符风格
  return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase();
}

function throwEventValue(attrName, attrValue) {
  throw `${attrName}的值必须是一个函数名，如this.xxx或this.xxx.bind(this),
    但现在的值是${attrValue}`;
}

function replaceWithExpr(path, value, noBracket) {
  var v = noBracket ? value : "{{" + value + "}}";
  path.replaceWith(t.stringLiteral(v));
}
