const generate = require("babel-generator").default;
const prettifyXml = require("prettify-xml");
const logic = require("./logic");
const wxmlHelper = require("./wxml");

/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} path ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */

module.exports = function render(path, type, componentName, modules) {
  var expr = path.node.body.body[0];
  if (expr && expr.type == "ReturnStatement") {
    //   var block = logic(expr.argument);//logic最后会返回一个<block>或jsx
    var jsx = generate(expr.argument).code
    var wxml = wxmlHelper(jsx).replace(/;$/, "");
    if (modules.componentType === "Component") {
      wxml = `<template name="${componentName}">${wxml}</template>`;
    }
    wxml = prettifyXml(wxml, {
      indent: 2
    })

    for (var i in modules.importComponents) {
      if (modules.usedComponents[i]) {
        wxml = `<import src="${modules.importComponents[i]}.wxml" />\n` + wxml;
      }
    }
    modules.set("wxml", wxml); //path.node.params
  } else {
    var msg = type + componentName;
    var statement =
      "不能有其他语句。你可以在里面使用三元表达式a?b:c或&&实现条件分支";
    if (type === "有状态组件") {
      msg += "的render方法只能存在return语句，" + statement;
    } else {
      msg += "的函数体必须立即return, " + statement;
    }
    throw msg;
  }
};
