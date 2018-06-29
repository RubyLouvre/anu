/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:36:07 
 * @Last Modified by: hibad
 * @Last Modified time: 2018-06-28 22:53:17
 */
const t = require("babel-types");
const generate = require("babel-generator").default;
const prettifyXml = require("./utils").prettifyXml;
const nPath = require("path");
const fs = require("fs-extra");
const template = require("babel-template");

const helpers = require("./helpers");
const sharedState = require("./sharedState");

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

const Pages = [];

function loadCSSFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  sharedState.output.wxss += content;
}
var ClassDeclaration = {
  enter(path) {
    //取得组件的父类
    let className = path.node.superClass ? path.node.superClass.name : "";
    let match = className.match(/\.?(App|Page|Component)/);
    if (match) {
      var clazzName = match[1];
      //取得或清理组件名，组件名可以用于defaultProps
      sharedState.componentName =
        clazzName === "Component" ? path.node.id.name : null;
      sharedState.output.type = clazzName;
    }
  },
  exit(path) {
    // 将类表式变成函数调用

    /*  const call = t.expressionStatement(
          t.callExpression(t.identifier(sharedState.output.type), [
            t.objectExpression(sharedState.compiled.methods)
          ])
        );
        */
    const call = t.expressionStatement(
      t.callExpression(t.identifier(sharedState.output.type), [
        t.callExpression(t.identifier("onInit"), [
          t.objectExpression(sharedState.compiled.methods)
        ])
      ])
    );
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

function parseJSX(path) {
  // TODO 使用Dom el转换,而不是直接用小程序el转换
  const wxml = generate(path).code;
  sharedState.output.wxml = prettifyXml(wxml);
}

module.exports = {
  ClassDeclaration: ClassDeclaration,
  ClassExpression: ClassDeclaration, //babel 6 没有ClassDeclaration，只有ClassExpression
  ClassMethod: {
    enter(path) {
      const methodName = path.node.key.name;
      sharedState.walkingMethod = methodName;

      let fn;
      if (methodName === "render") {
        //获取一个提示用的函数
        const fn2 = template(`a = function(){
          console.log("render方法已经抽取成wxml文件")
        }`)({});
        fn = t.ObjectProperty(t.identifier(methodName), fn2.expression.right);
      } else {
        //将类方法变成对象属性
        //https://babeljs.io/docs/en/babel-types#functionexpression
        fn = t.ObjectProperty(
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
      sharedState.compiled.methods.push(fn);
    },
    exit(path) {
      const methodName = path.node.key.name;
      if (methodName === "render") {
        //当render域里有赋值时, BlockStatement下面有的不是returnStatement,而是VariableDeclaration
        const jsx = getJSX(path);
        if (jsx) {
          parseJSX(jsx);
        } else {
          throw sharedState.componentName + ".render必须返回JSX";
        }
        path.remove();
      }
    }
  },
  FunctionDeclaration(path) {
    if (path.node.id.name === "B") {
      const jsx = getJSX(path);
      if (jsx) {
        parseJSX(jsx);
        sharedState.output.type = "Component";
        const call = t.expressionStatement(
          t.callExpression(t.identifier("Page"), path.node.params)
        );
        path.replaceWith(call);
      }
    }
  },
  ClassProperty(path) {
    //只处理静态属性

    if (path.node.static) {
      const propName = path.node.key.name;
      if (propName == "window") {
        //收集window对象是的配置项
        let config = {};
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
      } else if (propName === "defaultProps" && sharedState.componentName) {
        helpers.defaultProps(path.node.value.properties);
        path.remove();
      }
    }
  },
  MemberExpression(path) {
    //转换constructor与render外的方法中的this.state为this.data
    if (
      sharedState.walkingMethod !== "constructor" &&
      sharedState.walkingMethod !== "render"
    ) {
      const code = generate(path.node).code;
      if (code === "this.state") {
        path.node.property.name = "data";
      }
    }
  },
  AssignmentExpression(path) {
    // 转换微信小程序component的properties对象为defaultProps
    if (sharedState.componentName) {
      const left = path.node.left;
      if (
        left.object.name === sharedState.componentName &&
        left.property.name === "defaultProps"
      ) {
        helpers.defaultProps(path.node.right.properties);
        path.remove();
      }
    }
  },
  ImportDeclaration(path) {
    const source = path.node.source.value;
    if (/wechat/.test(source)) {
    } else if (/pages/.test(source)) {
      const pagePath = source.replace("./", "");
      Pages.push(pagePath);
    } else if (/components/.test(source)) {
      const { specifiers } = path.node;
      for (let sp of specifiers) {
        const componentName = sp.local.name;
        sharedState.importedComponent[componentName] = source;
      }
    } else if (/.css/.test(source)) {
      loadCSSFromFile(nPath.resolve(sharedState.sourcePath, "..", source));
    }
    path.remove();
  },
  CallExpression(path) {
    var callee = path.node.callee || Object;
    if (sharedState.walkingMethod == "constructor") {
      //构造器里面不能执行setState，因此无需转换setData
      if (callee.type === "Super") {
        //移除super()语句
        path.remove();
      }
    } else if (
      sharedState.output.type === "Page" ||
      sharedState.output.type === "Component"
    ) {
      var property = callee.property;
      if (property && property.name === "setState") {
        property.name = "setData";
      }
    }
  },

  //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  JSXExpressionContainer(path) {
    //  common.convertJSXExpressionContainer(path);
  },
  JSXOpeningElement: {
    enter(path) {
      helpers.nodeName(path);
      // console.log(path.node)
      //  common.convertJSXOpeningElement(path);
    }
  },
  JSXClosingElement: function(path) {
    if (!path.node.selfClosing) {
      helpers.nodeName(path);
    }
  },
  JSXAttribute(path) {
    helpers.attrName(path);
  },
  JSXExpressionContainer: {
    exit(path) {
      if (t.isJSXAttribute(path.parent)) {
        helpers.attrValue(path);
      }else if(path.node.expression.type === "ConditionalExpression"){
        helpers.condition(path);
      }
    }
  }
};
