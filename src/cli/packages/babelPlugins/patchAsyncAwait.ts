import * as path from 'path';
import nodeResolve from 'resolve';
import * as t from '@babel/types';
import utils from '../utils';
import { NodePath, PluginObj } from '@babel/core';
import config from '../../config/config';

let hackList: any = ['wx', 'bu', 'tt', 'quick', 'qq'];

let copyFlag = false;
let patchAsync = false;

const pkgName = 'regenerator-runtime';

function needInstall( pkgName: string ): boolean{
    try {
        nodeResolve.sync(pkgName, { 
            // TODO: 逻辑有问题
            basedir: process.cwd(),
            // moduleDirectory: cwd
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

                        patchAsync = true;
                    }
                }
            },
            post: function(){
                if ( patchAsync &&  !copyFlag ) {
                    if ( needInstall(pkgName) ) {
                        // 锁版本
                        utils.installer(pkgName + '@0.12.1');
                    }
                    let cwd = process.cwd();
                    
                    let dist = path.join( cwd, utils.getDistName(config.buildType), 'npm', `${pkgName}/runtime.js`);
                    let src =  path.join( cwd, 'node_modules', `${pkgName}/runtime.js`);
                    // fs.ensureFileSync(dist);
                    // fs.copyFileSync(src, dist);
                    copyFlag = true;
                }

            }
        }
    }
];
