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
                    // 如果父节点也是extend类型，该extend属性已经解析过
                    if (node.extend) {
                        return;
                    }
                }
                // 获取extend选择器
                // 解析.a:extend(.b) { color: red }形式
                const extendSelectors = parseExtendSelector(node.selector);
                node.selector = node.selector.replace(removeExtendReg, '');
                
                extendSelectors.forEach(extendSelector => {
                    // 遍历node 取出&:extend(.d)形式，放入extendSelector对象中
                    node.walkDecls((decl) => {
                        if (decl.extend) {
                            const selectors = parseExtendSelector(':' + decl.value);
                            selectors.forEach(selector => {
                                extendSelector.to = extendSelector.to.concat(selector.to);
                            });
                        }
                    });
                    extendSelector.to && extendSelector.to.forEach(selector => {
                        const isAll = selector.match(isAllReg) ? true : false;
                        if (isAll) {
                            selector = selector.replace(isAllReg, '');
                        }
                        // 从父节点查找要extend的规则
                        node.parent.each((node) => {
                            // 如果遇到@media，向下一级查找
                            if (node.type === 'atrule' && !node.hasOwnProperty('variable') && node.name === 'media') {
                                node.each((child) => {
                                    findRule(child);
                                });
                            }
                            function findRule(n) {
                                if (n.type === 'rule') {
                                    if (isAll) {
                                        if (parseSelector(n.selector).find(s => (s.match(selector)))) {
                                            n.selector += `, ${parseSelector(n.selector).map((s) => (s.replace(new RegExp(selector, 'g'), extendSelector.from)))}`;
                                        }
                                    } else {
                                        if (parseSelector(n.selector).find(s => (s === selector))) {
                                            n.selector += `, ${extendSelector.from}`;
                                        }
                                    }
                                }
                            }
                            findRule(node);
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
