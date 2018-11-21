/*!
 * 生成js文件, ux文件
 */
let babel = require('babel-core');
let fs = require('fs');
let path = require('path');
let beautify = require('js-beautify');
let miniappPlugin = require('./miniappPlugin');
let config = require('./config');
let quickFiles = require('./quickFiles');
let queue = require('./queue');
let utils = require('./utils');

const {compileSass, compileLess}= require('./stylesTransformer/postcssTransform');
const styleCompilerMap = {
    '.less': compileLess,
    '.css': compileLess,
    'sass': compileSass,
    'scss': compileSass
};
let cwd = process.cwd();

let componentOrAppOrPageReg = utils.getComponentOrAppOrPageReg();
//抽离async/await语法支持，可能非App/Component/Page业务中也包含async/await语法
const asyncAwaitPlugin  = utils.asyncAwaitHackPlugin(config.buildType);
function transform(sourcePath, resolvedIds, originalCode) {
    if (/^(React)/.test( path.basename(sourcePath)) ) {
        queue.push({
            code: originalCode,
            type: 'js',
            path: utils.updatePath(sourcePath, config.sourceDir, 'dist') 
        });
        return;
    }
    let transformFilePath = sourcePath;
    sourcePath = utils.resolvePatchComponentPath(sourcePath);
    
    //用户自定义alias与npm相对路径处理都作为alias配置
    let aliasMap = Object.assign(
        utils.updateCustomAlias(sourcePath, resolvedIds),
        utils.updateNpmAlias(sourcePath, resolvedIds)
    );
    
    //pages|app|components需经过miniappPlugin处理
    let miniAppPluginsInjectConfig = componentOrAppOrPageReg.test(transformFilePath) ? [miniappPlugin] : [];
    babel.transformFile(
        transformFilePath,
        {
            babelrc: false,
            plugins: [
                require('babel-plugin-syntax-jsx'),
                require('babel-plugin-transform-decorators-legacy').default,
                require('babel-plugin-transform-object-rest-spread'),
                require('babel-plugin-transform-es2015-template-literals'),
                require('babel-plugin-transform-async-to-generator'),
                ...miniAppPluginsInjectConfig,
            ]
        },
        function(err, result) {
            if (err) {
                //eslint-disable-next-line
                console.log(transformFilePath, '\n', err);
            }
            //babel6无transform异步方法
            setImmediate(async () => {
                let babelPlugins = [
                    asyncAwaitPlugin,
                    [
                        //配置环境变量
                        require('babel-plugin-transform-inline-environment-variables'),
                        {
                            env: {
                                ANU_ENV: config['buildType'],
                                BUILD_ENV: process.env.BUILD_ENV
                            }
                        }
                    ],
                    require('babel-plugin-minify-dead-code-elimination'), //移除没用的代码
                    [
                        require('babel-plugin-module-resolver'),        //计算别名配置以及处理npm路径计算
                        {
                            resolvePath(moduleName) {
                                if (!utils.isNpm(moduleName)) return;
                                //针对async/await语法依赖的npm路径做处理
                                if (/regenerator-runtime\/runtime/.test(moduleName)) {
                                    let regeneratorRuntimePath = utils.getRegeneratorRuntimePath(sourcePath);
                                    queue.push({
                                        code: fs.readFileSync(regeneratorRuntimePath, 'utf-8'),
                                        path: utils.updatePath(
                                            regeneratorRuntimePath,
                                            'node_modules',
                                            'dist' + path.sep + 'npm'
                                        ),
                                        type: 'npm'
                                    });
                                    Object.assign(
                                        aliasMap,
                                        utils.updateNpmAlias(sourcePath, { 'regenerator-runtime/runtime': regeneratorRuntimePath } )
                                    );
                                }
                                let value = aliasMap[moduleName] ;
                                value = /^\w/.test(value) ? `./${value}` : value;
                                if ( utils.isWin() ) {
                                    value = value.replace(/\\/g, '/');
                                }
                                return value;
                            }
                        }
                    ]
                ];
                //babel无transform异步方法
                try {
                    result = babel.transform(result.code, {
                        babelrc: false,
                        plugins: babelPlugins
                    });
                } catch (err) {
                    //eslint-disable-next-line
                    console.log(transformFilePath, '\n', err);
                }
                
                //处理中文转义问题
                result.code = result.code.replace(
                    /\\?(?:\\u)([\da-f]{4})/gi,
                    function(a, b) {
                        return unescape(`%u${b}`);
                    }
                );
                //生成JS文件
                var uxFile = quickFiles[sourcePath];
                if (config.buildType == 'quick' && uxFile) {
                    //假设假设存在<template>
                    var ux = `${uxFile.template || ''}`;
                    let using = uxFile.config && uxFile.config.usingComponents;
                    if (using) {
                        //假设存在<import>
                        let importTag = '';
                        for (let i in using) {
                            let importSrc = path.relative(
                                path.dirname(sourcePath),
                                path.join(cwd, config.sourceDir, using[i])
                            );
                            if (utils.isWin()) {
                                importSrc = importSrc.replace(/\\/g, '/');
                            }
                            importTag += `<import name="${i}" src="${importSrc}.ux"></import>`;
                        }
                        
                        ux = importTag + ux;
                    }
                    ux = beautify.html(ux, {
                        indent: 4,
                        'wrap-line-length': 100
                    });
                    
                    if (sourcePath.indexOf('components' ) > 0){
                        queue.push({
                            code: beautify.js(result.code.replace('console.log(nanachi)', 'export {React}')),
                             
                            path:  utils.updatePath(sourcePath, config.sourceDir, 'dist') 
                        });
                        let reg = utils.isWin() ? /components\\(\w+)/ :  /components\/(\w+)/;
                        var componentName =  sourcePath.match(reg)[1];
                        result.code = `import ${componentName}, { React } from './index.js';
                        export default  React.registerComponent(${componentName}, '${componentName}');`;
                    }
                    //假设存在<script>
                    ux += `
                        <script>
                            ${beautify.js(result.code)}
                        </script>`;
                    if (uxFile.cssType) {
                        //假设存在<style>
                        let {cssType, cssPath} = uxFile;
                        styleCompilerMap[cssType](cssPath)
                            .then((res)=>{
                                let {code} = res;
                                //当前样式文件代码要打包到ux中，样式中@import依赖打包成样式单文件
                                ux += `
                            <style lang="${cssType}">
                                ${beautify.css(code)}
                            </style>`;

                                queue.push({
                                    code: ux,
                                    path:  utils.updatePath(sourcePath, config.sourceDir, 'dist', 'ux') 
                                });
                            })
                            .catch((err)=>{
                                // eslint-disable-next-line
                                console.log(cssPath, '\n', err);
                            });
                        return;
                    }

                    queue.push({
                        code: ux,
                        path:  utils.updatePath(sourcePath, config.sourceDir, 'dist', 'ux') 
                    });
                } else {
                    queue.push({
                        code: result.code,
                        path:  utils.updatePath(sourcePath, config.sourceDir, 'dist'),
                        type: 'js'
                    });

                }
            });
        }
    );
}

module.exports = transform;

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md
