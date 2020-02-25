import * as path from 'path';
import nodeResolve from 'resolve';
import * as t from '@babel/types';
import utils from '../utils';
import { NodePath, PluginObj } from '@babel/core';
import config from '../../config/config';


let hackList: any = ['wx', 'bu', 'tt', 'quick', 'qq'];

let installFlag = false;
const pkgName = 'regenerator-runtime@0.12.1';

function needInstall( pkgName: string ): boolean{
    try {
        nodeResolve.sync(pkgName, { 
            basedir: process.cwd(),
            moduleDirectory: ''
        });
        return false;
    } catch (err) {
        return true;
    }
}


module.exports  = [
    require('@babel/plugin-transform-async-to-generator'),
    function(): PluginObj{
        return {
            visitor: {
                FunctionDeclaration: {
                    exit(astPath: NodePath<t.FunctionDeclaration>) {
                      
                        let name = astPath.node.id.name;
                        if ( !(name === '_asyncToGenerator' && hackList.includes(config.buildType))  ) {
                            return;
                        }

                        let root = astPath.findParent(t.isProgram);
                        (root as NodePath<t.Program>).node.body.unshift(
                            t.importDeclaration(
                                [
                                    t.importDefaultSpecifier(
                                        t.identifier('regeneratorRuntime')
                                    )
                                ],
                                t.stringLiteral('regenerator-runtime/runtime')
                            )

                            // t.variableDeclaration('var', [
                            //     t.variableDeclarator(
                            //         t.identifier('regeneratorRuntime'),
                            //         t.callExpression(t.identifier('require'), [
                            //             t.stringLiteral('regenerator-runtime/runtime')
                            //         ])
                            //     )
                            // ])
                        );

                    }
                }
            },
            post: function(){
                if ( needInstall(pkgName.split('@')[0]) &&  !installFlag) {
                    utils.installer(pkgName);
                    installFlag = true;
                }
            }
        }
    }
];
