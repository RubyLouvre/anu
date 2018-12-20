const postCss = require('postcss');
const varReg = /@{?([a-zA-Z0-9-_."']+)}?/g;
const removeQuoteReg = /^["|'](.*)["|']$/;

const postCssPluginLessVar = postCss.plugin('postCssPluginLessVar', ()=> {
    function findVarValue(node, key) {
        // 去掉变量定义首尾引号
        key = key.replace(removeQuoteReg, function(a, b){
            return b;
        });
        let find = false;
        let value;
        // 遍历variable 找出当前节点下变量定义
        node.each(node => {
            if (node.variable && key === node.name) {
                find = true;
                value = node.value;
            }
        });
        if (find && value) {
            return value;
        }
        // 没找到或到达根节点则退出递归
        if (!find && node.type !== 'root') {
            return findVarValue(node.parent, key);
        }
        return null;
    }

    function parseVariable(variable, decl) {
        const variables = variable && variable.match(varReg);

        if (variables && variables.length) {
            for (var i = 0, length = variables.length; i < length; i++) {
                const key = variables[i].split('@')[1];
                const value = findVarValue(decl.parent, key);
                variable = variable.replace(variables[i], value);
            }
        }
        if (variable && variable.match(varReg)) {
            variable = parseVariable(variable, decl);
        }
        return variable;
    }

    return (root) => {
        root.walkDecls(decl => {
            // 取出变量定义
            decl.value = parseVariable(decl.value, decl);
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