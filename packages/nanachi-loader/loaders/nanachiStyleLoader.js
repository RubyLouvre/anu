const path = require('path');
const postCss = require('postcss');

module.exports = function(code, map, meta) {
    const relativePath = path.relative(path.resolve(this.rootContext, 'source'), this.resourcePath);
    console.log(path.extname(relativePath));
    const callback = this.async();

    postCss([
        require('postcss-import')({
            // resolve: function(importer, baseDir){
            //     //如果@import的值没有文件后缀
            //     if (!/\.s[ca]ss$/.test(importer)) {
            //         importer = importer + '.scss';
            //     }
            //     //处理alias路径
            //     return utils.resolveStyleAlias(importer, baseDir);
            // },
            plugins: [
                require('../../cli/packages/postcssPlugins/postCssPluginRemoveRules') // 删除import文件的所有rules，保留@mixins、$variables、@functions等
            ]
        }),
        require('@csstools/postcss-sass'),
        // require('../postcssPlugins/postcssPluginAddImport')({
        //     extName,
        //     type: 'sass'
        // }), // 添加@import规则，小程序可以解析原有依赖
        require('../../cli/packages/postcssPlugins/postCssPluginFixNumber'), // 数字精度插件
        require('../../cli/packages/postcssPlugins/postCssPluginValidateStyle')
    ]).process(code, {
        from: this.resourcePath,
        syntax: require('postcss-scss')
    }).then(function(res) {
        // resolved({
        //     code: res.css,
        //     deps: utils.getDeps(res.messages)
        // });
        callback(null, [{
            isDefault: true,
            type: 'css',
            code: res.css,
            path: relativePath
        }], map, meta);
    }).catch(function(err) {
        console.error(err);
    });

    return;
};
