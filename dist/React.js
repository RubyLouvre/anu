/**
 * by 司徒正美 Copyright 2018-04-28
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

var arrayPush = Array.prototype.push;
var hasSymbol = typeof Symbol === "function" && Symbol["for"];

var hasOwnProperty = Object.prototype.hasOwnProperty;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;
function Fragment(props) {
    return props.children;
}
var gSBU = "getSnapshotBeforeUpdate";
var gDSFP = "getDerivedStateFromProps";
var effects = [];
function resetStack(info) {
    keepLast(info.containerStack);
    keepLast(info.containerStack);
}
function keepLast(list) {
    var n = list.length;
    list.splice(0, n - 1);
}
function get(key) {
    return key._reactInternalFiber;
}
var topFibers = [];
var topNodes = [];

var emptyObject = {};
var fakeWindow = {};
function getWindow() {
    try {
        return window;
    } catch (e) {
        try {
            return global;
        } catch (e) {
            return fakeWindow;
        }
    }
}
function toWarnDev(msg, deprecated) {
    msg = deprecated ? msg + " is deprecated" : msg;
    var process = getWindow().process;
    if (process && process.env.NODE_ENV === "development") {
        throw msg;
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

function createRenderer(methods) {
	return extend(Renderer, methods);
}
var Renderer = {
	controlledCbs: [],
	mountOrder: 1,
	currentOwner: null
};

var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};
function makeProps(type, config, props, children, len) {
    var defaultProps = void 0,
        propName = void 0;
    for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
        }
    }
    if (type && type.defaultProps) {
        defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    if (len === 1) {
        props.children = children[0];
    } else if (len > 1) {
        props.children = children;
    }
    return props;
}
function hasValidRef(config) {
    return config.ref !== undefined;
}
function hasValidKey(config) {
    return config.key !== undefined;
}
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
        toWarnDev("React.createElement: type is invalid.");
    }
    if (config != null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) {
            key = "" + config.key;
        }
    }
    props = makeProps(type, config || {}, props, children, argsLen);
    return ReactElement(type, tag, props, key, ref, Renderer.currentOwner);
}
function cloneElement(element, config) {
    var props = Object.assign({}, element.props);
    var type = element.type;
    var key = element.key;
    var ref = element.ref;
    var tag = element.tag;
    var owner = element._owner;
    for (var _len2 = arguments.length, children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        children[_key2 - 2] = arguments[_key2];
    }
    var argsLen = children.length;
    if (config != null) {
        if (hasValidRef(config)) {
            ref = config.ref;
            owner = Renderer.currentOwner;
        }
        if (hasValidKey(config)) {
            key = "" + config.key;
        }
    }
    props = makeProps(type, config || {}, props, children, argsLen);
    return ReactElement(type, tag, props, key, ref, owner);
}
function createFactory(type) {
    var factory = createElement.bind(null, type);
    factory.type = type;
    return factory;
}
function ReactElement(type, tag, props, key, ref, owner) {
    var ret = {
        type: type,
        tag: tag,
        props: props
    };
    if (tag !== 6) {
        ret.$$typeof = REACT_ELEMENT_TYPE;
        ret.key = key || null;
        var refType = typeNumber(ref);
        if (refType === 2 || refType === 3 || refType === 4 || refType === 5 || refType === 8) {
            if (refType < 4) {
                ref += "";
            }
            ret.ref = ref;
        } else {
            ret.ref = null;
        }
        ret._owner = owner;
    }
    return ret;
}
function isValidElement(vnode) {
    return !!vnode && vnode.$$typeof === REACT_ELEMENT_TYPE;
}
function createVText(type, text) {
    var vnode = ReactElement(type, 6, { children: text });
    return vnode;
}
var lastText = void 0;
var flattenIndex = void 0;
var flattenObject = void 0;
function flattenCb(child, key) {
    var childType = typeNumber(child);
    var textType = childType === 3 || childType === 4;
    if (textType) {
        if (lastText) {
            lastText.props.children += child;
            return;
        }
        lastText = child = createVText("#text", child + "");
    } else if (childType < 7) {
        lastText = null;
        return;
    } else {
        lastText = null;
    }
    if (!flattenObject["." + key]) {
        flattenObject["." + key] = child;
    } else {
        key = "." + flattenIndex;
        flattenObject[key] = child;
    }
    flattenIndex++;
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
                if (children.hasOwnProperty("toString")) {
                    children = children + "";
                } else {
                    throw "React.createElement: type is invalid.";
                }
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

var fakeObject = {
    enqueueSetState: returnFalse,
    isMounted: returnFalse
};
function Component(props, context) {
    Renderer.currentOwner = this;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.updater = fakeObject;
    this.state = null;
}
Component.prototype = {
    constructor: Component,
    replaceState: function replaceState() {
        toWarnDev("replaceState", true);
    },
    isReactComponent: returnTrue,
    isMounted: function isMounted() {
        toWarnDev("isMounted", true);
        return this.updater.isMounted(this);
    },
    setState: function setState(state, cb) {
        this.updater.enqueueSetState(this, state, cb);
    },
    forceUpdate: function forceUpdate(cb) {
        this.updater.enqueueSetState(this, true, cb);
    },
    render: function render() {
        throw "must implement render";
    }
};

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
var fn = inherit(PureComponent, Component);
fn.shouldComponentUpdate = function (nextProps, nextState) {
    var a = shallowEqual(this.props, nextProps);
    var b = shallowEqual(this.state, nextState);
    return !a || !b;
};
fn.isPureComponent = true;

function createRef() {
    return {
        current: null
    };
}
function forwardRef(fn) {
    createRef.render = fn;
    return createRef;
}

function AnuPortal(props) {
    return props.children;
}
function createPortal(children, parent) {
    var child = createElement(AnuPortal, { children: children, parent: parent });
    return child;
}

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
        get: function get$$1() {
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var NOBIND = {
    render: 1,
    shouldComponentUpdate: 1,
    componentWillReceiveProps: 1,
    componentWillUpdate: 1,
    componentDidUpdate: 1,
    componentWillMount: 1,
    componentDidMount: 1,
    componentWillUnmount: 1,
    componentDidUnmount: 1
};
function collectMixins(mixins) {
    var keyed = {};
    for (var i = 0; i < mixins.length; i++) {
        var mixin = mixins[i];
        if (mixin.mixins) {
            applyMixins(mixin, collectMixins(mixin.mixins));
        }
        for (var key in mixin) {
            if (mixin.hasOwnProperty(key) && key !== "mixins") {
                (keyed[key] || (keyed[key] = [])).push(mixin[key]);
            }
        }
    }
    return keyed;
}
var MANY_MERGED = {
    getInitialState: 1,
    getDefaultProps: 1,
    getChildContext: 1
};
function flattenHooks(key, hooks) {
    var hookType = _typeof(hooks[0]);
    if (hookType === "object") {
        var ret = {};
        for (var i = 0; i < hooks.length; i++) {
            extend(ret, hooks[i]);
        }
        return ret;
    } else if (hookType === "function" && hooks.length > 1) {
        return function () {
            var ret = {},
                r = void 0,
                hasReturn = MANY_MERGED[key];
            for (var _i = 0; _i < hooks.length; _i++) {
                r = hooks[_i].apply(this, arguments);
                if (hasReturn && r) {
                    extend(ret, r);
                }
            }
            if (hasReturn) {
                return ret;
            }
            return r;
        };
    } else {
        return hooks[0];
    }
}
function applyMixins(proto, mixins) {
    for (var key in mixins) {
        if (mixins.hasOwnProperty(key)) {
            proto[key] = flattenHooks(key, mixins[key].concat(proto[key] || []));
        }
    }
}
function newCtor(className, spec) {
    var curry = Function("ReactComponent", "blacklist", "spec", "return function " + className + "(props, context) {\n      ReactComponent.call(this, props, context);\n     if(!(this instanceof ReactComponent)){\n         throw \"muse new Component(...)\"\n     }\n     for (var methodName in this) {\n        var method = this[methodName];\n        if (typeof method  === \"function\"&& !blacklist[methodName]) {\n          this[methodName] = method.bind(this);\n        }\n      }\n\n      if (spec.getInitialState) {\n        var test = this.state = spec.getInitialState.call(this);\n        if(!(test === null || ({}).toString.call(test) == \"[object Object]\")){\n          throw \"Component.getInitialState(): must return an object or null\"\n        }\n      }\n  };");
    return curry(Component, NOBIND, spec);
}
function createClass(spec) {
    if (!isFn(spec.render)) {
        throw "createClass(...): Class specification must implement a `render` method.";
    }
    var Constructor = newCtor(spec.displayName || "Component", spec);
    var proto = inherit(Constructor, Component);
    if (spec.mixins) {
        applyMixins(spec, collectMixins(spec.mixins));
    }
    extend(proto, spec);
    if (spec.statics) {
        extend(Constructor, spec.statics);
        if (spec.statics.getDefaultProps) {
            throw "getDefaultProps is not statics";
        }
    }
    "propTypes,contextTypes,childContextTypes,displayName".replace(/\w+/g, function (name) {
        if (spec[name]) {
            var props = Constructor[name] = spec[name];
            if (name !== "displayName") {
                for (var i in props) {
                    if (!isFn(props[i])) {
                        toWarnDev(i + " in " + name + " must be a function");
                    }
                }
            }
        }
    });
    if (isFn(spec.getDefaultProps)) {
        Constructor.defaultProps = spec.getDefaultProps();
    }
    return Constructor;
}

function findDOMNode(stateNode) {
    if (stateNode == null) {
        return null;
    }
    if (stateNode.nodeType) {
        return stateNode;
    }
    if (stateNode.render) {
        var fiber = get(stateNode);
        var c = fiber.child;
        if (c) {
            return findDOMNode(c.stateNode);
        } else {
            return null;
        }
    }
    throw "findDOMNode:invalid type";
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
var fn$1 = DOMElement.prototype = {
    contains: Boolean
};
String("replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute" + ",getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent" + ",detachEvent").replace(/\w+/g, function (name) {
    fn$1[name] = function () {
        toWarnDev('need implement ' + name);
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
var win$1 = getWindow();
var inBrowser = !!win$1.alert;
if (!inBrowser) {
    win$1.document = fakeDoc;
}
var document = win$1.document;
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
var versions = {
    88: 7,
    80: 6,
    "00": NaN,
    "08": NaN
};
var msie = document.documentMode || versions[typeNumber(document.all) + "" + typeNumber(win$1.XMLHttpRequest)];
var modern = /NaN|undefined/.test(msie) || msie > 8;
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

var globalEvents = {};
var eventPropHooks = {};
var eventHooks = {};
var eventLowerCache = {
	onClick: 'click',
	onChange: 'change',
	onWheel: 'wheel'
};
function eventAction(dom, name, val, lastProps, fiber) {
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
}
var isTouch = 'ontouchstart' in document;
function dispatchEvent(e, type, endpoint) {
	e = new SyntheticEvent(e);
	if (type) {
		e.type = type;
	}
	var bubble = e.type,
	    terminal = endpoint || document,
	    hook = eventPropHooks[e.type];
	if (hook && false === hook(e)) {
		return;
	}
	Renderer.batchedUpdates(function () {
		var paths = collectPaths(e.target, terminal, {});
		var captured = bubble + 'capture';
		triggerEventFlow(paths, captured, e);
		if (!e._stopPropagation) {
			triggerEventFlow(paths.reverse(), bubble, e);
		}
	});
	Renderer.controlledCbs.forEach(function (el) {
		if (el.stateNode) {
			el.controlledCb({
				target: el.stateNode
			});
		}
	});
	Renderer.controlledCbs.length = 0;
}
var nodeID = 1;
function collectPaths(begin, end, unique) {
	var paths = [];
	var node = begin;
	while (node && node.nodeType == 1) {
		var checkChange = node;
		if (node.__events) {
			var vnode = node.__events.vnode;
			inner: while (vnode.return) {
				if (vnode.tag === 5) {
					node = vnode.stateNode;
					if (node === end) {
						return paths;
					}
					if (!node) {
						break inner;
					}
					var uid = node.uniqueID || (node.uniqueID = ++nodeID);
					if (node.__events && !unique[uid]) {
						unique[uid] = 1;
						paths.push({ node: node, events: node.__events });
					}
				}
				vnode = vnode.return;
			}
		}
		if (node === checkChange) {
			node = node.parentNode;
		}
	}
	return paths;
}
function triggerEventFlow(paths, prop, e) {
	for (var i = paths.length; i--;) {
		var path = paths[i];
		var fn = path.events[prop];
		if (isFn(fn)) {
			e.currentTarget = path.node;
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
		el.attachEvent('on' + type, fn);
	}
}
var rcapture = /Capture$/;
function getBrowserName(onStr) {
	var lower = eventLowerCache[onStr];
	if (lower) {
		return lower;
	}
	var camel = onStr.slice(2).replace(rcapture, '');
	lower = camel.toLowerCase();
	eventLowerCache[onStr] = lower;
	return lower;
}
function getRelatedTarget(e) {
	if (!e.timeStamp) {
		e.relatedTarget = e.type === 'mouseover' ? e.fromElement : e.toElement;
	}
	return e.relatedTarget;
}
String('mouseenter,mouseleave').replace(/\w+/g, function (name) {
	eventHooks[name] = function (dom, type) {
		var mark = '__' + type;
		if (!dom[mark]) {
			dom[mark] = true;
			var mask = type === 'mouseenter' ? 'mouseover' : 'mouseout';
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
createHandle('change');
createHandle('doubleclick');
createHandle('scroll');
createHandle('wheel');
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
var fixWheelType = document.onwheel !== void 666 ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
eventHooks.wheel = function (dom) {
	addEvent(dom, fixWheelType, specialHandles.wheel);
};
eventPropHooks.wheel = function (event) {
	event.deltaX = 'deltaX' in event ? event.deltaX :
	'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
	event.deltaY = 'deltaY' in event ? event.deltaY :
	'wheelDeltaY' in event ? -event.wheelDeltaY :
	'wheelDelta' in event ? -event.wheelDelta : 0;
};
eventHooks.changecapture = eventHooks.change = function (dom) {
	if (/text|password|search/.test(dom.type)) {
		addEvent(document, 'input', specialHandles.change);
	}
};
var focusMap = {
	focus: 'focus',
	blur: 'blur'
};
function blurFocus(e) {
	var dom = e.target || e.srcElement;
	var type = focusMap[e.type];
	var isFocus = type === 'focus';
	if (isFocus && dom.__inner__) {
		dom.__inner__ = false;
		return;
	}
	if (!isFocus && Renderer.focusNode === dom) {
		Renderer.focusNode = null;
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
'blur,focus'.replace(/\w+/g, function (type) {
	globalEvents[type] = true;
	if (modern) {
		var mark = '__' + type;
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
	addEvent(document, 'dblclick', specialHandles[name]);
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
		return '[object Event]';
	}
};
Renderer.eventSystem = {
	eventPropHooks: eventPropHooks,
	addEvent: addEvent,
	dispatchEvent: dispatchEvent,
	SyntheticEvent: SyntheticEvent
};

function getDuplexProps(dom, props) {
    var type = dom.type || dom.tagName.toLowerCase();
    var number = duplexMap[type];
    if (number) {
        for (var i in controlledStrategy) {
            if (props.hasOwnProperty(i)) {
                return i;
            }
        }
    }
    return "children";
}
var controlledStrategy = {
    value: controlled,
    checked: controlled,
    defaultValue: uncontrolled,
    defaultChecked: uncontrolled,
    children: noop
};
var rchecked = /checkbox|radio/;
function controlled(dom, name, nextProps, lastProps, fiber) {
    uncontrolled(dom, name, nextProps, lastProps, fiber, true);
}
function uncontrolled(dom, name, nextProps, lastProps, fiber, six) {
    var isControlled = !!six;
    var isSelect = fiber.type === "select";
    var value = nextProps[name];
    if (!isSelect) {
        if (name.indexOf("alue") !== -1) {
            var canSetVal = true;
            value = toString(value);
        } else {
            value = !!value;
        }
    }
    var multipleChange = isControlled || isSelect && nextProps.multiple != lastProps.multiple;
    if (multipleChange || lastProps === emptyObject) {
        dom._persistValue = value;
        syncValue({ target: dom });
        var duplexType = "select";
        if (isSelect) {
            syncOptions({
                target: dom
            });
        } else {
            duplexType = rchecked.test(dom.type) ? "checked" : "value";
        }
        if (isControlled) {
            var arr = duplexData[duplexType];
            arr[0].forEach(function (name) {
                eventAction(dom, name, nextProps[name] || noop, lastProps, fiber);
            });
            fiber.controlledCb = arr[1];
            Renderer.controlledCbs.push(fiber);
        }
    }
    if (canSetVal) {
        if (rchecked.test(dom.type)) {
            value = "value" in nextProps ? nextProps.value : "on";
        }
        dom.__anuSetValue = true;
        if (dom.type === "textarea") {
            dom.defaultValue = value;
        } else {
            dom.setAttribute("value", value);
        }
        dom.__anuSetValue = false;
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
function syncValue(_ref) {
    var dom = _ref.target;
    var name = rchecked.test(dom.type) ? "checked" : "value";
    var value = dom._persistValue;
    if (dom[name] + "" !== value + "") {
        dom.__anuSetValue = true;
        dom[name] = value;
        dom.__anuSetValue = false;
    }
}
var duplexData = {
    select: [["onChange"], syncOptions],
    value: [["onChange", "onInput"], syncValue],
    checked: [["onChange", "onClick"], syncValue]
};
function toString(a) {
    var t = typeNumber(a);
    if (t < 2 || t > 4) {
        if (t === 8 && a.hasOwnProperty("toString")) {
            return a.toString();
        }
        return "";
    }
    return a + "";
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
        stringValues["&" + value] = option;
    }
    var match = stringValues["&" + propValue];
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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
var rform = /textarea|input|select/i;
var isSpecialAttr = {
    style: 1,
    autoFocus: 1,
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
    var isSVG = fiber.namespaceURI === NAMESPACE.svg;
    var tag = fiber.type;
    var controlled = "children";
    if (!isSVG && rform.test(fiber.type)) {
        controlled = getDuplexProps(dom, nextProps);
    }
    for (var name in nextProps) {
        if (name === controlled) {
            continue;
        }
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
        if (_name === controlled) {
            continue;
        }
        if (!nextProps.hasOwnProperty(_name)) {
            var _which = tag + isSVG + _name;
            var _action = strategyCache[_which];
            if (!_action) {
                continue;
            }
            actionStrategy[_action](dom, _name, false, lastProps, fiber);
        }
    }
    controlledStrategy[controlled](dom, controlled, nextProps, lastProps, fiber);
}
function isBooleanAttr(dom, name) {
    var val = dom[name];
    return val === true || val === false;
}
function isEventName(name) {
    return (/^on[A-Z]/.test(name)
    );
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
var actionStrategy = {
    innerHTML: noop,
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
    event: eventAction,
    dangerouslySetInnerHTML: function dangerouslySetInnerHTML(dom, name, val, lastProps) {
        var oldhtml = lastProps[name] && lastProps[name].__html;
        var html = val && val.__html;
        html = html == null ? "" : html;
        if (html !== oldhtml) {
            dom.innerHTML = html;
        }
    }
};

function createInstance(fiber, context) {
    var updater = {
        mountOrder: Renderer.mountOrder++,
        enqueueSetState: returnFalse,
        isMounted: returnFalse
    };
    var props = fiber.props,
        type = fiber.type,
        tag = fiber.tag,
        ref = fiber.ref,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = fiber.stateNode = {};
    fiber.errorHook = "constructor";
    try {
        if (isStateless) {
            instance = {
                refs: {},
                props: props,
                context: context,
                ref: ref,
                __proto__: type.prototype,
                __isStateless: returnTrue,
                __init: true,
                renderImpl: type,
                render: function f() {
                    var a = this.__keep;
                    if (a) {
                        delete this.__keep;
                        return a.value;
                    }
                    a = this.renderImpl(this.props, this.context);
                    if (a && a.render) {
                        delete this.__isStateless;
                        for (var i in a) {
                            instance[i == "render" ? "renderImpl" : i] = a[i];
                        }
                    } else if (this.__init) {
                        this.__keep = {
                            value: a
                        };
                    }
                    return a;
                }
            };
            Renderer.currentOwner = instance;
            if (type.render) {
                instance.render = function () {
                    return type.render(this.props, this.ref);
                };
            } else {
                instance.render();
                delete instance.__init;
            }
        } else {
            instance = new type(props, context);
            if (!(instance instanceof Component)) {
                throw type.name + " doesn't extend React.Component";
            }
        }
    } finally {
        Renderer.currentOwner = lastOwn;
    }
    fiber.stateNode = instance;
    instance.props = props;
    instance.updater = updater;
    return instance;
}

function Fiber(vnode) {
    extend(this, vnode);
    var type = vnode.type;
    this.name = type.displayName || type.name || type;
    this.effectTag = 1;
}

var NOWORK = 1;
var PLACE = 2;
var CONTENT = 3;
var ATTR = 5;
var NULLREF = 7;
var DETACH = 11;
var HOOK = 13;
var REF = 17;
var CALLBACK = 19;
var CAPTURE = 23;
var effectNames = [PLACE, CONTENT, ATTR, NULLREF, HOOK, REF, DETACH, CALLBACK, CAPTURE].sort(function (a, b) {
    return a - b;
});
var effectLength = effectNames.length;

function pushError(fiber, hook, error) {
    var names = [];
    var root = findCatchComponent(fiber, names);
    var stack = describeError(names, hook);
    var boundary = root.catchBoundary;
    if (boundary) {
        fiber.effectTag = NOWORK;
        var inst = fiber.stateNode;
        if (inst && inst.updater && inst.updater.isMounted()) {
        } else {
            fiber.stateNode = {
                updater: fakeObject
            };
        }
        if (!boundary.capturedCount) {
            boundary.capturedCount = 1;
        }
        boundary.effectTag *= CAPTURE;
        root.capturedValues.push(error, {
            componentStack: stack
        });
    } else {
        var p = fiber.return;
        for (var i in p._children) {
            if (p._children[i] == fiber) {
                fiber.type = noop;
            }
        }
        while (p) {
            p._hydrating = false;
            p = p.return;
        }
        if (!Renderer.catchError) {
            Renderer.catchError = error;
        }
    }
}
function guardCallback(host, hook, args) {
    try {
        return applyCallback(host, hook, args);
    } catch (error) {
        pushError(get(host), hook, error);
    }
}
function applyCallback(host, hook, args) {
    var fiber = host._reactInternalFiber;
    fiber.errorHook = hook;
    var fn = host[hook];
    if (hook == "componentWillUnmount") {
        host[hook] = noop;
    }
    if (fn) {
        return fn.apply(host, args);
    }
    return true;
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
function findCatchComponent(fiber, names) {
    var instance = void 0,
        name = void 0,
        topFiber = fiber,
        boundary = void 0;
    while (fiber) {
        name = fiber.name;
        if (fiber.tag < 4) {
            names.push(name);
            instance = fiber.stateNode || {};
            if (instance.componentDidCatch && !boundary) {
                if (!fiber.capturedCount && topFiber !== fiber) {
                    boundary = fiber;
                } else if (fiber.capturedCount) {
                    fiber.effectTag = DETACH;
                    fiber.disposed = true;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
        if (fiber.return) {
            fiber = fiber.return;
        } else {
            if (boundary) {
                fiber.catchBoundary = boundary;
            }
            return fiber;
        }
    }
}
function detachFiber(fiber, effects$$1) {
    fiber.effectTag = DETACH;
    fiber.disposed = true;
    effects$$1.push(fiber);
    if (fiber.ref && fiber.stateNode && fiber.stateNode.parentNode) {
        fiber.effectTag *= NULLREF;
    }
    for (var child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects$$1);
    }
}

function updateEffects(fiber, topWork, info) {
    if (fiber.tag < 3) {
        try {
            updateClassComponent(fiber, info);
        } catch (e) {
            pushError(fiber, fiber.errorHook, e);
        }
        if (fiber.batching) {
            delete fiber.updateFail;
            delete fiber.batching;
        }
    } else {
        updateHostComponent(fiber, info);
    }
    if (fiber.child && !fiber.updateFail) {
        return fiber.child;
    }
    var f = fiber;
    while (f) {
        var instance = f.stateNode;
        var updater = instance && instance.updater;
        if (f.shiftContainer) {
            delete fiber.shiftContainer;
            info.containerStack.shift();
        } else if (updater) {
            if (fiber.shiftContext) {
                delete fiber.shiftContext;
                info.contextStack.shift();
            }
            if (updater.isMounted()) {
                updater.snapshot = guardCallback(instance, gSBU, [updater.lastProps || {}, updater.lastState || {}]);
            }
        }
        if (f === topWork) {
            break;
        }
        if (f.sibling) {
            return f.sibling;
        }
        f = f.return;
    }
}
function updateHostComponent(fiber, info) {
    var props = fiber.props,
        tag = fiber.tag,
        prev = fiber.alternate;
    if (!fiber.stateNode) {
        fiber.parent = info.containerStack[0];
        fiber.stateNode = Renderer.createElement(fiber);
    }
    var children = props && props.children;
    if (tag === 5) {
        info.containerStack.unshift(fiber.stateNode);
        fiber.shiftContainer = true;
        fiber.effectTag *= ATTR;
        if (prev) {
            fiber._children = prev._children;
        }
        diffChildren(fiber, children);
    } else {
        if (!prev || prev.props.children !== children) {
            fiber.effectTag *= CONTENT;
        }
    }
}
function mergeStates(fiber, nextProps, keep) {
    var instance = fiber.stateNode,
        pendings = fiber.pendingStates || [],
        n = pendings.length,
        state = instance.state;
    if (n === 0) {
        return state;
    }
    var nextState = extend({}, state);
    var fail = true;
    for (var i = 0; i < n; i++) {
        var pending = pendings[i];
        if (pending) {
            if (isFn(pending)) {
                var a = pending.call(instance, nextState, nextProps);
                if (!a) {
                    continue;
                } else {
                    pending = a;
                }
            }
            fail = false;
            extend(nextState, pending);
        }
    }
    if (keep) {
        pendings.length = 0;
        if (!fail) {
            pendings.push(nextState);
        }
    } else {
        delete fiber.pendingStates;
    }
    return nextState;
}
function updateClassComponent(fiber, info) {
    var type = fiber.type,
        instance = fiber.stateNode,
        isForced = fiber.isForced,
        props = fiber.props,
        stage = fiber.stage;
    var contextStack = info.contextStack,
        containerStack = info.containerStack,
        capturedValues = info.capturedValues;
    var nextContext = getMaskedContext(type.contextTypes, instance, contextStack),
        context = void 0,
        updateFail = false;
    if (instance == null) {
        if (type === AnuPortal) {
            fiber.parent = props.parent;
        } else {
            fiber.parent = containerStack[0];
        }
        stage = "mount";
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = Renderer.updateComponent;
        instance.props = props;
        if (type[gDSFP] || instance[gSBU]) {
            instance.__useNewHooks = true;
        }
    }
    if (type === AnuPortal) {
        containerStack.unshift(fiber.parent);
        fiber.shiftContainer = true;
    }
    instance._reactInternalFiber = fiber;
    var updater = instance.updater;
    if (!instance.__isStateless) {
        if (updater.isMounted()) {
            var hasSetState = isForced === true || fiber.pendingStates || fiber._updates;
            if (hasSetState) {
                stage = "update";
                var u = fiber._updates;
                if (u) {
                    fiber.isForced = isForced || u.isForced;
                    fiber.batching = u.batching;
                    fiber.pendingStates = u.pendingStates;
                    var hasCb = fiber.pendingCbs = u.pendingCbs;
                    if (hasCb) {
                        fiber.effectTag *= CALLBACK;
                    }
                    delete fiber._updates;
                }
            } else {
                updater.lastProps = instance.props;
                updater.lastState = instance.state;
                stage = "receive";
            }
        }
        var istage = stage;
        while (istage) {
            istage = stageIteration[istage](fiber, props, nextContext, instance, contextStack);
            fiber.setout = false;
        }
        var ps = fiber.pendingStates;
        if (ps && ps.length) {
            instance.state = mergeStates(fiber, props);
        } else {
            updateFail = stage == "update" && !fiber.isForced;
        }
        delete fiber.isForced;
    }
    instance.props = props;
    if (instance.getChildContext) {
        context = instance.getChildContext();
        context = Object.assign({}, nextContext, context);
        fiber.shiftContext = true;
        contextStack.unshift(context);
    }
    instance.context = nextContext;
    if (fiber.updateFail || updateFail) {
        fiber._hydrating = false;
        return;
    }
    fiber.effectTag *= HOOK;
    if (fiber.clearChildren) {
        delete fiber.clearChildren;
        delete fiber.capturedCount;
        return;
    }
    fiber._hydrating = true;
    var lastOwn = Renderer.currentOwner;
    Renderer.currentOwner = instance;
    var rendered = applyCallback(instance, "render", []);
    Renderer.currentOwner = lastOwn;
    if (capturedValues.length) {
        return;
    }
    diffChildren(fiber, rendered);
}
var stageIteration = {
    mount: function mount(fiber, nextProps, nextContext, instance) {
        fiber.setout = true;
        if (instance.__useNewHooks) {
            getDerivedStateFromProps(instance, fiber, nextProps, instance.state);
        } else {
            callUnsafeHook(instance, "componentWillMount", []);
        }
    },
    receive: function receive(fiber, nextProps, nextContext, instance, contextStack) {
        if (instance.__useNewHooks) {
            return "update";
        } else {
            var willReceive = instance.props !== nextProps || instance.context !== nextContext || contextStack.length > 1;
            if (willReceive) {
                fiber.setout = true;
                callUnsafeHook(instance, "componentWillReceiveProps", [nextProps, nextContext]);
                return "update";
            } else {
                cloneChildren(fiber);
                return false;
            }
        }
    },
    update: function update(fiber, nextProps, nextContext, instance) {
        var updater = instance.updater;
        var args = [nextProps, mergeStates(fiber, nextProps, true), nextContext];
        if (updater.lastProps !== nextProps) {
            fiber.setout = true;
            getDerivedStateFromProps(instance, fiber, nextProps, args[1]);
        }
        delete fiber.setout;
        delete fiber.updateFail;
        fiber._hydrating = true;
        if (!fiber.isForced && !applyCallback(instance, "shouldComponentUpdate", args)) {
            cloneChildren(fiber);
        } else if (!instance.__useNewHooks) {
            callUnsafeHook(instance, "componentWillUpdate", args);
        }
    }
};
function callUnsafeHook(a, b, c) {
    applyCallback(a, b, c);
    applyCallback(a, "UNSAFE_" + b, c);
}
function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
function getDerivedStateFromProps(instance, fiber, nextProps, lastState) {
    fiber.errorHook = gDSFP;
    var fn = fiber.type[gDSFP];
    if (fn) {
        var s = fn.call(null, nextProps, lastState);
        if (typeNumber(s) === 8) {
            Renderer.updateComponent(instance, s);
        }
    }
}
function cloneChildren(fiber) {
    fiber.updateFail = true;
    var prev = fiber.alternate;
    if (prev && prev.child) {
        var pc = prev._children;
        var cc = fiber._children = {};
        fiber.child = prev.child;
        for (var i in pc) {
            var a = pc[i];
            a.return = fiber;
            cc[i] = a;
        }
    }
}
function getMaskedContext(contextTypes, instance, contextStack) {
    if (instance && !contextTypes) {
        return instance.context;
    }
    var context = {};
    if (!contextTypes) {
        return context;
    }
    var parentContext = contextStack[0];
    for (var key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = parentContext[key];
        }
    }
    return context;
}
function diffChildren(parentFiber, children) {
    var oldFibers = parentFiber._children || {};
    var newFibers = fiberizeChildren(children, parentFiber);
    var effects$$1 = parentFiber.effects || (parentFiber.effects = []);
    var matchFibers = {};
    delete parentFiber.child;
    for (var i in oldFibers) {
        var newFiber = newFibers[i];
        var oldFiber = oldFibers[i];
        if (newFiber && newFiber.type === oldFiber.type) {
            matchFibers[i] = oldFiber;
            if (newFiber.key != null) {
                oldFiber.key = newFiber.key;
            }
            continue;
        }
        detachFiber(oldFiber, effects$$1);
    }
    var prevFiber = void 0,
        index = 0,
        newEffects = [];
    for (var _i in newFibers) {
        var _newFiber = newFibers[_i];
        var _oldFiber = matchFibers[_i];
        var alternate = null;
        if (_oldFiber) {
            if (isSameNode(_oldFiber, _newFiber)) {
                alternate = new Fiber(_oldFiber);
                var oldRef = _oldFiber.ref;
                _newFiber = extend(_oldFiber, _newFiber);
                _newFiber.alternate = alternate;
                if (oldRef && oldRef !== _newFiber.ref) {
                    alternate.effectTag *= NULLREF;
                    effects$$1.push(alternate);
                }
                if (_newFiber.tag === 5) {
                    _newFiber.lastProps = alternate.props;
                }
            } else {
                detachFiber(_oldFiber, effects$$1);
            }
            newEffects.push(_newFiber);
        } else {
            _newFiber = new Fiber(_newFiber);
        }
        newFibers[_i] = _newFiber;
        if (_newFiber.tag > 3) {
            _newFiber.effectTag *= PLACE;
        }
        if (_newFiber.ref) {
            _newFiber.effectTag *= REF;
        }
        _newFiber.index = index++;
        _newFiber.return = parentFiber;
        if (prevFiber) {
            prevFiber.sibling = _newFiber;
        } else {
            parentFiber.child = _newFiber;
        }
        prevFiber = _newFiber;
    }
    if (prevFiber) {
        delete prevFiber.sibling;
    }
}
Renderer.diffChildren = diffChildren;

function collectEffects(fiber, updateFail, isTop) {
    if (!fiber) {
        return [];
    }
    if (fiber.capturedCount == 1) {
        fiber.capturedCount++;
        Renderer.diffChildren(fiber, []);
    }
    var effects$$1 = fiber.effects;
    if (effects$$1) {
        delete fiber.effects;
    } else {
        effects$$1 = [];
    }
    if (isTop && fiber.tag == 5) {
        fiber.stateNode.insertPoint = null;
    }
    for (var child = fiber.child; child; child = child.sibling) {
        var isHost = child.tag > 3;
        if (isHost) {
            child.insertPoint = child.parent.insertPoint;
            child.parent.insertPoint = child.stateNode;
        } else {
            if (child.type != AnuPortal) {
                child.insertPoint = child.parent.insertPoint;
            }
        }
        if (updateFail || child.updateFail) {
            if (isHost) {
                if (!child.disposed) {
                    child.effectTag *= PLACE;
                    effects$$1.push(child);
                }
            } else {
                delete child.updateFail;
                arrayPush.apply(effects$$1, collectEffects(child, true));
            }
        } else {
            arrayPush.apply(effects$$1, collectEffects(child));
        }
        if (child.effectTag) {
            effects$$1.push(child);
        }
    }
    return effects$$1;
}

function getDOMNode() {
	return this;
}
var Refs = {
	fireRef: function fireRef(fiber, dom) {
		var ref = fiber.ref;
		var owner = fiber._owner;
		try {
			var number = typeNumber(ref);
			refStrategy[number](owner, ref, dom);
		} catch (e) {
			pushError(fiber, 'ref', e);
		}
	}
};
var refStrategy = {
	4: function _(owner, ref, dom) {
		if (dom === null) {
			delete owner.refs[ref];
		} else {
			if (dom.nodeType) {
				dom.getDOMNode = getDOMNode;
			}
			owner.refs[ref] = dom;
		}
	},
	5: function _(owner, ref, dom) {
		ref(dom);
	},
	8: function _(owner, ref, dom) {
		ref.current = dom;
	}
};

function commitEffects() {
    commitPlaceEffects(effects);
    Renderer.batchedUpdates(function () {
        var tasks = effects,
            task;
        while (task = tasks.shift()) {
            commitOtherEffects(task, tasks);
            if (Renderer.catchError) {
                tasks.length = 0;
                break;
            }
        }
    });
    var error = Renderer.catchError;
    if (error) {
        delete Renderer.catchError;
        throw error;
    }
}
function commitPlaceEffects(tasks) {
    var ret = [];
    for (var i = 0, n = tasks.length; i < n; i++) {
        var fiber = tasks[i];
        var amount = fiber.effectTag;
        var remainder = amount / PLACE;
        var hasEffect = amount > 1;
        if (hasEffect && remainder == ~~remainder) {
            try {
                fiber.parent.insertPoint = null;
                Renderer.insertElement(fiber);
            } catch (e) {
                throw e;
            }
            fiber.effectTag = remainder;
            hasEffect = remainder > 1;
        }
        if (hasEffect) {
            ret.push(fiber);
        }
    }
    tasks.length = 0;
    arrayPush.apply(tasks, ret);
    return ret;
}
function commitOtherEffects(fiber, tasks) {
    var instance = fiber.stateNode || emptyObject;
    var amount = fiber.effectTag;
    var updater = instance.updater || fakeObject;
    for (var i = 0; i < effectLength; i++) {
        var effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        if (amount % effectNo === 0) {
            amount /= effectNo;
            switch (effectNo) {
                case PLACE:
                    if (fiber.tag > 3) {
                        Renderer.insertElement(fiber);
                    }
                    break;
                case CONTENT:
                    Renderer.updateContext(fiber);
                    break;
                case ATTR:
                    Renderer.updateAttribute(fiber);
                    break;
                case NULLREF:
                    if (!instance.__isStateless) {
                        Refs.fireRef(fiber, null);
                    }
                    break;
                case DETACH:
                    if (fiber.tag > 3) {
                        Renderer.removeElement(fiber);
                    } else {
                        if (updater.isMounted()) {
                            updater.enqueueSetState = returnFalse;
                            guardCallback(instance, "componentWillUnmount", []);
                            updater.isMounted = returnFalse;
                        }
                    }
                    delete fiber.stateNode;
                    delete fiber.alternate;
                    break;
                case HOOK:
                    if (updater.isMounted()) {
                        guardCallback(instance, "componentDidUpdate", [updater.lastProps, updater.lastState, updater.snapshot]);
                    } else {
                        instance.parentNode = instance.parentNode || true;
                        updater.isMounted = returnTrue;
                        guardCallback(instance, "componentDidMount", []);
                    }
                    delete fiber._hydrating;
                    if (fiber.capturedCount == 1 && fiber.child) {
                        delete fiber.capturedCount;
                        var r = [];
                        var n = Object.assign({}, fiber);
                        detachFiber(n, r);
                        fiber.clearChildren = true;
                        r.shift();
                        delete fiber.child;
                        delete fiber._children;
                        tasks.push.apply(tasks, r);
                        fiber.effectTag = 1;
                        n.effectTag = amount;
                        tasks.push(n);
                        return;
                    }
                    break;
                case REF:
                    if (!instance.__isStateless) {
                        Refs.fireRef(fiber, instance);
                    }
                    break;
                case CALLBACK:
                    var queue = fiber.pendingCbs || [];
                    fiber._hydrating = true;
                    queue.forEach(function (fn) {
                        fn.call(instance);
                    });
                    fiber._hydrating = false;
                    delete fiber.pendingCbs;
                    break;
                case CAPTURE:
                    var root = fiber;
                    while (root.return) {
                        root = root.return;
                    }
                    var values = root.capturedValues;
                    fiber.effectTag = amount;
                    instance.componentDidCatch(values.shift(), values.shift());
                    if (!values.length) {
                        delete root.catchBoundary;
                    }
                    break;
            }
        }
    }
    fiber.effectTag = 1;
}

function Unbatch(props, context) {
    Component.call(this, props, context);
    this.state = {
        child: props.child
    };
}
var fn$2 = inherit(Unbatch, Component);
fn$2.render = function () {
    return this.state.child;
};

var macrotasks = [];
var batchedtasks = [];
function render$1(vnode, root, callback) {
    var container = createContainer(root),
        immediateUpdate = false;
    if (!container.hostRoot) {
        var fiber = new Fiber({
            type: Unbatch,
            tag: 2,
            props: {},
            return: container
        });
        container.child = fiber;
        var instance = fiber.stateNode = createInstance(fiber, {});
        instance.updater.enqueueSetState = updateComponent;
        instance._reactInternalFiber = fiber;
        container.hostRoot = instance;
        immediateUpdate = true;
        Renderer.emptyElement(container);
    }
    var carrier = {};
    updateComponent(container.hostRoot, {
        child: vnode
    }, wrapCb(callback, carrier), immediateUpdate);
    return carrier.instance;
}
function wrapCb(fn, carrier) {
    return function () {
        var fiber = get(this);
        var target = fiber.child ? fiber.child.stateNode : null;
        fn && fn.call(target);
        carrier.instance = target;
    };
}
function performWork(deadline) {
    workLoop(deadline);
    topFibers.forEach(function (el) {
        var microtasks = el.microtasks;
        if (el.catchBoundary) {
            macrotasks.push(el.catchBoundary);
            delete el.catchBoundary;
        }
        while (el = microtasks.shift()) {
            if (!el.disposed) {
                macrotasks.push(el);
            }
        }
    });
    if (macrotasks.length) {
        requestIdleCallback(performWork);
    }
}
var ricObj = {
    timeRemaining: function timeRemaining() {
        return 2;
    }
};
var ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
    fn(ricObj);
}
Renderer.scheduleWork = function () {
    performWork(ricObj);
};
var isBatching = false;
Renderer.batchedUpdates = function (callback) {
    var keepbook = isBatching;
    isBatching = true;
    try {
        return callback();
    } finally {
        isBatching = keepbook;
        if (!isBatching) {
            var el;
            while (el = batchedtasks.shift()) {
                if (!el.disabled) {
                    macrotasks.push(el);
                }
            }
            Renderer.scheduleWork();
        }
    }
};
function workLoop(deadline) {
    var topWork = getNextUnitOfWork();
    if (topWork) {
        var fiber = topWork,
            info = void 0;
        if (topWork.type === Unbatch) {
            info = topWork.return;
        } else {
            var dom = getContainer(fiber);
            info = {
                capturedValues: getRoot(fiber).capturedValues,
                containerStack: [dom],
                contextStack: [{}]
            };
        }
        while (fiber && !fiber.disposed && deadline.timeRemaining() > ENOUGH_TIME) {
            fiber = updateEffects(fiber, topWork, info);
        }
        arrayPush.apply(effects, collectEffects(topWork, null, true));
        effects.push(topWork);
        if (macrotasks.length && deadline.timeRemaining() > ENOUGH_TIME) {
            workLoop(deadline);
        } else {
            resetStack(info);
            commitEffects();
        }
    }
}
function getNextUnitOfWork(fiber) {
    fiber = macrotasks.shift();
    if (!fiber || fiber.merged) {
        return;
    }
    return fiber;
}
function getRoot(fiber) {
    while (fiber.return) {
        fiber = fiber.return;
    }
    return fiber;
}
function mergeUpdates(el, state, isForced, callback) {
    var fiber = el._updates || el;
    if (isForced) {
        fiber.isForced = true;
    }
    if (state) {
        var ps = fiber.pendingStates || (fiber.pendingStates = []);
        ps.push(state);
    }
    if (isFn(callback)) {
        var cs = fiber.pendingCbs || (fiber.pendingCbs = []);
        if (!cs.length) {
            if (!fiber.effectTag) {
                fiber.effectTag = CALLBACK;
            } else {
                fiber.effectTag *= CALLBACK;
            }
        }
        cs.push(callback);
    }
}
function fiberContains(p, son) {
    while (son.return) {
        if (son.return === p) {
            return true;
        }
        son = son.return;
    }
}
function getQueue(fiber) {
    while (fiber) {
        if (fiber.microtasks) {
            return fiber.microtasks;
        }
        fiber = fiber.return;
    }
}
function pushChildQueue(fiber, queue) {
    var maps = {};
    for (var i = queue.length, el; el = queue[--i];) {
        if (fiber === el) {
            queue.splice(i, 1);
            continue;
        } else if (fiberContains(fiber, el)) {
            queue.splice(i, 1);
            continue;
        }
        maps[el.stateNode.updater.mountOrder] = true;
    }
    var enqueue = true,
        p = fiber,
        hackSCU = [];
    while (p.return) {
        p = p.return;
        var instance = p.stateNode;
        if (instance.refs && !instance.__isStateless && p.type !== Unbatch) {
            hackSCU.push(p);
            var u = instance.updater;
            if (maps[u.mountOrder]) {
                enqueue = false;
                break;
            }
        }
    }
    hackSCU.forEach(function (el) {
        if (el._updates) {
            el._updates.batching = true;
        }
        el.batching = true;
    });
    if (enqueue) {
        if (fiber._hydrating) {
            fiber._updates = fiber._updates || {};
        }
        queue.push(fiber);
    }
}
function updateComponent(instance, state, callback, immediateUpdate) {
    var fiber = get(instance);
    if (fiber.parent) {
        fiber.parent.insertPoint = fiber.insertPoint;
    }
    var sn = typeNumber(state);
    var isForced = state === true;
    var microtasks = getQueue(fiber);
    state = isForced ? null : sn === 5 || sn === 8 ? state : null;
    if (fiber.setout) {
        immediateUpdate = false;
    } else if (isBatching && !immediateUpdate || fiber._hydrating) {
        pushChildQueue(fiber, batchedtasks);
    } else {
        immediateUpdate = immediateUpdate || !fiber._hydrating;
        pushChildQueue(fiber, microtasks);
    }
    mergeUpdates(fiber, state, isForced, callback);
    if (immediateUpdate) {
        Renderer.scheduleWork();
    }
}
Renderer.updateComponent = updateComponent;
function validateTag(el) {
    return el && el.appendChild;
}
function createContainer(root, onlyGet, validate) {
    validate = validate || validateTag;
    if (!validate(root)) {
        throw "container is not a element";
    }
    root.anuProp = 2018;
    var useProp = root.anuProp === 2018;
    if (useProp) {
        root.anuProps = void 0;
        if (get(root)) {
            return get(root);
        }
    } else {
        var index = topNodes.indexOf(root);
        if (index !== -1) {
            return topFibers[index];
        }
    }
    if (onlyGet) {
        return null;
    }
    var container = new Fiber({
        stateNode: root,
        tag: 5,
        name: "hostRoot",
        capturedValues: [],
        contextStack: [{}],
        containerStack: [root],
        microtasks: [],
        type: root.nodeName || root.type
    });
    if (useProp) {
        root._reactInternalFiber = container;
    }
    topNodes.push(root);
    topFibers.push(container);
    return container;
}
function getContainer(p) {
    if (p.parent) {
        return p.parent;
    }
    while (p = p.return) {
        if (p.tag === 5) {
            return p.stateNode;
        }
    }
}

function createElement$1(vnode) {
	var p = vnode.return;
	var type = vnode.type,
	    props = vnode.props,
	    ns = vnode.ns,
	    text = vnode.text;
	switch (type) {
		case '#text':
			var node = recyclables[type].pop();
			if (node) {
				node.nodeValue = text;
				return node;
			}
			return document.createTextNode(text);
		case '#comment':
			return document.createComment(text);
		case 'svg':
			ns = NAMESPACE.svg;
			break;
		case 'math':
			ns = NAMESPACE.math;
			break;
		default:
			do {
				var s = p.name == 'AnuPortal' ? p.props.parent : p.tag === 5 ? p.stateNode : null;
				if (s) {
					ns = s.namespaceURI;
					if (p.type === 'foreignObject' || ns === NAMESPACE.xhtml) {
						ns = '';
					}
					break;
				}
			} while (p = p.return);
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
			elem = document.createElement('<' + type + " type='" + inputType + "'/>");
		} catch (err) {
		}
	}
	return elem;
}
var fragment = document.createDocumentFragment();
function _emptyElement(node) {
	var child = void 0;
	while (child = node.firstChild) {
		_emptyElement(child);
		if (child === Renderer.focusNode) {
			Renderer.focusNode = false;
		}
		node.removeChild(child);
	}
}
var recyclables = {
	'#text': []
};
function _removeElement(node) {
	if (!node) {
		return;
	}
	if (node.nodeType === 1) {
		_emptyElement(node);
		if (node._reactInternalFiber) {
			var i = topFibers.indexOf(node._reactInternalFiber);
			if (i !== -1) {
				topFibers.splice(i, -1);
				topNodes.splice(i, -1);
			}
		}
		node.__events = null;
	} else if (node.nodeType === 3) {
		if (recyclables['#text'].length < 100) {
			recyclables['#text'].push(node);
		}
	}
	if (node === Renderer.focusNode) {
		Renderer.focusNode = false;
	}
	fragment.appendChild(node);
	fragment.removeChild(node);
}
function insertElement(fiber) {
	var dom = fiber.stateNode,
	    parent = fiber.parent,
	    insertPoint = fiber.insertPoint;
	try {
		if (insertPoint == null) {
			if (dom !== parent.firstChild) {
				parent.insertBefore(dom, parent.firstChild);
			}
		} else {
			if (dom !== parent.lastChild) {
				parent.insertBefore(dom, insertPoint.nextSibling);
			}
		}
	} catch (e) {
		throw e;
	}
	var isElement = fiber.tag === 5;
	var prevFocus = isElement && document.activeElement;
	if (isElement && prevFocus !== document.activeElement && contains(document.body, prevFocus)) {
		try {
			Renderer.focusNode = prevFocus;
			prevFocus.__inner__ = true;
			prevFocus.focus();
		} catch (e) {
			prevFocus.__inner__ = false;
		}
	}
}
function collectText(fiber, ret) {
	for (var c = fiber.child; c; c = c.sibling) {
		if (c.tag === 5) {
			collectText(c, ret);
			_removeElement(c.stateNode);
		} else if (c.tag === 6) {
			ret.push(c.props.children);
		} else {
			collectText(c, ret);
		}
	}
}
function isTextContainer(fiber) {
	switch (fiber.type) {
		case 'option':
		case 'noscript':
		case 'textarea':
		case 'style':
		case 'script':
			return true;
		default:
			return false;
	}
}
var DOMRenderer = createRenderer({
	render: render$1,
	updateAttribute: function updateAttribute(fiber) {
		var type = fiber.type,
		    props = fiber.props,
		    lastProps = fiber.lastProps,
		    stateNode = fiber.stateNode;
		if (isTextContainer(fiber)) {
			var texts = [];
			collectText(fiber, texts);
			var text = texts.reduce(function (a, b) {
				return a + b;
			}, '');
			switch (fiber.type) {
				case 'textarea':
					if (!('value' in props) && !('defaultValue' in props)) {
						if (!lastProps) {
							props.defaultValue = text;
						} else {
							props.defaultValue = lastProps.defaultValue;
						}
					}
					break;
				case 'option':
					stateNode.text = text;
					break;
				default:
					stateNode.innerHTML = text;
					break;
			}
		}
		diffProps(stateNode, lastProps || emptyObject, props, fiber);
		if (type === 'option') {
			if ('value' in props) {
				stateNode.duplexValue = stateNode.value = props.value;
			} else {
				stateNode.duplexValue = stateNode.text;
			}
		}
	},
	updateContext: function updateContext(fiber) {
		fiber.stateNode.nodeValue = fiber.props.children;
	},
	createElement: createElement$1,
	insertElement: insertElement,
	emptyElement: function emptyElement(fiber) {
		_emptyElement(fiber.stateNode);
	},
	unstable_renderSubtreeIntoContainer: function unstable_renderSubtreeIntoContainer(instance, vnode, root, callback) {
		var container = createContainer(root),
		    context = container.contextStack[0],
		    fiber = get(instance),
		    childContext = void 0;
		while (fiber.return) {
			var inst = fiber.stateNode;
			if (inst && inst.getChildContext) {
				childContext = inst.getChildContext();
				extend(context, childContext);
				break;
			}
			fiber = fiber.return;
		}
		if (!childContext && fiber.contextStack) {
			extend(context, fiber.contextStack[0]);
		}
		return Renderer.render(vnode, root, callback);
	},
	unmountComponentAtNode: function unmountComponentAtNode(root) {
		var container = createContainer(root, true);
		var instance = container && container.hostRoot;
		if (instance) {
			Renderer.updateComponent(instance, {
				child: null
			}, function () {
				var i = topNodes.indexOf(root);
				if (i !== -1) {
					topNodes.splice(i, 1);
					topFibers.splice(i, 1);
				}
				root._reactInternalFiber = null;
			}, true);
			return true;
		}
		return false;
	},
	removeElement: function removeElement(fiber) {
		var instance = fiber.stateNode;
		_removeElement(instance);
		var j = topNodes.indexOf(instance);
		if (j !== -1) {
			topFibers.splice(j, 1);
			topNodes.splice(j, 1);
		}
	}
});

var win = getWindow();
var prevReact = win.React;
var React = void 0;
if (prevReact && prevReact.eventSystem) {
    React = prevReact;
} else {
    var render = DOMRenderer.render,
        eventSystem = DOMRenderer.eventSystem,
        unstable_renderSubtreeIntoContainer = DOMRenderer.unstable_renderSubtreeIntoContainer,
        unmountComponentAtNode = DOMRenderer.unmountComponentAtNode;
    React = win.React = win.ReactDOM = {
        eventSystem: eventSystem,
        findDOMNode: findDOMNode,
        unmountComponentAtNode: unmountComponentAtNode,
        unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
        version: "1.4.0",
        render: render,
        hydrate: render,
        unstable_batchedUpdates: DOMRenderer.batchedUpdates,
        Fragment: Fragment,
        PropTypes: PropTypes,
        Children: Children,
        createPortal: createPortal,
        createContext: createContext,
        Component: Component,
        createRef: createRef,
        forwardRef: forwardRef,
        createClass: createClass,
        createElement: createElement,
        cloneElement: cloneElement,
        PureComponent: PureComponent,
        isValidElement: isValidElement,
        createFactory: createFactory
    };
}
var React$1 = React;

return React$1;

})));
