import { NodePath, PluginObj } from '@babel/core';
import * as t from '@babel/types';

module.exports = ():PluginObj => {
    return {
        visitor: {
            ImportDeclaration(astPath: NodePath<t.ImportDeclaration>, state: any) {
                state.file.opts.anu = state.file.opts.anu || {};
                state.file.opts.anu.dependencies = state.file.opts.anu.dependencies || [];
                state.file.opts.anu.dependencies.push(astPath.node.source.value);
            }
        }
    };
};