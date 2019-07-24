import postCss from 'postcss';
import less from 'less';

const postCssPluginLessParser = postCss.plugin('postcss-plugin-less-parser', function() {
    return async function(root, res) {
        const { css } = await less.render(root.toString());
        res.root = postCss.parse(css);
    };
});

module.exports = postCssPluginLessParser;