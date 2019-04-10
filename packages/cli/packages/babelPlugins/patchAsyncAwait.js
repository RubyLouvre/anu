let config = require('../config');
let fs = require('fs-extra');
let path = require('path');
let cwd = process.cwd();

let t = require('@babel/types');
let hackList = ['wx', 'bu', 'tt', 'quick', 'qq'];

let copyFlag = false;
let patchAsync = false;
const patchName = 'regenerator-runtime/runtime.js';

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
                    let dist = path.join( cwd, 'dist', 'npm', patchName);
                    let src =  path.join( cwd, 'node_modules', patchName);
                    fs.ensureFileSync(dist);
                    fs.copyFileSync(src, dist);
                    copyFlag = true;
                }
            }
        }
    }
];
