const postCss = require('postcss');

const postcssPluginRemoveRules = postCss.plugin('postcss-plugin-remove-rules', function() {
    return function(root) {
        root.walkRules(function(node) {
            node.remove();
        });
    };
});

module.exports = postcssPluginRemoveRules;