/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const config = require('../config');
const utils = require('../utils');
const extName = config[config['buildType']].styleExt;

const compileSassByPostCss = (filePath, originalCode)=>{
    return new Promise((resolved, reject)=>{
        postCss([
            require('postcss-import')({
                resolve: function(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.s[ca]ss$/.test(importer)) {
                        importer = importer + '.scss';
                    }
                    //处理alias路径
                    return utils.resolveStyleAlias(importer, baseDir);
                },
                plugins: [
                    require('../postcssPlugins/postCssPluginRemoveRules') // 删除import文件的所有rules，保留@mixins、$variables、@functions等
                ]
            }),
            require('@csstools/postcss-sass'),
            require('../postcssPlugins/postcssPluginAddImport')({
                extName,
                type: 'sass'
            }), // 添加@import规则，小程序可以解析原有依赖
            require('../postcssPlugins/postCssPluginFixNumber'), // 数字精度插件
            require('../postcssPlugins/postCssPluginValidateStyle'),
            require('../postcssPlugins/postcssPluginTransformKeyFrames'),
            require('../postcssPlugins/postcssPluginRemoveComments')
        ]).process(originalCode || fs.readFileSync(filePath).toString(), {
            from: filePath,
            syntax: require('postcss-scss')
        }).then(function(res) {
            resolved({
                code: res.css,
                deps: utils.getDeps(res.messages)
            });
        }).catch(function(err) {
            reject(err);
        });
    });
};

module.exports = compileSassByPostCss;
