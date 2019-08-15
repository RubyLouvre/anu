

import template from '@babel/template';
import * as t from '@babel/types';
import { NodePath, PluginObj } from '@babel/core';
const extraImportedPath: any = template(`
import dynamicPage from '@internalComponents/HOC/dynamicPage';
`)();

let pageName: string = '';
module.exports = function(): PluginObj{
    return {
        visitor: {
            Program: {
                exit(astPath: NodePath<t.Program>) {
                    // if (pageConfig) {
                    //     astPath.node.body.push(t.expressionStatement(
                    //         t.assignmentExpression(
                    //             '=',
                    //             t.memberExpression(
                    //                 t.identifier('P'),
                    //                 t.identifier('config')
                    //             ),
                    //             pageConfig
                    //         )
                    //     ));
                    // }
                    astPath.node.body.unshift(extraImportedPath);
                }
            },
            ExportDefaultDeclaration(astPath: NodePath<t.ExportDefaultDeclaration>) {
                const declaration = astPath.node.declaration;
                astPath.node.declaration = t.callExpression(t.identifier('dynamicPage'), [declaration as t.FunctionExpression]);
            },
            ClassDeclaration(classPath) {
                let pageConfig: any;
                pageName = (classPath.get('id').get('name') as any).node;
                classPath.traverse({
                    ClassMethod(astPath) {
                        if (astPath.node.kind === 'constructor') {
                            astPath.traverse({
                                AssignmentExpression(path) {
                                    const left = path.get('left');
                                    const right = path.get('right');
                                    if (left.type === 'MemberExpression' && 
                                        (left.get('object') as any).node.type === 'ThisExpression' &&
                                        (left.get('property') as any).node.name === 'config' &&
                                        right.type === 'ObjectExpression'
                                    ) {
                                        pageConfig = right.node;
                                    }
                                }
                            });
                        }
                    }
                })
                if (pageConfig) {
                    classPath.insertAfter(t.expressionStatement(
                        t.assignmentExpression(
                            '=',
                            t.memberExpression(
                                t.identifier(pageName),
                                t.identifier('config')
                            ),
                            pageConfig
                        )
                    ));
                }
            },
            // ClassMethod(astPath) {
            //     if (astPath.node.kind === 'constructor') {
            //         astPath.traverse({
            //             AssignmentExpression(path) {
            //                 const left = path.get('left');
            //                 const right = path.get('right');
            //                 if (left.type === 'MemberExpression' && 
            //                     (left.get('object') as any).node.type === 'ThisExpression' &&
            //                     (left.get('property') as any).node.name === 'config' &&
            //                     right.type === 'ObjectExpression'
            //                 ) {
            //                     pageConfig = right.node;
            //                 }
            //             }
            //         });
            //     }
            // }
        }
    };
};
    