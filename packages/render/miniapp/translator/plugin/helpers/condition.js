const t = require("babel-types");
const generate = require("babel-generator").default;

module.exports = function condition(path, test , consequent, alternate ) {
    //var node = path.node.expression
    var ifAttr = t.JSXAttribute(t.JSXIdentifier('wx:if'),
        t.stringLiteral(`{{${generate(test).code}}}`))
    
    var ifNode = t.JSXElement(t.JSXOpeningElement(t.JSXIdentifier("block"), [ifAttr], false),
        t.jSXClosingElement(t.JSXIdentifier("block")), [wrapText(consequent)])
    var args = [ifNode]
    if (alternate && alternate.type !== "NullLiteral") {
        var elseAttr = t.JSXAttribute(t.JSXIdentifier('wx:else'),
            t.stringLiteral("true"))
        var elseNode = t.JSXElement(t.JSXOpeningElement(t.JSXIdentifier("block"), [elseAttr], false),
            t.jSXClosingElement(t.JSXIdentifier("block")), [wrapText(alternate)])
        args.push(elseNode)
    }

    path.replaceWithMultiple(args)
};
//确保是文本节点，用JSXText包一下
function wrapText(node){
    if(node.type !== "JSXElement"){
        return t.JSXText(generate(node).code)
    }
    return node
}