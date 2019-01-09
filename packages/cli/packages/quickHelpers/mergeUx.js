
let path = require('path');
let beautify = require('js-beautify');
let config = require('../config');
let quickFiles = require('../quickFiles');
let utils = require('../utils');
let queue = require('../queue');
let cwd = process.cwd();

const compileSassByPostCss = require('../stylesTransformer/postcssTransformSass');
const compileLessByPostCss = require('../stylesTransformer/postcssTransformLess');
const compileSass = require('../stylesTransformer/transformSass');
// const compileLess = require('../stylesTransformer/transformLess');
const hasNodeSass = utils.hasNpm('node-sass');
const styleCompilerMap = {
    'less': compileLessByPostCss,
    'css':  compileLessByPostCss,
    'sass': hasNodeSass ? compileSass : compileSassByPostCss,
    'scss': hasNodeSass ? compileSass : compileSassByPostCss
};


function beautifyUx(code){
    return beautify.html(code, {
        indent: 4,
        'wrap-line-length': 100
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
    // /Users/qitmac000524/work/schnee-ui/node_modules/schnee-ui/components/XPicker/index.js ==> schnee-ui
    let libName =  path.relative( path.join(cwd, 'node_modules') , fileId).split(path.sep)[0];
    return path.join(cwd, 'node_modules', libName, dep); 
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
                return `<style lang="${uxFile.cssType}">\n${res.code}\n</style>`;
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
    if (!uxFile) return;
    //假设假设存在<template>
    var ux = `${uxFile.template || ''}`;
    map.resolveComponents(data);
    ux = beautifyUx(map.getImportTag(uxFile, sourcePath) + ux) + '\n'; 
    ux = ux + map.getJsCode(result.code) + '\n'; 
    ux = ux + await map.getCssCode(uxFile);
    return ux;
};