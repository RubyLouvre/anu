import postCss from 'postcss';

const postCssPluginRemoveComments = postCss.plugin('postcss-plugin-remove-comments', function() {
    return function(root) {
        root.walkComments(function(node) {
            node.remove();
        });
    };
});

module.exports = postCssPluginRemoveComments;