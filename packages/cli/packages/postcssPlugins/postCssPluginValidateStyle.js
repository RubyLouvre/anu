const postCss = require('postcss');
const chalk = require('chalk');
const config = require('../config');
const parser = require('postcss-selector-parser');

function parseSelector(css) {
    let result = [];
    parser((selector) => {
        if (selector.nodes && selector.nodes.length) {
            // 遍历选择器
            for (var i = 0, length = selector.nodes.length; i < length; i++) {
                result = result.concat(selector.nodes[i].toString().split(/\s+/));
            }
        }
    }).processSync(css, {
        lossless: false
    });
    return result;
}

function rpxToPx(value) {
    return value.replace(/(-?\d*\.?\d+)(r?px)/g, function(match, numberStr, unit) {
        
        const number = Number(numberStr.trim());
        if (unit === 'rpx') {
            return `${number}px`;
        } else {
            return `${number * 2}px`;
        }
    });
}

function validateMargin(decl) {
    if (decl.value.indexOf('auto') !== -1) {
        // eslint-disable-next-line
        console.warn(
            chalk.yellow`在快应用中无法在 margin 中使用 auto 居中，请使用 flex 布局。`
        );
    }
}

function splitBorder(decl) {
    const properties = ['width', 'style', 'color'];
    let values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
    if (values) {
        if (values.length > 3) {
            // eslint-disable-next-line
            console.warn(
                chalk`{red ${decl.prop}} 参数个数错误, {red ${values}, }` + 
                    chalk` 只保留前三个参数 ({cyan ${values.slice(0, 3)}})`
            );
            values = values.slice(0, 3);
        }
        values.map((value, index) => {
            const res = {};
            const prop = decl.prop + '-' + properties[index];
            res[prop] = value;
            decl.cloneBefore(postCss.decl({prop, value}));
        });
        decl.remove();
    }
}

function generateConflictDeclarations(declName, conflictRegex) {
    return (decl) => {
        const parent = decl.parent;
        parent.each((node) => {
            if (conflictRegex.test(node.prop)) {
                // eslint-disable-next-line
                console.log(
                    chalk`if {red ${declName}} is set, {red ${node.prop}} will be removed.`
                );
                node.remove();
            }
        });
    };
}

function generateProhibitValue(declName, prohibitRegex) {
    return (decl) => {
        if (prohibitRegex.test(decl.value)) {
            // eslint-disable-next-line
            console.log(
                chalk`Remote resource is not supported in {cyan ${declName}}, ` +
                    chalk`supplied {red ${decl.value}} will be removed.`
            );
            decl.remove();
        }
    };
}

function transformBorderRadius(decl) {
    const props = [
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius'
    ];
    const values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
    let res = values;
    if (values.length > 4) {
        // eslint-disable-next-line
        console.warn(
            chalk`{red ${decl.prop}} 参数个数错误, {red ${values}, }`
        );
        return;
    }
    switch (values.length) {
        case 1: 
            res = transformSingle(values);
            break;
        case 2: 
            res = transformDouble(values);
            break;
        case 3: 
            res = transformTriple(values);
            break;
        default:
            break;
    }
    res.forEach((value, index) => {
        decl.cloneBefore(postCss.decl({
            prop: props[index],
            value
        }));
    });
    decl.remove();
}
function transformBackground(decl) {
    const value = decl.value;
    let match = [
        /^#[a-zA-Z0-9]{3,6}$/i,   //16进制
        /^[a-z]{3,}$/i            //语意化颜色 [ blue | green | ...]
    ];
    for (let i = 0; i < match.length; i++){
        if (match[i].test(value)) {
            decl.prop = 'background-color';
            break;
        }
    }
}

function transformSingle(values) {
    return [values[0], values[0], values[0], values[0]];
}

function transformDouble(values) {
    return [values[0], values[1], values[0], values[1]];
}

function transformTriple(values) {
    return [values[0], values[1], values[2], values[1]];
}

const visitors = {
    'border-style'(decl) {
        const match = decl.value.match(/[a-z]+/gi);
        if (match && match.length > 1) {
            // eslint-disable-next-line
            console.log(
                chalk`{red border-style} should only have one value, got {red ${decl.value}},` +
                    chalk` only keeps the first value ({cyan ${match[0]}})`
            );
            decl.value = match[0];
        }
    },
    'border-radius'(decl) {
        generateConflictDeclarations(
            'border-radius',
            /border-(left|bottom|right|top)-(color|width)/i
        )(decl);
        transformBorderRadius(decl);
    },
    'background': (decl)=>{
        generateConflictDeclarations(
            'background',
            /(background|border)-color/i
        )(decl);
        transformBackground(decl);
    },
    'background-image'(decl) {
        generateConflictDeclarations(
            'background-image',
            /(background|border)-color/i
        )(decl);
        generateProhibitValue(
            'background-image',
            /url\(['"]https?:\/\/\S+['"]\)/i
        )(decl);
    },
    margin: validateMargin,
    'border-left': splitBorder,
    'border-right': splitBorder,
    'border-bottom': splitBorder,
    'border-top': splitBorder
};

const postCssPluginValidateStyle = postCss.plugin('postcss-plugin-validate-style', ()=> {
    return (root) => {
        if (config.buildType === 'quick') {
            root.walkAtRules(atrule => {
                if (atrule.name === 'media') {
                    atrule.params = rpxToPx(atrule.params);
                }
            });
            root.walkDecls(decl => {
                if (visitors[decl.prop]) {
                    visitors[decl.prop](decl);
                }
                decl.value = rpxToPx(decl.value);
            });
        }
        root.walkRules(rule => {
            const selectors = parseSelector(rule.selector);
            const patchComponents = config[config.buildType].patchComponents || [];
            patchComponents.forEach(comp => {
                if (selectors.indexOf(comp) !== -1) {
                    // eslint-disable-next-line
                    console.warn(
                        chalk`补丁组件{red ${comp}}不支持标签选择器`
                    );
                }
            });
            
        });
    };
});

module.exports = postCssPluginValidateStyle;