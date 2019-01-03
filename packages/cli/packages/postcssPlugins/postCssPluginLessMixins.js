const postCss = require('postcss');
const reg = /[a-zA-Z0-9-_.]+\s*\(.*\)$/;
const mixinVarReg = /\s*(@[a-zA-Z0-9-_."']+):\s*(.+)/;

const varReg = /@{?([a-zA-Z0-9-_."']+)}?/g;
const insertVarReg = /@{([a-zA-Z0-9-_."']+)}/g;
const removeQuoteReg = /^["|'](.*)["|']$/;

/**
 * 要放在postCssPluginLessVar前使用，因为要解析mixin传入的变量
 */
const postCssPluginLessMixins = postCss.plugin('postCssPluginLessMixins', () => {
    function findVarValue(node, key, mixinParams) {
        let result = { important: false };
        // 去掉变量定义首尾引号
        key = key.replace(removeQuoteReg, '$1');
        let find = false;
        let value;
        if (mixinParams && mixinParams['@' + key]) {
            return {
                value: mixinParams['@' + key]
            };
        }
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

    function parseVariable(variable, decl, isInsertVal, mixinParams) {
        const reg = isInsertVal ? insertVarReg : varReg;
        const variables = variable && variable.match(reg);

        if (variables && variables.length) {
            for (var i = 0, length = variables.length; i < length; i++) {
                let key;
                variables[i].replace(reg, function(a, b) {
                    key = b;
                });
                const { value, important } = findVarValue(decl.parent, key, mixinParams);
                variable = variable.replace(variables[i], value);
                // 添加标识，是由variable转换来的
                decl.isVar = true;
                if (important) { decl.important = important; }
            }
        }
        if (variable && variable.match(reg)) {
            variable = parseVariable(variable, decl, mixinParams);
        }
        return variable;
    }
    function findMixins(node, mixinName, params) {
        const mixinReg = new RegExp(`^${mixinName.replace(/\./g, '\\.')}\\s*(?:\\(.*\\))?$`);
        var find = false;
        var nodes = [];
        node.walkRules((rule) => {
            if (rule.selector.match(mixinReg)) {
                // eslint-disable-next-line
                const [p, state] = rule.selector.split('when');
                const mixinParams = getMixinParams(p);
                const match = matchMixinRule(mixinParams, params);
                if (match) {
                    if (mixinParams) {
                        match['@arguments'] = mixinParams.map(p => match[p.key] || p.value).join(' ');
                    }
                    find = true;
                    rule.walk(decl => {
                        if (decl.value) {
                            decl.value = parseVariable(decl.value, decl, false, match);
                        }
                        if (decl.selector) {
                            decl.selector = parseVariable(decl.selector, decl, false, match);
                        }
                        if (decl.params) {
                            decl.params = parseVariable(decl.params, decl, false, match);
                        }
                    });
                    nodes = nodes.concat(rule.nodes);
                }
            }
        });
        if (!find && node.type !== 'root') {
            return findMixins(node.parent, mixinName, params);
        }
        return nodes;
    }

    function matchMixinRule(mixinParams, mixinIncludeParams) {
        const res = {};
        if (mixinIncludeParams.length === 0 && mixinParams === null) {
            return res;
        }
        if (mixinIncludeParams && mixinParams) {
            if (mixinIncludeParams.length > mixinParams.length) {
                return false;
            }
        }
        const mixinNoParams = mixinIncludeParams && mixinIncludeParams.filter(p => {
            return !p.key;
        }) || [];
        
        let num = 0;
        for (var index = 0, length = mixinParams && mixinParams.length || 0; index < length; index++) {
            const p = mixinParams[index];
            if (p.key) {
                // match规则实现
                if (!p.key.match(/^@/) && p.key !== mixinIncludeParams[index].value) {
                    return false;
                }
                if (p.key.match(/^@/) && p.key !== '@_') {
                    let find = false;
                    mixinIncludeParams.forEach(includeP => {
                        if (p.key === includeP.key) {
                            res[p.key] = includeP.value;
                            find = true;
                        }
                    });
                    if (find) {
                        num++;
                    } else {
                        res[p.key] = mixinNoParams[index-num] && mixinNoParams[index-num].value || p.value;
                    }
                }
            }
        }
        return res;
    }

    function getMixinParams(str) {
        let matched = false;
        str = str.replace(/^.*?\((.+)\)$/g, function(a, b) {
            matched = true;
            return b;
        });
        if (!matched) {
            return null;
        }
        if (str.indexOf(';') !== -1) {
            str = str.split(';');
        } else {
            str = str.split(',');
        }
        return str.map(s => {
            s = s.trim();
            let key = s, value;
            
            s.replace(mixinVarReg, function(a, b, c) {
                key = b;
                value = c;
            });
            return {
                key,
                value
            };
        });
    }

    function getMixinIncludeParams(str) {
        str = str.replace(/^\(|\)$/g, ''); // 去掉首尾括号
        if (!str) {
            return [];
        }
        // 存在分号则参数以分号分割，否则以逗号分割
        if (str.indexOf(';') !== -1) {
            str = str.split(';');
        } else {
            str = str.split(',');
        }
        return str.map(s => {
            s = s.trim();
            let key, value = s;
            s.replace(mixinVarReg, function(a, b, c) {
                key = b;
                value = c;
            });
            return {
                key,
                value
            };
        });
    }

    return (root) => {
        root.walkAtRules((atrule) => {
            if (atrule.mixin) {
                const mixinName = atrule.raws.identifier + atrule.name;
                const nodes = findMixins(atrule.parent, mixinName, getMixinIncludeParams(atrule.params));
                for (var i = 0, length = nodes.length; i < length; i++) {
                    // 遍历找出的mixin定义节点，替换当前mixin，并传入important参数
                    const clonedNode = nodes[i].clone({mixin: false, important: atrule.important});
                    atrule.before(clonedNode);
                }
            }
        });
        root.walk((node) => {
            // 删除mixin调用语句
            if (node.mixin) {
                node.remove();
            }
            // 删除带括号的mixin定义语句
            if (node.selector && node.selector.match(reg) && !node.selector.match(/:extend/)) {
                node.remove();
            }
        });
    };
});

module.exports = postCssPluginLessMixins;