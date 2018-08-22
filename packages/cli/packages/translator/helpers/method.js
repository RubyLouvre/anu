const t = require("babel-types");

module.exports = function(path, methodName) {
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
};
