import postCss from 'postcss';
import config from '../../config/config';

const postCssPluginTransformKeyFrames = postCss.plugin('postcss-plugin-transform-keyframes', function() {
    return function(root) {
        if (config.buildType !== 'quick') {
            return;
        }
        root.walkAtRules(atrule => {
            if (atrule.name === 'keyframes') {
                atrule.walkRules((rule) => {
                    const rules = rule.selector.split(/\s*,\s*/);
                    rules.forEach(r => {
                        rule.cloneBefore(postCss.rule({
                            selector: r,
                            nodes: rule.nodes
                        }));
                    });
                    rule.remove();
                });
            }
        });
    };
});

module.exports = postCssPluginTransformKeyFrames;