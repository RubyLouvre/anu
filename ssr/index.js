import { getChildContext, getContextByTypes } from "../src/updater";
import { rnumber, cssNumber } from "../src/style";
var React = typeof global === "object" ? global.React : window.React;
var skipAttributes = {
    ref: 1,
    key: 1,
    children: 1
};

function renderVNode(vnode, context) {
    var { vtype, type, props } = vnode;
    switch (type) {
    case "#text":
        return encodeEntities(vnode.text);
    case "#comment":
        return "<!--" + vnode.text + "-->";
    default:
        var innerHTML = props && props.dangerouslySetInnerHTML;
        innerHTML = innerHTML && innerHTML.__html;
        if (vtype === 1) {
        //如果是元素节点
            var attrs = [];
            for (let name in props) {
                var v = props[name];
                if (
                    skipAttributes[name] ||
            (/^on[A-Z]/.test(name) && (skipAttributes[name] = true))
                ) {
                    continue;
                }

                if (name === "className" || name === "class") {
                    name = "class";
                    if (v && typeof v === "object") {
                        v = hashToClassName(v);
                    }
                } else if (name.match(rXlink)) {
                    name = name.toLowerCase().replace(rXlink, "xlink:$1");
                } else if (name === "style" && v && typeof v === "object") {
                    v = styleObjToCss(v);
                }
                if (skipFalseAndFunction(v)) {
                    attrs.push(name + "=" + encodeAttributes(v + ""));
                }
            }
            attrs = attrs.length ? " " + attrs.join(" ") : "";
            var str = "<" + type + attrs;
            if (voidTags[type]) {
                return str + "/>\n";
            }
            str += ">";
            if (innerHTML) {
                str += innerHTML;
            } else {
                //最近版本将虚拟DOM树结构调整了，children不一定为数组
                React.Children.forEach(props.children, function(el) {
                    if (el && el.vtype) {
                        str += renderVNode(el, context);
                    } else {
                        str += el || "";
                    }
                });
            }
            return str + "</" + type + ">\n";
        } else if (vtype > 1) {
            var data = {
                context
            };
            vnode = toVnode(vnode, data);
            context = data.context;
            return renderVNode(vnode, context);
        } else {
            throw "数据不合法";
        }
    }
}

function hashToClassName(obj) {
    var arr = [];
    for (var i in obj) {
        if (obj[i]) {
            arr.push(i);
        }
    }
    return arr.join(" ");
}
const rXlink = /^xlink\:?(.+)/;

function skipFalseAndFunction(a) {
    return a !== false && Object(a) !== a;
}

function styleObjToCss(obj) {
    var arr = [];
    for (var i in obj) {
        var val = obj[i];
        if (obj != null) {
            var unit = "";
            if (rnumber.test(val) && !cssNumber[name]) {
                unit = "px";
            }
            arr.push(cssName(name) + ": " + val + unit);
        }
    }
    return arr.join("; ");
}
const voidTags = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
];
var cssCached = {
    styleFloat: "float",
    cssFloat: "float"
};

function cssName(name) {
    if (cssCached[name]) {
        return cssCached[name];
    }

    return (cssCached[name] = name.replace(/([A-Z])/g, "-$1").toLowerCase());
}

//===============重新实现transaction＝＝＝＝＝＝＝＝＝＝＝

function toVnode(vnode, data, parentInstance) {
    var parentContext = data.context,
        Type = vnode.type,
        instance,
        rendered;

    if (vnode.vtype > 1) {
        var props = vnode.props;
        // props = getComponentProps(Type, props)
        var instanceContext = getContextByTypes(parentContext, Type.contextTypes);
        if (vnode.vtype === 4) {
            //处理无状态组件
            rendered = Type(props, instanceContext);
            if(rendered && rendered.render){
                rendered = rendered.render();
            }
            instance = {};
        } else {
            //处理普通组件
            instance = new Type(props, instanceContext);
            instance.props = instance.props || props;
            instance.context = instance.context || instanceContext;
            rendered = instance.render();
        }
        if(rendered === null || rendered === false){
            rendered = {
                vtype: 0,
                type: "#comment",
                text: "empty"
            };
        }
       
        vnode._instance = instance;
        instance.__current = vnode;
        if (parentInstance) {
            instance.__parentInstance = parentInstance;
        }

        if (instance.componentWillMount) {
            instance.componentWillMount();
        }
        // <App />下面存在<A ref="a"/>那么AppInstance.refs.a = AInstance
        // patchRef(vnode._owner, vnode.props.ref, instance)

        if (instance.getChildContext) {
            data.context = getChildContext(instance, parentContext); //将context往下传
        }
        return toVnode(rendered, data, instance);
    } else {
        return vnode;
    }
}

//==================实现序列化文本节点与属性值的相关方法=============

var matchHtmlRegExp = /["'&<>]/;

function escapeHtml(string) {
    var str = "" + string;
    var match = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    var escape;
    var html = "";
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
        case 34:
        // "
            escape = "&quot;";
            break;
        case 38:
        // &
            escape = "&amp;";
            break;
        case 39:
        // '
            escape = "&#x27;"; // modified from escape-html; used to be '&#39'
            break;
        case 60:
        // <
            escape = "&lt;";
            break;
        case 62:
        // >
            escape = "&gt;";
            break;
        default:
            continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

function encodeEntities(text) {
    if (typeof text === "boolean" || typeof text === "number") {
        return "" + text;
    }
    return escapeHtml(text);
}

function encodeAttributes(value) {
    return "\"" + encodeEntities(value) + "\"";
}

function renderToString(vnode, context) {
    var TAG_END = /\/?>/;
    var COMMENT_START = /^<\!\-\-/;
    var markup = renderVNode(vnode, context || {});
    var checksum = adler32(markup);
    // Add checksum (handle both parent tags, comments and self-closing tags)
    if (COMMENT_START.test(markup)) {
        return markup;
    } else {
        return markup.replace(
            TAG_END,
            " data-reactroot=\"\" data-react-checksum=\"" + checksum + "\"$&"
        );
    }
}

var MOD = 65521;

//  以后考虑去掉这个东西
function adler32(data) {
    var a = 1;
    var b = 0;
    var i = 0;
    var l = data.length;
    var m = l & ~0x3;
    while (i < m) {
        var n = Math.min(i + 4096, m);
        for (; i < n; i += 4) {
            b +=
        (a += data.charCodeAt(i)) +
        (a += data.charCodeAt(i + 1)) +
        (a += data.charCodeAt(i + 2)) +
        (a += data.charCodeAt(i + 3));
        }
        a %= MOD;
        b %= MOD;
    }
    for (; i < l; i++) {
        b += a += data.charCodeAt(i);
    }
    a %= MOD;
    b %= MOD;
    return a | (b << 16);
}
export default {
    renderToString,
    renderToStaticMarkup: renderToString
};
