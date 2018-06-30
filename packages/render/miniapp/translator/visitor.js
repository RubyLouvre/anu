const t = require("babel-types");
const generate = require("babel-generator").default;
const nPath = require("path");
const template = require("babel-template");

const helpers = require("./helpers");
const modules = require("./modules");


//const sharedState = require("./sharedState");

//jsx
//const common = require("./common");

const componentLiftMethods = {
    created: 1,
    attached: 1,
    ready: 1,
    moved: 1,
    detached: 1,
    relations: 1,
    externalClasses: 1,
    options: 1,
    data: 1,
    properties: 1
};

//const Pages = [];


var ClassDeclaration = {
    enter(path) {
        //重置数据

        let className = path.node.superClass ? path.node.superClass.name : "";
        let match = className.match(/\.?(App|Page|Component)/);
        if (match) {
            //获取类的组件类型与名字
            var componentType = match[1];
            if (componentType === "Component") {
                modules.componentName = path.node.id.name
            } else {
                modules.componentName = ""
            }
            modules.setType(componentType)

        }
    },
    exit(path) {
        // 将类表式变成函数调用
        const call = t.expressionStatement(
            t.callExpression(t.identifier(modules.componentType), [
                t.callExpression(t.identifier("onInit"), [
                    t.objectExpression(modules.compiledMethods)
                ])
            ])
        );
        //清空所有方法
        var onInit = template(`function onInit(config){
      if(config.hasOwnProperty("constructor")){
        config.constructor.call(config);
      }
      config.data = config.state;
      delete config.state;
      return config;
    }`)({});
        //插入到最前面
        path.parentPath.parentPath.insertBefore(onInit);
        //可以通过`console.log(generate(call).code)`验证
        path.replaceWith(call);
    }
};

function getJSX(path) {
    const jsx = path.node.body.body.find(i => i.type === "ReturnStatement");
    if (jsx && t.isJSXElement(jsx.argument)) {
        return jsx.argument;
    }
}

function parsePath(a, b) {
    if (b[0] !== '.' && b[0] !== '/') {
        console.log("格式不对[ "+b+" ]",b[0])
        return
    }
    var arr = a.split("/");
    if (b[0] == '/') {
        arr.pop()
        return arr.join("/") + b
    }
    if (b.slice(0, 2) == './') {
        arr.pop()
        return arr.join("/") + b.slice(1)
    }
    var jump = b.match(/\.\.\//g)
    if (jump) {
        var newB = b.replace(/\.\.\//g, "")
        arr.pop()
        for (var i = 0; i < jump.length; i++) {
            arr.pop()
        }
        return arr.join("/") + "/"+ newB
    }
    throw "格式不对[ "+b+" ]"

}

module.exports = {
    ClassDeclaration: ClassDeclaration,
    ClassExpression: ClassDeclaration, //babel 6 没有ClassDeclaration，只有ClassExpression
    ClassMethod: {
        enter(path) {
            var methodName = path.node.key.name;
            modules.walkingMethod = methodName;
            var fn = helpers.method(path, methodName)
            modules.compiledMethods.push(fn);
        },
        exit(path) {
            const methodName = path.node.key.name;
            if (methodName === "render") {
                //当render域里有赋值时, BlockStatement下面有的不是returnStatement,而是VariableDeclaration
                var jsx = getJSX(path);
                if (jsx) {
                    helpers.render(jsx, modules)
                } else {
                    throw modules.componentName + ".render必须返回JSX";
                }
                path.remove();
            }
        }
    },
    FunctionDeclaration(path) {
        var jsx = getJSX(path);
        if (jsx) {
            //这是无状态组件
            helpers.render(jsx, modules)
            modules.setType("Component")
            const call = t.expressionStatement(
                t.callExpression(t.identifier("Page"), path.node.params)
            );
            path.replaceWith(call);
        }
    },
    ClassProperty(path) {
        //只处理静态属性

        if (path.node.static) {
            const propName = path.node.key.name;
            if (propName == "window") {
                //收集window对象是的配置项
                /* let config = {};
                 path.node.value.properties.forEach(prop => {
                     config[prop.key.name] = prop.value.value;
                 });
                 if (sharedState.output.type === "App") {
                     config = {
                         window: config,
                         pages: Pages
                     };
                 }
                 // TODO 考虑下如何更合理配置
                 sharedState.output.json = config !== "" ? config : "{}";
                 */
            } else if (propName === "defaultProps" && modules.componentName) {
                helpers.defaultProps(path.node.value.properties, modules);
                path.remove();
            }
        }
    },
    MemberExpression(path) {
        //转换constructor与render外的方法中的this.state为this.data
        if (
            modules.walkingMethod !== "constructor" &&
            modules.walkingMethod !== "render"
        ) {
            const code = generate(path.node).code;
            if (code === "this.state") {
                path.node.property.name = "data";
            }
        }
    },
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
        var basename = nPath.basename(href)
        var current = modules.current
        var ext = nPath.extname(basename),
            postfix = ""
        if (ext) {
            basename = basename.slice(-1 * (ext.length + 1))
        } else {
            ext = "js"
            postfix = ".js"
        }
        if (ext === "js") {
            var useComponents = modules[current].useComponents;
            var href2 = parsePath(current, href + postfix)
            var obj = useComponents[href2] = {
                name: path.node.specifiers[0].local.name,
                value: href + postfix
            }
        } else {
            //  helpers.styles(href);
        }
        path.remove();
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
                property.name = "setData";
            }
        }
    },

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    JSXOpeningElement: function(path) {
        helpers.nodeName(path);
    },
    JSXClosingElement: function(path) {
        helpers.nodeName(path);
    },
    JSXAttribute(path) {
        helpers.attrName(path);
    },
    JSXExpressionContainer: {
        exit(path) {
            var expr = path.node.expression;
            if (t.isJSXAttribute(path.parent)) {
                helpers.attrValue(path);
            } else if (
                expr.type === "MemberExpression" &&
                generate(expr).code === "this.props.children"
            ) {
                //将 {this.props.children} 转换成 <slot />
                var children = t.JSXOpeningElement(t.JSXIdentifier("slot"), [], true);
                path.replaceWith(children);
            } else {
                var block = helpers.logic(expr);
                if (block) {
                    if (Array.isArray(block)) {
                        path.replaceWithMultiple(block);
                    } else {
                        path.replaceWith(block);
                    }
                }
            }
        }
    }
};