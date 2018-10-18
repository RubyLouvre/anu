/*!
 * 
 * 这是用检测用户写的样式表是否符合快应用的要求
 */

/* eslint no-console: 0 */
const css = require('css');
const R = require('ramda');
const chalk = require('chalk');

const extractPropertyOfDeclaration = R.prop('property');
const extractPropertyOfValue = R.prop('value');
const gtOne = R.gt(1);
const shouldReturn = R.equals(0);

const generateConflictDeclarations = (
    declarationName,
    conflictRegex
) => declaration => {
    const parent = declaration.parent;
    const declarations = parent.declarations;
    const properties = declarations.map(extractPropertyOfDeclaration);
    const filter = s => conflictRegex.test(s);
    const rejectedProperties = R.filter(filter)(properties);

    if (shouldReturn(rejectedProperties.length)) return;

    console.log(
        chalk`if {red ${declarationName}} is set, {red ${rejectedProperties.join(
            ', '
        )}} will be removed.`
    );

    rejectedProperties.forEach(property => {
        const index = declarations.findIndex(
            R.compose(
                R.equals(property),
                extractPropertyOfDeclaration
            )
        );
        parent.declarations = R.remove(index, 1, declarations);
    });
};

const generateProhibitValue = (
    declarationName,
    prohibitRegex
) => declaration => {
    const parent = declaration.parent;
    const declarations = parent.declarations;
    if (prohibitRegex.test(extractPropertyOfValue(declaration))) {
        console.log(
            chalk`Remote resource is not supported in {cyan ${declarationName}}, ` +
                chalk`supplied {red ${declaration.value}} will be removed.`
        );
        const index = declarations.findIndex(
            R.compose(
                R.equals(declaration.property),
                extractPropertyOfDeclaration
            )
        );
        parent.declarations = R.remove(index, 1, declarations);
    }
};

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
    const ast = css.parse(code);
    const rules = ast.stylesheet.rules;
    rules.forEach(rule => {
        if (!rule.declarations) return;
        rule.declarations.forEach(declaration => {
            if (visitors[declaration.property]) {
                visitors[declaration.property](declaration);
            }
        });
    });
    return css.stringify(ast);
};
