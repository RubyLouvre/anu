const t = require("babel-types");
const fs = require("fs-extra");
const path = require("path");
const cwd = process.cwd();
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
    createUUID: function() {
        return (Math.random() + "").slice(-4) + (Math.random() + "").slice(-4);
    },

    copyCustomComponents: function(config, modules) {
        Object.keys(config).forEach(componentName => {
            //对usingComponents直接copy目录
            let componentDir = path.dirname(config[componentName]);
            let src = path.join(cwd, "src", componentDir);
            let dest = path.join(cwd, "dist", componentDir);
            let list = modules.customComponents;
            fs.ensureDirSync(dest);
            fs.copySync(src, dest);
            if (!list.includes(componentName)) list.push(componentName);
        });
    }
};
