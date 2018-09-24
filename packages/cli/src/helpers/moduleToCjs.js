const babel = require('babel-core');

let transform = {};
transform.byCode = code => {
    return babel.transform(code, {
        babelrc: false,
        plugins: ['transform-es2015-modules-commonjs']
    });
};

transform.byPath = path => {
    return babel.transformFileSync(path, {
        babelrc: false,
        plugins: ['transform-es2015-modules-commonjs']
    });
};

module.exports = transform;
