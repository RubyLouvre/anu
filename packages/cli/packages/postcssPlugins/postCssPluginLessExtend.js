/**
 * less extend语法解析转义为css，在层级结构解析完后使用
 */
const postCss = require('postcss');
const parser = require('postcss-selector-parser');

const removeExtendReg = /:extend\(.*?\)/g;

const postCssPluginLessExtend = postCss.plugin('postCssPluginLessExtend', () => {

    /**
     * extend selector转换器
     * .a:extend(.b, .c), .d:extend(.e), .f => [{from: .a, to: [.b, .c]}, {from: .d, to: [.e]}]
     */
    function parseExtendSelector(selector) {
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
        }).processSync(selector, {
            lossless: false
        });
        return result;
    }

    return (root) => {
        root.walk((node) => {
            if (node.extend) {
                if (node.selector) {
                    // 获取extend选择器
                    // 解析.a:extend(.b) { color: red }形式
                    const extendSelectors = parseExtendSelector(node.selector);
                    node.selector = node.selector.replace(removeExtendReg, '');
                    // 遍历extend选择器
                    extendSelectors.forEach(extendSelector => {
                        node.walkDecls((decl) => {
                            if (decl.extend) {
                                const selector = parseExtendSelector(':' + decl.value)[0].to; // &:extend语法不可以有多个:extend
                                extendSelector.to = extendSelector.to.concat(selector);
                                decl.remove();
                            }
                        });
                        extendSelector.to && extendSelector.to.forEach(selector => {
                            root.walkRules((rule) => {
                                if (rule.selector === selector) {
                                    
                                    rule.selector += `, ${extendSelector.from}`;
                                }
                                
                            });
                        });
                    });
                }
                if (node.parent.selector) {
                    // 获取extend选择器
                    // 解析.a:extend(.b) { color: red }形式
                    const extendSelectors = parseExtendSelector(node.parent.selector);
                    node.parent.selector = node.parent.selector.replace(removeExtendReg, '');
                    // 遍历extend选择器
                    extendSelectors.forEach(extendSelector => {
                        node.parent.walkDecls((decl) => {
                            if (decl.extend) {
                                const selector = parseExtendSelector(':' + decl.value)[0].to; // &:extend语法不可以有多个:extend
                                extendSelector.to = extendSelector.to.concat(selector);
                                decl.remove();
                            }
                        });
                        extendSelector.to && extendSelector.to.forEach(selector => {
                            root.walkRules((rule) => {
                                if (rule.selector === selector) {
                                    
                                    rule.selector += `, ${extendSelector.from}`;
                                }
                                
                            });
                        });
                    });
                }
            }
        });
    };
});

module.exports = postCssPluginLessExtend;
