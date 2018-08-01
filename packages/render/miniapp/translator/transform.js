const syntaxClassProperties = require("babel-plugin-syntax-class-properties");
const babel = require("babel-core");
const visitor = require("./reactTranslate");
let modules = require("./modules");


/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function miniappPlugin(api) {
    return {
        inherits: syntaxClassProperties,
        visitor: visitor
    };
}


function transform(code, sourcePath) {
    modules.current = sourcePath.replace(process.cwd(), "");

    //console.log(sourcePath, '===sourcePath');

    if (/\/components\//.test(sourcePath)) {
        modules.componentType = "Component";
    } else if (/\/pages\//.test(sourcePath)) {
        modules.componentType = "Page";
    } else if (/app\.js/.test(sourcePath)) {
        modules.componentType = "App";
    }
    var result = babel.transform(code, {
        babelrc: false,
        plugins: [
            "syntax-jsx",
            //  "transform-react-jsx",
            "transform-decorators-legacy",
            "transform-object-rest-spread",
            miniappPlugin
        ]
    });

    result = babel.transform(result.code, {
        babelrc: false,
        plugins: [
            "transform-es2015-modules-commonjs"
        ]
    })

    var ret = Object.assign({}, modules);
    modules.reset();

    ret.js = result.code;
    return ret;
}

module.exports = transform;

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md
