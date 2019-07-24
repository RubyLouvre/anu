import postCss from 'postcss';

function rpxToRem(value: string) {
    return value.replace(/(-?\d*\.?\d+)rpx/g, function (match, numberStr) {

        const number = Number(numberStr.trim());
        return `${number/100}rem`;
    });
}

const postCssPluginRpxToRem = postCss.plugin('postcss-plugin-rpx-to-rem', ()=> {
    return (root) => {
        root.walkAtRules(atrule => {
            if (atrule.name === 'media') {
                atrule.params = rpxToRem(atrule.params);
            }
        });
        root.walkDecls(decl => {
            decl.value = rpxToRem(decl.value);
        });
    };
});

module.exports = postCssPluginRpxToRem;