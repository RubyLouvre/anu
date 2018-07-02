const generate = require("babel-generator").default;
const prettifyXml = require("prettify-xml");
const logic = require("./logic");

module.exports = function render(path, type, componentName) {
  var expr = path.node.body.body[0];
  if (expr && expr.type == "ReturnStatement") {
    var block = logic(a.argument);//logic最后会返回一个<block>或jsx
    var wxml = generate(block).code;
    return prettifyXml(wxml, {
      indent: 2
    });
  } else {
    var msg = type + componentName;
    var statement = "不能有其他语句。你可以在里面使用三元表达式a?b:c或&&实现条件分支";
    if (type === "有状态组件") {
      msg += "的render方法只能存在return语句，" + statement;
    } else {
      msg += "的函数体必须立即return, " + statement;
    }
    throw msg;
  }
};
