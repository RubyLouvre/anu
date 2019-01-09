
const postCss = require('postcss');

function fround(value, numPrecision) {
    return (numPrecision) ? Number((value + 2e-16).toFixed(numPrecision)) : value;
}

function fixNumber(value) {
    return value.replace(/(-?\d*\.?\d+)/g, function(match, numberStr) {
        const numPrecision = 8;
        const number = fround(Number(numberStr.trim()), numPrecision);
        return number;
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