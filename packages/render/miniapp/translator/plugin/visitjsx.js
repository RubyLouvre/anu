/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:36:48 
 * @Last Modified by:   hibad 
 * @Last Modified time: 2018-06-24 10:36:48 
 */
var t = require("babel-types");
const wxTags = require("./wx/tag");
const common = require("./common");
const generate = require("babel-generator").default;

module.exports = {
  JSXExpressionContainer(path) {
    common.convertJSXExpressionContainer(path);
  },
  JSXOpeningElement: {
    enter(path) {
      common.convertJSXOpeningElement(path);
    },
    exit(path) {
      const tag = path.node.name.name;
    }
  },
  JSXClosingElement: function(path) {
    if (!path.node.selfClosing) {
      const tag = path.node.name.name;
      path.node.name = t.identifier(wxTags[tag]);
    }
  }
};
