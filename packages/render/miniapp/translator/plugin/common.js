/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:36:22 
 * @Last Modified by:   hibad 
 * @Last Modified time: 2018-06-24 10:36:22 
 */
const t = require('@babel/types');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default
const chalk = require('chalk').default;
const WXML_EVENTS = require('./wx/events');
const wxTags = require('./wx/tag');
const parseCode = require('./utils').parseCode

let cache = {};

function assembleMapTag(tagName,fo, forItem, forIndex, nextNode) {
  const attrs = [
    t.jSXAttribute(t.jSXIdentifier('wx:for'), t.stringLiteral(`{{${fo}}}`)),
    t.jSXAttribute(t.jSXIdentifier('wx:for-item'), t.stringLiteral(`${forItem}`)),
  ]
  if (forIndex) 
    attrs.push(t.jSXAttribute(t.jSXIdentifier('wx:for-index'), t.stringLiteral(`${forIndex}`)));
  
  const jsxOpening = t.jsxOpeningElement(t.jsxIdentifier(tagName), attrs);
  const jsxClosing = t.jsxClosingElement(t.jsxIdentifier(tagName));
  let children = null;
  if (t.isCallExpression(nextNode)) { //
    children = recursivelyAssembleMapTag(nextNode);
  } else {  //JSX
    children = nextNode;
  }
  
  const jsxElement = t.jsxElement(jsxOpening, jsxClosing,[children]);

  return jsxElement;
}

/**
 * 递归遍历 callExpression
 * 层级结构为 callExpression => arguments<FunctionExpression> 
 *            => body<BlockStatement> => body[0]<ReturnStatement>
 *            => argment<CallExpression || JSXElement>
 * @param {*} callExpressionNode 
 */
function recursivelyAssembleMapTag(callExpressionNode, rootConfig) {
  if (callExpressionNode.callee.property.name !== 'map') {
    console.log(`react-miniapp暂不支持除了map以外的渲染函数`);
  }
  const varibleName = rootConfig? rootConfig.rootVarName : callExpressionNode.callee.object.name;
  const item = rootConfig? rootConfig.root1stParamName  // wx-for-item= ? (default item)
                : callExpressionNode.arguments[0].params[0].name; 
  const index = callExpressionNode.arguments[0].params[1]? // wx-for-index= ? (default index)
                  callExpressionNode.arguments[0].params[1] : 'index';
  const indexName = rootConfig ? rootConfig.rootIndex : index;
  const jsxElement = assembleMapTag(
    'block',
    varibleName, 
    item,
    indexName,
    callExpressionNode.arguments[0].body.body[0].argument
  );

  return jsxElement;
}

class MapVisitor {
  /**
   * 
   * @param {*} config 
   * config结构: {
   *    rootVarName,
   *    root1stParamName,
   *    isComponent,
   * 
   * }
   */
  constructor(config) {
    this.config = Object.assign({}, config);
  }

  visitor() {
    const self = this;
    return {
      CallExpression(path){
        self.object = generate(path.node.callee.object).code;
      },
      MemberExpression(path) {
        if (!self.entrance) {
          //第一次进入, 取得 第一个迭代的变量
          if (!self.config.isComponent) { //Page
            if(t.isIdentifier(path.node.object)) return;
            self.config.rootVarName = path.node.object.property.name;
            self.config.root1stParamName = path.parent.arguments[0].params[0].name;
            self.config.rootIndex = path.parent.arguments[0].params[1]? 
                              path.parent.arguments[0].params[1].name : 'index';
          } else {  //Component

          }
          self.entrance = true;
        }
      },
      ReturnStatement: {
        exit(path) {
          if (path.node) {
            if (t.isReturnStatement(path.node) && t.isCallExpression(path.node.argument)) { // return list.map()
              if (path.node.argument.callee.property.name !== 'map') {
                console.log(`react-miniapp暂不支持除了map以外的渲染函数`);
              } 
              const result = recursivelyAssembleMapTag(path.node.argument,self.config);
              path.node.argument = result;
            }
            // return <div/>
            const result = generate(path.node.argument).code;
            self.return = result;

          }
        }
      },
      FunctionExpression(path) {
        path.node.params.forEach((arg, index) => {
          if (index === 0) self.item = generate(arg).code;
          if (index === 1) self.index = generate(arg).code;
        })
      },
      ArrowFunctionExpression(path) {
        path.node.params.forEach((arg, index) => {
          if (index === 0) self.item = generate(arg).code;
          if (index === 1) self.index = generate(arg).code;
        })
      },
      JSXOpeningElement: {
        enter(path) {
          // console.log(path.parent);
          const tag = path.parent.openingElement.name.name;

          // TODO 处理key
          const jsx = t.jsxOpeningElement(t.jsxIdentifier(wxTags[tag]),[
            t.jSXAttribute(t.jSXIdentifier('wx:for'), t.stringLiteral(`{{${self.object}}}`)),
            t.jSXAttribute(t.jSXIdentifier('wx:for-item'), t.stringLiteral(`${self.item}`)),
            t.jSXAttribute(t.jSXIdentifier('wx:for-index'), t.stringLiteral(`${self.index || 'index'}`)),
          ]);
  
          path.parent.openingElement = jsx;
        },
        exit(path) {
          common.convertJSXOpeningElement(path);
        }
      },
      JSXExpressionContainer(path) {
        common.convertJSXExpressionContainer(path);
      },
      JSXClosingElement(path) {
        if (!path.node.selfClosing) {
          path.node.name = t.identifier(wxTags[path.node.name.name]);
        }
      }
    }
  }
}

const common = {
  convertJSXOpeningElement: function(path) {
    path.node.name = t.identifier(wxTags[path.node.name.name]);
    path.node.attributes.forEach((attr, index) => {
      const originName = attr.name.name;
      const attrName = attr.name.name.toLowerCase();
      if (attrName === 'classname') { // 转换className到class
        path.node.attributes[index] = t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral('app'));
        return;
      }
      if (WXML_EVENTS[attrName]) { // 事件转换
        //映射事件
        attr.name = t.identifier(WXML_EVENTS[attrName]);
        const funName = generate(attr.value.expression.property).code;
        if (t.isCallExpression(attr.value.expression) || t.isArrowFunctionExpression(attr.value.expression)) {
            const warningCode = generate(attr.value.expression).code;
            console.log(
              `小程序不支持在模板中使用function/arrow function，因此 '${warningCode}' 不会被编译`
            );
        }
        attr.value = t.stringLiteral(funName);
        return;
      }
      if (attrName === 'style') { // 样式转换
        let tempAttrs = '';
        attr.value.expression.properties.forEach(style => {
          const key = generate(style.key).code;``
          // TODO 未支持变量转换 'position:{{p}}'
          const value = style.value.value;
          tempAttrs += `${key}:${value}`;
        });
        attr.value = t.stringLiteral(`${tempAttrs}`);
      }
    });
  },
  convertJSXExpressionContainer(path) {
    if (t.isJSXAttribute(path.parent)) { //<img src={this.props.imgSrc}>
      const varibleName = generate(path.node.expression).code;
      path.replaceWith(t.stringLiteral(`{{${varibleName}}}`));
    }

    if (
      t.isMemberExpression(path.node.expression)|| //{this.props.children}
      t.isIdentifier(path.node.expression)||  //{}
      t.isBinaryExpression(path.node.expression)  //{1+2}
    ){
      const code = generate(path.node.expression).code;
      if (code === 'this.props.children') {
        const openningTag = t.jsxOpeningElement(t.jsxIdentifier('slot'), [], true);
        path.replaceWith(openningTag);
      } else {
        path.node.expression = t.identifier(`{${code}}`);
      }
    }
    
    if (t.isCallExpression(path.node.expression)) { // <div>{  }</div> {}就进入函数调用循环
      if (path.node.expression.callee.property.name === 'map') {
        const mapAST = parseCode(generate(path.node.expression).code);
        const instance = new MapVisitor();
        traverse(mapAST, Object.assign({},instance.visitor.call(instance)));
        path.replaceWith(t.identifier(instance.return));
      } else {
        path.remove();
      }
    }
  },
}

module.exports = Object.assign({},common);
