const R = require('ramda');

const pickProperty = R.prop('property');

const pickValue = R.prop('value');

const splitBySpaces = R.compose(
    R.split(/\s+/),
    R.trim
);

const splitBySlash = R.compose(
    R.split(/\//),
    R.trim
);

const lengthIs = count =>
    R.compose(
        R.equals(count),
        R.length
    );

const composeSingleValues = R.compose(
    R.repeat(R.__, 4),
    R.head
);

const composeDoubleValues = values =>
    R.append(R.last(values))(R.append(R.head(values), values));

const composeTripleValues = values => R.append(values[1], values);

module.exports = {
    pickProperty,
    pickValue,
    splitBySpaces,
    splitBySlash,
    lengthIs,
    composeSingleValues,
    composeDoubleValues,
    composeTripleValues
};
