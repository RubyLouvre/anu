const chalk = require('chalk');
const R = require('ramda');
const { pickValue, splitBySpaces } = require('./shared');

const containsAuto = R.compose(
    R.any(R.equals('auto')),
    splitBySpaces,
    pickValue
);

const throwError = () => {
    throw new Error(
        chalk`在快应用中无法在 margin 中使用 auto 居中，请使用 flex 布局。`
    );
};

const validateMargin = R.ifElse(containsAuto, throwError, R.F);

module.exports = validateMargin;
