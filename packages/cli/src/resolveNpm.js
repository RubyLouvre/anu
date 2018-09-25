const generate = require('babel-generator').default;
const babel = require('babel-core');
const traverse = require('babel-traverse').default;
const queue = require('./queue');
const cwd = process.cwd();
const path = require('path');
const nodeResolve = require('resolve');

const log = console.log;

const isNpm = (npmName)=>{
    return !/^(\.|\/)/.test(npmName);
}

//todo windows路径兼容
const resolveNpmPath = (id, npmPath)=>{
    let distDir = id.replace(/\/node_modules\//, '/dist/npm/' );     //含有依赖的文件路径
    let distRequired = npmPath.replace(/\/node_modules\//, '/dist/npm/' ); //被依赖的文件路径
    let relativePath = path.relative( path.dirname(distDir),  distRequired);
    return relativePath;
}

//todo windows路径兼容
const getDistPath = (id)=>{
    return id.replace(/\/node_modules\//, '/dist/npm/');
}

module.exports = (file)=>{
    let {id, originalCode} = file;
    let code = babel.transform(originalCode, {
        babelrc: false,
        plugins: [
            {
                visitor: {
                    ImportDeclaration(astPath){
                        let node = astPath.node;
                        let value = node.source.value;
                        if(!isNpm(value)) return; //文件中可能存在相对路径模块引用, 不需要更改路径位置
                        if(value !=='react'){
                            //文件中中react需要配置alias路径
                            let npmPath = nodeResolve.sync(value, {basedir: cwd, moduleDirectory: path.join(cwd, 'node_modules')});
                            node.source.value = resolveNpmPath(id, npmPath);
                        }
                       
                    },
                    CallExpression(astPath){
                        let node = astPath.node;
                        let callName = node.callee.name;
                        if(callName != 'require') return;
                        let value = node.arguments[0].value;
                        if(!isNpm(value)) return; //文件中可能存在相对路径模块引用, 不需要更改路径位置
                        if(value !=='react'){
                            //react需要配置alias路径
                            let npmPath = nodeResolve.sync(value, {basedir: cwd, moduleDirectory: path.join(cwd, 'node_modules')});
                            node.arguments[0].value = resolveNpmPath(id, npmPath);
                        }
                    }
                }
            },
            ["module-resolver", {
                "root": [ path.join(cwd, 'dist') ],
                "alias": {
                  "react": "./ReactWX.js",
                }
            }],
           'transform-es2015-modules-commonjs'
        ]
    }).code;


    queue.push({
        code: code,
        path: getDistPath(id),
        type: 'npm'
    });

};