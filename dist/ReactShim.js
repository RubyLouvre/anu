/**
 * 此版本要求浏览器没有createClass, createFactory, PropTypes, isValidElement,
 * unmountComponentAtNode,unstable_renderSubtreeIntoContainer
 * QQ 370262116 by 司徒正美 Copyright 2018-05-07
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
function Fragment(props) {
    return props.children;
}

var emptyObject = {};
function deprecatedWarn(methodName) {
    if (!deprecatedWarn[methodName]) {
        console.warn(methodName + " is deprecated");
        deprecatedWarn[methodName] = 1;
    }
}
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
function noop() {}
function inherit(SubClass, SupClass) {
    function Bridge() {}
    var orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    var fn = SubClass.prototype = new Bridge();
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
        array = array.match(rword) || [];
    }
    var result = {},
    value = val !== void 666 ? val : 1;
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
}
var rcamelize = /[-_][^-_]/g;
function camelize(target) {
    if (!target || target.indexOf("-") < 0 && target.indexOf("_") < 0) {
        return target;
    }
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
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};
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

function getDOMNode() {
    return this;
}

var Refs = {
    mountOrder: 1,
    currentOwner: null,
    controlledCbs: [],
    fireRef: function fireRef(fiber, dom, vnode) {
        if (fiber._disposed || fiber._isStateless) {
            dom = null;
        }
        var ref = vnode.ref;
        if (typeof ref === "function") {
            return ref(dom);
        }
        if (ref && Object.prototype.hasOwnProperty.call(ref, "current")) {
            ref.current = dom;
            return;
        }
        if (!ref) {
            return;
        }
        var owner = vnode._owner;
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

function Component(props, context) {
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
    constructor: Component,
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
        if (refType === 3 || refType === 4 || refType === 5 || refType === 8) {
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
function createVnode(node) {
    var type = node.nodeName,
        vnode = void 0;
    if (node.nodeType === 1) {
        vnode = new Vnode(type, 5);
        var ns = node.namespaceURI;
        if (!ns || ns.indexOf("html") >= 22) {
            vnode.type = type.toLowerCase();
        } else {
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
var lastText = void 0;
var flattenIndex = void 0;
var flattenObject = void 0;
function flattenCb(child, key) {
    var childType = typeNumber(child);
    if (childType < 3) {
        lastText = null;
        return;
    } else if (childType < 5) {
        if (lastText) {
            lastText.text += child;
            return;
        }
        lastText = child = createVText("#text", child + "");
    } else {
        lastText = null;
    }
    if (!flattenObject["." + key]) {
        flattenObject["." + key] = child;
    } else {
        key = "." + flattenIndex;
        flattenObject[key] = child;
    }
    child.index = flattenIndex++;
}
function fiberizeChildren(c, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    if (c !== void 666) {
        lastText = null;
        operateChildren(c, "", flattenCb, isIterable(c), true);
    }
    flattenIndex = 0;
    return fiber._children = flattenObject;
}
function computeName(el, i, prefix, isTop) {
    var k = i + "";
    if (el) {
        if (el.type == Fragment) {
            k = el.key ? "" : k;
        } else {
            k = el.key ? "$" + el.key : k;
        }
    }
    if (!isTop && prefix) {
        return prefix + ":" + k;
    }
    return k;
}
function isIterable(el) {
    if (el instanceof Object) {
        if (el.forEach) {
            return 1;
        }
        if (el.type === Fragment) {
            return 2;
        }
        var t = getIteractor(el);
        if (t) {
            return t;
        }
    }
    return 0;
}
function operateChildren(children, prefix, callback, iterableType, isTop) {
    var key = void 0,
        el = void 0,
        t = void 0,
        iterator = void 0;
    switch (iterableType) {
        case 0:
            if (Object(children) === children && !children.call && !children.type) {
                throw "children中存在非法的对象";
            }
            key = prefix || (children && children.key ? "$" + children.key : "0");
            callback(children, key);
            break;
        case 1:
            children.forEach(function (el, i) {
                operateChildren(el, computeName(el, i, prefix, isTop), callback, isIterable(el), false);
            });
            break;
        case 2:
            key = children && children.key ? "$" + children.key : "";
            key = isTop ? key : prefix ? prefix + ":0" : key || "0";
            el = children.props.children;
            t = isIterable(el);
            if (!t) {
                el = [el];
                t = 1;
            }
            operateChildren(el, key, callback, t, false);
            break;
        default:
            iterator = iterableType.call(children);
            var ii = 0,
                step;
            while (!(step = iterator.next()).done) {
                el = step.value;
                operateChildren(el, computeName(el, ii, prefix, isTop), callback, isIterable(el), false);
                ii++;
            }
            break;
    }
}
var REAL_SYMBOL = hasSymbol && Symbol.iterator;
var FAKE_SYMBOL = "@@iterator";
function getIteractor(a) {
    var iteratorFn = REAL_SYMBOL && a[REAL_SYMBOL] || a[FAKE_SYMBOL];
    if (iteratorFn && iteratorFn.call) {
        return iteratorFn;
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
        Children.map(children, function () {
            index++;
        }, null, true);
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
        operateChildren(children, "", mapWrapperCb, isIterable(children), true);
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
function computeKey(old, el, prefix, index) {
    var curKey = el && el.key != null ? el.key : null;
    var oldKey = old && old.key != null ? old.key : null;
    var dot = "." + prefix;
    if (oldKey && curKey && oldKey !== curKey) {
        return curKey + "/" + dot;
    }
    if (prefix) {
        return dot;
    }
    return curKey ? "." + curKey : "." + index;
}

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
        console.log("fire " + name);
    };
});
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
    var child = void 0;
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
    88: 7,
    80: 6,
    "00": NaN,
    "08": NaN
};
var msie = document.documentMode || versions[typeNumber(document.all) + "" + typeNumber(win.XMLHttpRequest)];
var modern = /NaN|undefined/.test(msie) || msie > 8;
function createElement$1(vnode, p) {
    var type = vnode.type,
        props = vnode.props,
        ns = vnode.namespaceURI,
        text = vnode.text;
    switch (type) {
        case "#text":
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
    } catch (e) {}
    var elem = document.createElement(type);
    var inputType = props && props.type;
    if (inputType) {
        try {
            elem = document.createElement("<" + type + " type='" + inputType + "'/>");
        } catch (err) {
        }
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
    var p = fiber.return,
        parentNode = void 0;
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
    if (typeNumber(objA) < 7 || typeNumber(objB) < 7) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
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

function createRef() {
    return {
        current: null
    };
}
function RefComponent(fn) {
    function RefProvider(props, ref) {
        return fn(props, ref);
    }
    RefProvider.isRef = true;
    return RefProvider;
}
function forwardRef(fn) {
    return RefComponent(fn);
}

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
            dom.__anuSetValue = true;
            dom.setAttribute("value", value);
            dom.__anuSetValue = false;
            if (dom.type === "number") {
                var valueAsNumber = parseFloat(dom.value) || 0;
                if (
                value != valueAsNumber ||
                value == valueAsNumber && dom.value != value) {
                    value += "";
                } else {
                    return;
                }
            }
        }
        if (dom._persistValue !== value) {
            dom.__anuSetValue = true;
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
        if (isUncontrolled) {
            if (!dom.multiple && dom.value !== dom._persistValue) {
                dom._persistValue = dom.value;
                dom._setValue = false;
            }
        } else {
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
            console.warn("\u4F60\u4E3A" + vnode.type + "[type=" + domType + "]\u5143\u7D20\u6307\u5B9A\u4E86**\u53D7\u63A7\u5C5E\u6027**" + duplexProp + "\uFF0C\n\u4F46\u662F\u6CA1\u6709\u63D0\u4F9B\u53E6\u5916\u7684" + Object.keys(keys) + "\n\u6765\u64CD\u4F5C" + duplexProp + "\u7684\u503C\uFF0C\b\u6846\u67B6\u5C06\u4E0D\u5141\u8BB8\u4F60\u901A\u8FC7\u8F93\u5165\u6539\u53D8\u8BE5\u503C");
            dom["on" + event1] = handle;
            dom["on" + event2] = handle;
        } else {
            vnode.controlledCb = handle;
            Refs.controlledCbs.push(vnode);
        }
    } else {
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
    var noEqual = dom[name] !== v;
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
            return setOptionSelected(option, true);
        }
        stringValues[value] = option;
    }
    var match = stringValues[propValue];
    if (match) {
        return setOptionSelected(match, true);
    }
    if (n && noDisableds[0]) {
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
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组');
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
function patchStyle(dom, lastStyle, nextStyle) {
    if (lastStyle === nextStyle) {
        return;
    }
    for (var name in nextStyle) {
        var val = nextStyle[name];
        if (lastStyle[name] !== val) {
            name = cssName(name, dom);
            if (val !== 0 && !val) {
                val = "";
            } else if (rnumber.test(val) && !cssNumber[name]) {
                val = val + "px";
            }
            try {
                dom.style[name] = val;
            } catch (e) {
                console.log("dom.style[" + name + "] = " + val + "throw error");
            }
        }
    }
    for (var _name in lastStyle) {
        if (!(_name in nextStyle)) {
            _name = cssName(_name, dom);
            dom.style[_name] = "";
        }
    }
}
var cssNumber = oneObject("animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom");
var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"];
var cssMap = oneObject("float", "cssFloat");
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
    var sibling = this.vnode.return.sibling;
    this.vnode._disposed = true;
    if (sibling && sibling._mountPoint && sibling._mountPoint.previousSibling === sibling._mountCarrier.dom) {
        sibling._mountPoint = this.vnode.stateNode.previousSibling;
    }
    delete this.vnode.stateNode;
    removeElement(this.node);
}
function disposeElement(fiber, updateQueue, silent) {
    if (!silent) {
        fiber._states = ["dispose"];
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
        return;
    }
    if (!silent) {
        fiber._states = ["dispose"];
        updateQueue.push(fiber);
    } else if (fiber._isMounted()) {
        fiber._states = ["dispose"];
        updateQueue.push(fiber);
    }
    fiber._mountCarrier = fiber._mountPoint = NaN;
    disposeChildren(fiber._children, updateQueue, silent);
}
function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}

var dirtyComponents = [];
function mountSorter(u1, u2) {
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
        if (fiber._disposed) {
            continue;
        }
        var hook = Refs.errorHook;
        if (hook) {
            (function () {
                var doctors = Refs.doctors,
                    doctor = doctors[0],
                    gotoCreateRejectQueue = void 0,
                    addDoctor = void 0,
                    silent = void 0;
                switch (hook) {
                    case "componentDidMount":
                    case "componentDidUpdate":
                    case "componentWillUnmount":
                        gotoCreateRejectQueue = queue.length === 0;
                        silent = 1;
                        break;
                    case "render":
                    case "constructor":
                    case "componentWillMount":
                    case "componentWillUpdate":
                    case "componentWillReceiveProps":
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
                    var unwindQueue = [];
                    doctors.forEach(function (doctor) {
                        disposeChildren(doctor._children, unwindQueue, silent);
                        doctor._children = {};
                    });
                    doctors.forEach(function (doctor) {
                        if (addDoctor) {
                            unwindQueue.push(doctor);
                            fiber = placehoder;
                        }
                        doctor.addState("catch");
                        unwindQueue.push(doctor);
                    });
                    queue = unwindQueue.concat(queue);
                }
            })();
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
var eventPropHooks = {};
var eventHooks = {};
var eventLowerCache = {
    onClick: "click",
    onChange: "change",
    onWheel: "wheel"
};
function isEventName(name) {
    return (/^on[A-Z]/.test(name)
    );
}
var isTouch = "ontouchstart" in document;
function dispatchEvent(e, type, end) {
    e = new SyntheticEvent(e);
    if (type) {
        e.type = type;
    }
    var bubble = e.type;
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
    } while (vnode = vnode.return);
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
                    dispatchEvent(e, type, common);
                }
            });
        }
    };
});
String("load,error").replace(/\w+/g, function (name) {
    eventHooks[name] = function (dom, type) {
        var mark = "__" + type;
        if (!dom[mark]) {
            dom[mark] = true;
            addEvent(dom, type, function (e) {
                dispatchEvent(e, type);
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
    while (depthA - depthB > 0) {
        instA = instA.parentNode;
        depthA--;
    }
    while (depthB - depthA > 0) {
        instB = instB.parentNode;
        depthB--;
    }
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
function onCompositionStart(e) {
    e.target.__onComposition = true;
}
function onCompositionEnd(e) {
    e.target.__onComposition = false;
    dispatchEvent(e, "change");
}
function isInCompositionMode(e) {
    return !e.target.__onComposition;
}
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
    createHandle("change", isInCompositionMode);
    eventHooks.changecapture = eventHooks.change = function (dom) {
        if (/text|password|search/.test(dom.type)) {
            addEvent(dom, "compositionstart", onCompositionStart);
            addEvent(dom, "compositionend", onCompositionEnd);
            addEvent(document, "input", specialHandles.change);
        }
    };
} else {
    createHandle("change");
    eventHooks.changecapture = eventHooks.change = function (dom) {
        if (/text|password|search/.test(dom.type)) {
            addEvent(document, "input", specialHandles.change);
        }
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
    event.deltaX = "deltaX" in event ? event.deltaX :
    "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    event.deltaY = "deltaY" in event ? event.deltaY :
    "wheelDeltaY" in event ? -event.wheelDeltaY :
    "wheelDelta" in event ? -event.wheelDelta : 0;
};
var focusMap = {
    focus: "focus",
    blur: "blur"
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
    fixEvent: noop,
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
extend || (extend = function (a) {
    return a;
});

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
                var parsedValue = this[controllProp] = value;
                this._persistValue = Array.isArray(value) ? value : parsedValue;
                this._setValue = true;
            }
        } else {
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
    } catch (e) {        }
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
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
            inputMonitor.observe(dom, name);
        }
        dom._observing = false;
        if (fiber.type === "select" && dom._setValue && !lastProps.multiple !== !fiber.props.multiple) {
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
        var method = typeNumber(val) < 3 && !val ? "removeAttribute" : "setAttribute";
        var nameRes = getSVGAttributeName(name);
        if (nameRes.ifSpecial) {
            var prefix = nameRes.name.split(":")[0];
            dom[method + "NS"](NAMESPACE[prefix], nameRes.name, val || "");
        } else {
            dom[method](nameRes, val || "");
        }
    },
    booleanAttr: function booleanAttr(dom, name, val) {
        dom[name] = !!val;
        if (dom[name] === false) {
            dom.removeAttribute(name);
        } else if (dom[name] === "false") {
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
            console.warn("setAttribute error", name, val);
        }
    },
    property: function property(dom, name, val) {
        if (controlled[name]) {
            return;
        }
        try {
            if (!val && val !== 0) {
                if (builtinStringProps[name]) {
                    dom[name] = "";
                } else {
                    dom.removeAttribute(name);
                }
            } else {
                dom[name] = val;
            }
        } catch (e) {
            try {
                dom.setAttribute(name, val);
            } catch (e) {          }
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
                var eventName = getBrowserName(name);
                var hook = eventHooks[eventName];
                addGlobalEvent(eventName);
                if (hook) {
                    hook(dom, eventName);
                }
            }
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

function HostFiber(vnode, parentFiber) {
    extend(this, vnode);
    this.name = vnode.type;
    this.return = parentFiber;
    this._states = ["resolve"];
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
    var fiber = void 0,
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
var uuid = 1;
function gud() {
    return uuid++;
}
var MAX_NUMBER = 1073741823;
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
                changedBits = 0;
            } else {
                changedBits = typeof calculateChangedBits === "function" ? calculateChangedBits(oldValue, newValue) : MAX_NUMBER;
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
        this.observedBits = observedBits === undefined || observedBits === null ? MAX_NUMBER
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
        this.observedBits = observedBits === undefined || observedBits === null ? MAX_NUMBER
        : observedBits;
    };
    fn2.componentWillUnmount = function () {
        if (this.context[contextProp]) {
            this.context[contextProp].off(this.onUpdate);
        }
    };
    fn2.render = function () {
        return this.props.children(this.state.value);
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
        disableHook(instance.updater);
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
        console.warn(stack);
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
function disableHook(u) {
    u.hydrate = u.render = u.resolve = noop;
}
function findCatchComponent(target, names) {
    var fiber = target.updater,
        instance = void 0,
        name = void 0,
        catchIt = void 0;
    do {
        name = fiber.name;
        if (fiber.name === "AnuInternalFiber") {
            if (catchIt) {
                return catchIt;
            }
            disposeVnode(fiber, [], true);
            break;
        } else if (fiber.tag < 4) {
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
            this._forceUpdate = true;
        } else {
            this._pendingStates.push(state);
        }
        if (this._hydrating) {
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
            enqueueUpdater(this);
            return;
        }
        if (this._isMounted === returnTrue) {
            if (this._receiving) {
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
        var nextState = extend({}, state);
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
            lastOwn = Refs.currentOwner,
            instance = void 0,
            lifeCycleHook = void 0;
        try {
            if (isStateless) {
                instance = {
                    refs: {},
                    __proto__: type.prototype,
                    __init__: true,
                    props: props,
                    context: context,
                    render: function f() {
                        var a = type(this.props, this.context);
                        if (a && a.render) {
                            lifeCycleHook = a;
                            return this.__init__ ? null : a.render.call(this);
                        }
                        return a;
                    }
                };
                Refs.currentOwner = instance;
                if (type.isRef) {
                    instance.render = function () {
                        delete this.updater._reactInternalFiber._hasRef;
                        return type(this.props, this.updater.ref);
                    };
                } else {
                    this.child = instance.render();
                    if (lifeCycleHook) {
                        for (var i in lifeCycleHook) {
                            if (i !== "render") {
                                instance[i] = lifeCycleHook[i];
                            }
                        }
                        lifeCycleHook = false;
                    } else {
                        this._willReceive = false;
                        this._isStateless = true;
                    }
                    delete instance.__init__;
                }
            } else {
                instance = new type(props, context);
            }
        } catch (e) {
            instance = {
                updater: this
            };
            this.stateNode = instance;
            return pushError(instance, "constructor", e);
        } finally {
            Refs.currentOwner = lastOwn;
        }
        this.stateNode = instance;
        getDerivedStateFromProps(this, type, props, instance.state);
        instance.props = props;
        instance.context = context;
        instance.updater = this;
        var carrier = this._return ? {} : mountCarrier;
        this._mountCarrier = carrier;
        this._mountPoint = carrier.dom || null;
        if (instance.componentWillMount) {
            captureError(instance, "componentWillMount", []);
        }
        instance.state = this.mergeStates();
        this.render(updateQueue);
        updateQueue.push(this);
    },
    hydrate: function hydrate(updateQueue, inner) {
        var instance = this.stateNode,
            context = this.context,
            props = this.props;
        if (this._states[0] === "hydrate") {
            this._states.shift();
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
        if (instance.getChildContext) {
            var c = getContextProvider(this.return);
            c = getUnmaskedContext(instance, c);
            this._unmaskedContext = c;
        }
        if (this._willReceive === false) {
            var a = this.child;
            if (a && a.sibling) {
                rendered = [];
                for (; a; a = a.sibling) {
                    rendered.push(a);
                }
            } else {
                rendered = a;
            }
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
            this._children = children;
            delete this.child;
        }
        Refs.diffChildren(fibers, children, this, updateQueue, this._mountCarrier);
    },
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
        this._isMounted = returnFalse;
        this._disposed = true;
    }
};
function transfer(queue) {
    var cbs = this._nextCallbacks,
        cb = void 0;
    if (cbs && cbs.length) {
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

function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}

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
function findDOMNode(instanceOrElement) {
    if (instanceOrElement == null) {
        return null;
    }
    if (instanceOrElement.nodeType) {
        return instanceOrElement;
    }
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
AnuInternalFiber.displayName = "AnuInternalFiber";
var fn$2 = inherit(AnuInternalFiber, Component);
fn$2.render = function () {
    return this.props.child;
};
function renderByAnu(vnode, root, callback) {
    var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    if (!(root && root.appendChild)) {
        throw "ReactDOM.render\u7684\u7B2C\u4E8C\u4E2A\u53C2\u6570\u9519\u8BEF";
    }
    Refs.currentOwner = null;
    var rootIndex = topNodes.indexOf(root),
        wrapperFiber = void 0,
        updateQueue = [],
        mountCarrier = {},
        wrapperVnode = createElement(AnuInternalFiber, { child: vnode });
    if (rootIndex !== -1) {
        wrapperFiber = topFibers[rootIndex];
        if (wrapperFiber._hydrating) {
            wrapperFiber._pendingCallbacks.push(renderByAnu.bind(null, vnode, root, callback, context));
            return wrapperFiber.child.stateNode;
        }
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
    root.__component = wrapperFiber;
    if (callback) {
        wrapperFiber._pendingCallbacks.push(callback.bind(wrapperFiber.child.stateNode));
    }
    drainQueue(updateQueue);
    return wrapperFiber.child ? wrapperFiber.child.stateNode : null;
}
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
function mountChildren(children, parentFiber, updateQueue, mountCarrier) {
    var prevFiber = void 0;
    for (var i in children) {
        var fiber = children[i] = mountVnode(children[i], parentFiber, updateQueue, mountCarrier);
        if (prevFiber) {
            prevFiber.sibling = fiber;
        } else {
            parentFiber.child = fiber;
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
        insertElement(fiber, mountCarrier.dom);
        mountCarrier.dom = dom;
        if (fiber.tag === 6) {
            if (vnode.text !== fiber.text) {
                dom.nodeValue = fiber.text = vnode.text;
            }
        } else {
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
        } else {
            delete nextVnode.ref;
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
function diffChildren(fibers, children, parentFiber, updateQueue, mountCarrier) {
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
        matchFibersWithRef.sort(function (a, b) {
            return a.index - b.index;
        }).forEach(function (fiber) {
            updateQueue.push(fiber);
        });
        var prevFiber = void 0,
            index = 0;
        for (var _i2 in children) {
            vnode = children[_i2];
            fiber = children[_i2] = matchFibers[_i2] ? receiveVnode(matchFibers[_i2], vnode, updateQueue, mountCarrier) : mountVnode(vnode, parentFiber, updateQueue, mountCarrier);
            fiber.index = index++;
            if (prevFiber) {
                prevFiber.sibling = fiber;
            } else {
                parentFiber.child = fiber;
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

var React = void 0;
if (win.React && win.React.options) {
    React = win.React;
} else {
    React = win.React = win.ReactDOM = {
        version: "1.3.3",
        render: render,
        hydrate: render,
        Fragment: Fragment,
        options: options,
        Children: Children,
        Component: Component,
        findDOMNode: findDOMNode,
        createRef: createRef,
        forwardRef: forwardRef,
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
