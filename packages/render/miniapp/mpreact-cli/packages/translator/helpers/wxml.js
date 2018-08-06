const syntaxJSX = require("babel-plugin-syntax-jsx");
const babel = require("babel-core");
const t = require("babel-types");
const generate = require("babel-generator").default;
const modules = require("../modules");
const attrValueHelper = require("./attrValue");
const attrNameHelper = require("./attrName");
const logicHelper = require("./logic");
const jsx = require("../jsx/jsx");

/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function wxml(code) {
    var result = babel.transform(code, {
        babelrc: false,
        plugins: [
            function wxmlPlugin(api) {
                return {
                    inherits: syntaxJSX,
                    visitor: visitor
                };
            }
        ]
    });
    return result.code;
}
var visitor = {
    JSXOpeningElement: {
        exit: function(path) {
            //   enter: function(path) {
            var openTag = path.node.name;
            if (
                openTag.type === "JSXMemberExpression" &&
                openTag.object.name === "React" &&
                openTag.property.name === "template"
            ) {
                var array, is, key;
                path.node.attributes.forEach(function(el) {
                    var attrName = el.name.name;
                    var attrValue = el.value.value;
                    if (/^\{\{.+\}\}/.test(attrValue)) {
                        attrValue = attrValue.slice(2, -2);
                    }
                    if (attrName === "templatedata") {
                        array = attrValue;
                    } else if (attrName === "is") {
                        is = attrValue;
                    } else if (attrName === "key") {
                        key = attrValue;
                    }
                });
                var attributes = [];
                var template = jsx.createElement("template", attributes, []);
                var p = path.parentPath.parentPath,
                    inLoop,
                    dataName = "data";
                while (p.parentPath) {
                    p = p.parentPath;
                    if (p.type === "CallExpression") {
                        inLoop = p.node.callee.property.name === "map";
                        dataName = p.node.arguments[0].params[0].name;
                        break;
                    }
                }
                //将组件变成template标签
                attributes.push();
                if (!inLoop) {
                    attributes.push(
                        jsx.createAttribute("is", is),
                        //    jsx.createAttribute("wx:for", `{{${array}}}`),
                        //   jsx.createAttribute("wx:for-item", "data"),
                        jsx.createAttribute("data", `{{...${dataName}}}`),
                        jsx.createAttribute("wx:for", `{{${array}}}`),
                        jsx.createAttribute("wx:for-item", dataName),
                        jsx.createAttribute("wx:for-index", "index")
                    );
                } else {
                    attributes.push(
                        jsx.createAttribute("is", is),
                        jsx.createAttribute("wx:if", `{{${array}[index]}}`),
                        //    jsx.createAttribute("wx:for", `{{${array}}}`),
                        //   jsx.createAttribute("wx:for-item", "data"),
                        jsx.createAttribute("data", `{{...${array}[index]}}`)
                        //   jsx.createAttribute("wx:for-item", dataName)
                    );
                    if (key) {
                        attributes.push(
                            jsx.createAttribute("wx:key", `{{${key}}}`)
                        );
                    }
                }

                path.parentPath.replaceWith(template);
            }
        }
    },
    JSXAttribute(path) {
        attrNameHelper(path);
    },

    JSXExpressionContainer: {
        enter() {},
        exit(path) {
            var expr = path.node.expression;
            if (t.isJSXAttribute(path.parent)) {
                attrValueHelper(path, modules);
            } else if (
                expr.type === "MemberExpression" &&
                generate(expr).code === "this.props.children"
            ) {
                //将 {this.props.children} 转换成 <slot />
                var children = t.JSXOpeningElement(
                    t.JSXIdentifier("slot"),
                    [],
                    true
                );
                path.replaceWith(children);
            } else {
                //返回block元素或template元素
                var block = logicHelper(expr);

                path.replaceWith(block);
            }
        }
    }
};
module.exports = wxml;
