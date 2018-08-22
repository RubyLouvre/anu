const nPath = require('path');
const fsExtra = require('fs-extra');

const isNpm = function(path){
    const toString = Object.prototype.toString;
    if(toString.call(path) !== '[object String]' || !path) return false;
    return !/^\/|\./.test(path);
}

const isAbsolute = function(path){
    return nPath.isAbsolute(path);
}

const isBuildInLibs = function(name){
    let libs = new Set(require('repl')._builtinLibs);
    return libs.has(name);
}

const copyNodeModuleToBuildNpm = function(source){
    let nodeModulesSourcesPath = nPath.join(process.cwd(), 'node_modules', source);
    let nodeModelesBuildSourcesPath = nPath.join(process.cwd(), `/dist/npm/${source}`);
    let pkg = nPath.join(nodeModulesSourcesPath, 'package.json');
    let mainFild = require(pkg).main;
   
    //拷贝package.json
    let packageDest = nPath.join(nodeModelesBuildSourcesPath, 'package.json');
    fsExtra.ensureFileSync(packageDest);
    fsExtra.copySync(
        pkg,
        packageDest
    )
    //拷贝package.json中main字段指向的模块
    let libSrc = nPath.join( nodeModulesSourcesPath,  mainFild );
    let libDest = nPath.join(nodeModelesBuildSourcesPath, mainFild);
    fsExtra.ensureFileSync(libDest)
    fsExtra.copySync(
        libSrc,
        libDest,
        {
            overwrite: true,
            errorOnExist:true,
        }
    );
}

const getNodeModulePath = function(moduleCurrent, source){
   let from = nPath.dirname(moduleCurrent.replace('src', 'dist'));
   let to = '/dist/npm/';
   let relativePath = nPath.relative(from, to);
   let nodeModelesBuildSourcesPath = nPath.join(process.cwd(), `/dist/npm/${source}`);
   let pkg = nPath.join(nodeModelesBuildSourcesPath, 'package.json');
   let mainFild = require(pkg).main;
   if(!mainFild){
       console.log(`无法读取${source} package, 请检查${source}目录下package.json中main字段是否正确`);
       process.exit(1);
    }
   let astValue = nPath.join(
        relativePath, 
        source, 
        mainFild.replace(/\.(js)/, '')
    )
   return astValue;
}


module.exports = function(moduleCurrent, source, node){
    if(isAbsolute(source) || isBuildInLibs(source) || !isNpm(source)) return;
    copyNodeModuleToBuildNpm(source); 
    node.source.value = getNodeModulePath(moduleCurrent, source);
}
