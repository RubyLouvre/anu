const path = require('path');
const fs = require('fs-extra');
const babel = require('babel-core');
const cwd = process.cwd();
const chalk = require('chalk');
const t = require('babel-types');
const npmResolve = require('resolve');
const esToCjs = require('./moduleToCjs');
const {isNpm, isBuildInLibs, isAlias, installer} = require('../utils');

let libAlias = {
    'react': path.join(cwd, 'dist', 'ReactWX.js')
    // 'prop-types': path.join(cwd, 'dist', 'ReactPropTypes.js')
};

const isAvailableNpmName = (name)=>{
    return isBuildInLibs(name) || isAlias(name) || isNpm(name);
};


let distNpmCache = {};
let analysisDepsCache = {};

//获取依赖pkg中main指向
const resolveNpmModule = (name)=>{
    let npmSrc = '';
    try {
        //注意moduleDirectory参数，永远在当前project目录查找node_modules，防止向上递归查找， 详见https://nodejs.org/api/modules.html#modules_all_together
        npmSrc = npmResolve.sync(name, {basedir: cwd, moduleDirectory: path.join(cwd, 'node_modules')});
    } catch (err){
        // eslint-disable-next-line
        console.log( chalk.red(`缺少依赖: ${name}, 正在自动安装中, 请稍候`) );
        installer(name, ()=>{
            //依赖安装成功
            npmSrc = npmResolve.sync(name, {basedir: path.join(cwd, 'node_modules')} );
        });
    }

    return npmSrc;
    
};

const writeContent = (data, isCache = true)=>{
    let {dist, content} = data;

    if (isCache){
        if (distNpmCache[dist] === content) return;
    }
    
    fs.ensureFileSync(dist);
    fs.writeFile(dist, content, 'utf-8', (err)=>{
        if (err){
            // eslint-disable-next-line
            console.log(err);
            return;
        }
        if (isCache){
            distNpmCache[dist] = content;
        }
        // eslint-disable-next-line
        console.log( chalk.green('build success: ' + path.relative(cwd, dist)) );
    });
};

//获取引用node_modules目录下模块的绝对路径
const getNpmPath = (src, name)=>{
    let npmSrc = '';
    if (isBuildInLibs(name) || isAlias(name)) return;
    if (/^\./.test(name)){
        if (!/\.js$/.test(name)){
            name = `${name}.js`; //require('./a') => require('./a.js')
        }
        npmSrc = path.join(path.dirname(src), name);
    } else {
        npmSrc = resolveNpmModule(name);
    }
    return npmSrc;
};

// eslint-disable-next-line
const hackReactWXExportDefault = (name, astPath)=>{
    let hackList = [
        'react'
    ];
    if (!hackList.includes(name)){
        return;
    }
    /**
     * var _react = require('..');
     * 
     * =>
     * 
     * var _react = require('..');
     * _react = _react.default || _react;
     */
    let varName = astPath.parent.id.name;
    let ast = t.expressionStatement(
        t.assignmentExpression(
            '=',
            t.identifier(
                varName,
            ),
            t.logicalExpression(
                '||',
                t.memberExpression(
                    t.identifier( varName ),
                    t.identifier('default')
                ),
                t.identifier(varName)
            )
        )
    );
    astPath.parentPath.insertAfter(ast);

};


const analysisDeps = (src, name) =>{

   
    let npmSrc = getNpmPath(src, name);
    if (analysisDepsCache[npmSrc]) return; //已分析过的不再分析
    
    analysisDepsCache[npmSrc] = true;
    let code = babel.transformFileSync(npmSrc, {
        babelrc: false,
        plugins: [
            {
                visitor: {
                    CallExpression(astPath){
                        
                        let callName = astPath.node.callee.name;
                        if (callName === 'require'){
                            let name = astPath.node.arguments[0].value;
                            if (libAlias[name]){
                                //如果有别名配置，只更新路径
                                updateNpmAliasPath(npmSrc, name, astPath.node);
                                
                                hackReactWXExportDefault(name, astPath);
                            } else {
                                updateNpmPath(npmSrc, name, astPath.node);
                                //递归分析
                                analysisDeps(npmSrc, name);
                            }
                            analysisDepsCache[npmSrc] = true;
                             
                        }
                        
                    },
                    MemberExpression(astPath){
                        let path = astPath;
                        if (path.matchesPattern('process.env.NODE_ENV')) {
                            path.replaceWith(t.valueToNode(process.env.NODE_ENV));
                            if (path.parentPath.isBinaryExpression()) {
                                const evaluated = path.parentPath.evaluate();
                                if (evaluated.confident) {
                                    path.parentPath.replaceWith(t.valueToNode(evaluated.value));
                                }
                            }
                        }
                    }
                }
            }
            
        ]
    }).code;


    writeContent({
        dist: getNpmDist(npmSrc),
        content: esToCjs.byCode(code).code  //es to cjs
    });
    
};


//获取打包的node_modules模块在dist/npm中对应路径
const getNpmDist = (src)=>{
    let relativePath = path.relative(path.join(cwd, 'node_modules'), src);
    let dist = path.join(cwd, 'dist', 'npm', relativePath);
    return dist;
};



//处理引用的路径
const resolveNpmPath = (sourcePath, npmName)=>{
    //被依赖的npm模块路径
    let requireNpmModulePath = getNpmPath(sourcePath, npmName);
    let relativePath = '', from = '', to = '';
    if (/\/src\//.test(sourcePath)){
        //src中存在npm资源依赖
        from = path.dirname(sourcePath.replace( 'src', 'dist' ));
        to = path.join(
            cwd, 
            'dist',
            'npm',
            path.relative( path.join(cwd, 'node_modules') , requireNpmModulePath)
        );
       
    } else if (/\/node_modules\//.test(sourcePath)){
        //node_modules中存在npm资源依赖
        from = path.dirname(sourcePath);
        to = requireNpmModulePath;
    }

    relativePath = path.relative(from,to);

    relativePath = process.platform === 'win32' ? relativePath.replace(/\\/g,'/') : relativePath;
    return relativePath;
    
};

const resolveNpmAliasPath = (src, name)=>{
    let aliasPath = libAlias[name];
    let from = '', to = '', relativePath = '';
    if (/\/node_modules\//.test(src)){
        let npmDist = path.relative( path.relative(cwd, 'node_modules'), src );
        npmDist = path.join(cwd, 'dist', 'npm', npmDist);
        from = path.dirname(npmDist);
        to = aliasPath;
    }
    relativePath = path.relative(from, to);
    relativePath = process.platform === 'win32' ? relativePath.replace(/\\/g,'/') : relativePath;
    return relativePath;
};

const updateRequireOrImportValue = (node, updatedPath)=>{
    node.callee && node.callee.name === 'require'
        ? node.arguments[0].value = updatedPath  //require CallExpression
        : node.source.value = updatedPath;       //ImportDeclaration
};
const updateNpmPath = (src, name, node)=>{
    let updatedPath = resolveNpmPath(src, name);
    updateRequireOrImportValue(node, updatedPath);
};

const updateNpmAliasPath = (src, name, node)=>{
    //别名配置
    let updatedPath = resolveNpmAliasPath(src, name);
    updateRequireOrImportValue(node, updatedPath);
};



module.exports = function(sourcePath, name, node) {
    let src = process.platform === 'win32' ? sourcePath : path.join(cwd, sourcePath);
    if (isAvailableNpmName(name)) return;
    updateNpmPath(src, name, node); 
    analysisDeps(src, name);
    
};