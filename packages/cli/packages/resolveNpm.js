const babel = require('babel-core');
const queue = require('./queue');
const cwd = process.cwd();
const path = require('path');
const utils = require('./utils');
const config = require('./config');
const nodeResolve = require('resolve');
const transformCache = {};


//处理相对路径
const getRelativePath = (from, to)=>{
    let relativePath =  path.relative( path.dirname(from), to);
    if ( /^\w/.test(relativePath) ) {
        //require('A') => require('./A');
        relativePath = `./${relativePath}`;
    }
    if ( utils.isWin() ){
        relativePath = relativePath.replace(/\\/g, '/');
    }
   
    return relativePath;
};

//处理npm文件引用其他npm模块路径
const resolveNpmDepPath = (id, value)=>{
    let depNpmFilePath = nodeResolve.sync(value, {
        basedir: cwd, 
        moduleDirectory: path.join(cwd, 'node_modules'),
        packageFilter: (pkg)=>{
            if (pkg.module){
                pkg.main = pkg.module;
            }
            return pkg;
        }
        
    });

    let from = utils.replacePath(id, '/node_modules/', '/dist/npm/');
    let to = utils.replacePath(depNpmFilePath, '/node_modules/', '/dist/npm/' );
    return getRelativePath(from, to);

};

const getDistPath = (id)=>{
    return utils.replacePath(id, '/node_modules/', '/dist/npm/');
};

//获取当前构建的react文件名
let ReactFileName = utils.getReactMap()[config['buildType']];

module.exports = (file)=>{
    let {id, originalCode} = file;
    //已处理过的不再处理
    if (transformCache[id]) return;
    transformCache[id] = true;
    let babelConfig = {
        babelrc: false,
        plugins: [
            {
                visitor: {
                    ImportDeclaration(astPath){
                        let node = astPath.node;
                        let value = node.source.value;
                        /**
                         * 1: node_modules文件中可能存在相对路径模块引用, 不需要更改路径位置.
                         * 2: react单独处理
                         */
                       
                        if (!utils.isNpm(value) || value === 'react') return; 
                        node.source.value = resolveNpmDepPath(id, value);
                    },
                    CallExpression(astPath){
                        let node = astPath.node;
                        let callName = node.callee.name;
                        if (callName != 'require') return;
                        let value = node.arguments[0].value;
                        if (!utils.isNpm(value) || value === 'react' ) return; 
                        node.arguments[0].value = resolveNpmDepPath(id, value);
                    }
                }
            },
            require('babel-plugin-transform-node-env-inline'),//处理环境判断的相关代码
            [ 
                require('babel-plugin-module-resolver'), 
                {
                    resolvePath(moduleName){
                        if (moduleName === 'react'){
                            //配置react别名
                            let distNpmFile = utils.replacePath(id, '/node_modules/', '/dist/npm/');
                            let distReactFile = path.join(cwd, 'dist', ReactFileName);
                            return getRelativePath(distNpmFile, distReactFile);

                        }
                    }
                }
            ]
             
        ]
    };

    setImmediate(()=>{
        let code = babel.transform(originalCode, babelConfig ).code;
        queue.push({
            code: code,
            path: getDistPath(id),
            type: 'npm'
        });
    });

};