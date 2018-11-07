const R = require('ramda');
const { splitBySpaces, pickValue } = require('./shared');

const replaceComma = R.replace(/(,\s+)/g, ',');

const directionPrefix = direction => `border-${direction}`;

const generatePrefixes = R.curry((direction, property) =>
    R.join('-', R.concat([directionPrefix(direction)], [property]))
);

const composePrefixes = direction =>
    R.map(generatePrefixes(direction), ['width', 'style', 'color']);

const composeDeclarations = declaration =>
    R.compose(
        R.map(R.merge(declaration)),
        R.map(R.zipObj(['property', 'value'])),
        R.zip
    );

const composeValues = R.compose(
    splitBySpaces,
    replaceComma,
    pickValue
);

const splitBorder = (direction, declaration) => {
    const { parent } = declaration;
    const declarations = R.reject(
        R.propEq('property', directionPrefix(direction))
    )(parent.declarations);
    parent.declarations = R.concat(
        declarations,
        composeDeclarations(declaration)(
            composePrefixes(direction),
            composeValues(declaration)
        )
    );
};

module.exports = R.curry(splitBorder);
