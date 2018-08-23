const syntaxClassProperties = require("babel-plugin-syntax-class-properties");
const babel = require("babel-core");
const visitor = require("./reactTranslate");
let helpers = require('./helpers');
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function miniappPlugin(api) {
    return {
        inherits: syntaxClassProperties,
        visitor: visitor,
        manipulateOptions(opts){//解析每个文件前执行一次
            var modules = opts.anu = {
                thisMethods: [],
                staticMethods: [],
                thisProperties: [],
                importComponents: {},//import xxx form path进来的组件
                usedComponents: {},//在<wxml/>中使用<import src="path">的组件
                customComponents: []//定义在page.json中usingComponents对象的自定义组件
            }
            modules.sourcePath = opts.filename;
            modules.current = opts.filename.replace(process.cwd(), "");
            if (/\/components\//.test(opts.filename)) {
                modules.componentType = "Component";
            } else if (/\/pages\//.test(opts.filename)) {
                modules.componentType = "Page";
            } else if (/app\.js/.test(opts.filename)) {
                modules.componentType = "App";
            }
        }
    };
}


function transform(sourcePath) {
    var result = babel.transformFileSync(sourcePath, {
        babelrc: false,
        plugins: [
            "syntax-jsx",
            "transform-decorators-legacy",
            "transform-object-rest-spread",
            miniappPlugin
        ]
    });

    return helpers.moduleToCjs.byCode(result.code).code
}

module.exports = transform;

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md