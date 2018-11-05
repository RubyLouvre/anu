/*!
 * 
 * 这是用检测用户写的样式表是否符合快应用的要求
 */

/* eslint no-console: 0 */
const css = require('css');
const R = require('ramda');
const chalk = require('chalk');
const config = require('./config');
const generateProhibitValue = require('./stylesTransformer/generateProhibitValue');
const generateConflictDeclarations = require('./stylesTransformer/generateConflictDeclarations');
const replaceRPXtoPX = require('./stylesTransformer/replaceRPXtoPX');

const gtOne = R.gt(1);

const visitors = {
    'border-style'(declaration) {
        const { value: rawValue } = declaration;
        if (!rawValue) return rawValue;
        const value = rawValue.match(/[a-z]+/gi);

        if (gtOne(value.length)) {
            console.log(
                chalk`{red border-style} should only have one value, got {red ${rawValue}},` +
                    chalk` only keeps the first value ({cyan ${value[0]}})`
            );
            declaration.value = value[0];
        }
    },
    'border-radius': generateConflictDeclarations(
        'border-radius',
        /border-(left|bottom|right|top)-(color|width)/i
    ),
    background: generateConflictDeclarations(
        'background',
        /(background|border)-color/i
    ),
    'background-image'(declaration) {
        generateConflictDeclarations(
            'background-image',
            /(background|border)-color/i
        )(declaration);
        generateProhibitValue(
            'background-image',
            /url\(['"]https?:\/\/\S+['"]\)/i
        )(declaration);
    }
};

module.exports = function validateStyle(code) {
    if (config.buildType !== 'quick') return code;
    const ast = css.parse(code);
    const rules = ast.stylesheet.rules;
    rules.forEach(({ declarations = [] }) => {
        R.filter(R.propEq('type', 'declaration'))(declarations).forEach(
            declaration => {
                replaceRPXtoPX(declaration);
                if (visitors[declaration.property]) {
                    visitors[declaration.property](declaration);
                }
            }
        );
    });
    return css.stringify(ast);
};
