const t = require("babel-types");
const template = require("babel-template");
const modules = require("../modules");
const generate = require("babel-generator").default;

module.exports = {
  enter(path) {
    //重置数据

    modules.className = path.node.id.name;
    modules.parentName = generate(path.node.superClass).code || "Object";
    modules.classId = ("c" + Math.random()).replace(/0\./, "");
  },
  exit(path) {
    // 将类表式变成函数调用

    if (!modules.ctorFn) {
      modules.ctorFn = template("function x(){b}")({
        x: t.identifier(modules.className),
        b: modules.thisProperties
      });
    }
    var parent = path.parentPath.parentPath;
    parent.insertBefore(modules.ctorFn);
    //用于绑定事件
    modules.thisMethods.push(t.objectProperty(
      t.identifier("classId"), t.stringLiteral(modules.classId)
    ))
    const call = t.expressionStatement(
      t.callExpression(t.identifier("React.miniCreateClass"), [
        t.identifier(modules.className),
        t.identifier(modules.parentName),
        t.objectExpression(modules.thisMethods),
        t.objectExpression(modules.staticMethods)
      ])
    );
    //插入到最前面
    //  path.parentPath.parentPath.insertBefore(onInit);
    //  可以通过`console.log(generate(call).code)`验证
    path.replaceWith(call);
    if (path.type == "CallExpression") {
      if (path.parentPath.type === "VariableDeclarator") {
        if (parent.type == "VariableDeclaration") {
          parent.node.kind = "";
        }
      }
    }
  }
};
