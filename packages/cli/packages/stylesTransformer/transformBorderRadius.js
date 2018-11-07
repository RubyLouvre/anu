const R = require('ramda');
const {
    splitBySpaces,
    splitBySlash,
    pickValue,
    lengthIs,
    composeSingleValues,
    composeDoubleValues,
    composeTripleValues
} = require('./shared');

const splitBorderRadiusValues = R.compose(
    R.map(splitBySpaces),
    splitBySlash
);

const composeValuesGroup = R.cond([
    [lengthIs(1), composeSingleValues],
    [lengthIs(2), composeDoubleValues],
    [lengthIs(3), composeTripleValues],
    [R.T, R.identity]
]);

const selectProperStructure = R.ifElse(
    lengthIs(1),
    R.head,
    R.compose(
        R.map(R.join(' ')),
        R.apply(R.zip)
    )
);

const composeDeclarations = declaration =>
    R.compose(
        R.map(R.merge(R.clone(declaration))),
        R.map(R.zipObj(['property', 'value'])),
        R.zip([
            'border-top-left-radius',
            'border-top-right-radius',
            'border-bottom-right-radius',
            'border-bottom-left-radius'
        ]),
        selectProperStructure,
        R.map(composeValuesGroup),
        splitBorderRadiusValues,
        pickValue
    )(declaration);

const filterOldBorderRadius = R.reject(R.propEq('property', 'border-radius'));

const transformBorderRadius = declaration => {
    declaration.parent.declarations = R.concat(
        filterOldBorderRadius(declaration.parent.declarations),
        composeDeclarations(declaration)
    );
};

module.exports = transformBorderRadius;
