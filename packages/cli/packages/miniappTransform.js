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
let validateStyle = require('./validateStyle');
let nodeSass = require('node-sass');
let cwd = process.cwd();

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
    //用户自定义alias与npm相对路径处理都作为alias配置
    let aliasMap = Object.assign(
        utils.updateCustomAlias(sourcePath, resolvedIds),
        utils.updateNpmAlias(sourcePath, resolvedIds)
    );
    
    //pages|app|components需经过miniappPlugin处理
    let miniAppPluginsInjectConfig = utils
        .getComponentOrAppOrPageReg()
        .test(sourcePath)
        ? [miniappPlugin]
        : [];

    
    babel.transformFile(
        sourcePath,
        {
            babelrc: false,
            plugins: [
                'syntax-jsx',
                'transform-decorators-legacy',
                'transform-object-rest-spread',
                'transform-async-to-generator',
                'transform-es2015-template-literals',
                asyncAwaitPlugin,
                ...miniAppPluginsInjectConfig,
                [
                    'module-resolver',
                    {
                        resolvePath(moduleName) {
                            if (!utils.isNpm(moduleName)) return;
                            //针对async/await语法依赖的npm路径做处理
                            if (/regenerator-runtime\/runtime/.test(moduleName)) {
                                //微信,百度小程序async/await语法依赖regenerator-runtime/runtime
                                let regeneratorRuntimePath =  utils.getRegeneratorRuntimePath(sourcePath);

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
                            return value;
                        }
                    }
                ]
            ]
        },
        function(err, result) {
            if (err) {
                // eslint-disable-next-line
                console.log(sourcePath, '\n', err);
            }

            //babel6无transform异步方法
            setImmediate(() => {
                let babelPlugins = [
                    [
                        //process.env.ANU_ENV
                        'transform-inline-environment-variables',
                        {
                            env: {
                                ANU_ENV: config['buildType'],
                                BUILD_ENV: process.env.BUILD_ENV
                            }
                        }
                    ],
                    'minify-dead-code-elimination'
                ];

                result = babel.transform(result.code, {
                    babelrc: false,
                    plugins: babelPlugins
                });
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
                                sourcePath,
                                path.resolve(cwd +'/'+ config.sourceDir + using[i])
                            );
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
                        var componentName =  sourcePath.match(/components\/(\w+)/)[1];
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
                        ux += `
<style lang="${uxFile.cssType}">
                            ${beautify.css(validateStyle(
        nodeSass.renderSync({
            data: uxFile.cssCode
        }).css.toString()
    ))}
</style>`;
                    }

                    queue.push({
                        code: ux,
                        path:  utils.updatePath(sourcePath, config.sourceDir, 'dist', 'ux') 
                    });
                } else {
                    queue.push({
                        code: result.code,
                        path:  utils.updatePath(sourcePath, config.sourceDir, 'dist')
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
