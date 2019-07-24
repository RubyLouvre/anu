import * as t from '@babel/types';
import generate from '@babel/generator';
import utils from '../utils';
import chalk from 'chalk';
const { createElement, createAttribute } = utils;

/**
 * 本模板将array.map(fn)变成<block wx:for="{{}}"></block>
 * 将if(xxx){}变成<block wx:if="{{xxx}}"></block>
 * 将xxx? aaa: bbb变成<block wx:if="aaa">aaa</block>
 * <block wx:if="!xxx">bbb</block>
 */
const rexpr = /(^|[^\w.])this\./g;

function parseExpr(node: any) {
    return `{{${generate(node).code.replace(rexpr, '$1')}}}`;
}

function wrapText(node: any) {
    if (node.type !== 'JSXElement') {
        return t.jsxText(parseExpr(node));
    }
    return node;
}

function createLogicHelper(prefix: string, keyName: string, hasDefaultKey: boolean){
    function logic(expr: any, modules: any, isText?: boolean): any {
        if (isText){
            return [wrapText(expr)];
        }
        // 处理条件指令
        if (t.isConditionalExpression(expr) || t.isIfStatement(expr)) {
            return condition(expr.test, expr.consequent, expr.alternate, modules);
        } else if (t.isLogicalExpression(expr) && expr.operator === '&&') {
            return condition(expr.left, expr.right, null, modules);
        } else if (
            t.isCallExpression(expr) &&
            (expr.callee as any).property && (expr.callee as any).property.name === 'map'
        ) {
            // 处理列表指令
            if (expr.arguments[0].type === 'ArrowFunctionExpression') {
                
                return loop(expr.callee, expr.arguments[0], modules);
            } else if (
                expr.arguments[0] &&
                expr.arguments[0].type === 'FunctionExpression'
            ) {
               
                return loop(expr.callee, expr.arguments[0], modules);
            } else {
                throw generate((expr.callee as any).object).code +
                '.map 后面的必须跟匿名函数或一个函数调用';
            }
        } else {
            return [wrapText(expr)];
        }
    }
    // 处理 test ? consequent: alternate 或 test && consequent
    function condition(test: any, consequent: any, alternate: any, modules: any) {
        let ifNode = createElement(
            'block',
            [createAttribute(prefix+ 'if', parseExpr(test))],
            logic(consequent, modules)
        );
        // null就不用创建一个<block>元素了，&&表达式也不需要创建<block>元素
        if (alternate && alternate.type !== 'NullLiteral') {
            // 如果存在if分支，那么就再包一层，一共三个block,
            // <block><block wx:if /><block wx:else /></block>
            let elseNode = createElement(
                'block',
                [createAttribute(prefix+'elif', 'true')],//elif
                logic(alternate, modules)
            );
            return [ifNode, elseNode];
        }
        return [ifNode];
    }
    
    // 处理 callee.map(fn)
    function loop(callee: any, fn: any, modules: any) {
        const attrs = [];
        if (prefix){//其他小程序
            attrs.push(createAttribute(prefix +'for', parseExpr(callee.object)));
            attrs.push(createAttribute(prefix +'for-item', fn.params[0].name));
            attrs.push(createAttribute(prefix +'for-index', fn.params[1].name));
        } else { //快应用
            var forExpr = '(' + fn.params[1].name + ',' + fn.params[0].name + ') in ' + parseExpr(callee.object).slice(2, -2);
            attrs.push(createAttribute('for', forExpr));
        }
       
        ;
        if (Object.keys(modules.key || {}).length) {
            //快应用不生成key

            //用于取到对应的 key
            var calleeCode = generate(callee).code;
            prefix &&  attrs.push( createAttribute(keyName, utils.genKey(modules.key[calleeCode])) );
            
            delete modules.key[calleeCode];
           // modules.key = null;
        } else if (hasDefaultKey) {
            attrs.push(createAttribute(keyName, '*this'));
        }
    
        const body = t.isBlockStatement(fn.body)
            ? fn.body.body.find(t.isReturnStatement)
            : fn.body;
    
        if (body) {
            // 循环内部存在循环或条件
            let children = logic(
                t.isBlockStatement(fn.body) ? body.argument : body,
                modules
            );
    
            return [createElement('block', attrs, children)];
    
        } else {
            // eslint-disable-next-line
            console.log(
                chalk`{cyan .map(fn)} 的函数中需要有 {cyan ReturnStatement}，在 ${
                    generate(fn).code} 中未找到 {cyan ReturnStatement}`
            );
            throw new Error('Parse error');
        }
    }
    return logic;    
};

module.exports = createLogicHelper;
export default createLogicHelper;