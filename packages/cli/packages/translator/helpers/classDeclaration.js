const t = require("babel-types");
const template = require("babel-template");
const generate = require("babel-generator").default;
function getAnu(state){
    return state.file.opts.anu
}
module.exports = {
    enter(path, state) {
        //重置数据
       var modules = getAnu(state)
        modules.className = path.node.id.name;
        modules.parentName = generate(path.node.superClass).code || "Object";
        modules.classCode = ("c" + Math.random()).replace(/0\./, "");
    },
    exit(path, state) {
        // 将类表式变成函数调用
        var modules = getAnu(state)
        if (!modules.ctorFn) {
            modules.ctorFn = template("function x(){b}")({
                x: t.identifier(modules.className),
                b: modules.thisProperties
            });
        }
        var parent = path.parentPath.parentPath;
        parent.insertBefore(modules.ctorFn);
        //用于绑定事件
        modules.thisMethods.push(
            t.objectProperty(
                t.identifier("classCode"),
                t.stringLiteral(modules.classCode)
            )
        );
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
        if (modules.componentType === "Page") {
            // 动态生成Page组件的Page(React.createPage(className,path))调用
            // Page(React.createPage(PPP, "pages/demo/stateless/aaa"));
            var createPage = template("Page(React.createPage(className,path))")(
                {
                    className: t.identifier(modules.className),
                    path: t.stringLiteral(
                        modules.current
                            .replace(/.+pages/, "pages")
                            .replace(/\.js$/, "")
                    )
                }
            );
            var p = path;
            //好像不能上升到根节点Program，只能上升到VariableDeclaration
            while (p.type != "VariableDeclaration") {
                p = p.parentPath;
            }
            p.insertAfter(createPage);
        }
    }
};
