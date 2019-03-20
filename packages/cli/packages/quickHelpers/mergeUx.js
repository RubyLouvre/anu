
let path = require('path');
let beautify = require('js-beautify');
let config = require('../config');
let quickFiles = require('../quickFiles');
let utils = require('../utils');
let queue = require('../queue');
let cwd = process.cwd();
let fs = require('fs');

const crypto = require('crypto');
let cache = {};
//缓存层，避免重复编译
let needUpdate = (id, originalCode, fn) => {
    let sha1 = crypto
        .createHash('sha1')
        .update(originalCode)
        .digest('hex');
    if (!cache[id] || cache[id] != sha1) {
        cache[id] = sha1;
        fn();
    }
};

//获取dist路径
let getDist = (filePath) =>{
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir} =  path.parse(dist);
    let distPath = path.join(dir, `${name}.css`);
    return distPath;
};

const compileSassByPostCss = require('../stylesTransformer/postcssTransformSass');
const compileLessByPostCss = require('../stylesTransformer/postcssTransformLess');

const styleCompilerMap = {
    'less': compileLessByPostCss,
    'css':  compileLessByPostCss,
    'sass': compileSassByPostCss,
    'scss': compileSassByPostCss
};


function beautifyUx(code){
    return beautify.html(code, {
        indent: 4,
        //'wrap-line-length': 100
    });
}


function isNodeModulePath(fileId){
    let isWin = utils.isWin();
    let reg = isWin ? /\\node_modules\\/ : /\/node_modules\//;
    return reg.test(fileId);
}

function fixPath(fileId, dep){
    if (!isNodeModulePath(fileId)) {
        return path.join(cwd, config.sourceDir, dep);
    }
    let retPath = utils.updatePath(dep, 'npm', 'node_modules');
    return path.join(cwd, retPath); 
}


let map = {
    getImportTag: function(uxFile, sourcePath){
        //假设存在<import>
        let importTag = '';
        let using = uxFile.config && uxFile.config.usingComponents || {};
        Object.keys(using).forEach((i)=>{
            let importSrc = path.relative(
                path.dirname(sourcePath),
                fixPath(sourcePath, using[i])
            );
            importSrc = utils.isWin() ? importSrc.replace(/\\/g, '/'): importSrc;
            importTag += `<import name="${i}" src="${importSrc}.ux"></import>`;
        });
        return importTag;
    },
    getJsCode: function(code){
        if (!code) return '';
        code = beautify.js(code);
        return `<script>\n${code}\n</script>`;
    },
    getCssCode:  function(uxFile){
        if (!uxFile.cssType) return '';
        let {cssType, cssPath} = uxFile;
       
        return styleCompilerMap[cssType](cssPath)
            .then((res)=>{
                // 递归编译@import依赖文件
                res.deps.forEach(dep => {
                    const code = fs.readFileSync(dep.file, 'utf-8');
                    needUpdate(dep.file, code,  ()=>{
                        let exitName = path.extname(dep.file).replace(/\./, '');
                        styleCompilerMap[exitName](dep.file, code).then(res => {
                            queue.push({
                                code: res.code,
                                path: getDist(dep.file),
                                type: 'css'
                            });
                        });
                    });
                });
                return `<style>\n${res.code}\n</style>`;
            });
    },
    resolveComponents: function(data){
        let {result, sourcePath} = data;
        let isComponentReg = utils.isWin() ? /\\components\\/ : /\/components\// ;
        if (!isComponentReg.test(sourcePath)) return;
        queue.push({
            code: beautify.js(result.code.replace('console.log(nanachi)', 'export {React}')),
            path:  utils.updatePath(sourcePath, config.sourceDir, 'dist') 
        });
        let reg = utils.isWin() ? /components\\(\w+)/ :  /components\/(\w+)/;
        var componentName =  sourcePath.match(reg)[1];
        result.code = `import ${componentName}, { React } from './index.js';
        export default  React.registerComponent(${componentName}, '${componentName}');`;
    }

};

module.exports = async (data)=>{
    let {sourcePath, result} = data;
    var uxFile = quickFiles[sourcePath];

    //如果没有模板, 并且不是app，则认为这是个纯js模块。
    if (!uxFile.template && uxFile.type != 'App') {
        return {
            type: 'js',
            code: result.code
        };
    }

    if (!uxFile) return;
    //假设假设存在<template>
    var ux = `${uxFile.template || ''}`;
    map.resolveComponents(data);
    ux = beautifyUx(map.getImportTag(uxFile, sourcePath) + ux) + '\n'; 
    ux = ux + map.getJsCode(result.code) + '\n'; 
    ux = ux + await map.getCssCode(uxFile);
    return {
        type: 'ux',
        code: ux
    };
};