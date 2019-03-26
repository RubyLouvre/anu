const StyleParser = require('./StyleParser');
const utils = require('../../../cli/packages/utils/index');
const { EXT_MAP } = require('../../../cli/consts/index');
const path = require('path');
const postcss = require('postcss');
const postCssLessEngine = require('postcss-less-engine-latest');
const getAliasFileManager = require('less-import-aliases');

const postcssPluginResolveImports = postcss.plugin('postcss-plugin-resolve-imports', () => {
    return (root, res) => {
        root.walkAtRules(atrule => {
            if (atrule.name === 'import' && atrule.import && atrule.params.match(/\(\s*reference\s*\)/)) {
                let importer = atrule.filename.trim().replace(/^['"](.*?)['"]$/, '$1');
                //如果@import的值没有文件后缀
                if (!/\.less$/.test(importer)) {
                    importer = importer + '.less';
                }
                //处理alias路径
                // deps.push({
                //     file: path.resolve(path.dirname(res.opts.from), utils.resolveStyleAlias(importer, path.dirname(res.opts.from)))
                // });
            }
        });
    };
});

class LessParser extends StyleParser {
    constructor(props) {
        super(props);
        this._postcssPlugins = [
            postCssLessEngine({
                plugins: [
                    new getAliasFileManager({
                        // aliases: getAlias()
                    })
                ]
            }),
            require('../postcssPlugins/postcssPluginAddImport')({
                // extName,
                type: 'less',
                // dependencies: deps
            }),
            require('../postcssPlugins/postCssPluginFixNumber'),
            require('../postcssPlugins/postCssPluginValidateStyle')
        ];
        this._postcssOptions = {
            from: this.filepath,
            parser: postCssLessEngine.parser
        };
    }
    static getParser({
        code,
        map,
        meta,
        filepath,
        platform
    }) {
        if (!this._instance) {
            this._instance = new LessParser({
                code,
                map,
                meta,
                filepath,
                platform
            });
        }
        return this._instance;
    }
}

module.exports = LessParser;