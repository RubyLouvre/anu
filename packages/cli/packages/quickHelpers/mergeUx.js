
let path = require('path');
let beautify = require('js-beautify');
let config = require('../../config/config');
let quickFiles = require('./quickFiles');
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

function beautifyUx(code){
    return beautify.html(code, {
        indent: 4,
        //'wrap-line-length': 100
    });
}

function isNodeModulePath(fileId){
    let reg = /[\\/]node_modules[\\/]/;
    return reg.test(fileId);
}

function nodeModules2Npm(p) {
    const relativePath = path.relative(path.resolve(cwd, 'node_modules'), p);
    return path.join(cwd, 'source/npm', relativePath);
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
            let targetPath = path.join(cwd, 'source', relativePath);
            if (/(node_modules|npm)[\\\/]schnee-ui/.test(sourcePath)) {
                if (/node_modules/.test(sourcePath)) {
                    sourcePath = nodeModules2Npm(sourcePath);
                }
                targetPath = path.join(cwd, 'source', relativePath);
            }
            let importSrc = path.relative(
                path.dirname(sourcePath),
                targetPath
            );
            importSrc = importSrc.replace(/\\/g, '/');
            importTag += `<import name="${i}" src="${importSrc}.ux"></import>`;
        });
        return importTag;
    },
    getJsCode: function(code){
        if (!code) return '';
        code = beautify.js(code);
        return `<script>\n${code}\n</script>`;
    },
    resolveComponents: function(data, queue){
        let {result, sourcePath, relativePath} = data;
        let isComponentReg = /[\\/]components[\\/]/;
        if (!isComponentReg.test(sourcePath)) return;
        queue.push({
            code: beautify.js(result.code.replace('console.log(nanachi)', 'export {React}')),
            path: relativePath,
            type: 'js'
        });
        let reg = /components[\\/](\w+)/;
        var componentName =  sourcePath.match(reg)[1];
        result.code = `import ${componentName}, { React } from './index.js';
        export default  React.registerComponent(${componentName}, '${componentName}');`;
    }

};

module.exports = async (data, queue)=>{
    let {sourcePath, result} = data;
    sourcePath = utils.fixWinPath(sourcePath);
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
    uxFile.header = beautifyUx(map.getImportTag(uxFile, sourcePath) + ux);
    uxFile.jsCode = map.getJsCode(result.code);
    uxFile.cssCode = uxFile.cssCode || '';
    return {
        type: 'ux',
    };
};