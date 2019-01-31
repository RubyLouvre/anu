/* eslint no-console: 0 */
const fs = require('fs');
const postCss = require('postcss');
const path = require('path');
const config = require('../config');
const utils = require('../utils');
const exitName = config[config['buildType']].styleExt;

const postcssPluginAddImport = postCss.plugin('postcss-plugin-add-import', function() {
    return function(root, res) {
        const deps = utils.getDeps(res.messages);
        function getRelativeImportPath(dirname, filepath) {
            return '\'' + path.relative(dirname, filepath)
                .replace(/\.s[ca]ss$/, `.${exitName || 'scss' }`)
                .replace(/(^\w)/, './$1') + 
                '\'';
        }
        if (!deps) {
            return;
        }
        deps.forEach(dep => {
            // 遍历依赖插入@import语句
            root.insertBefore(root.nodes[0], postCss.atRule({
                name: 'import',
                params: getRelativeImportPath(path.dirname(res.opts.from), dep.file)
            }));
        });
    };
});

const postcssPluginRemoveRules = postCss.plugin('postcss-plugin-remove-rules', function() {
    return function(root) {
        root.walkRules(function(node) {
            node.remove();
        });
    };
});

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
                    postcssPluginRemoveRules // 删除import文件的所有rules，保留@mixins、$variables、@functions等
                ]
            }),
            require('@csstools/postcss-sass'),
            postcssPluginAddImport, // 添加@import规则，小程序可以解析原有依赖
            require('../postcssPlugins/postCssPluginFixNumber'), // 数字精度插件
            require('../postcssPlugins/postCssPluginValidateStyle')
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
