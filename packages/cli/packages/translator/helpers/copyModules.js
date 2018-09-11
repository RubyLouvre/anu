const path = require('path');
const fs = require('fs-extra');
//const babel = require('babel-core');
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


// const resolveExt = (name)=>{
//     let result = /\.js$/.test(name) ? name : `${name}.js`;
//     return result;
// };

const copyNpm = (npmName)=>{

    let npmNameAry = npmName.split('/');
    // const npmPkg = path.join(cwd, 'node_modules', npmNameAry[0], 'package.json');

    // let mainFiled = require(npmPkg).main;
    // let srcNpmPkgDir = '';
    // let distLib = '';
    
    // if (npmNameAry.length > 1){
    //     //require('a/b/c')
    //     srcNpmPkgDir = path.join(cwd, 'node_modules', resolveExt(npmName) );  
    //     distLib = path.join(cwd, 'dist', 'npm', resolveExt(npmName));         
    // } else {
    //     //require('a');
    //     srcNpmPkgDir = path.join(cwd, 'node_modules', npmName, resolveExt( mainFiled )  );  
    //     distLib = path.join(cwd, 'dist', 'npm' , npmName,   resolveExt( mainFiled ) );     
    // }

    // fs.ensureFileSync(distLib);
    // fs.copyFile(
    //     srcNpmPkgDir,
    //     distLib
    // );


    let distLibTem = path.join(cwd, 'dist', 'npm', npmNameAry[0]);
    let srcNpmPkgDirTem = path.join(cwd, 'node_modules', npmNameAry[0]);
    fs.ensureDirSync(distLibTem);
    fs.copy(
        srcNpmPkgDirTem,
        distLibTem
    );


    // let hasDeps = false;
    // const result = babel.transformFileSync(srcNpmPkgDir, {
    //     plugins: [
    //         {
    //             visitor: {
    //                 CallExpression(astPath){
    //                     let name = astPath.node.callee.name;
    //                     if (name === 'require'){
    //                         let npmName = astPath.node.arguments[0].value;
    //                         if (isBuildInLibs(npmName) || isAlias(npmName) || !isNpm(npmName)) return;
    //                         copyNpm(npmName);
    //                         astPath.node.arguments[0].value = resolveNpmPath(srcNpmPkgDir, npmName);
    //                         hasDeps = true;
    //                     }
    //                 }
    //             }
    //         }
    //     ]
    // });
   

    // if (hasDeps){
    //     let hasDepsDist = path.join(cwd, 'dist', 'npm', path.relative(  path.join(cwd, 'node_modules'), srcNpmPkgDir ) );
    //     fs.ensureFileSync(hasDepsDist);
    //     fs.writeFileSync(hasDepsDist, result.code);
    // }
                       
};





const resolveNpmPath = (sourcePath, npmName)=>{

    let npmNameAry = npmName.split('/');
    let from = '';
    let to = '';
    if (/node_modules/.test(sourcePath)){
        //node_modules中模块存在依赖
        let dir = path.relative( path.join(cwd, 'node_modules'),  sourcePath);
        dir = path.join(cwd, 'dist', 'npm', dir);
        from = path.dirname(dir);
    } else {
        let dir =  path.relative( path.join(cwd, 'src'),  sourcePath);
        dir = path.join(cwd, 'dist', dir);
        from = path.dirname(dir);
    }

    if (npmNameAry.length > 1){
        to = path.join(cwd, 'dist', 'npm', npmName);
    } else {
        let pkgMain = require(path.join(cwd, 'node_modules', npmNameAry[0], 'package.json')).main;
        to = path.join(cwd, 'dist', 'npm', npmName, pkgMain);
    }
    let relativePath = path.relative(from, to);

    relativePath = process.platform === 'win32' ? relativePath.replace(/\\/g,'/') : relativePath;
   
    return relativePath;
    
};


module.exports = function(sourcePath, npmName, node) {
    sourcePath = process.platform === 'win32' ? sourcePath : path.join(cwd, sourcePath);
    if (isBuildInLibs(npmName) || isAlias(npmName) || !isNpm(npmName)) return;
    if (hasMainFild(npmName)){
        copyNpm(npmName);
        if (node.callee && node.callee.name === 'require'){
            //require
            node.arguments[0].value = resolveNpmPath(sourcePath, npmName);
        } else {
            //import
            node.source.value = resolveNpmPath(sourcePath, npmName);
        }
       
    }
};