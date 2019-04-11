const postCss = require('postcss');

const postcssPluginRemoveComments = postCss.plugin('postcss-plugin-remove-comments', function() {
    return function(root) {
        root.walkComments(function(node) {
            node.remove();
        });
    };
});

module.exports = postcssPluginRemoveComments;