/*!
 * 生成js文件, ux文件
 */
let babel = require('babel-core');
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
    let transformFilePath = sourcePath;
    sourcePath = utils.resolvePatchComponentPath(sourcePath);
  
    babel.transformFile(
        transformFilePath,
        {
            babelrc: false,
            comments: false,
            plugins: [
                require('babel-plugin-syntax-jsx'),
                require('babel-plugin-transform-decorators-legacy').default,
                require('babel-plugin-transform-object-rest-spread'),
                require('babel-plugin-transform-es2015-template-literals'),
                ...require('./babelPlugins/transformMiniApp')(sourcePath),
                require('./babelPlugins/transformIfImport'),
                require('babel-plugin-transform-async-to-generator'),
                
            ]
        },
        async function(err, result) {
            if (err) {
                //eslint-disable-next-line
                console.log(transformFilePath, '\n', err);
            }
            let babelPlugins = [
                require('./babelPlugins/injectRegeneratorRuntime'),
                ...require('./babelPlugins/transformEnv'),
                require('./babelPlugins/trasnformAlias')(
                    {
                        sourcePath: sourcePath,
                        resolvedIds: resolvedIds
                    }
                )
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
            result.code = utils.decodeChinise(result.code);

            let queueData = {
                code: result.code,
                path: utils.updatePath(sourcePath, config.sourceDir, 'dist'),
                type: 'js'
            };
           
            if (config.buildType == 'quick' && quickFiles[sourcePath]) {
                //ux处理
                queueData = {
                    code: await mergeUx({
                        sourcePath: sourcePath,
                        result: result
                    }),
                    path: utils.updatePath(sourcePath, config.sourceDir, 'dist', 'ux'),
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
