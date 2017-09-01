(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ReactDOMServer = factory());
}(this, (function () {

var __type = Object.prototype.toString;






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


/**
 * 收集一个元素的所有孩子
 *
 * @export
 * @param {any} dom
 * @returns
 */


/**
 * 小写化的优化
 * 
 * @export
 * @param {any} s 
 * @returns 
 */




/**
 *
 *
 * @param {any} obj
 * @returns
 */


var rword = /[^, ]+/g;

function oneObject(array, val) {
  if (typeNumber(array) === 4) {
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

function getChildContext(instance, context) {
  if (instance.getChildContext) {
    return Object.assign({}, context, instance.getChildContext());
  }
  return context;
}




function checkNull(vnode, type) {
  // if (Array.isArray(vnode) && vnode.length === 1) {
  //  vnode = vnode[0];
  // }
  if (vnode === null || vnode === false) {
    return { type: "#comment", text: "empty", vtype: 0 };
  } else if (!vnode || !vnode.vtype) {
    throw new Error("@" + type.name + "#render:You may have returned undefined, an array or some other invalid object");
  }
  return vnode;
}
var numberMap = {
  //null undefined IE6-8这里会返回[object Object]
  "[object Boolean]": 2,
  "[object Number]": 3,
  "[object String]": 4,
  "[object Function]": 5,
  "[object Symbol]": 6,
  "[object Array]": 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, array: 6, object:8
function typeNumber(data) {
  if (data === null) {
    return 1;
  }
  if (data === void 666) {
    return 0;
  }
  var a = numberMap[__type.call(data)];
  return a || 8;
}

var rnumber = /^-?\d+(\.\d+)?$/;
/**
     * 为元素样子设置样式
     * 
     * @export
     * @param {any} dom 
     * @param {any} oldStyle 
     * @param {any} newStyle 
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
        case '#text':
            return encodeEntities(vnode.text);
        case '#comment':
            return '<!--' + vnode.text + '-->';
        default:
            var innerHTML$$1 = props && props.dangerouslySetInnerHTML;
            innerHTML$$1 = innerHTML$$1 && innerHTML$$1.__html;
            if (vtype === 1) {
                var attrs = [];
                for (var i in props) {
                    var v = props[i];
                    if (skipAttributes[i] || /^on[A-Z]/.test(i) && (skipAttributes[i] = true)) {
                        continue;
                    }

                    if (name === 'className' || name === 'class') {
                        name = 'class';
                        if (v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
                            v = hashToClassName(v);
                        }
                    } else if (name.match(rXlink)) {
                        name = name.toLowerCase().replace(rXlink, 'xlink:$1');
                    } else if (name === 'style' && v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
                        v = styleObjToCss(v);
                    }
                    if (skipFalseAndFunction(val)) {
                        attrs.push(i + '=' + encodeAttributes(v + ''));
                    }
                }
                attrs = attrs.length ? ' ' + attrs.join(' ') : '';
                var str = '<' + type + attrs;
                if (voidTags[type]) {
                    return str + '/>\n';
                }
                str += '>';
                if (innerHTML$$1) {
                    str += innerHTML$$1;
                } else {
                    str += props.children.map(function (el) {
                        return el ? renderVNode(el, context) : '';
                    }).join('');
                }
                return str + '</' + type + '>\n';
            } else if (vtype > 1) {
                var data = {
                    context: context
                };
                vnode = toVnode(vnode, data);
                context = data.context;
                return renderVNode(vnode, context);
            } else {
                throw '数据不合法';
            }
    }
}

function hashToClassName() {
    var arr = [];
    for (var i in obj) {
        if (obj[i]) {
            arr.push(i);
        }
    }
    return arr.join(' ');
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
            var unit = '';
            if (rnumber.test(val) && !cssNumber[name]) {
                unit = 'px';
            }
            arr.push(cssName$$1(name) + ': ' + val + unit);
        }
    }
    return arr.join('; ');
}
var voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
var cssCached = {
    styleFloat: 'float',
    cssFloat: 'float'
};

function cssName$$1(name) {
    if (cssCached[name]) return cssCached[name];

    return cssCached[name] = name.replace(/([A-Z])/g, '-$1').toLowerCase();
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
        if (vnode.vtype === 4) {
            //处理无状态组件

            rendered = type(props, parentContext);
            instance = {};
        } else {

            //处理普通组件
            instance = new Type(props, parentContext);
            instance.props = instance.props || propx;
            instance.context = instance.context || parentContext;
            rendered = instance.render();
        }

        rendered = checkNull(rendered);
        vnode._renderedVnode = rendered;

        vnode._instance = instance;
        instance.__current = vnode;
        if (parentInstance) {
            instance.parentInstance = parentInstance;
        }

        if (instance.componentWillMount) {
            instance.componentWillMount();
        }
        // <App />下面存在<A ref="a"/>那么AppInstance.refs.a = AInstance
        // patchRef(vnode._owner, vnode.props.ref, instance)

        if (instance.getChildContext) {
            data.context = getChildContext(instance, context); //将context往下传
        }
        return toVnode(rendered, data, instance);
    } else {
        return vnode;
    }
}

//==================实现序列化文本节点与属性值的相关方法=============

var matchHtmlRegExp = /["'&<>]/;

function escapeHtml(string) {
    var str = '' + string;
    var match = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    var escape;
    var html = '';
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34:
                // "
                escape = '&quot;';
                break;
            case 38:
                // &
                escape = '&amp;';
                break;
            case 39:
                // '
                escape = '&#x27;'; // modified from escape-html; used to be '&#39'
                break;
            case 60:
                // <
                escape = '&lt;';
                break;
            case 62:
                // >
                escape = '&gt;';
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
    if (typeof text === 'boolean' || typeof text === 'number') {
        return '' + text;
    }
    return escapeHtml(text);
}

function encodeAttributes(value) {
    return '"' + encodeEntities(value) + '"';
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
        return markup.replace(TAG_END, ' data-reactroot="" data-react-checksum="' + checksum + '"$&');
    }
}

var MOD = 65521;

// adler32 is not cryptographically strong, and is only used to sanity check
// that markup generated on the server matches the markup generated on the
// client. This implementation (a modified version of the SheetJS version) has
// been optimized for our use case, at the expense of conforming to the adler32
// specification for non-ascii inputs.
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
