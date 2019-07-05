const postCss = require('postcss');
const path = require('path');
const utils = require('../utils');
const parser = require('postcss-selector-parser');

const postCssPluginAddStyleHash = postCss.plugin('postcss-plugin-add-style-hash', function() {
    return function(root, res) {
        const styleHash = utils.getStyleNamespace(path.dirname(res.opts.from));
        root.walkRules(rule => {
            if (rule.selector && rule.parent.type !== 'atrule') {
                rule.selector = parser((selector) => {
                    selector.walk(s => {
                        if (s.type === 'selector') {
                            s.nodes.unshift(parser.attribute({attribute: styleHash}));
                        }
                    });
                }).processSync(rule.selector, {
                    lossless: false
                });
            }
        });
    };
});

module.exports = postCssPluginAddStyleHash;