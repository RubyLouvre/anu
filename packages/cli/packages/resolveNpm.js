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
    return relativePath;
};

//处理npm文件引用其他npm模块路径
const resolveNpmDepPath = (id, value)=>{
    let importerId = nodeResolve.sync(value, {
        basedir: cwd, 
        moduleDirectory: path.join(cwd, 'node_modules'),
        packageFilter: (pkg)=>{
            if (pkg.module){
                pkg.main = pkg.module;
            }
            return pkg;
        }
        
    });
    return getRelativePath(id, importerId);

};

const getDistPath = (id)=>{
    return utils.updatePath(id, 'node_modules', `dist${path.sep}npm`);
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
                            let distNpmFile = utils.updatePath(id, 'node_modules', `dist${path.sep}npm`);
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