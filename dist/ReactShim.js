/**
 * 此版本要求浏览器没有createClass, createFactory, PropTypes, isValidElement,
 * unmountComponentAtNode,unstable_renderSubtreeIntoContainer
 * QQ 370262116 by 司徒正美 Copyright 2018-03-04
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

var hasSymbol = typeof Symbol === "function" && Symbol["for"];
var innerHTML = "dangerouslySetInnerHTML";
var hasOwnProperty = Object.prototype.hasOwnProperty;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol["for"]("react.fragment") : 0xeacb;




var emptyObject = {};
function deprecatedWarn(methodName) {
    if (!deprecatedWarn[methodName]) {
        //eslint-disable-next-line
        console.warn(methodName + " is deprecated");
        deprecatedWarn[methodName] = 1;
    }
}

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
function returnFalse() {
    return false;
}
function returnTrue() {
    return true;
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
function inherit(SubClass, SupClass) {
    function Bridge() {}
    var orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    var fn = SubClass.prototype = new Bridge();

    // 避免原型链拉长导致方法查找的性能开销
    extend(fn, orig);
    fn.constructor = SubClass;
    return fn;
}

var lowerCache = {};
function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}

function clearArray(a) {
    return a.splice(0, a.length);
}

function isFn(obj) {
    return __type.call(obj) === "[object Function]";
}

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

var rcamelize = /[-_][^-_]/g;
function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || target.indexOf("-") < 0 && target.indexOf("_") < 0) {
        return target;
    }
    //转换为驼峰风格
    var str = target.replace(rcamelize, function (match) {
        return match.charAt(1).toUpperCase();
    });
    return firstLetterLower(str);
}

function firstLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
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
    fireRef: function fireRef(fiber, dom, vnode) {
        if (fiber._disposed || fiber._isStateless) {
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

/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */
function Component(props, context) {
    //防止用户在构造器生成JSX
    Refs.currentOwner = this;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null;
}
var fakeObject = {
    enqueueSetState: returnFalse,
    _isMounted: returnFalse
};

Component.prototype = {
    constructor: Component, //必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState: function replaceState() {
        deprecatedWarn("replaceState");
    },

    isReactComponent: returnTrue,
    isMounted: function isMounted() {
        deprecatedWarn("isMounted");
        return (this.updater || fakeObject)._isMounted();
    },
    setState: function setState(state, cb) {
        (this.updater || fakeObject).enqueueSetState(state, cb);
    },
    forceUpdate: function forceUpdate(cb) {
        (this.updater || fakeObject).enqueueSetState(true, cb);
    },
    render: function render() {}
};

/*
 IndeterminateComponent = 0; // 不用
 FunctionalComponent = 1;
 ClassComponent = 2;
 HostRoot = 3; // 不用
 HostPortal = 4; // 不用
 HostComponent = 5; 
 HostText = 6;
 CallComponent = 7; // 不用
 CallHandlerPhase = 8;// 不用
 ReturnComponent = 9;// 不用
 Fragment = 10;// 不用
 Mode = 11; // 不用
 ContextConsumer = 12;// 不用
 ContextProvider = 13;// 不用
*/
function Vnode(type, tag, props, key, ref) {
    this.type = type;
    this.tag = tag;
    if (tag !== 6) {
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
    options.afterCreate(this);
}

Vnode.prototype = {
    getDOMNode: function getDOMNode() {
        return this.stateNode || null;
    },


    $$typeof: REACT_ELEMENT_TYPE
};

function Fragment(props) {
    return props.children;
}
/**
 * 虚拟DOM工厂
 *
 * @param {string|function|Component} type
 * @param {object} props
 * @param {array} ...children
 * @returns
 */

function createElement(type, config) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    var props = {},
        tag = 5,
        key = null,
        ref = null,
        argsLen = children.length;
    if (type && type.call) {
        tag = type.prototype && type.prototype.render ? 2 : 1;
    } else if (type === REACT_FRAGMENT_TYPE) {
        type = Fragment, tag = 1;
    } else if (type + "" !== type) {
        throw "React.createElement第一个参数只能是函数或字符串";
    }
    if (config != null) {
        for (var i in config) {
            var val = config[i];
            if (i === "key") {
                if (val !== void 0) {
                    key = val + "";
                }
            } else if (i === "ref") {
                if (val !== void 0) {
                    ref = val;
                }
            } else {
                props[i] = val;
            }
        }
    }

    if (argsLen === 1) {
        props.children = children[0];
    } else if (argsLen > 1) {
        props.children = children;
    }

    var defaultProps = type.defaultProps;
    if (defaultProps) {
        for (var propName in defaultProps) {
            if (props[propName] === void 666) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    return new Vnode(type, tag, props, key, ref);
}

function createVText(type, text) {
    var vnode = new Vnode(type, 6);
    vnode.text = text;
    return vnode;
}

// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中
function createVnode(node) {
    var type = node.nodeName,
        vnode;
    if (node.nodeType === 1) {
        vnode = new Vnode(type, 5);
        var ns = node.namespaceURI;
        if (!ns || ns.indexOf("html") >= 22) {
            vnode.type = type.toLowerCase(); //HTML的虚拟DOM的type需要小写化
        } else {
            //非HTML需要加上命名空间
            vnode.namespaceURI = ns;
        }
        vnode.props = getProps(node);
    } else {
        vnode = createVText(type, node.nodeValue);
    }
    vnode.stateNode = node;
    return vnode;
}

function getProps(node) {
    var attrs = node.attributes,
        props = {};
    for (var i = 0, attr; attr = attrs[i++];) {
        if (attr.specified) {
            var name = attr.name;
            if (name === "class") {
                name = "className";
            }
            props[name] = attr.value;
        }
    }
    return props;
}

var lastText;
var flattenIndex;
var flattenObject;
var flattenArray;
function flattenCb(child, index) {
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
    child.index = flattenIndex++;
    flattenArray.push(child);
}

function fiberizeChildren(c, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    flattenArray = [];
    //let vnode = fiber._reactInternalFiber;
    if (c !== void 666) {
        lastText = null;
        operateChildren(c, "", flattenCb);
    }
    flattenIndex = 0;
    return fiber._children = flattenObject;
}

function operateChildren(children, prefix, callback) {
    var iteratorFn;
    if (children) {
        if (children.forEach) {
            children.forEach(function (el, i) {
                operateChildren(el, prefix ? prefix + ":" + i : "." + i, callback);
            });
            return;
        } else if (iteratorFn = getIteractor(children)) {
            var iterator = iteratorFn.call(children),
                ii = 0,
                step;
            while (!(step = iterator.next()).done) {
                operateChildren(step.value, prefix ? prefix + ":" + ii : "." + ii, callback);
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

function cloneElement(vnode, props) {
    if (!vnode.tag === 6) {
        var clone = extend({}, vnode);
        delete clone._disposed;
        return clone;
    }
    var owner = vnode._owner,
        lastOwn = Refs.currentOwner,
        old = vnode.props,
        configs = {};
    if (props) {
        extend(extend(configs, old), props);
        configs.key = props.key !== void 666 ? props.key : vnode.key;
        if (props.ref !== void 666) {
            configs.ref = props.ref;
            owner = lastOwn;
        } else if (vnode._hasRef) {
            configs.ref = vnode.ref;
        }
    } else {
        configs = old;
    }
    Refs.currentOwner = owner;

    var args = [].slice.call(arguments, 0),
        argsLength = args.length;
    args[0] = vnode.type;
    args[1] = configs;
    if (argsLength === 2 && configs.children) {
        delete configs.children._disposed;
        args.push(configs.children);
    }
    var ret = createElement.apply(null, args);
    Refs.currentOwner = lastOwn;
    return ret;
}

var mapStack = [];
function mapWrapperCb(old, prefix) {
    if (old === void 0 || old === false || old === true) {
        old = null;
    }
    var cur = mapStack[0];
    var el = cur.callback.call(cur.context, old, cur.index);
    var index = cur.index;
    cur.index++;
    if (cur.isEach || el == null) {
        return;
    }
    if (el.tag < 6) {
        //如果返回的el等于old,还需要使用原来的key, _prefix
        var key = computeKey(old, el, prefix, index);
        cur.arr.push(cloneElement(el, { key: key }));
    } else if (el.type) {
        cur.arr.push(extend({}, el));
    } else {
        cur.arr.push(el);
    }
}
function K(el) {
    return el;
}
var Children = {
    only: function only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if (children && children.tag) {
            return children;
        }
        throw new Error("expect only one child");
    },
    count: function count(children) {
        if (children == null) {
            return 0;
        }
        var index = 0;
        operateChildren(children, "", function () {
            index++;
        });
        return index;
    },
    map: function map(children, callback, context, isEach) {
        if (children == null) {
            return children;
        }
        mapStack.unshift({
            index: 0,
            callback: callback,
            context: context,
            isEach: isEach,
            arr: []
        });
        operateChildren(children, "", mapWrapperCb);
        var top = mapStack.shift();
        return top.arr;
    },
    forEach: function forEach(children, callback, context) {
        Children.map(children, callback, context, true);
    },

    toArray: function toArray$$1(children) {
        if (children == null) {
            return [];
        }
        return Children.map(children, K);
    }
};
var rthimNumer = /\d+\$/;
function computeKey(old, el, prefix, index) {
    var curKey = el && el.key != null ? escapeKey(el.key) : null;
    var oldKey = old && old.key != null ? escapeKey(old.key) : null;
    var key = void 0;
    if (oldKey && curKey) {
        key = prefix + "$" + oldKey;
        if (oldKey !== curKey) {
            key = curKey + "/" + key;
        }
    } else {
        key = curKey || oldKey;
        if (key) {
            key = prefix + "$" + key;
        } else {
            key = prefix === "." ? prefix + index : prefix;
        }
    }
    return key.replace(rthimNumer, "$");
}

function escapeKey(key) {
    return String(key).replace(/[=:]/g, escaperFn);
}

var escaperLookup = {
    "=": "=0",
    ":": "=2"
};

function escaperFn(match) {
    return escaperLookup[match];
}

//用于后端的元素节点
function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
}

var NAMESPACE = {
    svg: "http://www.w3.org/2000/svg",
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    math: "http://www.w3.org/1998/Math/MathML"
};

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

var duplexMap = {
    color: 1,
    date: 1,
    datetime: 1,
    "datetime-local": 1,
    email: 1,
    month: 1,
    number: 1,
    password: 1,
    range: 1,
    search: 1,
    tel: 1,
    text: 1,
    time: 1,
    url: 1,
    week: 1,
    textarea: 1,
    checkbox: 2,
    radio: 2,
    "select-one": 3,
    "select-multiple": 3
};
var isStandard = "textContent" in document;
var fragment = document.createDocumentFragment();
function emptyElement(node) {
    var child;
    while (child = node.firstChild) {
        emptyElement(child);
        if (child === Refs.focusNode) {
            Refs.focusNode = false;
        }
        node.removeChild(child);
    }
}

var recyclables = {
    "#text": []
};
function removeElement(node) {
    if (!node) {
        return;
    }
    if (node.nodeType === 1) {
        if (isStandard) {
            node.textContent = "";
        } else {
            emptyElement(node);
        }
        node.__events = null;
    } else if (node.nodeType === 3) {
        //只回收文本节点
        if (recyclables["#text"].length < 100) {
            recyclables["#text"].push(node);
        }
    }
    if (node === Refs.focusNode) {
        Refs.focusNode = false;
    }
    fragment.appendChild(node);
    fragment.removeChild(node);
}

var versions = {
    88: 7, //IE7-8 objectobject
    80: 6, //IE6 objectundefined
    "00": NaN, // other modern browsers
    "08": NaN
};
/* istanbul ignore next  */
var msie = document.documentMode || versions[typeNumber(document.all) + "" + typeNumber(win.XMLHttpRequest)];

var modern = /NaN|undefined/.test(msie) || msie > 8;

function createElement$1(vnode, p) {
    var type = vnode.type,
        props = vnode.props,
        ns = vnode.namespaceURI,
        text = vnode.text;

    switch (type) {
        case "#text":
            //只重复利用文本节点
            var node = recyclables[type].pop();
            if (node) {
                node.nodeValue = text;
                return node;
            }
            return document.createTextNode(text);
        case "#comment":
            return document.createComment(text);
        case "svg":
            ns = NAMESPACE.svg;
            break;
        case "math":
            ns = NAMESPACE.math;
            break;
        case "div":
        case "span":
        case "p":
        case "tr":
        case "td":
        case "li":
            ns = "";
            break;
        default:
            if (!ns) {
                do {
                    if (p.tag === 5) {
                        ns = p.namespaceURI;
                        if (p.type === "foreignObject") {
                            ns = "";
                        }
                        break;
                    }
                } while (p = p.return);
            }
            break;
    }
    try {
        if (ns) {
            vnode.namespaceURI = ns;
            return document.createElementNS(ns, type);
        }
        //eslint-disable-next-line
    } catch (e) {}
    var elem = document.createElement(type);
    var inputType = props && props.type; //IE6-8下立即设置type属性
    if (inputType) {
        elem.type = inputType;
    }
    return elem;
}
function contains(a, b) {
    if (b) {
        while (b = b.parentNode) {
            if (b === a) {
                return true;
            }
        }
    }
    return false;
}
function insertElement(fiber, mountPoint) {
    if (fiber._disposed) {
        return;
    }
    //找到可用的父节点
    var p = fiber.return,
        parentNode;
    while (p) {
        if (p.tag === 5) {
            parentNode = p.stateNode;
            break;
        }
        p = p._return || p.return;
    }

    var dom = fiber.stateNode;
    var after = mountPoint ? mountPoint.nextSibling : parentNode.firstChild;

    if (after === dom) {
        return;
    }
    if (after === null && dom === parentNode.lastChild) {
        return;
    }
    if (after && !contains(parentNode, after)) {
        return;
    }
    var isElement = fiber.tag === 5;
    var prevFocus = isElement && document.activeElement;
    parentNode.insertBefore(dom, after);
    if (isElement && prevFocus !== document.activeElement && contains(document.body, prevFocus)) {
        try {
            Refs.focusNode = prevFocus;
            prevFocus.__inner__ = true;
            prevFocus.focus();
        } catch (e) {
            prevFocus.__inner__ = false;
        }
    }
}

function shallowEqual(objA, objB) {
    if (Object.is(objA, objB)) {
        return true;
    }
    //确保objA, objB都是对象
    if (typeNumber(objA) < 7 || typeNumber(objB) < 7) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

function PureComponent(props, context) {
    Component.call(this, props, context);
}

var fn$1 = inherit(PureComponent, Component);

fn$1.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
    var a = shallowEqual(this.props, nextProps);
    var b = shallowEqual(this.state, nextState);
    return !a || !b;
};
fn$1.isPureComponent = true;

/**
通过事件绑定实现受控组件
 */
var formElements = {
    select: 1,
    textarea: 1,
    input: 1,
    option: 1
};
var duplexData = {
    1: ["value", {
        onChange: 1,
        onInput: 1,
        readOnly: 1,
        disabled: 1
    }, function (a) {
        return a == null ? null : a + "";
    }, function (dom, value, vnode) {
        if (value == null) {
            return;
        }

        if (vnode.type === "input") {
            dom.__anuSetValue = true; //抑制onpropertychange
            dom.setAttribute("value", value);
            dom.__anuSetValue = false;
            if (dom.type === "number") {
                var valueAsNumber = parseFloat(dom.value) || 0;
                if (
                // eslint-disable-next-line
                value != valueAsNumber ||
                // eslint-disable-next-line
                value == valueAsNumber && dom.value != value) {
                    // Cast `value` to a string to ensure the value is set correctly. While
                    // browsers typically do this as necessary, jsdom doesn't.
                    value += "";
                } else {
                    return;
                }
            }
        }
        if (dom._persistValue !== value) {
            dom.__anuSetValue = true; //抑制onpropertychange
            dom._persistValue = dom.value = value;
            dom.__anuSetValue = false;
        }
    }, keepPersistValue, "change", "input"],
    2: ["checked", {
        onChange: 1,
        onClick: 1,
        readOnly: 1,
        disabled: 1
    }, function (a) {
        return !!a;
    }, function (dom, value, vnode) {
        if (vnode.props.value != null) {
            dom.value = vnode.props.value;
        }
        if (dom._persistValue !== value) {
            dom._persistValue = dom.checked = value;
        }
    }, keepPersistValue, "change", "click"],
    3: ["value", {
        onChange: 1,
        disabled: 1
    }, function (a) {
        return a;
    }, function (dom, value, vnode, isUncontrolled) {
        //只有在单选的情况，用户会乱修改select.value
        if (isUncontrolled) {
            if (!dom.multiple && dom.value !== dom._persistValue) {
                dom._persistValue = dom.value;
                dom._setValue = false;
            }
        } else {
            //props中必须有value
            if ("value" in vnode.props) {
                dom._persistValue = value;
            }
        }

        syncOptions({
            target: dom
        });
    }, syncOptions, "change"]
};

function inputControll(vnode, dom, props) {
    var domType = dom.type;
    var duplexType = duplexMap[domType];
    var isUncontrolled = dom._uncontrolled;
    if (duplexType) {
        var data = duplexData[duplexType];
        var duplexProp = data[0];
        var keys = data[1];
        var converter = data[2];
        var sideEffect = data[3];

        var value = converter(isUncontrolled ? dom._persistValue : props[duplexProp]);
        sideEffect(dom, value, vnode, isUncontrolled);
        if (isUncontrolled) {
            return;
        }

        var handle = data[4];
        var event1 = data[5];
        var event2 = data[6];
        if (!hasOtherControllProperty(props, keys)) {
            // eslint-disable-next-line
            console.warn("\u4F60\u4E3A" + vnode.type + "[type=" + domType + "]\u5143\u7D20\u6307\u5B9A\u4E86**\u53D7\u63A7\u5C5E\u6027**" + duplexProp + "\uFF0C\n\u4F46\u662F\u6CA1\u6709\u63D0\u4F9B\u53E6\u5916\u7684" + Object.keys(keys) + "\n\u6765\u64CD\u4F5C" + duplexProp + "\u7684\u503C\uFF0C\b\u6846\u67B6\u5C06\u4E0D\u5141\u8BB8\u4F60\u901A\u8FC7\u8F93\u5165\u6539\u53D8\u8BE5\u503C");
            dom["on" + event1] = handle;
            dom["on" + event2] = handle;
        } else {
            vnode.controlledCb = handle;
            Refs.controlledCbs.push(vnode);
        }
    } else {
        //处理option标签
        var arr = dom.children || [];
        for (var i = 0, el; el = arr[i]; i++) {
            dom.removeChild(el);
            i--;
        }
        if ("value" in props) {
            dom.duplexValue = dom.value = props.value;
        } else {
            dom.duplexValue = dom.text;
        }
    }
}

function hasOtherControllProperty(props, keys) {
    for (var key in keys) {
        if (props[key]) {
            return true;
        }
    }
}

function keepPersistValue(e) {
    var dom = e.target;
    var name = e.type === "textarea" ? "innerHTML" : /check|radio/.test(dom.type) ? "checked" : "value";
    var v = dom._persistValue;
    var noNull = v != null;
    var noEqual = dom[name] !== v; //2.0 , 2

    if (noNull && noEqual) {

        dom[name] = v;
    }
}

function syncOptions(e) {
    var target = e.target,
        value = target._persistValue,
        options = target.options;
    if (target.multiple) {
        updateOptionsMore(options, options.length, value);
    } else {
        updateOptionsOne(options, options.length, value);
    }
    target._setSelected = true;
}

function updateOptionsOne(options, n, propValue) {
    var stringValues = {},
        noDisableds = [];
    for (var i = 0; i < n; i++) {
        var option = options[i];
        var value = option.duplexValue;
        if (!option.disabled) {
            noDisableds.push(option);
        }
        if (value === propValue) {
            //精确匹配
            return setOptionSelected(option, true);
        }
        stringValues[value] = option;
    }
    var match = stringValues[propValue];
    if (match) {
        //字符串模糊匹配
        return setOptionSelected(match, true);
    }
    if (n && noDisableds[0]) {
        //选中第一个没有变disable的元素
        setOptionSelected(noDisableds[0], true);
    }
}

function updateOptionsMore(options, n, propValue) {
    var selectedValue = {};
    try {
        for (var i = 0; i < propValue.length; i++) {
            selectedValue["&" + propValue[i]] = true;
        }
    } catch (e) {
        /* istanbul ignore next */
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组'); // eslint-disable-line
    }
    for (var _i = 0; _i < n; _i++) {
        var option = options[_i];
        var value = option.duplexValue;
        var selected = selectedValue.hasOwnProperty("&" + value);
        setOptionSelected(option, selected);
    }
}

function setOptionSelected(dom, selected) {
    dom.selected = selected;
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
function patchStyle(dom, lastStyle, nextStyle) {
    if (lastStyle === nextStyle) {
        return;
    }

    for (var name in nextStyle) {
        var val = nextStyle[name];
        if (lastStyle[name] !== val) {
            name = cssName(name, dom);
            if (val !== 0 && !val) {
                val = ""; //清除样式
            } else if (rnumber.test(val) && !cssNumber[name]) {
                val = val + "px"; //添加单位
            }
            try {
                //node.style.width = NaN;node.style.width = 'xxxxxxx';
                //node.style.width = undefine 在旧式IE下会抛异常
                dom.style[name] = val; //应用样式
            } catch (e) {
                console.log("dom.style[" + name + "] = " + val + "throw error"); // eslint-disable-line
            }
        }
    }
    // 如果旧样式存在，但新样式已经去掉
    for (var _name in lastStyle) {
        if (!(_name in nextStyle)) {
            _name = cssName(_name, dom);
            dom.style[_name] = ""; //清除样式
        }
    }
}

var cssNumber = oneObject("animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom");

//var testStyle = document.documentElement.style
var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"];
var cssMap = oneObject("float", "cssFloat");

/**
 * 转换成当前浏览器可用的样式名
 * 
 * @param {any} name 
 * @returns 
 */
function cssName(name, dom) {
    if (cssMap[name]) {
        return cssMap[name];
    }
    var host = dom && dom.style || {};
    for (var i = 0, n = prefixes.length; i < n; i++) {
        var camelCase = camelize(prefixes[i] + name);
        if (camelCase in host) {
            return cssMap[name] = camelCase;
        }
    }
    return null;
}

var topFibers = [];
var topNodes = [];

function disposeVnode(fiber, updateQueue, silent) {
    if (fiber && !fiber._disposed) {
        options.beforeDelete(fiber._reactInnerFiber);
        if (fiber.name === "AnuInternalFiber") {
            var i = topFibers.indexOf(fiber);
            if (i !== -1) {
                topFibers.splice(i, 1);
                topNodes.splice(i, 1);
            }
        }

        if (fiber._return) {
            var dom = fiber._return.stateNode;
            delete dom.__events;
        }
        if (fiber.tag < 4) {
            disposeComponent(fiber, updateQueue, silent);
        } else {
            if (fiber.tag === 5) {
                disposeElement(fiber, updateQueue, silent);
            }
            updateQueue.push({
                node: fiber.stateNode,
                vnode: fiber,
                transition: remove
            });
        }
    }
}
function remove() {
    this.vnode._disposed = true;
    delete this.vnode.stateNode;
    removeElement(this.node);
}
function disposeElement(fiber, updateQueue, silent) {

    if (!silent) {
        fiber.addState("dispose");
        updateQueue.push(fiber);
    } else {
        if (fiber._isMounted()) {
            fiber._states = ["dispose"];
            updateQueue.push(fiber);
        }
    }
    disposeChildren(fiber._children, updateQueue, silent);
}

function disposeComponent(fiber, updateQueue, silent) {
    var instance = fiber.stateNode;
    if (!instance) {
        //没有实例化
        return;
    }

    if (!silent) {
        fiber.addState("dispose");
        updateQueue.push(fiber);
    } else if (fiber._isMounted && fiber._isMounted()) {
        if (silent === 1) {
            fiber._states.length = 0;
        }
        fiber.addState("dispose");
        updateQueue.push(fiber);
    }

    fiber._mountCarrier = fiber._mountPoint = NaN; //用null/undefined会碰到 xxx[0]抛错的问题
    disposeChildren(fiber._children, updateQueue, silent);
}

function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}

var dirtyComponents = [];
function mountSorter(u1, u2) {
    //按文档顺序执行
    u1._dirty = false;
    return u1._mountOrder - u2._mountOrder;
}
function flushUpdaters() {
    if (dirtyComponents.length) {
        var currentQueue = clearArray(dirtyComponents).sort(mountSorter);
        currentQueue.forEach(function (el) {
            delete el._dirty;
        });
        drainQueue(currentQueue);
    }
}

function enqueueUpdater(updater) {
    if (!updater._dirty) {
        updater.addState("hydrate");
        updater._dirty = true;
        dirtyComponents.push(updater);
    }
}
var placehoder = {
    transition: noop
};
function drainQueue(queue) {
    options.beforePatch();
    var fiber = void 0;
    while (fiber = queue.shift()) {
        // console.log(fiber.name, "执行" + fiber._states + " 状态");
        if (fiber._disposed) {
            continue;
        }
        var hook = Refs.errorHook;
        if (hook) {
            //如果存在医生节点
            var doctors = Refs.doctors,
                doctor = doctors[0],
                gotoCreateRejectQueue,
                addDoctor,
                silent; //2时添加disposed，1直接变成disposed
            switch (hook) {
                case "componentDidMount":
                case "componentDidUpdate":
                case "componentWillUnmount":
                    //render之后出错，拖动最后才构建错误列队
                    gotoCreateRejectQueue = queue.length === 0;
                    silent = 2;
                    break;
                case "render": //render出错，说明还没有执行render
                case "constructor":
                case "componentWillMount":
                case "componentWillUpdate":
                case "componentWillReceiveProps":
                    //render之前出错，会立即构建错误列队，然后加上医生节点之上的列队
                    gotoCreateRejectQueue = true;
                    queue = queue.filter(function (el) {
                        return el._mountOrder < doctor._mountOrder;
                    });
                    silent = 1;
                    addDoctor = true;
                    break;
            }
            if (gotoCreateRejectQueue) {
                delete Refs.error;
                delete Refs.doctors;
                delete Refs.errorHook;
                var rejectedQueue = [];
                // 收集要销毁的组件（要求必须resolved）
                // 错误列队的钩子如果发生错误，如果还没有到达医生节点，它的出错会被忽略掉，
                // 详见CompositeUpdater#catch()与ErrorBoundary#captureError()中的Refs.ignoreError开关
                doctors.forEach(function (doctor) {
                    disposeChildren(doctor._children, rejectedQueue, silent);
                    /* for (var i in doctor._children) {
                        var child = doctor._children[i];
                        disposeVnode(child, rejectedQueue, silent);
                    }*/
                    doctor._children = {};
                });
                // rejectedQueue = Array.from(new Set(rejectedQueue));
                doctors.forEach(function (doctor) {
                    if (addDoctor) {
                        rejectedQueue.push(doctor);
                        fiber = placehoder;
                    }
                    doctor.addState("catch");
                    rejectedQueue.push(doctor);
                });

                queue = rejectedQueue.concat(queue);
            }
        }
        fiber.transition(queue);
    }

    options.afterPatch();
    var error = Refs.error;
    if (error) {
        delete Refs.error;
        throw error;
    }
}

var globalEvents = {};
var eventPropHooks = {}; //用于在事件回调里对事件对象进行
var eventHooks = {}; //用于在元素上绑定特定的事件
//根据onXXX得到其全小写的事件名, onClick --> click, onClickCapture --> click,
// onMouseMove --> mousemove

var eventLowerCache = {
    onClick: "click",
    onChange: "change",
    onWheel: "wheel"
};
/**
 * 判定否为与事件相关
 *
 * @param {any} name
 * @returns
 */
function isEventName(name) {
    return (/^on[A-Z]/.test(name)
    );
}

var isTouch = "ontouchstart" in document;

function dispatchEvent(e, type, end) {
    //__type__ 在injectTapEventPlugin里用到
    e = new SyntheticEvent(e);
    if (type) {
        e.type = type;
    }
    var bubble = e.type;
    //var dom = e.target;
    var hook = eventPropHooks[bubble];
    if (hook && false === hook(e)) {
        return;
    }
    var paths = collectPaths(e.target, end || document);
    var captured = bubble + "capture";
    document.__async = true;

    triggerEventFlow(paths, captured, e);

    if (!e._stopPropagation) {
        triggerEventFlow(paths.reverse(), bubble, e);
    }
    document.__async = false;

    flushUpdaters();
    Refs.controlledCbs.forEach(function (el) {
        if (el.stateNode) {
            el.controlledCb({
                target: el.stateNode
            });
        }
    });
    Refs.controlledCbs.length = 0;
}

function collectPaths(from, end) {
    var paths = [];
    var node = from;
    while (node && !node.__events) {
        node = node.parentNode;
        if (end === from) {
            return paths;
        }
    }
    if (!node || node.nodeType > 1) {
        //如果跑到document上
        return paths;
    }
    var mid = node.__events;
    var vnode = mid.vnode;
    if (vnode._isPortal) {
        vnode = vnode.child;
    }
    do {
        if (vnode.tag === 5) {
            var dom = vnode.stateNode;
            if (dom === end) {
                break;
            }
            if (!dom) {
                break;
            }
            if (dom.__events) {
                paths.push({ dom: dom, events: dom.__events });
            }
        }
    } while (vnode = vnode.return); // eslint-disable-line
    return paths;
}

function triggerEventFlow(paths, prop, e) {
    for (var i = paths.length; i--;) {
        var path = paths[i];
        var fn = path.events[prop];
        if (isFn(fn)) {
            e.currentTarget = path.dom;
            fn.call(void 666, e);
            if (e._stopPropagation) {
                break;
            }
        }
    }
}

function addGlobalEvent(name, capture) {
    if (!globalEvents[name]) {
        globalEvents[name] = true;
        addEvent(document, name, dispatchEvent, capture);
    }
}

function addEvent(el, type, fn, bool) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, bool || false);
    } else if (el.attachEvent) {
        
    }
}

var rcapture = /Capture$/;
function getBrowserName(onStr) {
    var lower = eventLowerCache[onStr];
    if (lower) {
        return lower;
    }
    var camel = onStr.slice(2).replace(rcapture, "");
    lower = camel.toLowerCase();
    eventLowerCache[onStr] = lower;
    return lower;
}

/**
DOM通过event对象的relatedTarget属性提供了相关元素的信息。这个属性只对于mouseover和mouseout事件才包含值；
对于其他事件，这个属性的值是null。IE不支持realtedTarget属性，但提供了保存着同样信息的不同属性。
在mouseover事件触发时，IE的fromElement属性中保存了相关元素；
在mouseout事件出发时，IE的toElement属性中保存着相关元素。
但fromElement与toElement可能同时都有值
 */
function getRelatedTarget(e) {
    if (!e.timeStamp) {
        e.relatedTarget = e.type === "mouseover" ? e.fromElement : e.toElement;
    }
    return e.relatedTarget;
}

String("mouseenter,mouseleave").replace(/\w+/g, function (name) {
    eventHooks[name] = function (dom, type) {
        var mark = "__" + type;
        if (!dom[mark]) {
            dom[mark] = true;
            var mask = type === "mouseenter" ? "mouseover" : "mouseout";
            addEvent(dom, mask, function (e) {
                var t = getRelatedTarget(e);
                if (!t || t !== dom && !contains(dom, t)) {
                    var common = getLowestCommonAncestor(dom, t);
                    //由于不冒泡，因此paths长度为1
                    dispatchEvent(e, type, common);
                }
            });
        }
    };
});

function getLowestCommonAncestor(instA, instB) {
    var depthA = 0;
    for (var tempA = instA; tempA; tempA = tempA.parentNode) {
        depthA++;
    }
    var depthB = 0;
    for (var tempB = instB; tempB; tempB = tempB.parentNode) {
        depthB++;
    }

    // If A is deeper, crawl up.
    while (depthA - depthB > 0) {
        instA = instA.parentNode;
        depthA--;
    }

    // If B is deeper, crawl up.
    while (depthB - depthA > 0) {
        instB = instB.parentNode;
        depthB--;
    }

    // Walk in lockstep until we find a match.
    var depth = depthA;
    while (depth--) {
        if (instA === instB) {
            return instA;
        }
        instA = instA.parentNode;
        instB = instB.parentNode;
    }
    return null;
}

var specialHandles = {};
function createHandle(name, fn) {
    return specialHandles[name] = function (e) {
        if (fn && fn(e) === false) {
            return;
        }
        dispatchEvent(e, name);
    };
}

createHandle("change");
createHandle("doubleclick");
createHandle("scroll");
createHandle("wheel");
globalEvents.wheel = true;
globalEvents.scroll = true;
globalEvents.doubleclick = true;

if (isTouch) {
    eventHooks.click = eventHooks.clickcapture = function (dom) {
        dom.onclick = dom.onclick || noop;
    };
}

eventPropHooks.click = function (e) {
    return !e.target.disabled;
};

var fixWheelType = document.onwheel !== void 666 ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
eventHooks.wheel = function (dom) {
    addEvent(dom, fixWheelType, specialHandles.wheel);
};

eventPropHooks.wheel = function (event) {
    event.deltaX = "deltaX" in event ? event.deltaX : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
    "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    event.deltaY = "deltaY" in event ? event.deltaY : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
    "wheelDeltaY" in event ? -event.wheelDeltaY : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
    "wheelDelta" in event ? -event.wheelDelta : 0;
};

//react将text,textarea,password元素中的onChange事件当成onInput事件
eventHooks.changecapture = eventHooks.change = function (dom) {
    if (/text|password/.test(dom.type)) {
        addEvent(document, "input", specialHandles.change);
    }
};
var focusMap = {
    "focus": "focus",
    "blur": "blur"
};

function blurFocus(e) {
    var dom = e.target || e.srcElement;
    var type = focusMap[e.type];
    var isFocus = type === "focus";
    if (isFocus && dom.__inner__) {
        dom.__inner__ = false;
        return;
    }

    if (!isFocus && Refs.focusNode === dom) {
        Refs.focusNode = null;
    }
    do {
        if (dom.nodeType === 1) {
            if (dom.__events && dom.__events[type]) {
                dispatchEvent(e, type);
                break;
            }
        } else {
            break;
        }
    } while (dom = dom.parentNode);
}

"blur,focus".replace(/\w+/g, function (type) {
    globalEvents[type] = true;
    if (modern) {
        var mark = "__" + type;
        if (!document[mark]) {
            document[mark] = true;
            addEvent(document, type, blurFocus, true);
        }
    } else {
        eventHooks[type] = function (dom, name) {
            addEvent(dom, focusMap[name], blurFocus);
        };
    }
});

eventHooks.scroll = function (dom, name) {
    addEvent(dom, name, specialHandles[name]);
};

eventHooks.doubleclick = function (dom, name) {
    addEvent(document, "dblclick", specialHandles[name]);
};

function SyntheticEvent(event) {
    if (event.nativeEvent) {
        return event;
    }
    for (var i in event) {
        if (!eventProto[i]) {
            this[i] = event[i];
        }
    }
    if (!this.target) {
        this.target = event.srcElement;
    }
    this.fixEvent();
    this.timeStamp = new Date() - 0;
    this.nativeEvent = event;
}

var eventProto = SyntheticEvent.prototype = {
    fixEvent: noop, //留给以后扩展用
    fixHooks: noop,
    persist: noop,
    preventDefault: function preventDefault() {
        var e = this.nativeEvent || {};
        e.returnValue = this.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
        }
    },
    stopPropagation: function stopPropagation() {
        var e = this.nativeEvent || {};
        e.cancelBubble = this._stopPropagation = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
        this.stopPropagation();
        this.stopImmediate = true;
    },
    toString: function toString() {
        return "[object Event]";
    }
};
/* istanbul ignore next  */


/**
通过对象监控实现非受控组件
 */
var inputMonitor = {};
var rcheck = /checked|radio/;
var describe = {
    set: function set(value) {
        var controllProp = rcheck.test(this.type) ? "checked" : "value";
        if (this.type === "textarea") {
            this.innerHTML = value;
        }
        if (!this._observing) {
            if (!this._setValue) {
                //defaultXXX只会同步一次_persistValue
                var parsedValue = this[controllProp] = value;
                this._persistValue = Array.isArray(value) ? value : parsedValue;
                this._setValue = true;
            }
        } else {
            //如果用户私下改变defaultValue，那么_setValue会被抺掉
            this._setValue = value == null ? false : true;
        }
        this._defaultValue = value;
    },
    get: function get() {
        return this._defaultValue;
    },
    configurable: true
};

inputMonitor.observe = function (dom, name) {
    try {
        if ("_persistValue" in dom) {
            dom._setValue = true;
        }
        Object.defineProperty(dom, name, describe);
    } catch (e) {}
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//布尔属性的值末必为true,false
//https://github.com/facebook/react/issues/10589
var controlled = {
    value: 1,
    checked: 1
};

var isSpecialAttr = {
    style: 1,
    autoFocus: 1,
    defaultValue: 1,
    defaultChecked: 1,
    children: 1,
    innerHTML: 1,
    dangerouslySetInnerHTML: 1
};

var svgCache = {};
var strategyCache = {};
/**
 * 仅匹配 svg 属性名中的第一个驼峰处，如 viewBox 中的 wB，
 * 数字表示该特征在属性列表中重复的次数
 * -1 表示用 ":" 隔开的属性 (xlink:href, xlink:title 等)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
var svgCamelCase = {
    w: { r: 1, b: 1, t: 1 },
    e: { n: 1, t: 1, f: 1, p: 1, c: 1, m: 1, a: 2, u: 1, s: 1, v: 1 },
    o: { r: 1 },
    c: { m: 1 },
    p: { p: 1 },
    t: { s: 2, t: 1, u: 1, c: 1, d: 1, o: 1, x: 1, y: 1, l: 1 },
    l: { r: 1, m: 1, u: 1, b: -1, l: -1, s: -1 },
    r: { r: 1, u: 2, h: 1, w: 1, c: 1, e: 1 },
    h: { r: 1, a: 1, l: 1, t: 1 },
    y: { p: 1, s: 1, t: 1, c: 1 },
    g: { c: 1 },
    k: { a: -1, h: -1, r: -1, s: -1, t: -1, c: 1, u: 1 },
    m: { o: 1, l: 1, a: 1 },
    n: { c: 1, t: 1, u: 1 },
    s: { a: 3 },
    f: { x: 1, y: 1 },
    d: { e: 1, f: 1, m: 1, d: 1 },
    x: { c: 1 }
};

// SVG 属性列表中驼峰命名和短横线分隔命名特征值有重复
// 列出了重复特征中的短横线命名的属性名
var specialSVGPropertyName = {
    "overline-thickness": 2,
    "underline-thickness": 2,
    "overline-position": 2,
    "underline-position": 2,
    "stroke-miterlimit": 2,
    "baseline-shift": 2,
    "clip-path": 2,
    "font-size": 2,
    "font-size-adjust": 2,
    "font-stretch": 2,
    "font-style": 2,
    "text-decoration": 2,
    "vert-origin-x": 2,
    "vert-origin-y": 2,
    "paint-order": 2,
    "fill-rule": 2,
    "color-rendering": 2,
    "marker-end": 2,
    "pointer-events": 2,
    "units-per-em": 2,
    "strikethrough-thickness": 2,
    "lighting-color": 2
};

// 重复属性名的特征值列表
var repeatedKey = ["et", "ep", "em", "es", "pp", "ts", "td", "to", "lr", "rr", "re", "ht", "gc"];

function createRepaceFn(split) {
    return function (match) {
        return match.slice(0, 1) + split + match.slice(1).toLowerCase();
    };
}

var rhump = /[a-z][A-Z]/;
var toHyphen = createRepaceFn("-");
var toColon = createRepaceFn(":");

function getSVGAttributeName(name) {
    if (svgCache[name]) {
        return svgCache[name];
    }
    var key = name.match(rhump);
    if (!key) {
        return svgCache[name] = name;
    }

    var _ref = [].concat(_toConsumableArray(key[0].toLowerCase())),
        prefix = _ref[0],
        postfix = _ref[1];

    var orig = name;
    if (svgCamelCase[prefix] && svgCamelCase[prefix][postfix]) {
        var count = svgCamelCase[prefix][postfix];

        if (count === -1) {
            return svgCache[orig] = {
                name: name.replace(rhump, toColon),
                ifSpecial: true
            };
        }

        if (~repeatedKey.indexOf(prefix + postfix)) {
            var dashName = name.replace(rhump, toHyphen);
            if (specialSVGPropertyName[dashName]) {
                name = dashName;
            }
        }
    } else {
        name = name.replace(rhump, toHyphen);
    }

    return svgCache[orig] = name;
}

function diffProps(dom, lastProps, nextProps, fiber) {
    options.beforeProps(fiber);
    var isSVG = fiber.namespaceURI === NAMESPACE.svg;
    var tag = fiber.type;
    //eslint-disable-next-line
    for (var name in nextProps) {
        var val = nextProps[name];
        if (val !== lastProps[name]) {
            var which = tag + isSVG + name;
            var action = strategyCache[which];
            if (!action) {
                action = strategyCache[which] = getPropAction(dom, name, isSVG);
            }
            actionStrategy[action](dom, name, val, lastProps, fiber);
        }
    }
    //如果旧属性在新属性对象不存在，那么移除DOM eslint-disable-next-line
    for (var _name in lastProps) {
        if (!nextProps.hasOwnProperty(_name)) {
            var _which = tag + isSVG + _name;
            var _action = strategyCache[_which];
            if (!_action) {
                continue;
            }
            actionStrategy[_action](dom, _name, false, lastProps, fiber);
        }
    }
}

function isBooleanAttr(dom, name) {
    var val = dom[name];
    return val === true || val === false;
}
/**
 * 根据一个属性所在的元素或元素的文档类型，就可以永久决定该使用什么策略操作它
 *
 * @param {any} dom 元素节点
 * @param {any} name 属性名
 * @param {any} isSVG
 * @returns
 */
function getPropAction(dom, name, isSVG) {
    if (isSVG && name === "className") {
        return "svgClass";
    }
    if (isSpecialAttr[name]) {
        return name;
    }
    if (isEventName(name)) {
        return "event";
    }

    if (isSVG) {
        return "svgAttr";
    }
    //img.width = '100px'时,取img.width为0,必须用setAttribute
    if (name === "width" || name === "height") {
        return "attribute";
    }
    if (isBooleanAttr(dom, name)) {
        return "booleanAttr";
    }
    return name.indexOf("data-") === 0 || dom[name] === void 666 ? "attribute" : "property";
}
var builtinStringProps = {
    className: 1,
    title: 1,
    name: 1,
    type: 1,
    alt: 1,
    lang: 1
};

var rform = /textarea|input|select/i;
function uncontrolled(dom, name, val, lastProps, fiber) {
    if (rform.test(dom.nodeName)) {
        if (!dom._uncontrolled) {
            dom._uncontrolled = true;
            inputMonitor.observe(dom, name); //重写defaultXXX的setter/getter
        }
        dom._observing = false;
        if (fiber.type === "select" && dom._setValue && !lastProps.multiple !== !fiber.props.multiple) {
            //当select的multiple发生变化，需要重置selectedIndex，让底下的selected生效
            dom.selectedIndex = dom.selectedIndex;
            dom._setValue = false;
        }
        dom[name] = val;
        dom._observing = true;
    } else {
        dom.setAttribute(name, val);
    }
}

var actionStrategy = {
    innerHTML: noop,
    defaultValue: uncontrolled,
    defaultChecked: uncontrolled,
    children: noop,
    style: function style(dom, _, val, lastProps) {
        patchStyle(dom, lastProps.style || emptyObject, val || emptyObject);
    },
    autoFocus: function autoFocus(dom) {
        if (duplexMap[dom.type] < 3 || dom.contentEditable === "true") {
            dom.focus();
        }
    },
    svgClass: function svgClass(dom, name, val) {
        if (!val) {
            dom.removeAttribute("class");
        } else {
            dom.setAttribute("class", val);
        }
    },
    svgAttr: function svgAttr(dom, name, val) {
        // http://www.w3school.com.cn/xlink/xlink_reference.asp
        // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enh
        // a ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
        // xlinkTitle, xlinkType eslint-disable-next-line
        var method = typeNumber(val) < 3 && !val ? "removeAttribute" : "setAttribute";
        var nameRes = getSVGAttributeName(name);
        if (nameRes.ifSpecial) {
            var prefix = nameRes.name.split(":")[0];
            // 将xlinkHref 转换为 xlink:href
            dom[method + "NS"](NAMESPACE[prefix], nameRes.name, val || "");
        } else {
            dom[method](nameRes, val || "");
        }
    },
    booleanAttr: function booleanAttr(dom, name, val) {
        // 布尔属性必须使用el.xxx = true|false方式设值 如果为false, IE全系列下相当于setAttribute(xxx,""),
        // 会影响到样式,需要进一步处理 eslint-disable-next-line
        dom[name] = !!val;
        if (dom[name] === false) {
            dom.removeAttribute(name);
        } else if (dom[name] === "false") {
            //字符串属性会将它转换为false
            dom[name] = "";
        }
    },
    attribute: function attribute(dom, name, val) {
        if (val == null || val === false) {
            return dom.removeAttribute(name);
        }
        try {
            dom.setAttribute(name, val);
        } catch (e) {
            console.warn("setAttribute error", name, val); // eslint-disable-line
        }
    },
    property: function property(dom, name, val) {
        // 尝试直接赋值，部分情况下会失败，如给 input 元素的 size 属性赋值 0 或字符串
        // 这时如果用 setAttribute 则会静默失败
        if (controlled[name]) {
            return;
        }
        try {
            if (!val && val !== 0) {
                //如果它是字符串属性，并且不等于""，清空
                if (builtinStringProps[name]) {
                    dom[name] = "";
                }
                dom.removeAttribute(name);
            } else {
                dom[name] = val;
            }
        } catch (e) {
            try {
                //修改type会引发多次报错
                dom.setAttribute(name, val);
            } catch (e) {/*ignore*/}
        }
    },
    event: function event(dom, name, val, lastProps, fiber) {
        var events = dom.__events || (dom.__events = {});
        events.vnode = fiber;
        var refName = toLowerCase(name.slice(2));
        if (val === false) {
            delete events[refName];
        } else {
            if (!lastProps[name]) {
                //添加全局监听事件
                var eventName = getBrowserName(name);
                var hook = eventHooks[eventName];
                addGlobalEvent(eventName);
                if (hook) {
                    hook(dom, eventName);
                }
            }
            //onClick --> click, onClickCapture --> clickcapture
            events[refName] = val;
        }
    },
    dangerouslySetInnerHTML: function dangerouslySetInnerHTML(dom, name, val, lastProps) {
        var oldhtml = lastProps[name] && lastProps[name].__html;
        var html = val && val.__html;
        if (html !== oldhtml) {
            dom.innerHTML = html;
        }
    }
};

/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */
function HostFiber(vnode, parentFiber) {
    extend(this, vnode);
    this.name = vnode.type;
    this.return = parentFiber;
    this._states = ["resolve"];
    //  this.namesplace
    this._reactInternalFiber = vnode;
    this._mountOrder = Refs.mountOrder++;
}

HostFiber.prototype = {
    addState: function addState(state) {
        var states = this._states;
        if (states[states.length - 1] !== state) {
            states.push(state);
        }
    },
    transition: function transition(updateQueue) {
        var state = this._states.shift();
        if (state) {
            this[state](updateQueue);
        }
    },
    init: function init(updateQueue, mountCarrier, initChildren) {
        var dom = this.stateNode = createElement$1(this, this.return);
        var beforeDOM = mountCarrier.dom;
        mountCarrier.dom = dom;
        if (this.tag === 5) {
            initChildren(this);
        }
        insertElement(this, beforeDOM);
        if (this.tag === 5) {
            this.attr();
            updateQueue.push(this);
        }
    },

    _isMounted: returnFalse,
    attr: function attr() {
        var type = this.type,
            props = this.props,
            lastProps = this.lastProps,
            dom = this.stateNode;

        diffProps(dom, lastProps || emptyObject, props, this);
        if (formElements[type]) {
            inputControll(this, dom, props);
        }
    },
    resolve: function resolve() {
        this._isMounted = returnTrue;
        Refs.fireRef(this, this.stateNode, this._reactInternalFiber);
    },
    dispose: function dispose() {
        Refs.fireRef(this, null, this._reactInternalFiber);
    }
};

function AnuPortal(props) {
    return props.children;
}

function createPortal(children, node) {
    var fiber,
        events = node.__events;
    if (events) {
        fiber = node.__events.vnode;
    } else {
        events = node.__events = {};
        var vnode = createVnode(node);
        fiber = new HostFiber(vnode);
        events.vnode = fiber;
    }
    fiber._isPortal = true;
    var child = createElement(AnuPortal, { children: children });
    child._return = fiber;
    return child;
}

var check = function check() {
    return check;
};
check.isRequired = check;
var PropTypes = {
    array: check,
    bool: check,
    func: check,
    number: check,
    object: check,
    string: check,
    any: check,
    arrayOf: check,
    element: check,
    instanceOf: check,
    node: check,
    objectOf: check,
    oneOf: check,
    oneOfType: check,
    shape: check
};

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// https://github.com/jamiebuilds/create-react-context
// https://codesandbox.io/s/7kw2j5kl7j
var uuid = 1;
function gud() {
    return uuid++;
}

var MAX_SIGNED_31_BIT_INT = 1073741823;

function createEventEmitter(value) {
    var handlers = [];
    return {
        on: function on(handler) {
            handlers.push(handler);
        },
        off: function off(handler) {
            handlers = handlers.filter(function (h) {
                return h !== handler;
            });
        },
        get: function get() {
            return value;
        },
        set: function set(newValue, changedBits) {
            value = newValue;
            handlers.forEach(function (handler) {
                return handler(value, changedBits);
            });
        }
    };
}

function onlyChild(children) {
    return Array.isArray(children) ? children[0] : children;
}

function createContext(defaultValue, calculateChangedBits) {
    var contextProp = "__create-react-context-" + gud() + "__";
    function Provider(props, context) {
        Component.call(this, props, context);
        this.emitter = createEventEmitter(props.value);
    }
    Provider.childContextTypes = _defineProperty({}, contextProp, PropTypes.object.isRequired);
    var fn = inherit(Provider, Component);
    fn.getChildContext = function () {
        return _defineProperty({}, contextProp, this.emitter);
    };
    fn.componentWillReceiveProps = function (nextProps) {
        if (this.props.value !== nextProps.value) {
            var oldValue = this.props.value;
            var newValue = nextProps.value;
            var changedBits = void 0;
            if (Object.is(oldValue, newValue)) {
                changedBits = 0; // No change
            } else {
                changedBits = typeof calculateChangedBits === "function" ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

                changedBits |= 0;

                if (changedBits !== 0) {
                    this.emitter.set(nextProps.value, changedBits);
                }
            }
        }
    };
    fn.render = function () {
        return this.props.children;
    };
    function Consumer(props, context) {
        var _this = this;

        Component.call(this, props, context);

        this.observedBits = 0;
        this.state = {
            value: this.getValue()
        };
        this.onUpdate = function (newValue, changedBits) {
            var observedBits = _this.observedBits | 0;
            if ((observedBits & changedBits) !== 0) {
                _this.setState({ value: _this.getValue() });
            }
        };
    }
    Consumer.contextTypes = _defineProperty({}, contextProp, PropTypes.object);
    var fn2 = inherit(Consumer, Component);
    fn2.componentWillReceiveProps = function (nextProps) {
        var observedBits = nextProps.observedBits;

        this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
        : observedBits;
    };
    fn2.getValue = function () {
        if (this.context[contextProp]) {
            return this.context[contextProp].get();
        } else {
            return defaultValue;
        }
    };

    fn2.componentDidMount = function () {
        if (this.context[contextProp]) {
            this.context[contextProp].on(this.onUpdate);
        }
        var observedBits = this.props.observedBits;

        this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
        : observedBits;
    };

    fn2.componentWillUnmount = function () {
        if (this.context[contextProp]) {
            this.context[contextProp].off(this.onUpdate);
        }
    };

    fn2.render = function () {
        return onlyChild(this.props.children)(this.state.value);
    };
    return {
        Provider: Provider,
        Consumer: Consumer
    };
}

function pushError(instance, hook, error) {
    var names = [];
    var catchUpdater = findCatchComponent(instance, names);
    instance.updater._hasError = true;
    var stack = describeError(names, hook);
    if (catchUpdater) {
        disableHook(instance.updater); //禁止患者节点执行钩子
        catchUpdater.errorInfo = catchUpdater.errorInfo || [error, { componentStack: stack }, instance];
        if (!Refs.errorHook) {
            Refs.errorHook = hook;
            Refs.doctors = [catchUpdater];
        } else {
            if (Refs.doctors.indexOf(catchUpdater) === -1) {
                Refs.doctors.push(catchUpdater);
            }
        }

        delete catchUpdater.child;
    } else {
        console.warn(stack); // eslint-disable-line
        //如果同时发生多个错误，那么只收集第一个错误，并延迟到afterPatch后执行
        if (!Refs.error) {
            Refs.error = error;
        }
    }
}
function captureError(instance, hook, args) {
    try {
        var fn = instance[hook];
        if (fn) {
            return fn.apply(instance, args);
        }
        return true;
    } catch (error) {
        if (hook === "componentWillUnmount") {
            instance[hook] = noop;
        }
        pushError(instance, hook, error);
    }
}
function describeError(names, hook) {
    var segments = ["**" + hook + "** method occur error "];
    names.forEach(function (name, i) {
        if (names[i + 1]) {
            segments.push("in " + name + " (created By " + names[i + 1] + ")");
        }
    });
    return segments.join("\n").trim();
}
//让该组件不要再触发钩子
function disableHook(u) {
    u.hydrate = u.render = u.resolve = noop;
}
/**
 * 此方法遍历医生节点中所有updater，收集沿途的标签名与组件名
 */
function findCatchComponent(target, names) {
    var fiber = target.updater,
        instance,
        name,
        catchIt;
    do {
        name = fiber.name;
        if (fiber.name === "AnuInternalFiber") {
            if (catchIt) {
                return catchIt;
            }
            disposeVnode(fiber, [], true);
            break;
        } else if (fiber.tag < 4) {
            //1,2
            names.push(name);
            instance = fiber.stateNode;
            if (instance.componentDidCatch) {
                if (fiber._isDoctor) {
                    disableHook(fiber);
                } else if (!catchIt && target !== instance) {
                    catchIt = fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
    } while (fiber = fiber.return);
}

function alwaysNull() {
    return null;
}

/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */
function ComponentFiber(vnode, parentFiber) {
    extend(this, vnode);
    var type = vnode.type;
    this.name = type.displayName || type.name;
    this.return = parentFiber;
    this.context = getMaskedContext(getContextProvider(parentFiber), type.contextTypes);
    this._reactInternalFiber = vnode;
    this._pendingCallbacks = [];
    this._pendingStates = [];
    this._states = ["resolve"];
    this._mountOrder = Refs.mountOrder++;

    //  fiber总是保存最新的数据，如state, props, context
    //  this._hydrating = true 表示组件会调用render方法及componentDidMount/Update钩子
    //  this._nextCallbacks = [] 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
}

ComponentFiber.prototype = {
    addState: function addState(state) {
        var states = this._states;
        if (states[states.length - 1] !== state) {
            states.push(state);
        }
    },
    transition: function transition(updateQueue) {
        var state = this._states.shift();
        if (state) {
            this[state](updateQueue);
        }
    },
    enqueueSetState: function enqueueSetState(state, cb) {
        if (state === true) {
            //forceUpdate
            this._forceUpdate = true;
        } else {
            //setState
            this._pendingStates.push(state);
        }
        if (this._hydrating) {
            //组件在更新过程（_hydrating = true），其setState/forceUpdate被调用
            //那么会延期到下一个渲染过程调用
            if (!this._nextCallbacks) {
                this._nextCallbacks = [cb];
            } else {
                this._nextCallbacks.push(cb);
            }
            return;
        } else {
            if (isFn(cb)) {
                this._pendingCallbacks.push(cb);
            }
        }
        if (document.__async) {
            //在事件句柄中执行setState会进行合并
            enqueueUpdater(this);
            return;
        }
        if (this._isMounted === returnTrue) {
            if (this._receiving) {
                //componentWillReceiveProps中的setState/forceUpdate应该被忽略
                return;
            }
            this.addState("hydrate");
            drainQueue([this]);
        }
    },
    mergeStates: function mergeStates() {
        var instance = this.stateNode,
            pendings = this._pendingStates,
            n = pendings.length,
            state = instance.state;
        if (n === 0) {
            return state;
        }
        var nextState = extend({}, state); //每次都返回新的state
        for (var i = 0; i < n; i++) {
            var pending = pendings[i];
            if (pending && pending.call) {
                pending = pending.call(instance, nextState, this.props);
            }
            extend(nextState, pending);
        }
        pendings.length = 0;
        return nextState;
    },


    _isMounted: returnFalse,
    init: function init(updateQueue, mountCarrier) {
        var props = this.props,
            context = this.context,
            type = this.type,
            tag = this.tag,
            isStateless = tag === 1,
            instance = void 0,
            mixin = void 0;
        //实例化组件

        try {
            var lastOwn = Refs.currentOwner;
            if (isStateless) {
                instance = {
                    refs: {},
                    __proto__: type.prototype,
                    render: function render() {
                        return type(this.props, this.context);
                    }
                };
                Refs.currentOwner = instance;
                mixin = type(props, context);
            } else {
                instance = new type(props, context);
                Refs.currentOwner = instance;
            }
        } catch (e) {
            //失败时，则创建一个假的instance
            instance = {
                updater: this
            };
            //  vnode.stateNode = instance;
            this.stateNode = instance;
            return pushError(instance, "constructor", e);
        } finally {
            Refs.currentOwner = lastOwn;
        }
        //如果是无状态组件需要再加工
        if (isStateless) {
            if (mixin && mixin.render) {
                //带生命周期的
                extend(instance, mixin);
            } else {
                //不带生命周期的
                this.child = mixin;
                this._isStateless = true;
                this.mergeStates = alwaysNull;
                this._willReceive = false;
            }
        }

        this.stateNode = instance;
        getDerivedStateFromProps(this, type, props, instance.state);
        //如果没有调用constructor super，需要加上这三行
        instance.props = props;
        instance.context = context;
        instance.updater = this;
        var carrier = this._return ? {} : mountCarrier;
        this._mountCarrier = carrier;
        this._mountPoint = carrier.dom || null;
        //this._updateQueue = updateQueue;
        if (instance.componentWillMount) {
            captureError(instance, "componentWillMount", []);
        }
        instance.state = this.mergeStates();
        //让顶层的元素updater进行收集
        this.render(updateQueue);
        updateQueue.push(this);
    },
    hydrate: function hydrate(updateQueue, inner) {
        var instance = this.stateNode,
            context = this.context,
            props = this.props;

        if (this._states[0] === "hydrate") {
            this._states.shift(); // ReactCompositeComponentNestedState-state
        }
        var state = this.mergeStates();
        var shouldUpdate = true;
        if (!this._forceUpdate && !captureError(instance, "shouldComponentUpdate", [props, state, context])) {
            shouldUpdate = false;

            var nodes = collectComponentNodes(this._children);
            var carrier = this._mountCarrier;
            carrier.dom = this._mountPoint;
            nodes.forEach(function (el) {
                insertElement(el, carrier.dom);
                carrier.dom = el.stateNode;
            });
        } else {
            captureError(instance, "componentWillUpdate", [props, state, context]);
            var lastProps = instance.props,
                lastState = instance.state;

            this._hookArgs = [lastProps, lastState];
        }

        if (this._hasError) {
            return;
        }

        delete this._forceUpdate;
        //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
        instance.props = props;
        instance.state = state;
        instance.context = context;
        if (!inner) {
            this._mountCarrier.dom = this._mountPoint;
        }

        if (shouldUpdate) {
            this.render(updateQueue);
        }
        this.addState("resolve");
        updateQueue.push(this);
    },
    render: function render(updateQueue) {
        var instance = this.stateNode,
            children = emptyObject,
            fibers = this._children || emptyObject,
            rendered = void 0,
            number = void 0;


        this._hydrating = true;
        //给下方使用的context

        if (instance.getChildContext) {
            var c = getContextProvider(this.return);
            c = getUnmaskedContext(instance, c);
            this._unmaskedContext = c;
        }

        if (this._willReceive === false) {
            rendered = this.child; //原来是vnode.child
            delete this._willReceive;
        } else {
            var lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            rendered = captureError(instance, "render", []);
            if (this._hasError) {
                rendered = true;
            }
            Refs.currentOwner = lastOwn;
        }
        number = typeNumber(rendered);
        if (number > 2) {
            children = fiberizeChildren(rendered, this);
        } else {
            //undefinded, null, boolean
            this._children = children; //emptyObject
            delete this.child;
        }
        Refs.diffChildren(fibers, children, this, updateQueue, this._mountCarrier);
    },

    // ComponentDidMount/update钩子，React Chrome DevTools的钩子， 组件ref, 及错误边界
    resolve: function resolve(updateQueue) {
        var instance = this.stateNode,
            vnode = this._reactInternalFiber;

        var hasMounted = this._isMounted();
        if (!hasMounted) {
            this._isMounted = returnTrue;
        }
        if (this._hydrating) {
            var hookName = hasMounted ? "componentDidUpdate" : "componentDidMount";
            captureError(instance, hookName, this._hookArgs || []);
            //执行React Chrome DevTools的钩子
            if (hasMounted) {
                options.afterUpdate(instance);
            } else {
                options.afterMount(instance);
            }
            delete this._hookArgs;
            delete this._hydrating;
        }

        if (this._hasError) {
            return;
        } else {
            //执行组件ref（发生错误时不执行）
            if (vnode._hasRef) {
                Refs.fireRef(this, instance, vnode);
                vnode._hasRef = false;
            }
            clearArray(this._pendingCallbacks).forEach(function (fn) {
                fn.call(instance);
            });
        }
        transfer.call(this, updateQueue);
    },
    catch: function _catch(queue) {
        var instance = this.stateNode;
        // delete Refs.ignoreError;

        this._states.length = 0;
        this._children = {};
        this._isDoctor = this._hydrating = true;
        instance.componentDidCatch.apply(instance, this.errorInfo);
        delete this.errorInfo;
        this._hydrating = false;
        transfer.call(this, queue);
    },
    dispose: function dispose() {
        var instance = this.stateNode;

        options.beforeUnmount(instance);
        instance.setState = instance.forceUpdate = returnFalse;

        Refs.fireRef(this, null, this._reactInternalFiber);
        captureError(instance, "componentWillUnmount", []);
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        this._isMounted = returnFalse;
        this._disposed = true;
    }
};
function transfer(queue) {
    var cbs = this._nextCallbacks,
        cb;
    if (cbs && cbs.length) {
        //如果在componentDidMount/Update钩子里执行了setState，那么再次渲染此组件
        do {
            cb = cbs.shift();
            if (isFn(cb)) {
                this._pendingCallbacks.push(cb);
            }
        } while (cbs.length);
        delete this._nextCallbacks;
        this.addState("hydrate");
        queue.push(this);
    }
}
function getDerivedStateFromProps(updater, type, props, state) {
    if (isFn(type.getDerivedStateFromProps)) {
        state = type.getDerivedStateFromProps.call(null, props, state);
        if (state != null) {
            updater._pendingStates.push(state);
        }
    }
}

function getMaskedContext(curContext, contextTypes) {
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

function getUnmaskedContext(instance, parentContext) {
    var context = instance.getChildContext();
    if (context) {
        parentContext = extend(extend({}, parentContext), context);
    }
    return parentContext;
}
function getContextProvider(fiber) {
    do {
        var c = fiber._unmaskedContext;
        if (c) {
            return c;
        }
    } while (fiber = fiber.return);
}

//收集fiber
function collectComponentNodes(children) {
    var ret = [];
    for (var i in children) {
        var child = children[i];
        var instance = child.stateNode;
        if (child._disposed) {
            continue;
        }
        if (child.tag > 4) {
            ret.push(child);
        } else {
            var fiber = instance.updater;
            if (child.child) {
                var args = collectComponentNodes(fiber._children);
                ret.push.apply(ret, args);
            }
        }
    }
    return ret;
}
//明天测试ref,与tests

//[Top API] React.isValidElement


//[Top API] ReactDOM.render
function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
//[Top API] ReactDOM.unstable_renderSubtreeIntoContainer

//[Top API] ReactDOM.unmountComponentAtNode
function unmountComponentAtNode(container) {
    var rootIndex = topNodes.indexOf(container);
    if (rootIndex > -1) {
        var lastFiber = topFibers[rootIndex];
        var queue = [];
        disposeVnode(lastFiber, queue);
        drainQueue(queue);
        emptyElement(container);
        container.__component = null;
        return true;
    }
    return false;
}
//[Top API] ReactDOM.findDOMNode
function findDOMNode(instanceOrElement) {
    if (instanceOrElement == null) {
        //如果是null
        return null;
    }
    if (instanceOrElement.nodeType) {
        //如果本身是元素节点
        return instanceOrElement;
    }
    //实例必然拥有updater与render
    if (instanceOrElement.render) {
        var fiber = instanceOrElement.updater;
        var c = fiber.child;
        if (c) {
            return findDOMNode(c.stateNode);
        } else {
            return null;
        }
    }
}

var AnuInternalFiber = function AnuInternalFiber() {
    Component.call(this);
};
AnuInternalFiber.displayName = "AnuInternalFiber"; //fix IE6-8函数没有name属性
var fn$2 = inherit(AnuInternalFiber, Component);

fn$2.render = function () {
    return this.props.child;
};
// ReactDOM.render的内部实现 Host
function renderByAnu(vnode, root, callback) {
    var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (!(root && root.appendChild)) {
        throw "ReactDOM.render\u7684\u7B2C\u4E8C\u4E2A\u53C2\u6570\u9519\u8BEF"; // eslint-disable-line
    }
    //__component用来标识这个真实DOM是ReactDOM.render的容器，通过它可以取得上一次的虚拟DOM
    // 但是在IE6－8中，文本/注释节点不能通过添加自定义属性来引用虚拟DOM，这时我们额外引进topFibers,
    //topNodes来寻找它们。
    Refs.currentOwner = null; //防止干扰
    var rootIndex = topNodes.indexOf(root),
        wrapperFiber = void 0,
        updateQueue = [],
        mountCarrier = {},
        wrapperVnode = createElement(AnuInternalFiber, { child: vnode });

    if (rootIndex !== -1) {
        wrapperFiber = topFibers[rootIndex];
        if (wrapperFiber._hydrating) {
            //如果是在componentDidMount/Update中使用了ReactDOM.render，那么将延迟到此组件的resolve阶段执行
            wrapperFiber._pendingCallbacks.push(renderByAnu.bind(null, vnode, root, callback, context));
            return wrapperFiber.child.stateNode; //这里要改
        }
        //updaterQueue是用来装载fiber， mountCarrier是用来确保节点插入正确的位置
        wrapperFiber = receiveVnode(wrapperFiber, wrapperVnode, updateQueue, mountCarrier);
    } else {
        emptyElement(root);
        topNodes.push(root);
        rootIndex = topNodes.length - 1;
        var rootFiber = new HostFiber(createVnode(root));
        rootFiber.stateNode = root;
        rootFiber._unmaskedContext = context;
        var children = rootFiber._children = {
            ".0": wrapperVnode
        };
        mountChildren(children, rootFiber, updateQueue, mountCarrier);
        wrapperFiber = rootFiber.child;
    }
    topFibers[rootIndex] = wrapperFiber;
    root.__component = wrapperFiber; //compat!
    if (callback) {
        wrapperFiber._pendingCallbacks.push(callback.bind(wrapperFiber.child.stateNode));
    }

    drainQueue(updateQueue);
    //组件虚拟DOM返回组件实例，而元素虚拟DOM返回元素节点
    return wrapperFiber.child.stateNode;
}

/**
 * 
 * @param {Vnode} vnode 
 * @param {Fiber} parentFiber 
 * @param {Array} updateQueue 
 * @param {Object} mountCarrier 
 */
function mountVnode(vnode, parentFiber, updateQueue, mountCarrier) {
    options.beforeInsert(vnode);
    var useHostFiber = vnode.tag > 4;
    var fiberCtor = useHostFiber ? HostFiber : ComponentFiber;
    var fiber = new fiberCtor(vnode, parentFiber);
    if (vnode._return) {
        var p = fiber._return = vnode._return;
        p.child = fiber;
    }
    fiber.init(updateQueue, mountCarrier, function (f) {
        var children = fiberizeChildren(f.props.children, f);
        mountChildren(children, f, updateQueue, {});
    });
    return fiber;
}
/**
 * 重写children对象中的vnode为fiber，并用child, sibling, return关联各个fiber
 * @param {Object} children 
 * @param {Fiber} parentFiber 
 * @param {Array} updateQueue 
 * @param {Object} mountCarrier 
 */
function mountChildren(children, parentFiber, updateQueue, mountCarrier) {
    var prevFiber, firstFiber;
    //	index = 0;
    for (var i in children) {
        var fiber = children[i] = mountVnode(children[i], parentFiber, updateQueue, mountCarrier);
        //	fiber.index = index++;
        if (!firstFiber) {
            parentFiber.child = firstFiber = fiber;
        }
        if (prevFiber) {
            prevFiber.sibling = fiber;
        }
        prevFiber = fiber;
        if (Refs.errorHook) {
            break;
        }
    }
}

function updateVnode(fiber, vnode, updateQueue, mountCarrier) {
    var dom = fiber.stateNode;
    options.beforeUpdate(vnode);
    if (fiber.tag > 4) {
        //文本，元素

        insertElement(fiber, mountCarrier.dom);
        mountCarrier.dom = dom;

        if (fiber.tag === 6) {
            //文本
            if (vnode.text !== fiber.text) {
                dom.nodeValue = fiber.text = vnode.text;
            }
        } else {
            //元素
            fiber._reactInternalFiber = vnode;
            fiber.lastProps = fiber.props;
            var props = fiber.props = vnode.props;
            var fibers = fiber._children;
            if (props[innerHTML]) {
                disposeChildren(fibers, updateQueue);
            } else {
                var children = fiberizeChildren(props.children, fiber);
                diffChildren(fibers, children, fiber, updateQueue, {});
            }
            fiber.attr();
            fiber.addState("resolve");
            updateQueue.push(fiber);
        }
    } else {
        receiveComponent(fiber, vnode, updateQueue, mountCarrier);
    }
}

function receiveComponent(fiber, nextVnode, updateQueue, mountCarrier) {
    // todo:减少数据的接收次数
    var type = fiber.type,
        stateNode = fiber.stateNode,
        nextProps = nextVnode.props,
        nextContext = void 0,
        willReceive = fiber._reactInternalFiber !== nextVnode;


    if (type.contextTypes) {
        nextContext = fiber.context = getMaskedContext(getContextProvider(fiber.return), type.contextTypes);
        willReceive = true;
    } else {
        nextContext = stateNode.context;
    }
    fiber._willReceive = willReceive;
    fiber._mountPoint = fiber._return ? null : mountCarrier.dom;
    fiber._mountCarrier = fiber._return ? {} : mountCarrier;
    //  fiber._mountCarrier.dom = fiber._mountPoint;
    var lastVnode = fiber._reactInternalFiber;
    fiber._reactInternalFiber = nextVnode;
    fiber.props = nextProps;

    if (!fiber._dirty) {
        fiber._receiving = true;
        if (willReceive) {
            captureError(stateNode, "componentWillReceiveProps", [nextProps, nextContext]);
        }
        if (lastVnode.props !== nextProps) {
            try {
                getDerivedStateFromProps(fiber, type, nextProps, stateNode.state);
            } catch (e) {
                pushError(stateNode, "getDerivedStateFromProps", e);
            }
        }
        delete fiber._receiving;
        if (fiber._hasError) {
            return;
        }

        if (lastVnode.ref !== nextVnode.ref) {
            Refs.fireRef(fiber, null, lastVnode);
        }

        fiber.hydrate(updateQueue, true);
    }
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function receiveVnode(fiber, vnode, updateQueue, mountCarrier) {
    if (isSameNode(fiber, vnode)) {
        updateVnode(fiber, vnode, updateQueue, mountCarrier);
    } else {
        disposeVnode(fiber, updateQueue);
        fiber = mountVnode(vnode, fiber.return, updateQueue, mountCarrier);
    }
    return fiber;
}
// https://github.com/onmyway133/DeepDiff
function diffChildren(fibers, children, parentFiber, updateQueue, mountCarrier) {
    var r = mountCarrier.dom;
    //这里都是走新的任务列队
    var fiber = void 0,
        vnode = void 0,
        child = void 0,
        firstChild = void 0,
        isEmpty = true;
    if (parentFiber.tag === 5) {
        firstChild = parentFiber.stateNode.firstChild;
    }
    for (var i in fibers) {
        isEmpty = false;
        child = fibers[i];
        //向下找到其第一个元素节点子孙
        if (firstChild) {
            do {
                if (child._return) {
                    break;
                }
                if (child.tag > 4) {
                    child.stateNode = firstChild;
                    break;
                }
            } while (child = child.child);
        }
        break;
    }
    //优化： 只添加
    if (isEmpty) {
        mountChildren(children, parentFiber, updateQueue, mountCarrier);
    } else {
        var matchFibers = {},
            matchFibersWithRef = [];
        for (var _i in fibers) {
            vnode = children[_i];
            fiber = fibers[_i];
            if (vnode && vnode.type === fiber.type) {
                matchFibers[_i] = fiber;
                if (vnode.key != null) {
                    fiber.key = vnode.key;
                }
                if (fiber.tag === 5 && fiber.ref !== vnode.ref) {
                    matchFibersWithRef.push({
                        index: vnode.index,
                        transition: Refs.fireRef.bind(null, fiber, null, fiber._reactInternalFiber),
                        _isMounted: noop
                    });
                }
                continue;
            }
            disposeVnode(fiber, updateQueue);
        }
        //step2: 更新或新增节点
        matchFibersWithRef.sort(function (a, b) {
            return a.index - b.index; //原来叫order
        }).forEach(function (fiber) {
            updateQueue.push(fiber);
        });
        var prevFiber,
            firstFiber,
            index = 0;

        for (var _i2 in children) {

            vnode = children[_i2];
            fiber = children[_i2] = matchFibers[_i2] ? receiveVnode(matchFibers[_i2], vnode, updateQueue, mountCarrier) : mountVnode(vnode, parentFiber, updateQueue, mountCarrier);
            fiber.index = index++;
            if (!firstFiber) {
                parentFiber.child = firstFiber = fiber;
            }
            if (prevFiber) {
                prevFiber.sibling = fiber;
            }
            prevFiber = fiber;
            if (Refs.errorHook) {
                return;
            }
        }
        if (prevFiber) {
            delete prevFiber.sibling;
        }
    }
}
Refs.diffChildren = diffChildren;

var React;
if (win.React && win.React.options) {
    React = win.React;
} else {
    React = win.React = win.ReactDOM = {
        version: "1.3.0-alpha",
        render: render,
        hydrate: render,
        Fragment: REACT_FRAGMENT_TYPE,
        options: options,
        Children: Children,
        Component: Component,

        findDOMNode: findDOMNode,
        createPortal: createPortal,
        createContext: createContext,
        createElement: createElement,
        cloneElement: cloneElement,
        PureComponent: PureComponent,
        unmountComponentAtNode: unmountComponentAtNode
    };
}
var React$1 = React;

return React$1;

})));
