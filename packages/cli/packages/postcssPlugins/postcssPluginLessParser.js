const postcss = require('postcss');
const less = require('less');

const postCssPluginLessParser = postcss.plugin('postcss-plugin-less-parser', function() {
    return async function(root, res) {
        const { css } = await less.render(root.toString());
        res.root = postcss.parse(css);
    };
});

module.exports = postCssPluginLessParser;