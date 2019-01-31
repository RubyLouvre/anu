const postCss = require('postcss');
const path = require('path');
const utils = require('../utils');

const postcssPluginAddImport = postCss.plugin('postcss-plugin-add-import', function({ extName } = {}) {
    return function(root, res) {
        const deps = utils.getDeps(res.messages);
        function getRelativeImportPath(dirname, filepath) {
            return '\'' + path.relative(dirname, filepath)
                .replace(/\.s[ca]ss$/, `.${extName || 'scss' }`)
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

module.exports = postcssPluginAddImport;