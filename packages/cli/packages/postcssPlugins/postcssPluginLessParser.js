const postcss = require('postcss');
const less = require('less');

const postcssPluginLessParser = postcss.plugin('postcss-plugin-less-parser', function() {
    return async function(root, res) {
        const { css } = await less.render(root.toString());
        res.root = postcss.parse(css);
    };
});

module.exports = postcssPluginLessParser;