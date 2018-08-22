const syntaxJSX = require("babel-plugin-syntax-jsx");
const babel = require("babel-core");
const t = require("babel-types");
const generate = require("babel-generator").default;
const attrValueHelper = require("./attrValue");
const attrNameHelper = require("./attrName");
const logicHelper = require("./logic");
const jsx = require("../utils");
const chineseHelper = require("./chinese");

var chineseHack = chineseHelper();
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function wxml(code, modules) {
    var result = babel.transform(code, {
        babelrc: false,
        plugins: [
            function wxmlPlugin(api) {
                return {
                    inherits: syntaxJSX,
                    visitor: visitor,
                    manipulateOptions(opts){//解析每个文件前执行一次
                       opts.anu = modules
                    }
                };
            }
        ]
    });
    var html = result.code;
    if (chineseHack.unicodeNumber) {
       return chineseHack.recovery(html)
    }
    return html;
}
var visitor = {
    JSXOpeningElement: {
        exit: function(path) {
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
                    } else if (attrName === "wx:key") {
                        key = attrValue;
                    } else if (attrName === "key") {
                        key = attrValue;
                    }
                });
                var attributes = [];
                var template = jsx.createElement("template", attributes, []);
                template.key = key;
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
                if (!inLoop) {
                    attributes.push(
                        jsx.createAttribute("is", is),
                        jsx.createAttribute("data", `{{...${dataName}}}`),
                        jsx.createAttribute("wx:for", `{{${array}}}`),
                        jsx.createAttribute("wx:for-item", dataName),
                        jsx.createAttribute("wx:for-index", "index"),
                        jsx.createAttribute("wx:key", "*this")
                    );
                } else {
                    attributes.push(
                        jsx.createAttribute("is", is),
                        jsx.createAttribute("wx:if", `{{${array}[index]}}`),
                        jsx.createAttribute("data", `{{...${array}[index]}}`)
                    );
                }

                path.parentPath.replaceWith(template);
            }
        }
    },
    JSXAttribute(path) {
        chineseHack.collect(path);
        if (path.node.name.name === "key") {
            let node = path.node.value;
            let value;

            if (t.isStringLiteral(node)) {
                value = node.value;
            } else {
                if (/\./.test(node.expression.value)) {
                    value = "*this";
                } else {
                    value = `{{${generate(node.expression).code}}}`;
                }
            }
            path.parentPath.node.attributes.push(
                jsx.createAttribute("wx:key", value)
            );
            path.remove();
            return;
        }
        attrNameHelper(path);
    },

    JSXExpressionContainer: {
        enter() {},
        exit(path, state) {
            var modules = state.file.opts.anu;
            var expr = path.node.expression;
            if (t.isJSXAttribute(path.parent)) {
                attrValueHelper(path);
            } else if (
                expr.type === "MemberExpression" &&
                generate(expr).code === "this.props.children"
            ) {
                //将 {this.props.children} 转换成 <slot />
                console.warn("小程序暂时不支持{this.props.children}");
            } else {
                //返回block元素或template元素
                var block = logicHelper(expr, modules);
                path.replaceWith(block);
            }
        }
    }
};
module.exports = wxml;
