import postCss from 'postcss';

const postCssPluginRemoveRules = postCss.plugin('postcss-plugin-remove-rules', function() {
    return function(root) {
        root.each(node => {
            // 删除最上层的所有rules
            if (node.type === 'rule') {
                node.remove();
            }
            // 删除@keyframes
            if (node.type === 'atrule' && node.name === 'keyframes') {
                node.remove();
            }
        });
    };
});

module.exports = postCssPluginRemoveRules;