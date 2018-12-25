const postCss = require('postcss');
const reg = /[a-zA-Z0-9-_.]+\s*\(.*\)$/;
const mixinVarReg = /\s*(@[a-zA-Z0-9-_."']+):\s*(.+)/;

/**
 * 要放在postCssPluginLessVar前使用
 */
const postCssPluginLessMixins = postCss.plugin('postCssPluginLessMixins', () => {
    function findMixins(node, mixinName, params) {
        const mixinReg = new RegExp(mixinName + '\\s*(?:\\(.*\\))?$');
        var find = false;
        var nodes = [];
        function extractVar(variable, obj) {
            const varReg = /(@{?[a-zA-Z0-9-_."']+}?)/g;
            const variables = variable && variable.match(varReg);

            if (variables && variables.length) {
                for (var i = 0, length = variables.length; i < length; i++) {
                    let key;
                    variables[i].replace(varReg, function(a, b) {
                        key = b;
                    });
                    variable = variable.replace(variables[i], obj[key]);
                }
            }
            if (variable && variable.match(varReg)) {
                variable = extractVar(variable, obj);
            }
            return variable;
        }
        node.walkRules((rule) => {
            if (rule.selector.match(mixinReg)) {
                const match = matchMixinRule(getMixinParams(rule.selector), params);
                if (match) {
                    find = true;
                    rule.walk(decl => {
                        if (decl.value) {
                            decl.value = extractVar(decl.value, match);
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
        for (var index = 0, length = mixinParams.length; index < length; index++) {
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