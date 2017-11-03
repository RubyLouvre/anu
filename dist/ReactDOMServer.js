(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ReactDOMServer = factory());
}(this, (function () {

var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7;




/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */


/**
 * 一个空函数
 *
 * @export
 */


/**
 * 类继承
 *
 * @export
 * @param {any} SubClass
 * @param {any} SupClass
 */








var rword = /[^, ]+/g;

function oneObject(array, val) {
    if (array + "" === array) {
        //利用字符串的特征进行优化，字符串加上一个空字符串等于自身
        array = array.match(rword) || [];
    }
    var result = {},

    //eslint-disable-next-line
    value = val !== void 666 ? val : 1;
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
}






// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8

var pendingRefs = [];
window.pendingRefs = pendingRefs;

var cacheTree = {};
window.cacheTree = cacheTree;

/**
 * 为了防止污染用户的实例，需要将操作组件虚拟DOM与生命周期钩子的逻辑全部抽象到这个类中
 * 
 * @export
 * @param {any} instance 
 * @param {any} vnode 
 */


function getChildContext(instance, parentContext) {
    if (instance.getChildContext) {
        var context = instance.getChildContext();
        if (context) {
            parentContext = Object.assign({}, parentContext, context);
        }
    }
    return parentContext;
}

function getContextByTypes(curContext, contextTypes) {
    var context = {};
    if (!contextTypes || !curContext) {
        return context;
    }
    for (var key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = curContext[key];
        }
    }
    return context;
}

var rnumber = /^-?\d+(\.\d+)?$/;
/**
     * 为元素样子设置样式
     * 
     * @export
     * @param {any} dom 
     * @param {any} lastStyle 
     * @param {any} nextStyle 
     */


var cssNumber = oneObject("animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom");

var cssMap = oneObject("float", "cssFloat");

/**
 * 转换成当前浏览器可用的样式名
 * 
 * @param {any} name 
 * @returns 
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var React = (typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" ? global.React : window.React;
var skipAttributes = {
    ref: 1,
    key: 1,
    children: 1
};

function renderVNode(vnode, context) {
    var _vnode = vnode,
        vtype = _vnode.vtype,
        type = _vnode.type,
        props = _vnode.props;

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
                for (var _name in props) {
                    var v = props[_name];
                    if (skipAttributes[_name] || /^on[A-Z]/.test(_name) && (skipAttributes[_name] = true)) {
                        continue;
                    }

                    if (_name === "className" || _name === "class") {
                        _name = "class";
                        if (v && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                            v = hashToClassName(v);
                        }
                    } else if (_name.match(rXlink)) {
                        _name = _name.toLowerCase().replace(rXlink, "xlink:$1");
                    } else if (_name === "style" && v && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                        v = styleObjToCss(v);
                    }
                    if (skipFalseAndFunction(v)) {
                        attrs.push(_name + "=" + encodeAttributes(v + ""));
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
                    React.Children.forEach(props.children, function (el) {
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
                    context: context
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
var rXlink = /^xlink\:?(.+)/;

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
            arr.push(cssName$$1(name) + ": " + val + unit);
        }
    }
    return arr.join("; ");
}
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var cssCached = {
    styleFloat: "float",
    cssFloat: "float"
};

function cssName$$1(name) {
    if (cssCached[name]) {
        return cssCached[name];
    }

    return cssCached[name] = name.replace(/([A-Z])/g, "-$1").toLowerCase();
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
            if (rendered && rendered.render) {
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
        if (rendered === null || rendered === false) {
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
        return markup.replace(TAG_END, " data-reactroot=\"\" data-react-checksum=\"" + checksum + "\"$&");
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
            b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
        }
        a %= MOD;
        b %= MOD;
    }
    for (; i < l; i++) {
        b += a += data.charCodeAt(i);
    }
    a %= MOD;
    b %= MOD;
    return a | b << 16;
}
var index = {
    renderToString: renderToString,
    renderToStaticMarkup: renderToString
};

return index;

})));
