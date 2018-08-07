const t = require("babel-types");

module.exports = {
    createElement: function(nodeName, attrs, children) {
        return t.JSXElement(
            t.JSXOpeningElement(t.JSXIdentifier(nodeName), attrs, false),
            t.jSXClosingElement(t.JSXIdentifier(nodeName)),
            children
        );
    },
    createAttribute: function(name, value) {
        return t.JSXAttribute(t.JSXIdentifier(name), t.stringLiteral(value));
    },
    createDataId: function() {
        return "data" + String(Math.random() + Math.random()).slice(2);
    }
};
