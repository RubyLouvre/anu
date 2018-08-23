//将<view aaa={this.state.xxx}> 转换成 <view aaa="{{xxx}}">

const t = require('babel-types');
const CSSProperty = require('./shared/CSSProperty');
const generate = require('babel-generator').default;
const styleHelper = require('./inlineStyle');

function bindEvent(path) {
  replaceWithExpr(path, 'dispatchEvent', true);
}

function stylePropsName(name) {
  let regTpl = /\'(.+)\'\)/g;
  let nameArrLen = name.split(',').length;
  let propsName = name.split(',')[nameArrLen - 1].replace(regTpl, '$1');
  return propsName.trim();
}

module.exports = function(path) {
  var expr = path.node.expression;
  var attrName = path.parent.name.name;
  var isEvent = /^(bind|catch)/.test(attrName);
  var attrValue = generate(expr).code;
  switch (path.node.expression.type) {
    case 'NumericLiteral': //11
    case 'StringLiteral': // "string"
    case 'BinaryExpression': // 1+ 2
    case 'Identifier': // kkk undefined
    case 'NullLiteral': // null
    case 'BooleanLiteral':
      if (isEvent) {
        throwEventValue(attrName, attrValue);
      }
      replaceWithExpr(path, attrValue);
      break;
    case 'MemberExpression':
      if (isEvent) {
        bindEvent(path, attrName, attrValue.replace(/^\s*this\./, ''));
      } else {
        replaceWithExpr(path, attrValue.replace(/^\s*this\./, ''));
      }
      break;
    case 'CallExpression':
      if (isEvent) {
        var match = attrValue.match(/this\.(\w+)\.bind/);
        if (match && match[1]) {
          bindEvent(path, attrName, match[1]);
        } else {
          throwEventValue(attrName, attrValue);
        }
      } else {
        if (attrName === 'style' && attrValue.indexOf('React.collectStyle') === 0) {
          // style={{}} 类型解析
          // let name = attrValue.replace(regTpl, '$1').split(',')[2];
          let name = stylePropsName(attrValue);
          replaceWithExpr(path, `props.${name}`);
        } else {
          replaceWithExpr(path, attrValue);
        }
      }
      break;
    case 'ObjectExpression':
      if (attrName === 'style') {
        var styleValue = styleHelper(expr);

        replaceWithExpr(path, styleValue, true);
      } else if (isEvent) {
        throwEventValue(attrName, attrValue);
      }
      break;
    default:
      console.log('===0000=', path.node.expression.type);
      break;
  }
};
var rhyphen = /([a-z\d])([A-Z]+)/g;
function hyphen(target) {
  //转换为连字符风格
  return target.replace(rhyphen, '$1-$2').toLowerCase();
}

function throwEventValue(attrName, attrValue) {
  throw `${attrName}的值必须是一个函数名，如this.xxx或this.xxx.bind(this),
    但现在的值是${attrValue}`;
}

function replaceWithExpr(path, value, noBracket) {
  var v = noBracket ? value : '{{' + value + '}}';
  path.replaceWith(t.stringLiteral(v));
}
