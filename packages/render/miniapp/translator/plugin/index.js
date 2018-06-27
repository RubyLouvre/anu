var visitor = require("./visitor");
const visitJsx = require("./visitjsx");
const syntaxClassProperties = require("babel-plugin-syntax-class-properties")
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
module.exports = function(api) {
  return {
    inherits: syntaxClassProperties,
    visitor: Object.assign({}, visitor, visitJsx)
  };
}
