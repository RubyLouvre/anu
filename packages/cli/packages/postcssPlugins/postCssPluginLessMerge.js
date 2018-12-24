const postCss = require('postcss');

const mergeReg = /\+_?$/;

function mergeNode(node, next) {
    if (!next) {
        return;
    }
    if (node.prop === next.prop) {
        if (node.prop.match(/\+$/)) {
            node.value += ', ' + next.value;
        }
        if (node.prop.match(/\+_$/)) {
            node.value += ' ' + next.value;
        }
        mergeNode(node, next.next());
        next.remove();
    } else {
        mergeNode(node, next.next());
    }
}

const postCssPluginLessMerge = postCss.plugin('postCssPluginLessMerge', () => {
    return (root) => {
        root.walkDecls((decl) => {
            if (decl.prop.match(mergeReg)) {
                mergeNode(decl, decl.next());
                decl.prop = decl.prop.replace(mergeReg, '');
            }
        });
    };
});

module.exports = postCssPluginLessMerge;