const StyleParser = require('./StyleParser');
const calculateAlias = require('../../../packages/utils/calculateAlias');
const { MAP } = require('../../../consts/index');

class LessParser extends StyleParser {
    constructor(props) {
        super(props);
        this._postcssPlugins = this._postcssPlugins.concat([
            require('postcss-import')({
                resolve: function(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.less$/.test(importer)) {
                        importer = importer + '.less';
                    }
                    //处理alias路径
                    return calculateAlias(props.filepath, importer);
                },
                plugins: this.platform !== 'h5' ? [
                    require('../../../packages/postcssPlugins/postCssPluginRemoveRules') // 删除import文件的所有rules，保留@mixins、$variables、@functions等
                ] : []
            }),
            require('../../../packages/postcssPlugins/postCssPluginLessParser'),
            ...this.platform !== 'h5' ? [require('../../../packages/postcssPlugins/postCssPluginAddImport')({
                extName: MAP[this.platform]['EXT_NAME'][this.type],
                type: this.type,
            })] : [
                require('../../../packages/postcssPlugins/postCssPluginRpxToRem'),
                require('../../../packages/postcssPlugins/postCssPluginAddStyleHash')
            ],
            require('../../../packages/postcssPlugins/postCssPluginFixNumber'),
            require('../../../packages/postcssPlugins/postCssPluginValidateStyle'),
            require('../../../packages/postcssPlugins/postCssPluginTransformKeyFrames'),
            require('../../../packages/postcssPlugins/postCssPluginRemoveComments')
        ]);
        this._postcssOptions = {
            from: this.filepath,
            parser: require('postcss-less')
        };
    }
}

module.exports = LessParser;