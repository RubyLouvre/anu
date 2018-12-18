const postCss = require('postcss');
const varReg = /@{?([a-zA-Z0-9-_.]+)}?/g;

const postCssPluginLessVar = postCss.plugin('postCssPluginLessVar', ()=> {
    function findVarValue(node, v) {
        let find = false;
        let value;
        // 遍历variable 找出当前节点下变量定义
        node.walkAtRules(rule => {
            if (v === rule.name) {
                find = true;
                value = rule.value;
            }
        });
        if (find && value) {
            return value;
        }
        // 没找到或到达根节点则退出递归
        if (!find && node.type !== 'root') {
            return findVarValue(node.parent, v);
        }
        return null;
    }

    return (root) => {
        root.walkDecls(decl => {
            // 取出变量定义
            const variables = decl.value && decl.value.match(varReg);
            if (variables && variables.length) {
                for (var i = 0, length = variables.length; i < length; i++) {
                    const key = variables[i].split('@')[1];
                    const value = findVarValue(decl.parent, key);
                    decl.value = decl.value.replace(variables[i], value);
                }
            }
        });
        // 移除变量声明
        root.walkAtRules(rule => {
            if (rule.variable) {
                rule.remove();
            }
        });
    };
});

module.exports = postCssPluginLessVar;