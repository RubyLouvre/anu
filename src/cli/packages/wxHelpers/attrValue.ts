//将<view aaa={this.state.xxx}> 转换成 <view aaa="{{xxx}}">

import * as t from '@babel/types';
import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import config from '../../config/config';
import calculateStyleString from '../utils/calculateStyleString';
const buildType = config.buildType;

module.exports = function (astPath: any) {
  
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
        ThisExpression(nodePath: NodePath<t.ThisExpression>) {
            if (t.isMemberExpression(nodePath.parentPath)) {
                nodePath.parentPath.replaceWith(
                    t.identifier((nodePath.parent as any).property.name)
                );
            }
        }
    });

    var attrValue = generate(expr).code;//没有this.
    
    switch (expr.type) {
        case 'ArrayExpression': //[]
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
                replaceWithExpr(astPath, calculateStyleString(expr), true);
            }

            //不转译 Spread 运算。{{...a}} 
            if ((['wx', 'qq', 'tt'] as any).includes(buildType)) {
                if (
                    expr.properties.every(function(prop: any){
                        return prop.type === 'SpreadElement' || prop.type === 'ObjectProperty'
                    })
                ) {
                    // {...a} => '{{...a}}'
                    let value = '{' +  attrValue.replace(/\n/g, '') + '}';
                    astPath.replaceWith(t.stringLiteral(value));
                }
            }

            break;
        case 'BinaryExpression': { // a + b
            if (attrName === 'class' || attrName === 'className') {
                let { left, right } = expr;
                if (t.isStringLiteral(left) || t.isStringLiteral(right)) {
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

function throwEventValue(attrName: string, attrValue: string) {
    throw `${attrName}的值必须是一个函数名，如 this.xxx 或 this.xxx.bind(this),
    但现在的值是${attrValue}`;
}

function replaceWithExpr(astPath: any, value: string, noBracket?: boolean) {
    let v = noBracket ? value : '{{' + value + '}}';
    astPath.replaceWith(t.stringLiteral(v));
}

function bindEvent(astPath: any, attrName: string, expr: any) {
    if(expr.type === 'ArrowFunctionExpression'){
        replaceWithExpr(astPath, 'dispatchEvent', true);
    }else{
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
}
function toString(node: any) {
    if (t.isStringLiteral(node)) return node.value;
    if (t.isMemberExpression) return `{{${generate(node).code}}}`;
}