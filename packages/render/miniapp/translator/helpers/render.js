
const generate = require("babel-generator").default;
const prettifyXml = require("prettify-xml");


module.exports = function render(path, modules) {
    // TODO 使用Dom el转换,而不是直接用小程序el转换
    const wxml = generate(path).code;
    modules[modules.current].wxml = prettifyXml(wxml, {
        indent: 2
    });
}
