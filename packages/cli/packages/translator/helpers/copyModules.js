const path = require('path');
const fsExtra = require('fs-extra');

const isNpm = function(astPath){
    const toString = Object.prototype.toString;
    if (toString.call(astPath) !== '[object String]' || !astPath) return false;
    return !/^\/|\./.test(astPath);
};

const isBuildInLibs = function(name){
    let libs = new Set(require('repl')._builtinLibs);
    return libs.has(name);
};

const isAlias = (name)=>{
    const cwd = process.cwd();
    let aliasField = require( path.join(cwd, 'package.json') ).mpreact.alias;
    let aliasAray = Object.keys(aliasField);
    let isAliasFlag = false;
    for (let i = 0; i < aliasAray.length; i++){
        if (new RegExp(`^${aliasAray[i]}`).test(name)){
            isAliasFlag = true;
            break;
        }
    }
    return isAliasFlag;
};

const copyNodeModuleToBuildNpm = function(source){
    let nodeModulesSourcesPath = path.join(process.cwd(), 'node_modules', source);
    let nodeModelesBuildSourcesPath = path.join(process.cwd(), `${path.sep}dist${path.sep}npm${path.sep}${source}`);
    let pkg = path.join(nodeModulesSourcesPath, 'package.json');
    let mainFild = require(pkg).main;
   
    //拷贝package.json
    let packageDest = path.join(nodeModelesBuildSourcesPath, 'package.json');
    fsExtra.ensureFileSync(packageDest);
    fsExtra.copySync(
        pkg,
        packageDest
    );
    //拷贝package.json中main字段指向的模块
    let libSrc = path.join( nodeModulesSourcesPath,  mainFild );
    let libDest = path.join(nodeModelesBuildSourcesPath, mainFild);
    fsExtra.ensureFileSync(libDest);
    fsExtra.copySync(
        libSrc,
        libDest,
        {
            overwrite: true,
            errorOnExist:true,
        }
    );
};

const getNodeModulePath = function(moduleCurrent, source){
    let from = path.dirname(moduleCurrent.replace('src', 'dist'));
    let to = `${path.sep}dist${path.sep}npm${path.sep}`;
    let relativePath = path.relative(from, to);
    let nodeModelesBuildSourcesPath = path.join(process.cwd(), `${path.sep}dist${path.sep}npm${path.sep}${source}`);
    let pkg = path.join(nodeModelesBuildSourcesPath, 'package.json');
    let mainFild = require(pkg).main;
    if (!mainFild){
        // eslint-disable-next-line
        console.log(`无法读取${source} package, 请检查${source}目录下package.json中main字段是否正确`);
        process.exit(1);
    }
    let astValue = path.join(
        relativePath, 
        source, 
        mainFild.replace(/\.(js)/, '')
    );
    return astValue;
};


module.exports = function(moduleCurrent, source, node){
    if (isBuildInLibs(source) || isAlias(source) || !isNpm(source)) return;
    copyNodeModuleToBuildNpm(source); 
    node.source.value = getNodeModulePath(moduleCurrent, source);
};
