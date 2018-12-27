const postCss = require('postcss');
const varReg = /@{?([a-zA-Z0-9-_."']+)}?/g;
const removeQuoteReg = /^["|'](.*)["|']$/;

const postCssPluginLessVar = postCss.plugin('postCssPluginLessVar', ()=> {
    function findVarValue(node, key) {
        let result = { important: false };
        // 去掉变量定义首尾引号
        key = key.replace(removeQuoteReg, '$1');
        let find = false;
        let value;
        // 遍历variable 找出当前节点下变量定义
        node.each(node => {
            if (node.variable && key === node.name) {
                find = true;
                value = node.value.trim();
            }
        });
        if (find && value) {
            value = value.replace(/\s*!important$/, function() {
                result.important = true;
                return '';
            });
            result.value = value;
        }
        // 没找到或到达根节点则退出递归
        if (!find && node.type !== 'root') {
            result = findVarValue(node.parent, key);
        }

        return result;
    }

    function parseVariable(variable, decl) {
        const variables = variable && variable.match(varReg);

        if (variables && variables.length) {
            for (var i = 0, length = variables.length; i < length; i++) {
                let key;
                variables[i].replace(varReg, function(a, b) {
                    key = b;
                });
                const { value, important } = findVarValue(decl.parent, key);
                variable = variable.replace(variables[i], value);
                // 添加标识，是由variable转换来的
                decl.isVar = true;
                if (important) { decl.important = important; }
            }
        }
        if (variable && variable.match(varReg)) {
            variable = parseVariable(variable, decl);
        }
        return variable;
    }

    return (root) => {
        // 解析变量声明
        root.walkDecls(decl => {
            // 转换变量的key
            decl.prop = parseVariable(decl.prop, decl);
            // 转换变量的value
            decl.value = parseVariable(decl.value, decl);
        });
        // 解析插值变量
        root.walkRules(rule => {
            rule.selector = parseVariable(rule.selector, rule);
        });
        
        root.walkAtRules(atrule => {
            // import语句
            if (atrule.import) {
                atrule.filename = atrule.params = parseVariable(atrule.params, atrule);
            }
        });
    };
});

module.exports = postCssPluginLessVar;