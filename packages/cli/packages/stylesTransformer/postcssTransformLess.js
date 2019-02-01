/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const config = require('../config');
const postCss = require('postcss');
const postCssLessEngine = require('postcss-less-engine-latest');
const getAliasFileManager = require('less-import-aliases');
const extName = config[config['buildType']].styleExt;

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

const postcssPluginResolveImports = postCss.plugin('postcss-plugin-resolve-imports', () => {
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

const compileLessByPostCss = (filePath, originalCode)=>{
    originalCode = originalCode || fs.readFileSync(filePath).toString();
    
    return new Promise(async (resolved, reject)=>{
        
        if (/@import/.test(originalCode)) {
            await postCss([postcssPluginResolveImports]).process(
                originalCode,
                {
                    from: filePath,
                    syntax: require('postcss-less')
                }
            );
        }
        
        postCss([
            postCssLessEngine({
                plugins: [
                    new getAliasFileManager({
                        aliases: getAlias()
                    })
                ]
            }),
            require('../postcssPlugins/postcssPluginAddImport')({
                extName,
                type: 'less',
                dependencies: deps
            }),
            require('../postcssPlugins/postCssPluginFixNumber'),
            require('../postcssPlugins/postCssPluginValidateStyle')
        ])
            .process(
                originalCode,
                {
                    from: filePath,
                    parser: postCssLessEngine.parser
                }
            )
            .then((result)=>{
                resolved({
                    code: result.css,
                    deps
                });
            })
            .catch((err)=>{
                reject(err);
            });
    });
    
};

module.exports = compileLessByPostCss;
