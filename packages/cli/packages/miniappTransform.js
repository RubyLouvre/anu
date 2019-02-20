/* eslint-disable no-console */
/*!
 * 生成js文件, ux文件
 */
let babel = require('@babel/core');
let path = require('path');
let config = require('./config');
let quickFiles = require('./quickFiles');
let queue = require('./queue');
let mergeUx = require('./quickHelpers/mergeUx');
let utils = require('./utils');

function transform(sourcePath, resolvedIds, originalCode) {
    if (/^(React)/.test( path.basename(sourcePath)) ) {
        queue.push({
            code: originalCode,
            type: 'js',
            path: utils.updatePath(sourcePath, config.sourceDir, 'dist') 
        });
        return;
    }
    babel.transformFile(
        sourcePath,
        {
            babelrc: false,
            comments: false,
            plugins: [
                /**
                 * [babel 6 to 7] 
                 * v6 default config: ["plugin", { "loose": true }]
                 * v7 default config: ["plugin"]
                 */
                [
                    require('@babel/plugin-proposal-class-properties'),
                    { loose: true }
                ],
                require('@babel/plugin-syntax-jsx'),
                [
                    /**
                     * [babel 6 to 7] 
                     * In anticipation of the new decorators proposal implementation,
                     * we've decided to make it the new default behavior.
                     * This means that to continue using the current decorators syntax/behavior,
                     * you must set the legacy option as true.
                     */
                    require('@babel/plugin-proposal-decorators'),
                    {
                        legacy: true
                    }
                ],
                require('@babel/plugin-transform-async-to-generator'),
                require('@babel/plugin-proposal-object-rest-spread'),
                require('@babel/plugin-transform-template-literals'),
                ...require('./babelPlugins/transformMiniApp')(sourcePath),
                ...require('./babelPlugins/transformEnv'),
                require('./babelPlugins/injectRegeneratorRuntime'),
                require('./babelPlugins/transformIfImport'),
                require('./babelPlugins/trasnformAlias')(
                    {
                        sourcePath: sourcePath,
                        resolvedIds: resolvedIds
                    }
                )
            ]
        },
        async function(err, result) {
            if (err) {
                console.log('444444444444 err');
                //eslint-disable-next-line
                console.log('sourcePath:', sourcePath, '\n', err);
                process.exit(1);
            }
            // let babelPlugins = [
            //     ...require('./babelPlugins/transformEnv'),
            //     require('./babelPlugins/injectRegeneratorRuntime'),
            //     require('./babelPlugins/trasnformAlias')(
            //         {
            //             sourcePath: sourcePath,
            //             resolvedIds: resolvedIds
            //         }
            //     )
            // ];
            //babel无transform异步方法
            // try {
            //     result = babel.transform(result.code, {
            //         babelrc: false,
            //         plugins: babelPlugins
            //     });
            //     console.log('666666666666');
            // } catch (err) {
            //     console.log('666666666666 catch (err)');
            //     //eslint-disable-next-line
            //     console.log(sourcePath, '\n', err);
            //     process.exit(1);
            // }
            //处理中文转义问题
            result.code = utils.decodeChinise(result.code);

            let queueData = {
                code: result.code,
                path: utils.updatePath(sourcePath, config.sourceDir, 'dist'),
                type: 'js'
            };
           
            if (config.buildType == 'quick' && quickFiles[sourcePath]) {
                const distPath = utils.updatePath(sourcePath, config.sourceDir, 'dist', 'ux');
                // 补丁 queue的占位符, 防止同步代码执行时间过长产生的多次构建结束的问题
                const placeholder = {
                    code: '',
                    path: distPath,
                    type: 'ux'
                };
                queue.push(placeholder);
                // 补丁 END
                
                //ux处理
                queueData = {
                    code: await mergeUx({
                        sourcePath: sourcePath,
                        result: result
                    }),
                    path: distPath,
                    type: 'ux'
                };
            } 

            queue.push(queueData);

        }
    );
}

module.exports = transform;

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md
