/* eslint no-console: 0 */

const chalk = require('chalk');
const R = require('ramda');

const extractPropertyOfDeclaration = R.prop('property');
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

module.exports = generateConflictDeclarations;
