//将<view aaa={this.state.xxx}> 转换成 <view aaa="{{xxx}}">

const t = require('babel-types');
const generate = require('babel-generator').default;
const getStyleValue = require('../utils/getStyleValue');
const buildType = require('../config').buildType;

module.exports = function (astPath) {
    let expr = astPath.node.expression;
    let attrName = astPath.parent.name.name;
    let isEventRegex =
        buildType == 'ali' || buildType == 'quick'
            ? /^(on|catch)/
            : /^(bind|catch)/;
    let isEvent = isEventRegex.test(attrName);
    if (isEvent) { //处理事件
        return bindEvent(astPath, attrName, expr);
    }
    //去掉里面所有this
    astPath.traverse({
        ThisExpression(nodePath) {
            if (t.isMemberExpression(nodePath.parentPath)) {
                nodePath.parentPath.replaceWith(
                    t.identifier(nodePath.parent.property.name)
                );
            }
        }
    });
    var attrValue = generate(expr).code;//没有this.
    switch (expr.type) {
        case 'NumericLiteral': //11
        case 'StringLiteral': // "string"
        case 'Identifier': // kkk undefined
        case 'NullLiteral': // null
        case 'BooleanLiteral':// false, true
        case 'LogicalExpression':// a && b
        case 'UnaryExpression':  // !a
        case 'ConditionalExpression':// a ? b: c
        case 'MemberExpression': // aa.bbb
            replaceWithExpr(astPath, attrValue);
            break;
        case 'CallExpression': // fn(a)
            if (
                attrName === 'style' &&
                attrValue.indexOf('React.toStyle') > -1
            ) {
                //通过style={React.toStyle(this.state.color, this.props, 'style4338')}
                //变成style="{{props.style4338}}"
                let start = attrValue.indexOf('\'style');
                let end = attrValue.lastIndexOf(')');
                let styleID = attrValue.slice(start, end);
                replaceWithExpr(astPath, `props[${styleID}] `);
            } else {
                replaceWithExpr(astPath, attrValue);
            }
            break;
        case 'ObjectExpression':
            //通过style={{a:1,b:1}}
            //变成style="{{props.style4338}}"
            if (attrName === 'style') {
                replaceWithExpr(astPath, getStyleValue(expr), true);
            }
            break;
        case 'BinaryExpression': { // a + b
            if (attrName === 'class' || attrName === 'className') {
                let { left, right } = expr;
                if (t.isStringLiteral(left) || t.isStringLiteral(right)) {
                    // 快应用的 bug
                    // class={{this.className0 + ' dynamicClassName'}} 快应用会将后者的空格吞掉
                    // 影响 class 的求值
                    /*  let className =
                        buildType == 'quick'
                            ? `${toString(
                                expr.left
                            )} ${toString(expr.right)}`
                            : `${toString(
                                expr.left
                            )}${toString(expr.right)}`;
                            */
                    let className = `${toString(
                        expr.left
                    )}${toString(expr.right)}`;
                    astPath.replaceWith(t.stringLiteral(className));
                    return;
                }
            }
            replaceWithExpr(astPath, attrValue);
            break;
        }
    }
};

function throwEventValue(attrName, attrValue) {
    throw `${attrName}的值必须是一个函数名，如 this.xxx 或 this.xxx.bind(this),
    但现在的值是${attrValue}`;
}

function replaceWithExpr(astPath, value, noBracket) {
    let v = noBracket ? value : '{{' + value + '}}';
    astPath.replaceWith(t.stringLiteral(v));
}

function bindEvent(astPath, attrName, expr) {
    let eventHandle = generate(expr).code;
    if (!/^\s*\w+\./.test(eventHandle)) {
        throwEventValue(attrName, eventHandle);
    }
    if (buildType == 'quick') {
        let n = attrName.charAt(0) === 'o' ? 2 : 5;
        astPath.parent.name.name = 'on' + attrName.slice(n).toLowerCase();
    }
    replaceWithExpr(astPath, 'dispatchEvent', true);
}
function toString(node) {
    if (t.isStringLiteral(node)) return node.value;
    if (t.isMemberExpression) return `{{${generate(node).code}}}`;
}