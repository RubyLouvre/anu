


const t = require("babel-types");
const generate = require("babel-generator").default;
//确保是JSX，不是JSXElement就需要转换成JSXText
module.exports = function wrapText(node){
    if(node.type !== "JSXElement"){
        return t.JSXText(generate(node).code)
    }
    return node
}