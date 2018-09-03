//将<view aaa={this.state.xxx}> 转换成 <view aaa="{{xxx}}">

const t = require('babel-types');
const generate = require('babel-generator').default;
const styleHelper = require('./inlineStyle');

function bindEvent(astPath) {
    replaceWithExpr(astPath, 'dispatchEvent', true);
}

module.exports = function(astPath) {
    var expr = astPath.node.expression;
    var attrName = astPath.parent.name.name;
    var isEvent = /^(bind|catch)/.test(attrName);
    var attrValue = generate(expr).code;
    switch (astPath.node.expression.type) {
        case 'NumericLiteral': //11
        case 'StringLiteral': // "string"
        case 'Identifier': // kkk undefined
        case 'NullLiteral': // null
        case 'BooleanLiteral':
            if (isEvent) {
                throwEventValue(attrName, attrValue);
            }
        
            replaceWithExpr(astPath, attrValue);
            break;
        case 'BinaryExpression':
            astPath.traverse({
                ThisExpression(nodePath) {
                    if (t.isMemberExpression(nodePath.parentPath)) {
                        nodePath.parentPath.replaceWith(
                            t.identifier(nodePath.parent.property.name)
                        );
                    }
                }
            });
            replaceWithExpr(astPath, generate(astPath.node.expression).code);
            break;
        case 'MemberExpression':
            if (isEvent) {
                bindEvent(
                    astPath,
                    attrName,
                    attrValue.replace(/^\s*this\./, '')
                );
            } else {
                replaceWithExpr(astPath, attrValue.replace(/^\s*this\./, ''));
            }
            break;
        case 'CallExpression':
            if (isEvent) {
                var match = attrValue.match(/this\.(\w+)\.bind/);
                if (match && match[1]) {
                    bindEvent(astPath, attrName, match[1]);
                } else {
                    throwEventValue(attrName, attrValue);
                }
            } else {
                if (
                    attrName === 'style' &&
                    attrValue.indexOf('React.collectStyle') === 0
                ) {
                    // style={{}} 类型解析
                    let name = attrValue;
                    let styleID = name.match(/style\d+/)[0];
                    if (name.lastIndexOf('+') !== -1){
                       
                        var indexName =  name.split('+').pop().match(/\w+/)[0];

                        replaceWithExpr(astPath, `props['${styleID}' + ${indexName}] `  );
                    } else {
                        replaceWithExpr(astPath, `props.${styleID}`);
                    }
                   
                } else {
                    replaceWithExpr(astPath, attrValue);
                }
            }
            break;
        case 'ObjectExpression':
            if (attrName === 'style') {
                var styleValue = styleHelper(expr);
                replaceWithExpr(astPath, styleValue, true);
            } else if (isEvent) {
                throwEventValue(attrName, attrValue);
            }
            break;
        case 'ConditionalExpression':
            astPath.traverse({
                ThisExpression(nodePath) {
                    if (t.isMemberExpression(nodePath.parentPath)) {
                        nodePath.parentPath.replaceWith(
                            t.identifier(nodePath.parent.property.name)
                        );
                    }
                }
            });
            replaceWithExpr(astPath, attrValue.replace(/^\s*this\./, ''));
            break;
        default:
            break;
    }
};

function throwEventValue(attrName, attrValue) {
    throw `${attrName}的值必须是一个函数名，如 this.xxx 或 this.xxx.bind(this),
    但现在的值是${attrValue}`;
}

function replaceWithExpr(astPath, value, noBracket) {
    var v = noBracket ? value : '{{' + value + '}}';
    astPath.replaceWith(t.stringLiteral(v));
}
