const StyleParser = require('./StyleParser');
const utils = require('../../../packages/utils/index');
const { MAP } = require('../../../consts/index');

class SassParser extends StyleParser {
    constructor(props) {
        super(props);
        this._postcssPlugins = [
            require('stylelint')({
                configFile: require.resolve(`../../../config/stylelint/.stylelint-${this.platform}.config.js`)
            }),
            require('../../../packages/postcssPlugins/postcssPluginReport'),
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
                    require('../../../packages/postcssPlugins/postCssPluginRemoveRules') // 删除import文件的所有rules，保留@mixins、$variables、@functions等
                ]
            }),
            require('@csstools/postcss-sass'),
            require('../../../packages/postcssPlugins/postcssPluginAddImport')({
                extName: MAP[this.platform]['EXT_NAME'][this.type],
                type: this.type
            }), // 添加@import规则，小程序可以解析原有依赖
            require('../../../packages/postcssPlugins/postCssPluginFixNumber'), // 数字精度插件
            require('../../../packages/postcssPlugins/postCssPluginValidateStyle'),
            require('../../../packages/postcssPlugins/postcssPluginTransformKeyFrames'),
            require('../../../packages/postcssPlugins/postcssPluginRemoveComments')
        ];
        this._postcssOptions = {
            from: this.filepath,
            syntax: require('postcss-scss')
        };
    }
}

module.exports = SassParser;