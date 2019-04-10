
let path = require('path');
let beautify = require('js-beautify');
let config = require('../config');
let quickFiles = require('../quickFiles');
let utils = require('../utils');
let cwd = process.cwd();
let fs = require('fs');

const crypto = require('crypto');
let cache = {};
//缓存层，避免重复编译
let needUpdate = (id, originalCode) => {
    let sha1 = crypto
        .createHash('sha1')
        .update(originalCode)
        .digest('hex');
    if (!cache[id] || cache[id] != sha1) {
        cache[id] = sha1;
        return true;
    }
    return false;
};

//获取dist路径
let getDist = (filePath) =>{
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir} =  path.parse(dist);
    let distPath = path.join(dir, `${name}.css`);
    return distPath;
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

function nodeModules2Npm(p) {
    const relativePath = path.relative(path.resolve(cwd, 'node_modules'), p);
    return path.resolve(cwd, 'source/npm', relativePath);
}

// TODO: 合并到QuickParser中
let map = {
    getImportTag: function(uxFile, sourcePath){
        //假设存在<import>
        let importTag = '';
        let using = uxFile.config && uxFile.config.usingComponents || {};
        Object.keys(using).forEach((i)=>{
            const isWin = utils.isWin();
            const reg = isWin ? /^(\\)/ : /^(\/)/;
            const relativePath = using[i].replace(reg, '.$1');
            let targetPath = path.resolve(cwd, 'source', relativePath);
            if (/(node_modules|npm)\/schnee-ui/.test(sourcePath)) {
                if (/node_modules/.test(sourcePath)) {
                    sourcePath = nodeModules2Npm(sourcePath);
                }
                targetPath = path.resolve(cwd, 'source/npm/schnee-ui', relativePath);
            }
            let importSrc = path.relative(
                path.dirname(sourcePath),
                targetPath
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
        let { cssRes } = uxFile;
        if (!cssRes) return '';
        return `<style>\n${cssRes.css}\n</style>`;
    },
    resolveComponents: function(data, queue){
        let { result, sourcePath, relativePath } = data;
        let isComponentReg = utils.isWin() ? /\\components\\/ : /\/components\// ;
        if (!isComponentReg.test(sourcePath)) return;
        queue.push({
            code: beautify.js(result.code.replace('console.log(nanachi)', 'export {React}')),
            path: relativePath,
            type: 'js'
        });
        let reg = utils.isWin() ? /components\\(\w+)/ :  /components\/(\w+)/;
        var componentName =  sourcePath.match(reg)[1];
        result.code = `import ${componentName}, { React } from './index.js';
        export default  React.registerComponent(${componentName}, '${componentName}');`;
    }

};

module.exports = async (data, queue)=>{
    let { sourcePath, result, relativePath } = data;
    var uxFile = quickFiles[sourcePath];
    //如果没有模板, 并且不是app，则认为这是个纯js模块。
    if (!uxFile || (!uxFile.template && uxFile.type != 'App')) {
        return {
            type: 'js',
            code: result.code
        };
    }

    //假设假设存在<template>
    var ux = `${uxFile.template || ''}`;
    map.resolveComponents(data, queue);
    ux = beautifyUx(map.getImportTag(uxFile, sourcePath) + ux) + '\n'; 
    ux = ux + map.getJsCode(result.code) + '\n'; 
    ux = ux + await map.getCssCode(uxFile);
    return {
        type: 'ux',
        code: ux
    };
};