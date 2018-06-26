/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:36:07 
 * @Last Modified by: hibad
 * @Last Modified time: 2018-06-24 22:55:01
 */
const t = require('babel-types');
const generate = require('babel-generator').default;
const prettifyXml = require('./utils').prettifyXml;
const nPath = require('path');
const fs = require('fs-extra');

const converters = require('./converters');
const sharedState = require('./sharedState');

function changeData(a, value){
   if(a.refs && a.props){
     a.state = value
   }else{
     a.data = value
   }
}
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
}

const Pages = [];

function loadCSSFromFile(filePath){
  const content = fs.readFileSync(filePath, "utf8");
  sharedState.output.wxss += content;
}

module.exports = {
  ClassDeclaration: {
    enter(path) {      
      const superClz = path.node.superClass && path.node.superClass.name;
      if (superClz) {
        if (superClz !== 'App' && superClz !== 'Page' && superClz !== 'Component') return;
        sharedState.output.type = superClz;
      }
    },
    exit(path) {
      // 把该节点从path中移除?
      const call = t.expressionStatement(
        t.callExpression(
          t.identifier(sharedState.output.type),
          [t.objectExpression(sharedState.compiled.methods)]
        )
      );
      path.replaceWith(call);
    }
  },
  MemberExpression(path) {    
    const code = generate(path.node).code;
/*
    if(path.node.object.name === "a"){
      console.log(path.node.object, "++++++")
    }
   */
    if (code === 'this.state' && sharedState.walkingMethod !== 'constructor') {
      path.node.property.name = 'data';
    }
  },
  AssignmentExpression(path){
    // 转换微信小程序component的properties对象为defaultProps
    if(path.node.left.property.name === "defaultProps"){
      if(sharedState.output.type !== 'Component') return;
      converters.defaultProps(path.node.right.properties);
      path.remove();
    }
  },
  ClassProperty(path) {
    const propName = path.node.key.name;
    console.log(propName, "___")
    if (/window/.test(propName) && path.node.static) {
      let config = {};
      path.node.value.properties.forEach(prop => {
        config[prop.key.name] = prop.value.value;
      })
      if (sharedState.output.type === 'App') {
        config = {
          window: config,
          pages: Pages
        };
      }
      // TODO 考虑下如何更合理配置
      sharedState.output.json = config !== ''? config: "{}";
    }else if (propName === "defaultProps" && path.node.static) {
      if(sharedState.output.type !== 'Component') return; // 只有Component有properties
      converters.defaultProps(path.node.value.properties);
      path.remove();
    }
  },
  ImportDeclaration(path) {    
    const source = path.node.source.value;
    if (/wechat/.test(source)) {
    } else if (/pages/.test(source)) {
      const pagePath = source.replace('./', '');
      Pages.push(pagePath);
    } else if (/components/.test(source)) {
      const { specifiers } = path.node;
      for (let sp of specifiers) {
        const componentName = sp.local.name;
        sharedState.importedComponent[componentName] = source;
      }
    } else if (/.css/.test(source)) {
      loadCSSFromFile(nPath.resolve(sharedState.sourcePath, '..' , source));
    }
    path.remove()
  },
  ClassMethod: {
    enter(path) {
      const methodName = path.node.key.name;
      sharedState.walkingMethod = methodName;
      if (methodName === 'render' || methodName === 'constructor') return;
      
      //构造method的ast节点
      const fn = t.ObjectProperty(
        t.identifier(methodName),
        t.functionExpression(null, path.node.params, path.node.body, path.node.generator,path.node.async)
      );

      //component?
      sharedState.compiled.methods.push(fn);
    },
    exit(path) {
      const methodName = path.node.key.name;
      if (methodName === 'render') { //当render域里有赋值时, BlockStatement下面有的不是returnStatement,而是VariableDeclaration
        const wxmlAST = path.node.body.body.find(i => i.type === 'ReturnStatement');
        // TODO 使用Dom el转换,而不是直接用小程序el转换
        const wxml = generate(wxmlAST.argument).code;
        sharedState.output.wxml = wxmlAST && prettifyXml(wxml);
        path.remove();
      } else if (methodName === 'constructor') {
       
        for(const body of path.node.body.body ){
          if(t.isExpressionStatement(body)){
            converters.componentUtils.dataHandler(body);
          }
        }
      }
    }
  }
}