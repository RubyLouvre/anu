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
                    // 遍历找出的mixin定义节点，替换当前mixin，并传入important参数
                    const clonedNode = nodes[i].clone({mixin: false, important: atrule.important});
                    atrule.cloneAfter(clonedNode);
                }
            }
            
        });
        root.walk((node) => {
            // 删除mixin调用语句
            if (node.mixin) {
                node.remove();
            }
            // 删除带括号的mixin定义语句
            if (node.selector && node.selector.match(reg)) {
                node.remove();
            }
            
        });
    };
});

module.exports = postCssPluginLessMixins;