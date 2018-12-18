const R = require('ramda');

const replaceRPXtoPX = declaration => {
    if (declaration.type === 'comment') return; //不解析注释节点
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
