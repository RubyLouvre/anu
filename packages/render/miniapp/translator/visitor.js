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
    //小程序的模块不支持export 语句,
    enter() {},
    exit(path) {
      if (path.node.declaration.type == "Identifier") {
        path.replaceWith(helpers.exportExpr(path.node.declaration.name, true));
      }
      // console.log(path.node.declaration)
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
  MemberExpression(path) {
    //转换constructor与render外的方法中的this.state为this.data
    if (modules.walkingMethod !== "render") {
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
        property.name = "setData";
      }
    }
  },

  //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  JSXOpeningElement: {
    enter: function(path) {},
    exit: function(path) {
      var nodeName = path.node.name.name;
      if (modules.importComponents[nodeName]) {
        console.log("移除", nodeName);
        var attributes = path.node.attributes;
        var ret = jsx.createElement(
          "template",
          path.node.attributes,
          path.parentPath.node.children
        );

        var key = String(Math.random()).slice(2);
        attributes.push(
          jsx.createAttribute("is", nodeName),
          jsx.createAttribute("wx:for", `{{array${key}}}`),
          jsx.createAttribute("wx:key", `{{key${key}}}`),
          jsx.createAttribute("wx:for-item", "item"),
          jsx.createAttribute("data", "{{...item}}")
        );
        path.parentPath.replaceWith(ret);
      } else {
        helpers.nodeName(path);
      }
    }
  },
  JSXClosingElement: function(path) {
    var nodeName = path.node.name.name;
    if (!modules.importComponents[nodeName]) {
      helpers.nodeName(path);
    }
  },
  JSXAttribute(path) {
    helpers.attrName(path);
  },
  JSXExpressionContainer: {
    enter() {},
    enter(path) {
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
        //返回block元素或template元素
        var block = helpers.logic(expr);
        path.replaceWith(block);
      }
    }
  }
};
