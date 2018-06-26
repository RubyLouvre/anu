var visitor = require("./visitor");
const visitJsx = require("./visitjsx");
const declare = require('@babel/helper-plugin-utils').declare;
const syntaxClassProperties = require("babel-plugin-syntax-class-properties")
  .default;

/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
module.exports = declare(api => {
  return {
    inherits: syntaxClassProperties,
    visitor: Object.assign({}, visitor, visitJsx)
  };
});
