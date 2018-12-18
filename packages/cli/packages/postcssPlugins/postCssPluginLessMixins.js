const postCss = require('postcss');
const reg = /[a-zA-Z0-9-_.]+\(\)$/;

const postCssPluginLessMixins = postCss.plugin('postCssPluginLessMixins', () => {
    function findMixins(node, mixinName) {
        const mixinReg = new RegExp(mixinName + '(?:\\(\\))?$');
        var find = false;
        var nodes = [];
        node.walkRules((rule) => {
            if (rule.selector.match(mixinReg)) {
                find = true;
                nodes = nodes.concat(rule.nodes);
            }
        });
        if (!find && node.type !== 'root') {
            return findMixins(node.parent, mixinName);
        }
        return nodes;
    }

    return (root) => {
        root.walkAtRules((atrule) => {
            if (atrule.mixin) {
                const mixinName = atrule.raws.identifier + atrule.name;
                const nodes = findMixins(atrule.parent, mixinName);
                for (var i = 0, length = nodes.length; i < length; i++) {
                    const clonedNode = nodes[i].clone({mixin: false});
                    atrule.cloneAfter(clonedNode);
                }
            }
        });
        root.walk((node) => {
            if (node.mixin) {
                node.remove();
            }
            if (node.selector && node.selector.match(reg)) {
                node.remove();
            }
            
        });
    }
});

module.exports = postCssPluginLessMixins;