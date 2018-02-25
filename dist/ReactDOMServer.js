(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stream')) :
	typeof define === 'function' && define.amd ? define(['stream'], factory) :
	(global.ReactDOMServer = factory(global.stream));
}(this, (function (stream) {

var hasSymbol = typeof Symbol === "function" && Symbol["for"];

var hasOwnProperty = Object.prototype.hasOwnProperty;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol["for"]("react.fragment") : 0xeacb;






/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
function extend(obj, props) {
    for (var i in props) {
        if (hasOwnProperty.call(props, i)) {
            obj[i] = props[i];
        }
    }
    return obj;
}


var __type = Object.prototype.toString;

/**
 * 一个空函数
 *
 * @export
 */
function noop() {}

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





var options = oneObject(["beforeProps", "afterCreate", "beforeInsert", "beforeDelete", "beforeUpdate", "afterUpdate", "beforePatch", "afterPatch", "beforeUnmount", "afterMount"], noop);

var numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
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

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
var pendingRefs = [];
window.pendingRefs = pendingRefs;
var Refs = {
    mountOrder: 1,
    currentOwner: null,
    controlledCbs: [],
    // errorHook: string,//发生错误的生命周期钩子
    // errorInfo: [],    //已经构建好的错误信息
    // doctors: null     //医生节点
    // error: null       //第一个捕捉到的错误
    fireRef: function fireRef(vnode, dom, fiber) {
        if (fiber._disposed || fiber.__isStateless) {
            dom = null;
        }
        var ref = vnode.ref;
        if (typeof ref === "function") {
            return ref(dom);
        }
        var owner = vnode._owner;
        if (!ref) {
            return;
        }
        if (!owner) {
            throw "Element ref was specified as a string (" + ref + ") but no owner was set";
        }
        if (dom) {
            if (dom.nodeType) {
                dom.getDOMNode = getDOMNode;
            }
            owner.refs[ref] = dom;
        } else {
            delete owner.refs[ref];
        }
    }
};

var vtype2tag = {
    0: 6, //text,
    1: 5, //element,
    4: 1, //function
    2: 2 //class
};
/*
 IndeterminateComponent = 0; // Before we know whether it is functional or class
 FunctionalComponent = 1;
 ClassComponent = 2;
 HostRoot = 3; // Root of a host tree. Could be nested inside another node.
 HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
 HostComponent = 5;
 HostText = 6;
 CallComponent = 7;
 CallHandlerPhase = 8;
 ReturnComponent = 9;
 Fragment = 10;
 Mode = 11;
 ContextConsumer = 12;
 ContextProvider = 13;
*/
function Vnode(type, vtype, props, key, ref) {
    this.type = type;
    this.vtype = vtype;
    this.tag = vtype2tag[vtype];
    if (vtype) {
        this.props = props;
        this._owner = Refs.currentOwner;

        if (key) {
            this.key = key;
        }

        var refType = typeNumber(ref);
        if (refType === 3 || refType === 4 || refType === 5) {
            //number, string, function
            this._hasRef = true;
            this.ref = ref;
        }
    }
    /*
      this.stateNode = null
    */

    options.afterCreate(this);
}

Vnode.prototype = {
    getDOMNode: function getDOMNode() {
        return this.stateNode || null;
    },


    $$typeof: REACT_ELEMENT_TYPE
};

/**
 * 虚拟DOM工厂
 *
 * @param {string|function|Component} type
 * @param {object} props
 * @param {array} ...children
 * @returns
 */



function createVText(type, text) {
    var vnode = new Vnode(type, 0);
    vnode.text = text;
    return vnode;
}

// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中


var lastText;
var flattenIndex;
var flattenObject;
var flattenArray;
function flattenCb(child, index, vnode) {
    var childType = typeNumber(child);
    if (childType < 3) {
        //在React16中undefined, null, boolean不会产生节点
        lastText = null;
        return;
    } else if (childType < 5) {
        //number string
        if (lastText) {
            //合并相邻的文本节点
            lastText.text += child;
            return;
        }
        lastText = child = createVText("#text", child + "");
    } else {
        lastText = null;
    }
    var key = child.key;
    if (key && !flattenObject[".$" + key]) {
        flattenObject[".$" + key] = child;
    } else {
        if (index === ".") {
            index = "." + flattenIndex;
        }
        flattenObject[index] = child;
    }
    flattenIndex++;
    flattenArray.push(child);
}

function fiberizeChildren(c, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    flattenArray = [];
    var vnode = fiber._reactInternalFiber;
    if (c !== void 666) {
        lastText = null;
        operateChildren(c, "", flattenCb, vnode);
    }
    flattenIndex = 0;
    return fiber.children = flattenObject;
}

function operateChildren(children, prefix, callback, parent) {
    var iteratorFn;
    if (children) {
        if (children.forEach) {
            children.forEach(function (el, i) {
                operateChildren(el, prefix ? prefix + ":" + i : "." + i, callback, parent);
            });
            return;
        } else if (iteratorFn = getIteractor(children)) {
            var iterator = iteratorFn.call(children),
                ii = 0,
                step;
            while (!(step = iterator.next()).done) {
                operateChildren(step.value, prefix ? prefix + ":" + ii : "." + ii, callback, parent);
                ii++;
            }
            return;
        }
    }
    if (Object(children) === children && !children.call && !children.type) {
        throw "children中存在非法的对象";
    }
    callback(children, prefix || ".", parent);
}
var REAL_SYMBOL = hasSymbol && Symbol.iterator;
var FAKE_SYMBOL = "@@iterator";
function getIteractor(a) {
    if (typeNumber(a) > 7) {
        var iteratorFn = REAL_SYMBOL && a[REAL_SYMBOL] || a[FAKE_SYMBOL];
        if (iteratorFn && iteratorFn.call) {
            return iteratorFn;
        }
    }
}

//用于后端的元素节点
function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
}



var fn = DOMElement.prototype = {
    contains: Boolean
};
String("replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute" + ",getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent" + ",detachEvent").replace(/\w+/g, function (name) {
    fn[name] = function () {
        console.log("fire " + name); // eslint-disable-line
    };
});

//用于后端的document
var fakeDoc = new DOMElement();
fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function (type) {
    return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement("html");
fakeDoc.body = new DOMElement("body");
fakeDoc.nodeName = "#document";
fakeDoc.textContent = "";
try {
    var w = window;
    var b = !!w.alert;
} catch (e) {
    b = false;
    w = {
        document: fakeDoc
    };
}


var win = w;

var document = w.document || fakeDoc;


var fragment = document.createDocumentFragment();




var versions = {
    88: 7, //IE7-8 objectobject
    80: 6, //IE6 objectundefined
    "00": NaN, // other modern browsers
    "08": NaN
};
/* istanbul ignore next  */
var msie = document.documentMode || versions[typeNumber(document.all) + "" + typeNumber(win.XMLHttpRequest)];

var modern = /NaN|undefined/.test(msie) || msie > 8;

/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */




function getChildContext(instance, parentContext) {
	if (instance.getChildContext) {
		var context = instance.getChildContext();
		if (context) {
			parentContext = extend(extend({}, parentContext), context);
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

var skipAttributes = {
    ref: 1,
    key: 1,
    children: 1,
    dangerouslySetInnerHTML: 1,
    innerHTML: 1
};
var cssCached = {
    styleFloat: "float",
    cssFloat: "float"
};
var rXlink = /^xlink:?(.+)/;

function cssName$$1(name) {
    if (cssCached[name]) {
        return cssCached[name];
    }
    return cssCached[name] = name.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function stringifyClassName(obj) {
    var arr = [];
    for (var i in obj) {
        if (obj[i]) {
            arr.push(i);
        }
    }
    return arr.join(" ");
}

var attrCached = {};
function encodeAttributes(value) {
    if (attrCached[value]) {
        return attrCached[value];
    }
    return attrCached[value] = "\"" + encodeEntities(value) + "\"";
}

function skipFalseAndFunction(a) {
    return a !== false && Object(a) !== a;
}

function stringifyStyleObject(obj) {
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

var forElement = {
    select: 1,
    input: 1,
    textarea: 1
};

function stringifyAttributes(props, type) {
    var attrs = [];
    for (var _name in props) {
        var v = props[_name];
        if (skipAttributes[_name]) {
            continue;
        }
        var checkType = false;
        if (_name === "className" || _name === "class") {
            _name = "class";
            if (v && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                v = stringifyClassName(v);
                checkType = true;
            }
        } else if (_name === "style") {
            if (Object(v) == v) {
                v = stringifyStyleObject(v);
                checkType = true;
            } else {
                continue;
            }
        } else if (_name === "defaultValue") {
            if (forElement[type]) {
                _name = "value";
            }
        } else if (_name === "defaultChecked") {
            if (forElement[type]) {
                _name = "checked";
                v = "";
                checkType = true;
            }
        } else if (_name.match(rXlink)) {
            _name = _name.toLowerCase().replace(rXlink, "xlink:$1");
        }
        if (checkType || skipFalseAndFunction(v)) {
            attrs.push(_name + "=" + encodeAttributes(v + ""));
        }
    }
    return attrs.length ? " " + attrs.join(" ") : "";
}

var _marked = /*#__PURE__*/regeneratorRuntime.mark(renderVNodeGen);

// https://github.com/juliangruber/stream 
// 如果要用在前端，需要加这个库 npm install stream
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
            var innerHTML$$1 = props && props.dangerouslySetInnerHTML;
            innerHTML$$1 = innerHTML$$1 && innerHTML$$1.__html;
            if (vtype === 1) {
                //如果是元素节点
                if (type === "option") {
                    //向上找到select元素
                    for (var p = vnode.return; p && p.type !== "select"; p === p.return) {
                        // no operation
                    }
                    if (p && p.valuesSet) {
                        var curValue = getOptionValue(vnode);
                        if (p.valuesSet["&" + curValue]) {
                            props = Object.assign({ selected: "" }, props); //添加一个selected属性
                        }
                    }
                } else if (type === "select") {
                    var selectValue = vnode.props.value || vnode.props.defaultValue;
                    if (selectValue != null) {
                        var values = [].concat(selectValue),
                            valuesSet = {};
                        values.forEach(function (el) {
                            valuesSet["&" + el] = true;
                        });
                        vnode.valuesSet = valuesSet;
                    }
                }

                var str = "<" + type + stringifyAttributes(props, type);
                if (voidTags[type]) {
                    return str + "/>\n";
                }
                str += ">";
                if (innerHTML$$1) {
                    str += innerHTML$$1;
                } else {
                    var fakeUpdater = {
                        _reactInternalFiber: vnode
                    };
                    var children = fiberizeChildren(props.children, fakeUpdater);
                    for (var i in children) {
                        var child = children[i];
                        str += renderVNode(child, context);
                    }
                    vnode.updater = fakeUpdater;
                }
                return str + "</" + type + ">\n";
            } else if (vtype > 1) {
                var data = {
                    context: context
                };
                vnode = toVnode(vnode, data);
                context = data.context;
                return renderVNode(vnode, context);
            } else if (Array.isArray(vnode)) {
                var multiChild = "";
                vnode.forEach(function (el) {
                    multiChild += renderVNode(el, context);
                });
                return multiChild;
            } else {
                throw "数据不合法";
            }
    }
}

function renderVNodeGen(vnode, context) {
    var _vnode2, vtype, type, props, innerHTML$$1, p, curValue, selectValue, values, valuesSet, str, fakeUpdater, children, i, child, data, multiChild;

    return regeneratorRuntime.wrap(function renderVNodeGen$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _vnode2 = vnode, vtype = _vnode2.vtype, type = _vnode2.type, props = _vnode2.props;
                    _context.t0 = type;
                    _context.next = _context.t0 === "#text" ? 4 : _context.t0 === "#comment" ? 7 : 10;
                    break;

                case 4:
                    _context.next = 6;
                    return encodeEntities(vnode.text);

                case 6:
                    return _context.abrupt("break", 40);

                case 7:
                    _context.next = 9;
                    return "<!--" + vnode.text + "-->";

                case 9:
                    return _context.abrupt("break", 40);

                case 10:
                    innerHTML$$1 = props && props.dangerouslySetInnerHTML;

                    innerHTML$$1 = innerHTML$$1 && innerHTML$$1.__html;

                    if (!(vtype === 1)) {
                        _context.next = 24;
                        break;
                    }

                    //如果是元素节点
                    if (type === "option") {
                        //向上找到select元素
                        for (p = vnode.return; p && p.type !== "select"; p === p.return) {
                            // no operation
                        }
                        if (p && p.valuesSet) {
                            curValue = getOptionValue(vnode);

                            if (p.valuesSet["&" + curValue]) {
                                props = Object.assign({ selected: "" }, props); //添加一个selected属性
                            }
                        }
                    } else if (type === "select") {
                        selectValue = vnode.props.value || vnode.props.defaultValue;

                        if (selectValue != null) {
                            values = [].concat(selectValue), valuesSet = {};

                            values.forEach(function (el) {
                                valuesSet["&" + el] = true;
                            });
                            vnode.valuesSet = valuesSet;
                        }
                    }

                    str = "<" + type + stringifyAttributes(props, type);

                    if (!voidTags[type]) {
                        _context.next = 18;
                        break;
                    }

                    _context.next = 18;
                    return str + "/>\n";

                case 18:
                    str += ">";
                    if (innerHTML$$1) {
                        str += innerHTML$$1;
                    } else {
                        fakeUpdater = {
                            vnode: vnode
                        };
                        children = fiberizeChildren(props.children, fakeUpdater);

                        for (i in children) {
                            child = children[i];

                            str += renderVNode(child, context);
                        }
                        vnode.updater = fakeUpdater;
                    }
                    _context.next = 22;
                    return str + "</" + type + ">\n";

                case 22:
                    _context.next = 40;
                    break;

                case 24:
                    if (!(vtype > 1)) {
                        _context.next = 32;
                        break;
                    }

                    data = {
                        context: context
                    };

                    vnode = toVnode(vnode, data);
                    context = data.context;
                    _context.next = 30;
                    return renderVNode(vnode, context);

                case 30:
                    _context.next = 40;
                    break;

                case 32:
                    if (!Array.isArray(vnode)) {
                        _context.next = 39;
                        break;
                    }

                    multiChild = "";

                    vnode.forEach(function (el) {
                        multiChild += renderVNode(el, context);
                    });
                    _context.next = 37;
                    return multiChild;

                case 37:
                    _context.next = 40;
                    break;

                case 39:
                    throw "数据不合法";

                case 40:
                case "end":
                    return _context.stop();
            }
        }
    }, _marked, this);
}

function getOptionValue(option) {
    if ("value" in option.props) {
        return option.props.value;
    } else {
        var a = option.props.children;
        if (a + "" === "a") {
            return a;
        } else {
            return a.text;
        }
    }
}

var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

/**
 * 将组件虚拟DOM进行实例化，不断render，归化为元素虚拟DOM或文本节点或数组
 * @param {*} vnode 组件虚拟DOM
 * @param {*} data 一个包含context的对象
 */
function toVnode(vnode, data) {
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
            if (instance.componentWillMount) {
                try {
                    instance.componentWillMount();
                } catch (e) {
                    // no operation
                }
            }
            rendered = instance.render();
        }

        rendered = fixVnode(rendered);

        if (instance.componentWillMount) {
            instance.componentWillMount();
        }
        // <App />下面存在<A ref="a"/>那么AppInstance.refs.a = AInstance
        // patchRef(vnode._owner, vnode.props.ref, instance)

        if (instance.getChildContext) {
            data.context = getChildContext(instance, parentContext); //将context往下传
        }
        if (Array.isArray(rendered)) {
            return rendered.map(function (el) {
                return toVnode(el, data, instance);
            });
        } else {
            return toVnode(rendered, data, instance);
        }
    } else {
        return vnode;
    }
}

//==================实现序列化文本节点与属性值的相关方法=============

function fixVnode(vnode) {
    var number = typeNumber(vnode);
    if (number < 3) {
        // 0, 1, 2
        return {
            vtype: 0,
            text: "",
            type: "#text"
        };
    } else if (number < 5) {
        //3, 4
        return {
            vtype: 0,
            text: vnode + "",
            type: "#text"
        };
    } else {
        return vnode;
    }
}

function renderToString(vnode, context) {
    return renderVNode(fixVnode(vnode), context || {});
}

function renderToNodeStream(vnode, context) {
    var rs = new stream.Readable();
    var it = renderVNodeGen(vnode, context || {});

    rs._read = function () {
        var v = it.next();

        if (!v.done) {
            rs.push(v.value.toString());
        } else {
            rs.push(null);
        }
    };

    return rs;
}

var index = {
    renderToString: renderToString,
    renderToStaticMarkup: renderToString,
    renderToNodeStream: renderToNodeStream,
    renderToStaticNodeStream: renderToNodeStream
};

return index;

})));
