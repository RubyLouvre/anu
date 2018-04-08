/**
 * by 司徒正美 Copyright 2018-04-08
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

var __push = Array.prototype.push;
var hasSymbol = typeof Symbol === "function" && Symbol["for"];

var hasOwnProperty = Object.prototype.hasOwnProperty;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;
function Fragment(props) {
    return props.children;
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

function createRenderer(methods) {
    return extend(Renderer, methods);
}
var Renderer = {
    interactQueue: null,
    mainThread: [],
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
    options.afterCreate(ret);
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
                throw "React.createElement: type is invalid.";
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

function Component(props, context) {
    Renderer.currentOwner = this;
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
        toWarnDev("replaceState", true);
    },
    isReactComponent: returnTrue,
    isMounted: function isMounted() {
        toWarnDev("isMounted", true);
        return (this.updater || fakeObject)._isMounted(this);
    },
    setState: function setState(state, cb) {
        (this.updater || fakeObject).enqueueSetState(this, state, cb);
    },
    forceUpdate: function forceUpdate(cb) {
        (this.updater || fakeObject).enqueueSetState(this, true, cb);
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
function mountSorter(u1, u2) {
    return u1.stateNode.updater.mountOrder - u2.stateNode.updater.mountOrder;
}
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
    var fibers = Renderer.interactQueue || (Renderer.interactQueue = []);
    triggerEventFlow(paths, captured, e);
    if (!e._stopPropagation) {
        triggerEventFlow(paths.reverse(), bubble, e);
    }
    fibers.sort(mountSorter);
    __push.apply(Renderer.mainThread, fibers);
    Renderer.interactQueue = null;
    Renderer.batchedUpdates();
    Renderer.controlledCbs.forEach(function (el) {
        if (el.stateNode) {
            el.controlledCb({
                target: el.stateNode
            });
        }
    });
    Renderer.controlledCbs.length = 0;
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
        el.attachEvent("on" + type, fn);
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
    event.deltaX = "deltaX" in event ? event.deltaX :
    "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    event.deltaY = "deltaY" in event ? event.deltaY :
    "wheelDeltaY" in event ? -event.wheelDeltaY :
    "wheelDelta" in event ? -event.wheelDelta : 0;
};
eventHooks.changecapture = eventHooks.change = function (dom) {
    if (/text|password|search/.test(dom.type)) {
        addEvent(document, "input", specialHandles.change);
    }
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
Object.freeze || (Object.freeze = function (a) {
    return a;
});


var eventSystem = Object.freeze({
	eventPropHooks: eventPropHooks,
	eventHooks: eventHooks,
	eventLowerCache: eventLowerCache,
	isEventName: isEventName,
	isTouch: isTouch,
	dispatchEvent: dispatchEvent,
	addGlobalEvent: addGlobalEvent,
	addEvent: addEvent,
	getBrowserName: getBrowserName,
	createHandle: createHandle,
	focusMap: focusMap,
	SyntheticEvent: SyntheticEvent
});

function findDOMNode(stateNode) {
    if (stateNode == null) {
        return null;
    }
    if (stateNode.nodeType) {
        return stateNode;
    }
    if (stateNode.render) {
        var fiber = get(stateNode);
        if (fiber.disposed) {
            throw "findDOMNode:disposed component";
        }
        var c = fiber.child;
        if (c) {
            return findDOMNode(c.stateNode);
        } else {
            return null;
        }
    }
    throw "findDOMNode:invalid type";
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
            Renderer.controlledCbs.push(vnode);
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
                }
                dom.removeAttribute(name);
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

function Fiber(vnode) {
    extend(this, vnode);
    var type = vnode.type;
    this.name = type.displayName || type.name || type;
    this.effectTag = 1;
}

var componentStack = [];
var effects = [];
var containerStack = [];
var contextStack = [emptyObject];

function hasContextChanged() {
    return contextStack[0] != emptyObject;
}

var NOWORK = 1;
var PLACE = 2;
var CONTENT = 3;
var ATTR = 5;
var NULLREF = 7;
var HOOK = 11;
var CHANGEREF = 13;
var REF = 17;
var DETACH = 19;
var CALLBACK = 23;
var CAPTURE = 29;
var effectNames = [PLACE, CONTENT, ATTR, NULLREF, HOOK, CHANGEREF, REF, DETACH, CALLBACK, CAPTURE];
var effectLength = effectNames.length;

var updateQueue = Renderer.mainThread;
function pushError(fiber, hook, error) {
    var names = [];
    var catchFiber = findCatchComponent(fiber, names);
    var stack = describeError(names, hook);
    if (catchFiber) {
        disableEffect(fiber);
        catchFiber.errorInfo = catchFiber.errorInfo || [error, { componentStack: stack }];
        delete catchFiber._children;
        delete catchFiber.child;
        catchFiber.effectTag = CAPTURE;
        updateQueue.push(catchFiber);
    } else {
        if (!Renderer.error) {
            Renderer.error = error;
        }
    }
}
function callLifeCycleHook(instance, hook, args) {
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
        pushError(get(instance), hook, error);
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
function disableEffect(fiber) {
    if (fiber.stateNode) {
        fiber.stateNode.render = noop;
    }
    fiber.effectTag = NOWORK;
    for (var child = fiber.child; child; child = child.sibling) {
        disableEffect(fiber);
    }
}
function findCatchComponent(topFiber, names) {
    var instance = void 0,
        name = void 0,
        fiber = topFiber,
        catchIt = void 0;
    do {
        name = fiber.name;
        if (!fiber.return) {
            if (catchIt) {
                return catchIt;
            }
            break;
        } else if (fiber.tag < 4) {
            names.push(name);
            instance = fiber.stateNode;
            if (instance.componentDidCatch) {
                if (instance.updater._isDoctor) {
                    disableEffect(fiber);
                } else if (!catchIt && fiber !== topFiber) {
                    catchIt = fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
    } while (fiber = fiber.return);
}

function createInstance(fiber, context) {
    var updater = {
        mountOrder: Renderer.mountOrder++,
        enqueueSetState: returnFalse,
        _isMounted: returnFalse
    };
    var props = fiber.props,
        type = fiber.type,
        tag = fiber.tag,
        ref = fiber.ref,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = fiber.stateNode = {};
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
                        return a;
                    }
                    a = this.renderImpl(this.props, this.context);
                    if (a && a.render) {
                        delete this.__isStateless;
                        for (var i in a) {
                            instance[i == "render" ? "renderImpl" : i] = a[i];
                        }
                    } else if (this.__init) {
                        this.__keep = a;
                    }
                    return a;
                }
            };
            Renderer.currentOwner = instance;
            if (type.render) {
                instance.oneRef = function (a) {
                    var ref = instance.ref;
                    if (isFn(ref)) {
                        ref(a);
                        instance.ref = noop;
                    } else if (ref && "current" in ref) {
                        ref.current = a;
                    }
                };
                instance.render = function () {
                    return type.render(this.props, this.oneRef);
                };
            } else {
                instance.render();
                delete instance.__init;
            }
        } else {
            instance = new type(props, context);
        }
    } catch (e) {
        pushError(fiber, "constructor", e);
    } finally {
        Renderer.currentOwner = lastOwn;
    }
    fiber.stateNode = instance;
    instance.props = props;
    instance.updater = updater;
    return instance;
}

function updateEffects(fiber, topWork) {
    if (fiber.tag > 3) {
        updateHostComponent(fiber);
    } else {
        updateClassComponent(fiber);
    }
    if (!fiber.shouldUpdateFalse) {
        if (fiber.child) {
            return fiber.child;
        }
    }
    var f = fiber;
    while (f) {
        if (f.stateNode.getChildContext) {
            var useTest = contextStack.shift();
        }
        if (f.tag === 5) {
            containerStack.shift();
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
function updateHostComponent(fiber) {
    if (!fiber.stateNode) {
        try {
            fiber.stateNode = Renderer.createElement(fiber);
        } catch (e) {
            throw e;
        }
    }
    fiber.parent = fiber.type === AnuPortal ? fiber.props.parent : containerStack[0];
    var props = fiber.props,
        tag = fiber.tag,
        root = fiber.root,
        prev = fiber.alternate;
    var children = props && props.children;
    if (tag === 5) {
        containerStack.unshift(fiber.stateNode);
        if (!root) {
            fiber.effectTag *= ATTR;
        }
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
    for (var i = 0; i < n; i++) {
        var pending = pendings[i];
        if (pending && pending.call) {
            pending = pending.call(instance, nextState, nextProps);
        }
        extend(nextState, pending);
    }
    if (keep) {
        pendings.length = 0;
        pendings.push(nextState);
    } else {
        delete fiber.pendingStates;
    }
    return nextState;
}
function updateClassComponent(fiber) {
    var type = fiber.type,
        instance = fiber.stateNode,
        isForced = fiber.isForced,
        props = fiber.props,
        stage = fiber.stage;
    fiber.parent = fiber.type === AnuPortal ? fiber.props.parent : containerStack[0];
    var nextContext = getMaskedContext(type.contextTypes, instance),
        context = void 0;
    if (instance == null) {
        stage = "init";
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = Renderer.updateComponent;
        instance.props = props;
    } else {
        var isSetState = isForced === true || fiber.pendingStates || fiber._updates;
        if (isSetState) {
            stage = "update";
            var u = fiber._updates;
            if (u) {
                isForced = fiber.isForced || u.isForced;
                fiber.pendingStates = u.pendingStates;
                var hasCb = fiber.pendingCbs = u.pendingCbs;
                if (hasCb) {
                    fiber.effectTag *= CALLBACK;
                }
                delete fiber._updates;
            }
            delete fiber.isForced;
        } else {
            stage = "receive";
        }
    }
    instance._reactInternalFiber = fiber;
    if (instance.__isStateless) {
        stage = "noop";
    }
    var updater = instance.updater;
    updater._hooking = true;
    while (stage) {
        stage = stageIteration[stage](fiber, props, nextContext, instance, isForced);
    }
    updater._hooking = false;
    var ps = fiber.pendingStates;
    if (ps && ps.length) {
        instance.state = mergeStates(fiber, props);
    }
    delete fiber.isForced;
    instance.props = props;
    if (instance.getChildContext) {
        try {
            context = instance.getChildContext();
            context = Object.assign({}, nextContext, context);
        } catch (e) {
            context = {};
        }
        contextStack.unshift(context);
    }
    instance.context = nextContext;
    if (fiber.shouldUpdateFalse) {
        return;
    }
    fiber.effectTag *= HOOK;
    updater._hydrating = true;
    var lastOwn = Renderer.currentOwner;
    Renderer.currentOwner = instance;
    var rendered = callLifeCycleHook(instance, "render", []);
    if (componentStack[0] === instance) {
        componentStack.shift();
    }
    if (updater._hasError) {
        rendered = [];
    }
    Renderer.currentOwner = lastOwn;
    diffChildren(fiber, rendered);
}
var stageIteration = {
    noop: noop,
    init: function init(fiber, nextProps, nextContext, instance) {
        getDerivedStateFromProps(instance, fiber, nextProps, instance.state);
        callUnsafeHook(instance, "componentWillMount", []);
    },
    receive: function receive(fiber, nextProps, nextContext, instance) {
        var updater = instance.updater;
        updater.lastProps = instance.props;
        updater.lastState = instance.state;
        var propsChange = updater.lastProps !== nextProps;
        var willReceive = propsChange || hasContextChanged() || instance.context !== nextContext;
        if (willReceive) {
            callUnsafeHook(instance, "componentWillReceiveProps", [nextProps, nextContext]);
        } else {
            cloneChildren(fiber);
            return;
        }
        if (propsChange) {
            getDerivedStateFromProps(instance, fiber, nextProps, updater.lastState);
        }
        return "update";
    },
    update: function update(fiber, nextProps, nextContext, instance, isForced) {
        var args = [nextProps, mergeStates(fiber, nextProps, true), nextContext];
        delete fiber.shouldUpdateFalse;
        if (!isForced && !callLifeCycleHook(instance, "shouldComponentUpdate", args)) {
            cloneChildren(fiber);
        } else {
            callLifeCycleHook(instance, "getSnapshotBeforeUpdate", args);
            callUnsafeHook(instance, "componentWillUpdate", args);
        }
    }
};
function callUnsafeHook(a, b, c) {
    callLifeCycleHook(a, b, c);
    callLifeCycleHook(a, "UNSAFE_" + b, c);
}
function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
function detachFiber(fiber, effects$$1) {
    fiber.effectTag = DETACH;
    if (fiber.ref) {
        fiber.effectTag *= NULLREF;
    }
    fiber.disposed = true;
    if (fiber.tag < 3) {
        fiber.effectTag *= HOOK;
    }
    effects$$1.push(fiber);
    for (var child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects$$1);
    }
}
var gDSFP = "getDerivedStateFromProps";
function getDerivedStateFromProps(instance, fiber, nextProps, lastState) {
    try {
        var method = fiber.type[gDSFP];
        if (method) {
            var partialState = method.call(null, nextProps, lastState);
            if (typeNumber(partialState) === 8) {
                instance.updater.enqueueSetState(instance, partialState);
            }
        }
    } catch (error) {
        pushError(instance, gDSFP, error);
    }
}
function cloneChildren(fiber) {
    fiber.shouldUpdateFalse = true;
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
    if (componentStack[0] === fiber.stateNode) {
        componentStack.shift();
    }
}
function getMaskedContext(contextTypes, instance) {
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
    if (parentFiber.tag === 5) {
        var firstChild = parentFiber.stateNode.firstChild;
        if (firstChild) {
            for (var _i in oldFibers) {
                var child = oldFibers[_i];
                do {
                    if (child._return) {
                        break;
                    }
                    if (child.tag > 4) {
                        child.stateNode = firstChild;
                        break;
                    }
                } while (child = child.child);
                break;
            }
        }
    }
    var prevFiber = void 0,
        index = 0,
        newEffects = [];
    for (var _i2 in newFibers) {
        var _newFiber = newFibers[_i2];
        var _oldFiber = matchFibers[_i2];
        if (_oldFiber) {
            if (isSameNode(_oldFiber, _newFiber)) {
                var alternate = new Fiber(_oldFiber);
                _newFiber = extend(_oldFiber, _newFiber);
                _newFiber.alternate = alternate;
                if (alternate.ref && alternate.ref !== _newFiber.ref) {
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
        newFibers[_i2] = _newFiber;
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
            if (_newFiber.tag > 3 && _newFiber.alternate) {
            }
        }
        prevFiber = _newFiber;
    }
    if (prevFiber) {
        delete prevFiber.sibling;
    }
}

function getDOMNode() {
    return this;
}
var Refs = {
    fireRef: function fireRef(fiber, dom) {
        var ref = fiber.ref;
        var owner = fiber._owner;
        try {
            if (isFn(ref)) {
                return ref(dom);
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
        } catch (e) {
            pushError(owner, "ref", e);
        }
    }
};

var clearUpElements = [];
function commitEffects(a) {
    var arr = a || effects;
    arr = commitPlaceEffects(arr);
    for (var i = 0; i < arr.length; i++) {
        commitOtherEffects(arr[i]);
        if (Renderer.error) {
            arr.length = 0;
            break;
        }
    }
    arr.forEach(commitOtherEffects);
    clearUpElements.forEach(removeStateNode);
    clearUpElements.length = arr.length = effects.length = 0;
    var error = Renderer.error;
    if (error) {
        delete Renderer.error;
        throw error;
    }
}
function removeStateNode(el) {
    delete el.alternate;
    delete el.stateNode;
}
function commitPlaceEffects(fibers) {
    var ret = [];
    for (var i = 0, n = fibers.length; i < n; i++) {
        var fiber = fibers[i];
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
    return ret;
}
function commitOtherEffects(fiber) {
    var instance = fiber.stateNode;
    var amount = fiber.effectTag;
    var updater = instance.updater;
    for (var i = 0; i < effectLength; i++) {
        var effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        var remainder = amount / effectNo;
        if (remainder == ~~remainder) {
            amount = remainder;
            switch (effectNo) {
                case PLACE:
                    Renderer.insertElement(fiber);
                    break;
                case ATTR:
                    Renderer.updateAttribute(fiber);
                    break;
                case DETACH:
                    if (fiber.tag > 3) {
                        Renderer.removeElement(fiber);
                    }
                    clearUpElements.push(fiber);
                    break;
                case HOOK:
                    if (fiber.disposed) {
                        updater.enqueueSetState = returnFalse;
                        if (updater._isMounted()) {
                            callLifeCycleHook(instance, "componentWillUnmount", []);
                        }
                        updater._isMounted = returnFalse;
                    } else {
                        if (updater._isMounted()) {
                            callLifeCycleHook(instance, "componentDidUpdate", [updater.lastProps, updater.lastState]);
                        } else {
                            updater._isMounted = returnTrue;
                            callLifeCycleHook(instance, "componentDidMount", []);
                        }
                    }
                    delete fiber.pendingFiber;
                    delete updater._hydrating;
                    break;
                case CONTENT:
                    Renderer.updateContext(fiber);
                    break;
                case REF:
                    if (!instance.__isStateless) {
                        Refs.fireRef(fiber, instance);
                    }
                    break;
                case CHANGEREF:
                case NULLREF:
                    if (!instance.__isStateless) {
                        Refs.fireRef(fiber, null);
                    }
                    break;
                case CALLBACK:
                    var queue = fiber.pendingCbs;
                    queue.forEach(function (fn) {
                        fn.call(instance);
                    });
                    delete fiber.pendingCbs;
                    break;
                case CAPTURE:
                    updater._isDoctor = true;
                    instance.componentDidCatch.apply(instance, fiber.errorInfo);
                    fiber.errorInfo = null;
                    updater._isDoctor = false;
                    break;
            }
        }
    }
    fiber.effectTag = 1;
}

function collectEffects(fiber, shouldUpdateFalse, isTop) {
    if (!fiber) {
        return [];
    }
    var effects = fiber.effects;
    if (effects) {
        delete fiber.effects;
    } else {
        effects = [];
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
            child.insertPoint = child.parent.insertPoint;
        }
        if (shouldUpdateFalse || child.shouldUpdateFalse) {
            if (isHost) {
                if (!child.disposed) {
                    child.effectTag *= PLACE;
                    effects.push(child);
                }
            } else {
                delete child.shouldUpdateFalse;
                __push.apply(effects, collectEffects(child, true));
            }
        } else {
            __push.apply(effects, collectEffects(child));
        }
        if (child.effectTag) {
            effects.push(child);
        }
    }
    return effects;
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

var updateQueue$1 = Renderer.mainThread;
function render$1(vnode, root, callback) {
    var hostRoot = Renderer.updateRoot(root);
    var instance = null;
    if (hostRoot._hydrating) {
        hostRoot.pendingCbs.push(function () {
            render$1(vnode, root, callback);
        });
        return;
    }
    hostRoot.props = {
        children: vnode
    };
    hostRoot.pendingCbs = [function () {
        instance = hostRoot.child ? hostRoot.child.stateNode : null;
        callback && callback.call(instance);
        hostRoot._hydrating = false;
    }];
    hostRoot._hydrating = true;
    hostRoot.effectTag = CALLBACK;
    updateQueue$1.push(hostRoot);
    Renderer.scheduleWork();
    return instance;
}
Renderer.scheduleWork = function () {
    performWork({
        timeRemaining: function timeRemaining() {
            return 2;
        }
    });
};
var isBatchingUpdates = false;
Renderer.batchedUpdates = function () {
    var keepbook = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
        Renderer.scheduleWork();
    } finally {
        isBatchingUpdates = keepbook;
        if (!isBatchingUpdates) {
            commitEffects();
        }
    }
};
function workLoop(deadline) {
    var topWork = getNextUnitOfWork();
    if (topWork) {
        var fiber = topWork;
        var p = getContainer(fiber);
        if (p) {
            containerStack.unshift(p);
        }
        while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
            fiber = updateEffects(fiber, topWork);
        }
        if (topWork) {
            __push.apply(effects, collectEffects(topWork, null, true));
            if (topWork.effectTag) {
                effects.push(topWork);
            }
        }
        if (!isBatchingUpdates) {
            commitEffects();
        }
    }
}
function performWork(deadline) {
    workLoop(deadline);
    if (updateQueue$1.length > 0) {
        requestIdleCallback(performWork);
    }
}
var ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
    fn({
        timeRemaining: function timeRemaining() {
            return 2;
        }
    });
}
function getNextUnitOfWork(fiber) {
    fiber = updateQueue$1.shift();
    if (!fiber) {
        return;
    }
    if (fiber.merged) {
        return;
    }
    if (fiber.root) {
        fiber.stateNode = fiber.stateNode || {};
        if (!get(fiber.stateNode)) {
            Renderer.emptyElement(fiber);
        }
        fiber.stateNode._reactInternalFiber = fiber;
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
    if (callback) {
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
Renderer.updateComponent = function (instance, state, callback) {
    var fiber = get(instance);
    if (fiber.parent) {
        fiber.parent.insertPoint = fiber.insertPoint;
    }
    var isForced = state === true;
    state = isForced ? null : state;
    if (this._hydrating || Renderer.interactQueue) {
        if (!fiber._updates) {
            fiber._updates = {};
            var queue = Renderer.interactQueue || updateQueue$1;
            queue.push(fiber);
        }
        mergeUpdates(fiber, state, isForced, callback);
    } else {
        mergeUpdates(fiber, state, isForced, callback);
        if (!this._hooking) {
            updateQueue$1.push(fiber);
            Renderer.scheduleWork();
        }
    }
};

function createElement$1(vnode) {
    var p = vnode.return;
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
        } catch (err) {}
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
    "#text": []
};
function _removeElement(node) {
    if (!node) {
        return;
    }
    if (node.nodeType === 1) {
        _emptyElement(node);
        node.__events = null;
    } else if (node.nodeType === 3) {
        if (recyclables["#text"].length < 100) {
            recyclables["#text"].push(node);
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
        parentNode = fiber.parent,
        before = fiber.insertPoint;
    try {
        if (before == null) {
            if (dom !== parent.firstChild) {
                parentNode.insertBefore(dom, parent.firstChild);
            }
        } else {
            if (dom !== parent.lastChild) {
                parentNode.insertBefore(dom, before.nextSibling);
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
var DOMRenderer = createRenderer({
    render: render$1,
    updateAttribute: function updateAttribute(fiber) {
        var type = fiber.type,
            props = fiber.props,
            lastProps = fiber.lastProps,
            stateNode = fiber.stateNode;
        diffProps(stateNode, lastProps || emptyObject, props, fiber);
        if (formElements[type]) {
            inputControll(fiber, stateNode, props);
        }
    },
    updateContext: function updateContext(fiber) {
        fiber.stateNode.nodeValue = fiber.props.children;
    },
    updateRoot: function updateRoot(root) {
        if (!(root && root.appendChild)) {
            throw "ReactDOM.render\u7684\u7B2C\u4E8C\u4E2A\u53C2\u6570\u9519\u8BEF";
        }
        var hostRoot = get(root);
        if (!hostRoot) {
            hostRoot = new Fiber({
                stateNode: root,
                root: true,
                tag: 5,
                name: "hostRoot",
                type: root.tagName.toLowerCase(),
                namespaceURI: root.namespaceURI
            });
        }
        if (topNodes.indexOf(root) == -1) {
            topNodes.push(root);
            topFibers.push(hostRoot);
        }
        return hostRoot;
    },
    createElement: createElement$1,
    insertElement: insertElement,
    emptyElement: function emptyElement(fiber) {
        _emptyElement(fiber.stateNode);
    },
    unstable_renderSubtreeIntoContainer: function unstable_renderSubtreeIntoContainer(instance, vnode, container, callback) {
        toWarnDev("unstable_renderSubtreeIntoContainer", true);
        return Renderer.render(vnode, container, callback);
    },
    unmountComponentAtNode: function unmountComponentAtNode(container) {
        var rootIndex = topNodes.indexOf(container);
        if (rootIndex > -1) {
            var lastFiber = topFibers[rootIndex],
                effects = [];
            detachFiber(lastFiber, effects);
            effects.shift();
            commitEffects(effects);
            topNodes.splice(rootIndex, 1);
            topFibers.splice(rootIndex, 1);
            container._reactInternalFiber = null;
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
if (prevReact && prevReact.options) {
    React = prevReact;
} else {
    var render = DOMRenderer.render,
        unstable_renderSubtreeIntoContainer = DOMRenderer.unstable_renderSubtreeIntoContainer,
        unmountComponentAtNode = DOMRenderer.unmountComponentAtNode;
    React = win.React = win.ReactDOM = {
        version: "1.3.1",
        render: render,
        hydrate: render,
        options: options,
        Fragment: Fragment,
        PropTypes: PropTypes,
        Children: Children,
        createPortal: createPortal,
        createContext: createContext,
        Component: Component,
        eventSystem: eventSystem,
        findDOMNode: findDOMNode,
        createRef: createRef,
        forwardRef: forwardRef,
        createClass: createClass,
        createElement: createElement,
        cloneElement: cloneElement,
        PureComponent: PureComponent,
        isValidElement: isValidElement,
        unmountComponentAtNode: unmountComponentAtNode,
        unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
        createFactory: createFactory
    };
}
var React$1 = React;

return React$1;

})));
