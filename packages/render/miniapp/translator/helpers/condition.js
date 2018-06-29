const t = require("babel-types");
const generate = require("babel-generator").default;
const wrapText = require("./wrapText")
module.exports = function condition(path, test , consequent, alternate ) {
    var ifAttr = t.JSXAttribute(t.JSXIdentifier('wx:if'),
        t.stringLiteral(`{{${generate(test).code}}}`))
    
    var ifNode = t.JSXElement(t.JSXOpeningElement(t.JSXIdentifier("block"), [ifAttr], false),
        t.jSXClosingElement(t.JSXIdentifier("block")), [wrapText(consequent)])
    var args = [ifNode]
    // null就不用创建一个<block>元素了，&&表达式也不需要创建<block>元素
    if (alternate && alternate.type !== "NullLiteral") {
        var elseAttr = t.JSXAttribute(t.JSXIdentifier('wx:else'),
            t.stringLiteral("true"))
        var elseNode = t.JSXElement(t.JSXOpeningElement(t.JSXIdentifier("block"), [elseAttr], false),
            t.JSXClosingElement(t.JSXIdentifier("block")), [wrapText(alternate)])
        args.push(elseNode)
    }

    path.replaceWithMultiple(args)
};
