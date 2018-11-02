const R = require('ramda');
const postfixes = ['top', 'right', 'bottom', 'left'];

const splitValues = R.compose(
    R.split(/\s+/),
    R.trim,
    R.prop('value')
);

const composeDeclaration = declaration =>
    R.compose(
        R.merge(R.clone(declaration)),
        R.zipObj(['property', 'value'])
    );

const composeMultiDeclarations = R.curry((declaration, properties, values) =>
    R.compose(
        R.map(composeDeclaration(declaration)),
        R.zip
    )(properties, values)
);

const composeProperties = property =>
    R.map(postfix => `${property}-${postfix}`)(postfixes);

const composeSingleValues = R.compose(
    R.repeat(R.__, 4),
    R.head
);

const composeDoubleValues = values =>
    R.append(R.last(values))(R.append(R.head(values), values));

const composeTripleValues = values => R.append(values[1], values);

const lengthIs = count =>
    R.compose(
        R.equals(count),
        R.length
    );

const composeValues = R.cond([
    [lengthIs(1), composeSingleValues],
    [lengthIs(2), composeDoubleValues],
    [lengthIs(3), composeTripleValues],
    [R.T, R.identity]
]);

const deriveDeclarations = R.curry((property, declaration) =>
    R.compose(
        R.compose(
            composeMultiDeclarations(declaration),
            composeProperties
        )(property),
        composeValues,
        splitValues
    )(declaration)
);

const expandDeclarations = R.curry((declaration, property) => {
    const expandedDeclarations = deriveDeclarations(property)(declaration);
    const filteredDeclarations = R.reject(R.propEq('property', property))(
        declaration.parent.declarations
    );
    declaration.parent.declarations = R.concat(
        filteredDeclarations,
        expandedDeclarations
    );
});

module.exports = expandDeclarations;
