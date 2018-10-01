const babel = require('babel-core');
const queue = require('./queue');
const cwd = process.cwd();
const path = require('path');
const utils = require('./utils');
const config = require('./config');
const nodeResolve = require('resolve');


const transformCache = {};

//todo windows路径兼容
const resolveNpmDepPath = (id, npmPath)=>{
    let distDir = id.replace(/\/node_modules\//, '/dist/npm/' );     //含有依赖的文件路径
    let distRequired = npmPath.replace(/\/node_modules\//, '/dist/npm/' ); //被依赖的文件路径
    let relativePath = path.relative( path.dirname(distDir),  distRequired);
    return relativePath;
};

//todo windows路径兼容
const getDistPath = (id)=>{
    return id.replace(/\/node_modules\//, '/dist/npm/');
};

let ReactMap = utils.getReactMap();

module.exports = (file)=>{
    let {id, originalCode, moduleType} = file;
    //已处理过的不再处理
    if (transformCache[id]) return;
    transformCache[id] = true;
    let depFile = '';
    let babelConfig = {
        babelrc: false,
        plugins: [
            {
                visitor: {
                    ImportDeclaration(astPath){
                        let node = astPath.node;
                        let value = node.source.value;
                        if (!utils.isNpm(value)) return; //文件中可能存在相对路径模块引用, 不需要更改路径位置
                        if (value !=='react'){
                            //文件中中react需要配置alias路径
                            depFile = nodeResolve.sync(value, {
                                basedir: cwd, 
                                moduleDirectory: path.join(cwd, 'node_modules'),
                                packageFilter: (pkg)=>{
                                    if (pkg.module){
                                        pkg.main = pkg.module;
                                    }
                                    return pkg;
                                }
                                
                            });
                            node.source.value = resolveNpmDepPath(id, depFile);
                        }
                       
                    },
                    CallExpression(astPath){
                        let node = astPath.node;
                        let callName = node.callee.name;
                        if (callName != 'require') return;
                        let value = node.arguments[0].value;
                        if (!utils.isNpm(value)) return; //文件中可能存在相对路径模块引用, 不需要更改路径位置
                        if (value !=='react'){
                            //react需要配置alias路径
                            depFile = nodeResolve.sync(value, {
                                basedir: cwd, 
                                moduleDirectory: path.join(cwd, 'node_modules'),
                                packageFilter: (pkg)=>{
                                    if (pkg.module){
                                        pkg.main = pkg.module;
                                    }
                                    return pkg;
                                }
                                
                            });
                            node.arguments[0].value = resolveNpmDepPath(id, depFile);
                        }
                    }
                }
            },
            ['transform-node-env-inline'], //处理环境判断的相关代码
            ['module-resolver', {
                resolvePath(moduleName){
                    if (moduleName === 'react'){
                        //配置react别名
                        let distNpmFile = id.replace(/\/node_modules\//, '/dist/npm/');
                        let distReactFile = path.join(cwd, 'dist', ReactMap[config['buildType']] );
                        let value =  path.relative( path.dirname(distNpmFile),  distReactFile);
                        //require('xxx.js') => require('./xxx.js');
                        if (/^\w/.test(value)){
                            value = `./${value}`;
                        }
                        return value;
                    }
                }
            }]
             
        ]
    };

    if (moduleType === 'es'){
        //{allowTopLevelThis: true}, 防止this被转成undefined
        //https://github.com/babel/babelify/issues/37#issuecomment-160041164
        babelConfig.plugins.push(['transform-es2015-modules-commonjs', {'allowTopLevelThis': true}]);
    }


    setTimeout(()=>{
        let code = babel.transform(originalCode, babelConfig ).code;
        queue.push({
            code: code,
            path: getDistPath(id),
            type: 'npm'
        });
        utils.emit('build');
    }, 4);

    

};