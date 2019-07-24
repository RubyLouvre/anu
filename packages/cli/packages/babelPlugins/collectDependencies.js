"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = () => {
    return {
        visitor: {
            ImportDeclaration(astPath, state) {
                state.file.opts.anu = state.file.opts.anu || {};
                state.file.opts.anu.dependencies = state.file.opts.anu.dependencies || [];
                state.file.opts.anu.dependencies.push(astPath.node.source.value);
            }
        }
    };
};
