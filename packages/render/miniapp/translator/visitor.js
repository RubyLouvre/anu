const t = require("babel-types");
const generate = require("babel-generator").default;
const nPath = require("path");
const template = require("babel-template");

const helpers = require("./helpers");
const modules = require("./modules");

const parsePath = require("./utils").parsePath;

//const Pages = [];

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
      var fn = helpers.method(path, methodName);
      modules.compiledMethods.push(fn);
    },
    exit(path) {
      const methodName = path.node.key.name;
      if (methodName === "render") {
        //当render域里有赋值时, BlockStatement下面有的不是returnStatement,而是VariableDeclaration
        var jsx = helpers.render(path, "有状态组件", modules.componentName);
        modules.set("wxml", jsx);
        path.remove();
      }
    }
  },
  FunctionDeclaration: {
    //enter里面会转换jsx中的JSXExpressionContainer
    exit(path) {
      //函数声明转换为无状态组件
      var name = path.node.id.name;
      if (!modules.componentType) {
        modules.componentName = name;
        modules.setType("Component");
        var wxml = helpers.render(path, "无状态组件", name);
        modules.set("wxml", wxml); //path.node.params
        var call = t.expressionStatement(
          t.callExpression(t.identifier("Page"), [t.objectExpression([])])
        );
        path.replaceWith(call);
      }
    }
  },
  ExportDefaultDeclaration: {
    //小程序的模块不支持export 语句
    exit(path) {
      if (modules.componentType) {
        path.remove();
      }
    }
  },
  ExportNamedDeclaration: {
    //小程序在定义
    exit(path) {
      if (modules.componentType) {
        path.remove();
      }
    }
  },
  ClassProperty(path) {
    //只处理静态属性
    if (path.node.static) {
      var key = path.node.key.name;
      if (key == "json") {
        var json = generate(path.node.value).code;
        if (typeof json === "object") {
          var validKeys =
            testmodules.componentType === "App" ? appValidKeys : pageValidKeys;
          //普通的组件也有json，表示其引用的子组件
          for (var i in json) {
            if (validKeys[i] != 1) {
              console.warn("app.json只不存在" + i + "配置项");
            }
          }
          if (/App|Component|Page/.testmodules.componentType) {
            modules.set("json", json);
          }
        }
      }
      //如果是组件
      if (key === "defaultProps" && modules.componentType === "Component") {
        helpers.defaultProps(path.node.value.properties, modules);
      }
      path.remove();
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
    var basename = nPath.basename(href);
    var current = modules.current;
    var ext = nPath.extname(basename),
      postfix = "";
    if (ext) {
      basename = basename.slice(-1 * (ext.length + 1));
    } else {
      ext = "js";
      postfix = ".js";
    }
    if (ext === "js") {
      var useComponents = modules[current].useComponents;
      var href2 = parsePath(current, href + postfix);
      var importName = path.node.specifiers[0].local.name
      modules.importComponents[importName] = true;
      var obj = (useComponents[href2] = {
        name: importName,
        value: href + postfix
      });
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
    if( modules.importComponents[path.node.name.name]){
    
      console.log("=====",path.node.name.name, path.node);
      var attrName = t.JSXIdentifier("data-uuid");
      var attrValue =  t.stringLiteral((modules.uuid++)+"")
      path.node.attributes.push(t.JSXAttribute(attrName,attrValue))

    }
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
          path.replaceWith(block);
        }
      }
    }
  }
};
