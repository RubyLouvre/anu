const t = require("babel-types");
const generate = require("babel-generator").default;
const nPath = require("path");
const helpers = require("./helpers");
const queue = require("./queue");
const utils = require("./utils");

function getAnu(state) {
    return state.file.opts.anu;
}
module.exports = {
    ClassDeclaration: helpers.classDeclaration,
    //babel 6 没有ClassDeclaration，只有ClassExpression
    ClassExpression: helpers.classDeclaration,
    ClassMethod: {
        enter(path, state) {
            var modules = getAnu(state);
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
            helpers.render.enter(
                path,
                "有状态组件",
                modules.className,
                modules
            );
        },
        exit(path, state) {
            var modules = getAnu(state);
            const methodName = path.node.key.name;
            if (methodName === "render") {
                //当render域里有赋值时, BlockStatement下面有的不是returnStatement,而是VariableDeclaration
                helpers.render.exit(
                    path,
                    "有状态组件",
                    modules.className,
                    modules
                );
            }
        }
    },
    FunctionDeclaration: {
        //enter里面会转换jsx中的JSXExpressionContainer
        exit(path, state) {
            //函数声明转换为无状态组件
            let modules = getAnu(state);
            let name = path.node.id.name;
            if (
                /^[A-Z]/.test(name) &&
                modules.componentType === "Component" &&
                !modules.parentName
            ) {
                //需要想办法处理无状态组件
                helpers.render.exit(path, "无状态组件", name, modules);
            }
        }
    },
    ImportDeclaration(path, state) {
        let node = path.node;
        let modules = getAnu(state);
        let source = node.source.value;
        let specifiers = node.specifiers;
        if (modules.componentType === "App") {
            if (/\/pages\//.test(source)) {
                modules["appRoute"] = modules["appRoute"] || [];
                modules["appRoute"].push(nPath.join(source));
                path.remove(); //移除分析依赖用的引用
            }
        }

        if (/\.(less|scss)$/.test(nPath.extname(source))) {
            path.remove();
        }

        specifiers.forEach(item => {
            //重点，保持所有引入的组件名及它们的路径，用于<import />
            modules.importComponents[item.local.name] = source;
            if (item.local.name === "React") {
                let from = nPath.dirname(
                    modules.current.replace("src", "dist")
                );
                let to = "/dist/";
                let relativePath = nPath.relative(from, to);
                let pathStart = "";
                if (relativePath === "") {
                    pathStart = "./";
                }
                node.source.value = `${pathStart}${nPath.join(
                    relativePath,
                    nPath.basename(node.source.value)
                )}`;
            }
        });

        helpers.copyNpmModules(modules.current, source, node);
    },

    ExportNamedDeclaration: {
        //小程序在定义
        enter() {},
        exit(path) {
            let declaration = path.node.declaration;
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

    ClassProperty(path, state) {
        let key = path.node.key.name;
        let modules = getAnu(state);
        if (key === "config") {
            //format json
            let code = generate(path.node.value).code;
            let config = null;
            let jsonStr = "";
            try {
                config = JSON.parse(code);
            } catch (err) {
                config = eval("(" + code + ")");
            }

            //assign the page routes in app.js
            if (modules.componentType === "App") {
                config = Object.assign(config, { pages: modules["appRoute"] });
                delete modules["appRoute"];
            }
            if (config.usingComponents) {
                //将页面配置对象中的usingComponents对象中的组件名放进modules.customComponents
                //数组中，并将对应的文件复制到dist目录中
                utils.copyCustomComponents(config.usingComponents, modules);
            }
            jsonStr = JSON.stringify(config, null, 4);

            queue.pageConfig.push({
                type: "json",
                path: modules.sourcePath
                    .replace(/\/src\//, "/dist/")
                    .replace(/\.js$/, ".json"),
                code: jsonStr
            });
        }
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
    AssignmentExpression(path, state) {
        let modules = getAnu(state);
        // 转换微信小程序component的properties对象为defaultProps
        let left = path.node.left;
        if (
            modules.className &&
            t.isMemberExpression(left) &&
            left.object.name === modules.className &&
            left.property.name === "defaultProps"
        ) {
            helpers.defaultProps(path.node.right.properties, modules);
            path.remove();
        }
    },
    CallExpression(path, state) {
        let callee = path.node.callee || Object;
        let modules = getAnu(state);
        //移除super()语句
        if (modules.walkingMethod == "constructor") {
            if (callee.type === "Super") {
                path.remove();
            }
        }
    },

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    JSXOpeningElement: {
        //  enter: function(path) {},
        enter: function(path, state) {
            let modules = getAnu(state);
            let nodeName = path.node.name.name;
            if (modules.importComponents[nodeName]) {
                modules.usedComponents[nodeName] = true;
                path.node.name.name = "React.template";
                var attributes = path.node.attributes;
                attributes.push(
                    utils.createAttribute(
                        "templatedata",
                        "data" + utils.createUUID()
                    ),
                    t.JSXAttribute(
                        t.JSXIdentifier("is"),
                        t.jSXExpressionContainer(t.identifier(nodeName))
                    )
                );
            } else {
                if (nodeName != "React.template") {
                    helpers.nodeName(path, modules);
                }
            }
        }
    },
    JSXAttribute: function(path, state) {
        let modules = getAnu(state);
        let attrName = path.node.name.name;
        let attrValue = path.node.value;
        var attrs = path.parentPath.node.attributes;
        if (/^(?:on|catch)[A-Z]/.test(attrName)) {
            var n = attrName.charAt(0) == "o" ? 2 : 5;
            var value = utils.createUUID();
            var name = `data-${attrName.slice(n).toLowerCase()}-fn`;

            attrs.push(utils.createAttribute(name, value));
            if (!attrs.setClassCode) {
                attrs.setClassCode = true;
                var keyValue;
                for (var i = 0, el; (el = attrs[i++]); ) {
                    if (el.name.name == "key") {
                        if (t.isLiteral(el.value)) {
                            keyValue = el.value;
                        } else if (t.isJSXExpressionContainer(el.value)) {
                            keyValue = el.value;
                        }
                    }
                }
                attrs.push(
                    utils.createAttribute("data-class-code", modules.classCode),
                    t.JSXAttribute(
                        t.JSXIdentifier("data-instance-code"),
                        t.jSXExpressionContainer(
                            t.identifier("this.props.instanceCode")
                        )
                    )
                );
                if (keyValue != undefined) {
                    attrs.push(
                        t.JSXAttribute(t.JSXIdentifier("data-key"), keyValue)
                    );
                }
            }
        }else if (attrName === "style" && t.isJSXExpressionContainer(attrValue)) {
            var expr = attrValue.expression
            var styleType = expr.type;
            var styleRandName = "style" + utils.createUUID();
            if (styleType === "Identifier") {
                // 处理形如 <div style={formItemStyle}></div> 的style结构
                var styleName = expr.name;
                attrs.push(
                    t.JSXAttribute(
                        t.JSXIdentifier("style"),
                        t.jSXExpressionContainer(
                            t.identifier(
                                `React.collectStyle(${styleName}, this.props, '${styleRandName}')`
                            )
                        )
                    )
                );
                path.remove();
            }else if (styleType === "ObjectExpression") {
                // 处理形如 style={{ width: 200, borderWidth: '1px' }} 的style结构
                var styleValue = generate(expr).code;
                attrs.push(
                    t.JSXAttribute(
                        t.JSXIdentifier("style"),
                        t.jSXExpressionContainer(
                            t.identifier(
                                `React.collectStyle(${styleValue}, this.props, '${styleRandName}')`
                            )
                        )
                    )
                );
                path.remove();
            }
        }
    },
    JSXClosingElement: function(path, state) {
        let modules = getAnu(state);
        let nodeName = path.node.name.name;
        if (
            !modules.importComponents[nodeName] &&
            nodeName !== "React.template"
        ) {
            helpers.nodeName(path, modules);
        } else {
            path.node.name.name = "React.template";
        }
    }
};
