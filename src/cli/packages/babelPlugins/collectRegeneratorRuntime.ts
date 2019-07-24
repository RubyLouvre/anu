import { NodePath, PluginObj } from '@babel/core';
import * as t from '@babel/types';
import config from '../../config/config';
let hackList: any = ['wx', 'bu', 'tt', 'quick','qq'];//这些都不支持async/await

//插入regenerator-runtime/runtime
let visitor = {
    FunctionDeclaration: {
        exit(astPath: NodePath<t.FunctionDeclaration>) {
            //微信，百度小程序async/await语法需要插入var regeneratorRuntime = require('regenerator-runtime/runtime');
            let name = astPath.node.id.name;
            if ( !(name === '_asyncToGenerator' && hackList.includes(config.buildType))  ) {
                return;
            }
            let root = astPath.findParent(t.isProgram);
            (root as NodePath<t.Program>).node.body.unshift(
                t.variableDeclaration('var', [
                    t.variableDeclarator(
                        t.identifier('regeneratorRuntime'),
                        t.callExpression(t.identifier('require'), [
                            t.stringLiteral('regenerator-runtime/runtime')
                        ])
                    )
                ])
            );
        }
    }
};

module.exports = [
    require('@babel/plugin-transform-async-to-generator'),
    function(): PluginObj{
        return {
            visitor: visitor
        };
    }
];
