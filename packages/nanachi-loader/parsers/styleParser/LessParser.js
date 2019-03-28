const StyleParser = require('./StyleParser');
const utils = require('../../../cli/packages/utils/index');
const { EXT_MAP } = require('../../../cli/consts/index');
const path = require('path');
const postcss = require('postcss');
const postCssLessEngine = require('postcss-less-engine-latest');
const getAliasFileManager = require('less-import-aliases');

const getAlias = ()=>{
    let cwd = process.cwd();
    let pkg = require(path.join( cwd, 'package.json' ));
    let alias = ( pkg.nanachi || pkg.mpreact || {} ).alias || {};
    let result = {};
    Object.keys(alias).forEach((key)=>{
        //The key has to be used without "at[@]" prefix
        //https://www.npmjs.com/package/less-import-aliases
        result[key.replace(/@/, '')] = path.join( cwd, alias[key]);
    });
    return result;
};

const deps = [];

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
                deps.push({
                    file: path.resolve(path.dirname(res.opts.from), utils.resolveStyleAlias(importer, path.dirname(res.opts.from)))
                });
            }
        });
    };
});

class LessParser extends StyleParser {
    constructor(props) {
        super(props);
        this._postcssPlugins = [
            require('postcss-import')({
                resolve: function(importer, baseDir){
                    //如果@import的值没有文件后缀
                    if (!/\.less$/.test(importer)) {
                        importer = importer + '.less';
                    }
                    //处理alias路径
                    return utils.resolveStyleAlias(importer, baseDir);
                },
                plugins: [
                    require('../../../cli/packages/postcssPlugins/postCssPluginRemoveRules') // 删除import文件的所有rules，保留@mixins、$variables、@functions等
                ]
            }),
            require('../../../cli/packages/postcssPlugins/postcssPluginLessParser'),
            require('../../../cli/packages/postcssPlugins/postcssPluginAddImport')({
                extName: EXT_MAP.get(path.extname(this.relativePath).replace(/^\./, '')),
                type: 'less',
            }),
            require('../../../cli/packages/postcssPlugins/postCssPluginFixNumber'),
            require('../../../cli/packages/postcssPlugins/postCssPluginValidateStyle')
        ];
        this._postcssOptions = {
            from: this.filepath,
            parser: require('postcss-less')
        };
    }
    // async parse() {
    //     if (/@import/.test(this.code)) {
    //         console.log('less parse');
    //         await postcss([postcssPluginResolveImports]).process(
    //             this.code,
    //             {
    //                 from: this.filepath,
    //                 syntax: require('postcss-less')
    //             }
    //         );
    //     }
    //     return await super.parse();
    // }
}

module.exports = LessParser;