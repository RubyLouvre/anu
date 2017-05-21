(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ReactDOMServer = factory());
}(this, (function () {

/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
function extend(obj, props) {
    if (props) {
        for (var i in props) {
            if (props.hasOwnProperty(i)) obj[i] = props[i];
        }
    }
    return obj;
}
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
 *  收集一个元素的所有孩子
 * 
 * @export
 * @param {any} dom 
 * @returns 
 */



/**
 * 收集该虚拟DOM的所有组件实例，方便依次执行它们的生命周期钩子
 *
 * @param {any} instance
 * @returns
 */


/**
 *
 *
 * @param {any} type
 * @returns
 */
function isFn(type) {
    return typeof type === 'function';
}

/**
 *
 *
 * @export
 * @param {any} type
 * @returns
 */
function isStateless(type) {
    var fn = type.prototype;
    return isFn(type) && (!fn || !fn.render);
}

var rword = /[^, ]+/g;

function oneObject(array, val) {
    if (typeof array === 'string') {
        array = array.match(rword) || [];
    }
    var result = {},
        value = val !== void 0 ? val : 1;
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
}

function getContext(instance, context) {
    if (instance.getChildContext) {
        return extend(extend({}, context), instance.getChildContext());
    }
    return context;
}





/**
 * 获取虚拟DOM对应的顶层组件实例的类型
 *
 * @param {any} vnode
 * @param {any} instance
 * @param {any} pool
 */

var rnumber = /^-?\d+(\.\d+)?$/;
/**
 * 为元素样子设置样式
 * 
 * @export
 * @param {any} dom 
 * @param {any} oldStyle 
 * @param {any} newStyle 
 */


var cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom');

var cssMap = oneObject('float', 'cssFloat');

/**
 * 转换成当前浏览器可用的样式名
 * 
 * @param {any} name 
 * @returns 
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var React = global.React;

var Component = React.Component;

function renderVNode(vnode, context) {
    var _vnode = vnode,
        type = _vnode.type,
        props = _vnode.props;


    switch (type) {
        case '#text':
            return encodeEntities(vnode.text);
        case '#comment':
            return '<!--' + vnode.text + '-->';
        default:
            var innerHTML = props && props.dangerouslySetInnerHTML;
            innerHTML = innerHTML && innerHTML.__html;
            if (typeof type === 'string') {
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
                    } else if (name.match(/^xlink\:?(.+)/)) {
                        name = name.toLowerCase().replace(/^xlink\:?(.+)/, 'xlink:$1');
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
                if (innerHTML) {
                    str += innerHTML;
                } else {
                    str += props.children.map(function (el) {
                        return el ? renderVNode(el, context) : '';
                    }).join('');
                }
                return str + '</' + type + '>\n';
            } else if (typeof type === 'function') {
                vnode = toVnode(vnode, context);
                return renderVNode(vnode, vnode.context || context);
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

var voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

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
            arr.push(cssProp(name) + ': ' + val + unit);
        }
    }
    return arr.join('; ');
}
var cssCached = {
    styleFloat: 'float',
    cssFloat: 'float'
};

function cssProp(name) {
    if (cssCached[name]) return cssCached[name];

    return cssCached[name] = name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

//===============重新实现transaction＝＝＝＝＝＝＝＝＝＝＝
function setStateWarn() {}
var transaction = {
    renderWithoutSetState: function renderWithoutSetState(instance, nextProps, context) {
        instance.setState = instance.forceUpdate = setStateWarn;
        try {
            var vnode = instance.render(nextProps, context);
            if (vnode === null) {
                vnode = {
                    type: '#comment',
                    text: 'empty'
                };
            }
        } finally {
            delete instance.setState;
            delete instance.forceUpdate;
        }
        return vnode;
    }
};

function toVnode(vnode, context, parentInstance) {

    var Type = vnode.type,
        instance,
        rendered;

    if (typeof Type === 'function') {
        var props = vnode.props;
        if (isStateless(Type)) {
            //处理无状态组件
            instance = new Component(null, context);
            instance.render = instance.statelessRender = Type;
            rendered = transaction.renderWithoutSetState(instance, props, context);
        } else {

            //处理普通组件
            var defaultProps = Type.defaultProps || instance && instance.getDefaultProps && instance.getDefaultProps();
            props = extend({}, props); //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
            for (var i in defaultProps) {
                if (props[i] === void 666) {
                    props[i] = defaultProps[i];
                }
            }
            instance = new Type(props, context);

            //必须在这里添加vnode，因为willComponent里可能进行setState操作
            Component.call(instance, props, context); //重点！！
            instance.componentWillMount && instance.componentWillMount();

            rendered = transaction.renderWithoutSetState(instance);
        }
        instance._rendered = rendered;

        vnode._instance = instance;

        if (parentInstance) {
            instance.parentInstance = parentInstance;
        } else {
            instance.vnode = vnode;
        }

        // <App />下面存在<A ref="a"/>那么AppInstance.refs.a = AInstance
        // patchRef(vnode._owner, vnode.props.ref, instance)

        if (instance.getChildContext) {
            context = rendered.context = getContext(instance, context); //将context往下传
        }
        return toVnode(rendered, context, instance);
    } else {

        vnode.context = context;
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
    renderToString: renderToString
};

return index;

})));
