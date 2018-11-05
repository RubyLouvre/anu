/* eslint no-console: 0 */

const chalk = require('chalk');
const R = require('ramda');

const extractPropertyOfValue = R.prop('value');
const extractPropertyOfDeclaration = R.prop('property');

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

module.exports = generateProhibitValue;
