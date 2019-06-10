let fs = require('fs-extra');
let path = require('path');
let cwd = process.cwd();
let nodeResolve = require('resolve');
let t = require('@babel/types');

let hackList = ['wx', 'bu', 'tt', 'quick', 'qq'];
let utils = require('../utils');
let config = require('../../config/config');

let copyFlag = false;
let patchAsync = false;

const pkgName = 'regenerator-runtime';

function needInstall( pkgName ){
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
    function(){
        return {
            visitor: {
                FunctionDeclaration: {
                    exit(astPath) {
                      
                        let name = astPath.node.id.name;
                        if ( !(name === '_asyncToGenerator' && hackList.includes(config.buildType))  ) {
                            return;
                        }

                        let root = astPath.findParent(t.isProgram);
                        root.node.body.unshift(
                            t.variableDeclaration('var', [
                                t.variableDeclarator(
                                    t.identifier('regeneratorRuntime'),
                                    t.callExpression(t.identifier('require'), [
                                        t.stringLiteral('regenerator-runtime/runtime')
                                    ])
                                )
                            ])
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
                    let dist = path.join( cwd, utils.getDistName(config.buildType), 'npm', `${pkgName}/runtime.js`);
                    let src =  path.join( cwd, 'node_modules', `${pkgName}/runtime.js`);
                    fs.ensureFileSync(dist);
                    fs.copyFileSync(src, dist);
                    copyFlag = true;
                }

            }
        }
    }
];
