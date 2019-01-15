const postCss = require('postcss');
const postCssLessEngine = require('postcss-less-engine-latest');
const utils = require('../../packages/utils');

exports.transformLess = async function (code, buildType, filePath) {
    let plugins = [
        postCssLessEngine(),
        require('../../packages/postcssPlugins/postCssPluginFixNumber'),
        require('../../packages/postcssPlugins/postCssPluginValidateStyle'),
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
    if (buildType !== 'quick') {
        // 只有快应用需要postCssPluginValidateStyle插件
        plugins.splice(2, 1);
    }
    const result = await postCss(plugins).process(
        code,
        {
            from: filePath,
            parser: postCssLessEngine.parser
        }
    );
    return result.css;
        
};
