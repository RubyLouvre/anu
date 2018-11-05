const R = require('ramda');

const replaceRPXtoPX = declaration => {
    declaration.value = R.replace(
        /([-\d]+)(r?px)/g,
        (match, numberStr, unit) => {
            const number = Number(numberStr.trim());
            if (unit === 'rpx') {
                return ` ${number}px`;
            } else {
                return ` ${number * 2}px`;
            }
        }
    )(declaration.value);
};

module.exports = replaceRPXtoPX;
