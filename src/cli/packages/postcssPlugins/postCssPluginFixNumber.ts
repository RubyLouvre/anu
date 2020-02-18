import postCss from 'postcss';

function fround(value: number, numPrecision: number) {
    return (numPrecision) ? Number((value + 2e-16).toFixed(numPrecision)) : value;
}

function fixNumber(value: string) {
    return value.replace(/(\s|^)(-?\d*\.?\d+)(\s|$)/g, function(match, before, numberStr, after) {
        const numPrecision = 8;
        const number = fround(Number(numberStr.trim()), numPrecision);
        return before + number + after;
    });
}

const postCssPluginFixNumber = postCss.plugin('postcss-plugin-fix-number', ()=> {
    return (root) => {
        root.walkAtRules(atrule => {
            if (atrule.name === 'media') {
                atrule.params = fixNumber(atrule.params);
            }
        });
        root.walkDecls(decl => {
            decl.value = fixNumber(decl.value);
        });
    };
});

module.exports = postCssPluginFixNumber;