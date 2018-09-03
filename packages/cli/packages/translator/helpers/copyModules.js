const path = require('path');
const fs = require('fs-extra');
const cwd = process.cwd();

const isNpm = function(astPath){
    const toString = Object.prototype.toString;
    if (toString.call(astPath) !== '[object String]' || !astPath) return false;
    return !/^\/|\./.test(astPath);
};

const isBuildInLibs = function(name) {
    let libs = new Set(require('repl')._builtinLibs);
    return libs.has(name);
};

const isAlias = name => {
    const cwd = process.cwd();
    let aliasField = require(path.join(cwd, 'package.json')).mpreact.alias;
    let aliasAray = Object.keys(aliasField);
    let isAliasFlag = false;
    for (let i = 0; i < aliasAray.length; i++) {
        if (new RegExp(`^${aliasAray[i]}`).test(name)) {
            isAliasFlag = true;
            break;
        }
    }
    return isAliasFlag;
};


const hasMainFild = (npmName)=>{
    const pkg = require( path.join( cwd, 'node_modules', npmName, 'package.json' ) );
    if (!pkg.main){
        // eslint-disable-next-line
        console.log(
            `无法读取${npmName} package, 请检查${npmName}目录下package.json中main字段是否正确`
        );
        process.exit(1);
    }
    return true;
};

const copyNpm = (npmName)=>{

    const npmDir = path.join(cwd, 'node_modules', npmName);
    const npmPkg = path.join(npmDir, 'package.json');
    const npmLib = path.join(npmDir, require(npmPkg).main );
 
    const distDir = path.join(cwd, 'dist', 'npm', npmName);
    const distPkg = path.join(distDir,'package.json');
    const distLib = path.join(distDir, require(npmPkg).main );

    fs.ensureFileSync(distPkg);
    fs.ensureFileSync(distLib);

    fs.copyFileSync(
        npmPkg,
        distPkg
    );
    fs.copyFileSync(
        npmLib,
        distLib
    );
    

};

const resolveNpmPath = (sourcePath, npmName)=>{
    sourcePath = process.platform === 'win32' ? sourcePath : path.join(cwd, sourcePath);
    let from = path.dirname(sourcePath.replace(/\/src\//, '/dist/'));
    let pkgMain = require(path.join(cwd, 'node_modules', npmName, 'package.json')).main;
    let to = path.join(cwd, 'dist', 'npm', npmName, pkgMain);
    let relativePath = path.relative(from, to);
    relativePath = process.platform === 'win32' ? relativePath.replace(/\\/g,'/') : relativePath;
    return relativePath;
    
};


module.exports = function(sourcePath, npmName, node) {
    if (isBuildInLibs(npmName) || isAlias(npmName) || !isNpm(npmName)) return;
    if (hasMainFild(npmName)){
        copyNpm(npmName);
        node.source.value = resolveNpmPath(sourcePath, npmName);
    }
};