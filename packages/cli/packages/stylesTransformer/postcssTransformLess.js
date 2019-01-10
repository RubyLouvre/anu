/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const utils = require('../utils');
const postCssLessEngine = require('postcss-less-engine');

const compileLessByPostCss = (filePath, originalCode)=>{
    return new Promise((resolved, reject)=>{
        let plugins = [
            postCssLessEngine(),
            require('../postcssPlugins/postCssPluginFixNumber'),
            require('../postcssPlugins/postCssPluginValidateStyle'),
            require('postcss-import')({
                resolve(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.less$/.test(importer)) {
                        importer = importer + '.less';
                    }
                    //处理alias路径
                    return utils.resolveStyleAlias(importer, baseDir);
                }
            })
        ];
        
        postCss(plugins)
            .process(
                originalCode || fs.readFileSync(filePath).toString(),
                {
                    from: filePath,
                    parser: postCssLessEngine.parser
                }
            )
            .then((result)=>{
                resolved({
                    code: result.css
                });
            })
            .catch((err)=>{
                reject(err);
            });
    });
    
};

module.exports = compileLessByPostCss;
