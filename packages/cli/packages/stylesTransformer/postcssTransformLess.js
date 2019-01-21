/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const postCss = require('postcss');
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

const compileLessByPostCss = (filePath, originalCode)=>{
    return new Promise((resolved, reject)=>{
        let plugins = [
            postCssLessEngine({
                plugins: [
                    new getAliasFileManager({
                        aliases: getAlias()
                    })
                ]
            }),
            require('../postcssPlugins/postCssPluginFixNumber'),
            require('../postcssPlugins/postCssPluginValidateStyle')
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
