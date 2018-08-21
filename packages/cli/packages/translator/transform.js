const syntaxClassProperties = require("babel-plugin-syntax-class-properties");
const babel = require("babel-core");
const visitor = require("./reactTranslate");
let modules = require("./modules");
let helpers = require('./helpers');


/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function miniappPlugin(api) {
    return {
        inherits: syntaxClassProperties,
        visitor: visitor
    };
}


function transform(sourcePath) {
    modules.current = sourcePath.replace(process.cwd(), "");
    if (/\/components\//.test(sourcePath)) {
        modules.componentType = "Component";
    } else if (/\/pages\//.test(sourcePath)) {
        modules.componentType = "Page";
    } else if (/app\.js/.test(sourcePath)) {
        modules.componentType = "App";
    }
    
    var result = babel.transformFileSync(sourcePath, {
        babelrc: false,
        plugins: [
            "syntax-jsx",
            "transform-decorators-legacy",
            "transform-object-rest-spread",
            miniappPlugin
        ]
    });

    result = helpers.moduleToCjs.byCode(result.code)
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