
let beautify = require('js-beautify');
let quickFiles = require('./quickFiles');
let utils = require('../utils');
let calculateAlias = require('../utils/calculateAlias');


function beautifyUx(code){
    return beautify.html(code, {
        indent: 4,
        //'wrap-line-length': 100 //慎重
    });
}

// TODO: 合并到QuickParser中
let map = {
    getImportTag: function(uxFile, sourcePath){
        //假设存在<import>
        let importTag = '';
        let using = uxFile.config && uxFile.config.usingComponents || {};
        Object.keys(using).forEach((i)=>{
            let importerReletivePath = calculateAlias(sourcePath, using[i]);
            importTag += `<import name="${i}" src="${importerReletivePath}.ux"></import>`;
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