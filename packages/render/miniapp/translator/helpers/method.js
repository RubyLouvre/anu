const t = require("babel-types");
const template = require("babel-template");

module.exports = function(path, methodName) {
    if (methodName === "render") {
        //获取一个提示用的函数
        var noop = template(`a = function(){
        console.log("render方法已经抽取成wxml文件")
      }`)({});
        return t.ObjectProperty(t.identifier("render"), noop.expression.right);
    } else {
        //将类方法变成对象属性
        //https://babeljs.io/docs/en/babel-types#functionexpression
        return t.ObjectProperty(
            t.identifier(methodName),
            t.functionExpression(
                null,
                path.node.params,
                path.node.body,
                path.node.generator,
                path.node.async
            )
        );
    }
}