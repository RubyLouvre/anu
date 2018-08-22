const babel = require("babel-core");


let transform = {};
transform.byCode = (code)=>{
    result = babel.transform(code, {
        babelrc: false,
        plugins: [
            "transform-es2015-modules-commonjs"
        ]
    })
    return result;
}

transform.byPath = (path)=>{
    result = babel.transformFileSync(path, {
        babelrc: false,
        plugins: [
            "transform-es2015-modules-commonjs"
        ]
    })
    return result;
}


module.exports = transform;