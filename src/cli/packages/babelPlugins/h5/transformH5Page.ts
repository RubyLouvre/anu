

import template from '@babel/template';
import * as t from '@babel/types';
import { NodePath, PluginObj } from '@babel/core';
const extraImportedPath: any = template(`
import dynamicPage from '@internalComponents/HOC/dynamicPage';
`)();

module.exports = function(): PluginObj{
    return {
        visitor: {
            Program: {
                exit(astPath: NodePath<t.Program>) {
                    astPath.node.body.unshift(extraImportedPath);
                }
            },
            ExportDefaultDeclaration(astPath: NodePath<t.ExportDefaultDeclaration>) {
                const declaration = astPath.node.declaration;
                astPath.node.declaration = t.callExpression(t.identifier('dynamicPage'), [declaration as t.FunctionExpression]);
            }
        }
    };
};
    