const t = require("babel-types");
const generate = require("babel-generator").default;
const nPath = require("path");
const template = require("babel-template");

const helpers = require("./helpers");
const modules = require("./modules");
const jsx = require("./jsx/jsx");

const parsePath = require("./utils").parsePath;

//const Pages = [];
//  miniCreateClass(ctor, superClass, methods, statics)
//参考这里，真想砍人 https://developers.weixin.qq.com/miniprogram/dev/framework/config.html
var appValidKeys = {
    pages: 1,
    window: 1,
    tabBar: 1,
    networkTimeout: 1,
    debug: 1
};
var pageValidKeys = {
    navigationBarBackgroundColor: 1,
    navigationBarTextStyle: 1,
    navigationBarTitleText: 1,
    backgroundColor: 1,
    backgroundTextStyle: 1,
    enablePullDownRefresh: 1,
    disableScroll: 1,
    onReachBottomDistance: 1,
    component: 1,
    usingComponents: 1
};
module.exports = {
    ClassDeclaration: helpers.classDeclaration,
    //babel 6 没有ClassDeclaration，只有ClassExpression
    ClassExpression: helpers.classDeclaration,
    ClassMethod: {
        enter(path) {
            var methodName = path.node.key.name;
            modules.walkingMethod = methodName;
            if (methodName !== "constructor") {
                var fn = helpers.method(path, methodName);
                modules.thisMethods.push(fn);
            } else {
                var node = path.node;
                modules.ctorFn = t.functionDeclaration(
                    t.identifier(modules.className),
                    node.params,
                    node.body,
                    node.generator,
                    false
                );
            }
        },
        exit(path) {
            const methodName = path.node.key.name;
            if (methodName === "render") {
                //当render域里有赋值时, BlockStatement下面有的不是returnStatement,而是VariableDeclaration
                helpers.render(
                    path,
                    "有状态组件",
                    modules.componentName,
                    modules
                );
            }
        }
    },
    FunctionDeclaration: {
        //enter里面会转换jsx中的JSXExpressionContainer
        exit(path) {
            //函数声明转换为无状态组件
            var name = path.node.id.name;
            if (modules.componentType === "Component") {
                //需要想办法处理无状态组件
            }
        }
    },

    ExportDefaultDeclaration: {
        //小程序的模块不支持export 语句,
        exit(path) {
            if (path.node.declaration.type == "Identifier") {
                path.replaceWith(
                    helpers.exportExpr(path.node.declaration.name, true)
                );
            }
        }
    },

    ExportNamedDeclaration: {
        //小程序在定义
        enter() {},
        exit(path) {
            var declaration = path.node.declaration;
            if (!declaration) {
                var map = path.node.specifiers.map(function(el) {
                    return helpers.exportExpr(el.local.name);
                });
                path.replaceWithMultiple(map);
            } else if (declaration.type === "Identifier") {
                path.replaceWith(
                    helpers.exportExpr(declaration.name, declaration.name)
                );
            } else if (declaration.type === "VariableDeclaration") {
                var id = declaration.declarations[0].id.name;
                declaration.kind = "var"; //转换const,let为var
                path.replaceWithMultiple([declaration, helpers.exportExpr(id)]);
            } else if (declaration.type === "FunctionDeclaration") {
                var id = declaration.id.name;
                path.replaceWithMultiple([declaration, helpers.exportExpr(id)]);
            }
        }
    },

    ClassProperty(path) {
        //只处理静态属性
        var key = path.node.key.name;
        if (path.node.static) {
            var keyValue = t.ObjectProperty(t.identifier(key), path.node.value);
            modules.staticMethods.push(keyValue);
        } else {
            if (key == "globalData" && modules.componentType === "App") {
                var thisMember = t.assignmentExpression(
                    "=",
                    t.memberExpression(t.identifier("this"), t.identifier(key)),
                    path.node.value
                );
                modules.thisProperties.push(thisMember);
            }
        }
        path.remove();
    },
    MemberExpression(path) {},
    AssignmentExpression(path) {
        // 转换微信小程序component的properties对象为defaultProps
        if (modules.componentName) {
            const left = path.node.left;
            if (
                left.object.name === modules.componentName &&
                left.property.name === "defaultProps"
            ) {
                helpers.defaultProps(path.node.right.properties, modules);
                path.remove();
            }
        }
    },

    ImportDeclaration(path) {
        var href = path.node.source.value;
        var ext = nPath.extname(href);
        var isJS = false;
        if (ext === "js") {
            href = href.slice(0, -3);
            isJS = true;
        } else if (!ext) {
            isJS = true;
        }
        var paths = path.node.specifiers.map(function(node) {
            var importName = node.local.name;
            var requireStatement = `var ${importName} = require("${href}")${
                node.type == "ImportDefaultSpecifier" ? ".default" : ""
            };`;
            if (isJS) {
                modules.importComponents[importName] = href;
            }
            return template(requireStatement)({});
        });

        path.replaceWithMultiple(paths);
    },
    CallExpression(path) {
        var callee = path.node.callee || Object;
        if (modules.walkingMethod == "constructor") {
            //构造器里面不能执行setState，因此无需转换setData
            if (callee.type === "Super") {
                //移除super()语句
                path.remove();
            }
        } else if (
            modules.componentType === "Page" ||
            modules.componentType === "Component"
        ) {
            var property = callee.property;
            if (property && property.name === "setState") {
                // property.name = "setData";
            }
        }
    },

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    JSXOpeningElement: {
        //  enter: function(path) {},
        enter: function(path) {
            var nodeName = path.node.name.name;
            if (modules.importComponents[nodeName]) {
                modules.usedComponents[nodeName] = true;
                path.node.name.name = "React.template";
                var attributes = path.node.attributes;
                attributes.push(
                    jsx.createAttribute("templatedata", jsx.createDataId()),
                    t.JSXAttribute(
                        t.JSXIdentifier("is"),
                        t.jSXExpressionContainer(t.identifier(nodeName))
                    )
                );
            } else {
                if (nodeName != "React.template") {
                    helpers.nodeName(path);
                }
            }
        }
    },
    JSXClosingElement: function(path) {
        var nodeName = path.node.name.name;
        if (
            !modules.importComponents[nodeName] &&
            nodeName !== "React.template"
        ) {
            helpers.nodeName(path);
        } else {
            path.node.name.name = "React.template";
        }
    }
};
