import postCss from 'postcss';
import * as path from 'path';
import utils from '../utils';
import parser from 'postcss-selector-parser';

const postCssPluginAddStyleHash = postCss.plugin('postcss-plugin-add-style-hash', function() {
    return function(root, res) {
        const styleHash = utils.getStyleNamespace(path.dirname(res.opts.from));
        root.walkRules(rule => {
            if (rule.selector && rule.parent.type !== 'atrule') {
                rule.selector = parser((selector) => {
                    selector.walk(s => {
                        if (s.type === 'selector' && s.parent.type !== 'pseudo') {
                            s.nodes.unshift(parser.attribute({
                                attribute: styleHash
                            } as any));
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