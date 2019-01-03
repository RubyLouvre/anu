const g = require('babel-generator').default;
const path = require('path');
const config = require('../config');
const cwd = process.cwd();
let collectError;
const visitor = {
    JSXExpressionContainer: {
        enter: function(astPath){
            let expression =  astPath.node.expression;
            let callee = expression.callee;
            
            let type = expression.type;
            let fileId = path.relative(cwd, this.file.parserOpts.sourceFileName);
            let { line, column } = astPath.node.loc.start;

            //判断map的数组是否经过函数处理. 例如: list.slice(0,2).map
            if (
                type === 'CallExpression'
                && callee && callee.property && callee.property.name === 'map'
                && callee.object.type === 'CallExpression'
            ) {
                collectError.jsxError.push({
                    id: fileId,
                    level: 'error',
                    msg: `jsx中无法调用非map函数\nat ${fileId}:${line}:${column}\n ${g(astPath.node).code}\n`,
                });
                return;
            }

            //属性插值中，不能调用非事件绑定的函数
            if ( 
                astPath.parentPath.type === 'JSXAttribute' //属性节点
                && !/^(on)|(catch)/.test(astPath.parentPath.node.name.name) //跳过属性中事件on|catch绑定  属性名不是事件绑定
                && type === 'CallExpression'     //属性值是函数调用
                && callee.property && callee.property.name != 'bind'   //属性值是非bind函数调用
            ) {
                collectError.jsxError.push({
                    id: fileId,
                    level: 'error',
                    msg: `jsx属性中无法调用非map函数.\nat ${fileId}:${line}:${column}\n ${g(astPath.node).code}\n`,
                });
                return;
            }

            //三元表达式中不能调用函数
            if (astPath.parentPath.type === 'JSXAttribute' && type === 'ConditionalExpression') {
                astPath.traverse({
                    CallExpression: function(){
                        collectError.jsxError.push({
                            id: fileId,
                            level: 'error',
                            msg: `jsx属性中三元表式无法调用非map函数.\nat ${fileId}:${line}:${column}\n${g(astPath.node).code}\n`,
                        });
                    }
                });
            }

        }
    }
};
module.exports = (errorStack)=>{
    collectError = errorStack;
    if (['wx', 'tt'].includes(config.buildType)) {
        return [
            ()=>{
                return {
                    visitor: visitor
                };
            }
        ];
    } else {
        return [];
    }
};