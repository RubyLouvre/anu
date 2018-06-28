var visitor = require("./visitor");
const syntaxClassProperties = require("babel-plugin-syntax-class-properties")
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
module.exports = function(api) {
  return {
    inherits: syntaxClassProperties,
    visitor:  visitor
  };
}

// https://github.com/NervJS/taro/tree/master/packages/taro-cli
// https://blog.csdn.net/liangklfang/article/details/54879672
// https://github.com/PepperYan/react-miniapp/blob/master/scripts/transform.js
// https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md