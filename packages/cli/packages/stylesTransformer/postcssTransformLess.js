/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const validateStyle = require('../validateStyle');
const utils = require('../utils');

const compileLessByPostCss = (filePath, originalCode)=>{
    return new Promise((resolved, reject)=>{
        postCss([
            require('../postcssPlugins/postCssPluginLessMixins'),
            require('../postcssPlugins/postCssPluginLessVar'),
            require('postcss-import')({
                resolve(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.less$/.test(importer)) {
                        importer = importer + '.less';
                    }
                    //处理alias路径
                    return utils.resolveStyleAlias(importer, baseDir);
                }
            }),
            require('postcss-nested'), // 嵌套
            require('../postcssPlugins/postCssPluginLessFunction'),
            require('../postcssPlugins/postCssPluginLessMerge'),
            require('postcss-automath'),      //5px + 2 => 7px
            // require('postcss-nested-props'),   //属性嵌套
            require('../postcssPlugins/postCssPluginLessExtend'),
            require('../postcssPlugins/postCssPluginRemoveCommentsAndEmptyRule'),
        ])
            .process(
                originalCode || fs.readFileSync(filePath).toString(),
                {
                    from: filePath,   
                    parser: require('postcss-less'),
                }
            )
            .then((result)=>{
                let code = validateStyle(result.css);
                resolved({
                    code: code
                });
            })
            .catch((err)=>{
                reject(err);
            });
    });
    
};

module.exports = compileLessByPostCss;
