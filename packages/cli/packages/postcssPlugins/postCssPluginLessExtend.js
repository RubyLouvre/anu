/**
 * less extend语法解析转义为css，在层级结构解析完后使用
 */
const postCss = require('postcss');
const parser = require('postcss-selector-parser');

const isAllReg = /\sall$/;
const removeExtendReg = /:extend\(.*?\)/g;

const postCssPluginLessExtend = postCss.plugin('postCssPluginLessExtend', () => {

    /**
     * 拆分selector为数组
     */
    function parseSelector(css) {
        const result = [];
        parser((selector) => {
            if (selector.nodes && selector.nodes.length) {
                // 遍历选择器
                for (var i = 0, length = selector.nodes.length; i < length; i++) {
                    result.push(selector.nodes[i].toString());
                }
            }
        }).processSync(css, {
            lossless: false
        });
        return result;
    }

    /**
     * extend selector转换器
     * .a:extend(.b, .c), .d:extend(.e), .f => [{from: .a, to: [.b, .c]}, {from: .d, to: [.e]}]
     */
    function parseExtendSelector(css) {
        const result = [];
        parser((selector) => {
            if (selector.nodes && selector.nodes.length) {
                // 遍历选择器
                for (var i = 0, length = selector.nodes.length; i < length; i++) {
                    const res = {};
                    const pseudos = [];
                    // 查找伪类
                    selector.nodes[i].walkPseudos((pseudo) => {
                        if (pseudo.value === ':extend') {
                            if (pseudo.nodes && pseudo.nodes.length) {
                                for (var i = 0, length = pseudo.nodes.length; i < length; i++) {
                                    const selector = pseudo.nodes[i].toString();
                                    pseudos.push(selector);
                                }
                            }
                        }
                    });
                   
                    res.from = selector.nodes[i].toString().replace(removeExtendReg, '');
                    res.to = pseudos;
                    result.push(res);
                }
            }
        }).processSync(css, {
            lossless: false
        });
        return result;
    }

    return (root) => {
        root.walk((node) => {
            if (node.extend && (node.selector || node.parent.selector)) {
                if (!node.selector) {
                    node = node.parent;
                }
                // 获取extend选择器
                // 解析.a:extend(.b) { color: red }形式
                const extendSelectors = parseExtendSelector(node.selector);
                node.selector = node.selector.replace(removeExtendReg, '');
                // 遍历extend选择器
                extendSelectors.forEach(extendSelector => {
                    node.walkDecls((decl) => {
                        if (decl.extend) {
                            const selectors = parseExtendSelector(':' + decl.value);
                            selectors.forEach(selector => {
                                extendSelector.to = extendSelector.to.concat(selector.to)
                            });
                        }
                    });
                    extendSelector.to && extendSelector.to.forEach(selector => {
                        const isAll = selector.match(isAllReg) ? true : false;
                        if (isAll) {
                            selector = selector.replace(isAllReg, '');
                        }
                        root.walkRules((rule) => {
                            if (isAll) {
                                const matchedRule = parseSelector(rule.selector).find(s => (s.match(selector)));
                                if (matchedRule) {
                                    rule.selector += `, ${matchedRule.replace(selector, extendSelector.from)}`;
                                }
                            } else {
                                if (parseSelector(rule.selector).find(s => (s === selector))) {
                                    rule.selector += `, ${extendSelector.from}`;
                                }
                            }
                            
                        });
                    });
                });
            }
        });
        root.walkDecls((decl) => {
            if (decl.extend) {
                decl.remove();
            }
        });
    };
});

module.exports = postCssPluginLessExtend;
