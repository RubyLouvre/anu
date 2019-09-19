import * as t from '@babel/types';
import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import template from '@babel/template';
import utils from '../utils';

module.exports = {
    enter(astPath: NodePath<t.ClassDeclaration>, state: any) {
        //重置数据
        let modules = utils.getAnu(state);
        modules.className = astPath.node.id.name;
        modules.parentName = generate(astPath.node.superClass).code || 'Object';
        modules.classUid = 'c' + utils.createUUID(astPath);
    },
    exit(astPath: NodePath<t.ClassDeclaration>, state: any) {
        // 将类表式变成函数调用
        let modules = utils.getAnu(state);
        if (!modules.ctorFn) {
            /**
             * 占位符要大写
             * placeholderPattern
             * Type: RegExp | false Default: /^[_$A-Z0-9]+$/
             * 
             * A pattern to search for when looking for Identifier and StringLiteral nodes
             * that should be considered placeholders. 'false' will disable placeholder searching
             * entirely, leaving only the 'placeholderWhitelist' value to find placeholders.
             */
            modules.ctorFn = template('function X(){B}')({
                X: t.identifier(modules.className),
                B: modules.thisProperties
            });
           
        }

        if (astPath.parent.type === 'Program') {
            astPath.insertBefore(modules.ctorFn);
        } else {
            // 支持mobx装饰器逻辑，let P = xxx 转为 P = xxx。因为let声明变量后不能声明同名function
            let tempPath: any;
            astPath.findParent(function(astPath) {
                if (astPath.type !== 'Program') {
                    tempPath = astPath;
                    return false;
                }
                return true;
            });
            let tempExp = tempPath.get('declarations')[0];
            let left = tempExp.get('id').node, right = tempExp.get('init').node;
            tempPath.replaceWith(t.expressionStatement(t.assignmentExpression('=', left, right)));
            tempPath.insertBefore(modules.ctorFn);
        }
        // console.log(astPath.findParent(function(astPath) {
        //     return astPath.parent.type === 'Program' || astPath.type === 'Program'
        // }).type);
        // astPath.insertBefore(modules.ctorFn);
        //用于绑定事件
        modules.thisMethods.push(
            t.objectProperty(
                t.identifier('classUid'),
                t.stringLiteral(modules.classUid)
            )
        );
        /**
         * 使用 babel-types 完成如下语法
         * var Global = React.toClass(Global, React.Component, {});
         */
        
        const classDeclarationAst = t.assignmentExpression(
            '=', 
            t.identifier(modules.className),
            t.callExpression(t.identifier('React.toClass'), [
                t.identifier(modules.className),
                t.identifier(modules.parentName),
                t.objectExpression(modules.thisMethods),
                t.objectExpression(modules.staticMethods)
            ])
        );
        if(modules.componentType === 'App'){
            if(!/this.globalData/.test(generate(modules.ctorFn).code)){
                 throw 'app.js没有设置globalData对象'
            }
        }
        
        // const classDeclarationAst = t.variableDeclaration(
        //     'var',
        //     [
        //         t.variableDeclarator(
        //             t.identifier(modules.className),
        //             t.callExpression(t.identifier('React.toClass'), [
        //                 t.identifier(modules.className),
        //                 t.identifier(modules.parentName),
        //                 t.objectExpression(modules.thisMethods),
        //                 t.objectExpression(modules.staticMethods)
        //             ])
        //         )
        //     ]
        // );

        
        // 可以通过 `console.log(generate(classDeclarationAst).code)` 查看编译后的代码

        astPath.replaceWith(classDeclarationAst);
        if (astPath.type == 'CallExpression') {
            if (astPath.parentPath.type === 'VariableDeclarator') {
                if ((parent as any).type == 'VariableDeclaration') { // tsc todo: parent哪来的？
                    (parent as any).node.kind = 'var';
                }
            }
        }
        if (modules.componentType === 'Page') {
            modules.registerStatement = utils.createRegisterStatement(
                modules.className,
                modules.current
                    .replace(/.+pages/, 'pages')
                    .replace(/\.js$/, ''),
                true
            );
        } else if (modules.componentType === 'Component') {
            modules.registerStatement = utils.createRegisterStatement(
                modules.className,
                modules.className
            );
        }
    }
};
