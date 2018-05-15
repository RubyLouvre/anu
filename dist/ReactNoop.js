/**
 * 此个版本专门用于测试
 * by 司徒正美 Copyright 2018-05-15
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ReactNoop = factory());
}(this, (function () {

var arrayPush = Array.prototype.push;

var hasOwnProperty = Object.prototype.hasOwnProperty;
function Fragment(props) {
    return props.children;
}
var gSBU = "getSnapshotBeforeUpdate";
var gDSFP = "getDerivedStateFromProps";
var hasSymbol = typeof Symbol === "function" && Symbol["for"];
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;
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
function isMounted(instance) {
    var fiber = get(instance);
    return !!(fiber && fiber.hasMounted);
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


function isFn(obj) {
    return __type.call(obj) === "[object Function]";
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
    macrotasks: [],
    boundaries: [],
    currentOwner: null
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
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
function createVText(text) {
    return ReactElement("#text", 6, { children: text + "" });
}
function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
        '=': '=0',
        ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
        return escaperLookup[match];
    });
    return '$' + escapedString;
}
var lastText = void 0;
var flattenIndex = void 0;
var flattenObject = void 0;
function flattenCb(context, child, key, childType) {
    if (child === null) {
        lastText = null;
        return;
    }
    if (childType === 3 || childType === 4) {
        if (lastText) {
            lastText.props.children += child;
            return;
        }
        lastText = child = createVText(child);
    } else {
        lastText = null;
    }
    if (!flattenObject[key]) {
        flattenObject[key] = child;
    } else {
        key = "." + flattenIndex;
        flattenObject[key] = child;
    }
    flattenIndex++;
}
function fiberizeChildren(children, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    if (children !== void 666) {
        lastText = null;
        traverseAllChildren(children, "", flattenCb);
    }
    flattenIndex = 0;
    return fiber.children = flattenObject;
}
function getComponentKey(component, index) {
    if ((typeof component === "undefined" ? "undefined" : _typeof(component)) === 'object' && component !== null && component.key != null) {
        return escape(component.key);
    }
    return index.toString(36);
}
var SEPARATOR = ".";
var SUBSEPARATOR = ':';
function traverseAllChildren(children, nameSoFar, callback, bookKeeping) {
    var childType = typeNumber(children);
    var invokeCallback = false;
    switch (childType) {
        case 0:
        case 1:
        case 2:
        case 5:
        case 6:
            children = null;
            invokeCallback = true;
            break;
        case 3:
        case 4:
            invokeCallback = true;
            break;
        case 8:
            if (children.$$typeof) {
                invokeCallback = true;
            } else if (children.hasOwnProperty("toString")) {
                children = children + "";
                invokeCallback = true;
                childType = 3;
            }
            break;
    }
    if (invokeCallback) {
        callback(bookKeeping, children,
        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar, childType);
        return 1;
    }
    var subtreeCount = 0;
    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;
    if (children.forEach) {
        children.forEach(function (child, i) {
            var nextName = nextNamePrefix + getComponentKey(child, i);
            subtreeCount += traverseAllChildren(child, nextName, callback, bookKeeping);
        });
        return subtreeCount;
    }
    var iteratorFn = getIteractor(children);
    if (iteratorFn) {
        iterator = iteratorFn.call(children);
        var ii = 0,
            step;
        while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildren(child, nextName, callback, bookKeeping);
        }
        return subtreeCount;
    }
    throw "React.createElement: type is invalid.";
}
var REAL_SYMBOL = hasSymbol && Symbol.iterator;
var FAKE_SYMBOL = "@@iterator";
function getIteractor(a) {
    var iteratorFn = REAL_SYMBOL && a[REAL_SYMBOL] || a[FAKE_SYMBOL];
    if (iteratorFn && iteratorFn.call) {
        return iteratorFn;
    }
}

var Children = {
    only: function only(children) {
        if (isValidElement(children)) {
            return children;
        }
        throw new Error("expect only one child");
    },
    count: function count(children) {
        if (children == null) {
            return 0;
        }
        return traverseAllChildren(children, "", noop);
    },
    map: function map(children, func, context) {
        return proxyIt(children, func, [], context);
    },
    forEach: function forEach(children, func, context) {
        return proxyIt(children, func, null, context);
    },
    toArray: function toArray$$1(children) {
        return proxyIt(children, K, []);
    }
};
function proxyIt(children, func, result, context) {
    if (children == null) {
        return [];
    }
    mapChildren(children, null, func, result, context);
    return result;
}
function K(el) {
    return el;
}
function mapChildren(children, prefix, func, result, context) {
    var keyPrefix = "";
    if (prefix != null) {
        keyPrefix = escapeUserProvidedKey(prefix) + "/";
    }
    traverseAllChildren(children, "", traverseCallback, {
        context: context,
        keyPrefix: keyPrefix,
        func: func,
        result: result,
        count: 0
    });
}
var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
    return ("" + text).replace(userProvidedKeyEscapeRegex, "$&/");
}
function traverseCallback(bookKeeping, child, childKey) {
    var result = bookKeeping.result,
        keyPrefix = bookKeeping.keyPrefix,
        func = bookKeeping.func,
        context = bookKeeping.context;
    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (!result) {
        return;
    }
    if (Array.isArray(mappedChild)) {
        mapChildren(mappedChild, childKey, K, result);
    } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
            mappedChild = extend({}, mappedChild);
            mappedChild.key = keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + "/" : "") + childKey;
        }
        result.push(mappedChild);
    }
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
    isMounted: function isMounted$$1() {
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
    function create(obj, value) {
        obj[contextProp] = value;
        return obj;
    }
    Provider.childContextTypes = create({}, PropTypes.object.isRequired);
    var fn = inherit(Provider, Component);
    fn.getChildContext = function () {
        return create({}, this.emitter);
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
    Consumer.contextTypes = create({}, PropTypes.object);
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

function UpdateQueue() {
    return {
        pendingStates: [],
        pendingCbs: []
    };
}
function createInstance(fiber, context) {
    var updater = {
        mountOrder: Renderer.mountOrder++,
        enqueueSetState: returnFalse,
        isMounted: isMounted
    };
    var props = fiber.props,
        type = fiber.type,
        tag = fiber.tag,
        ref = fiber.ref,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = {
        refs: {},
        props: props,
        context: context,
        ref: ref,
        __proto__: type.prototype
    };
    fiber.errorHook = "constructor";
    try {
        if (isStateless) {
            extend(instance, {
                __isStateless: true,
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
            });
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
        fiber.stateNode = instance;
        fiber.updateQueue = UpdateQueue();
        instance._reactInternalFiber = fiber;
        instance.updater = updater;
        instance.context = context;
        updater.enqueueSetState = Renderer.updateComponent;
        if (type[gDSFP] || instance[gSBU]) {
            instance.__useNewHooks = true;
        }
    }
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
    var boundary = findCatchComponent(fiber, hook, error);
    if (boundary) {
        fiber.effectTag = NOWORK;
        if (fiber.hasMounted) {
        } else {
            fiber.stateNode = {
                updater: fakeObject
            };
        }
    } else {
        var p = fiber.return;
        for (var i in p.children) {
            if (p.children[i] == fiber) {
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
function findCatchComponent(fiber, hook, error) {
    var instance = void 0,
        name = void 0,
        names = [],
        topFiber = fiber,
        retry = void 0,
        boundary = void 0;
    while (fiber) {
        name = fiber.name;
        if (fiber.tag < 4) {
            names.push(name);
            instance = fiber.stateNode || {};
            if (instance.componentDidCatch && !boundary) {
                if (!fiber.hasCatch && topFiber !== fiber) {
                    boundary = fiber;
                } else if (fiber.hasCatch) {
                    retry = Object.assign({}, fiber);
                    retry.effectTag = DETACH;
                    retry.disposed = true;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
        fiber = fiber.return;
        if (boundary) {
            var boundaries = Renderer.boundaries;
            var stack = describeError(names, hook);
            var values = boundary.capturedValues || (boundary.capturedValues = []);
            values.push(error, {
                componentStack: stack
            });
            boundary.hasError = true;
            boundary.effectTag *= CAPTURE;
            boundaries.unshift(boundary);
            if (retry && retry !== boundary) {
                var arr = boundary.effects || (boundary.effects = []);
                arr.push(retry);
            }
            return boundary;
        }
    }
}
function removeFormBoundaries(fiber) {
    delete fiber.hasError;
    var arr = Renderer.boundaries;
    var index = arr.indexOf(fiber);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
function detachFiber(fiber, effects$$1) {
    fiber.effectTag = DETACH;
    effects$$1.push(fiber);
    if (fiber.ref && fiber.hasMounted) {
        fiber.effectTag *= NULLREF;
    }
    fiber.disposed = true;
    for (var child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects$$1);
    }
}

function updateEffects(fiber, topWork, info) {
    if (fiber.tag < 3) {
        var keepbook = Renderer.currentOwner;
        try {
            updateClassComponent(fiber, info);
        } catch (e) {
            pushError(fiber, fiber.errorHook, e);
        }
        Renderer.currentOwner = keepbook;
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
            if (fiber.hasMounted && instance[gSBU]) {
                updater.snapshot = guardCallback(instance, gSBU, [updater.prevProps, updater.prevState]);
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
        if (framentParent) {
            fiber.framentParent = framentParent;
            framentParent = null;
        }
    }
    var children = props && props.children;
    if (tag === 5) {
        info.containerStack.unshift(fiber.stateNode);
        fiber.shiftContainer = true;
        fiber.effectTag *= ATTR;
        if (prev) {
            fiber.children = prev.children;
        }
        diffChildren(fiber, children);
    } else {
        if (!prev || prev.props.children !== children) {
            fiber.effectTag *= CONTENT;
        }
    }
}
function mergeStates(fiber, nextProps) {
    var instance = fiber.stateNode,
        pendings = fiber.updateQueue.pendingStates,
        n = pendings.length,
        state = fiber.memoizedState || instance.state;
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
    if (fail) {
        return state;
    } else {
        return fiber.memoizedState = nextState;
    }
}
var framentParent = null;
function updateClassComponent(fiber, info) {
    var type = fiber.type,
        instance = fiber.stateNode,
        props = fiber.props;
    var contextStack = info.contextStack,
        containerStack = info.containerStack;
    var newContext = getMaskedContext(type.contextTypes, instance, contextStack);
    if (instance == null) {
        if (type === AnuPortal) {
            framentParent = null;
            fiber.parent = props.parent;
        } else {
            fiber.parent = containerStack[0];
        }
        instance = createInstance(fiber, newContext);
        if (type === Fragment) {
            framentParent = fiber;
        }
    }
    instance._reactInternalFiber = fiber;
    if (type === AnuPortal) {
        containerStack.unshift(fiber.parent);
        fiber.shiftContainer = true;
    }
    var updateQueue = fiber.updateQueue;
    if (!instance.__isStateless) {
        delete fiber.updateFail;
        if (fiber.hasMounted) {
            applybeforeUpdateHooks(fiber, instance, props, newContext, contextStack);
        } else {
            applybeforeMountHooks(fiber, instance, props, newContext, contextStack);
        }
        if (fiber.memoizedState) {
            instance.state = fiber.memoizedState;
        }
    }
    fiber.batching = updateQueue.batching;
    var cbs = updateQueue.pendingCbs;
    if (cbs.length) {
        fiber.pendingCbs = cbs;
        fiber.effectTag *= CALLBACK;
    }
    if (fiber.updateFail) {
        cloneChildren(fiber);
        fiber._hydrating = false;
        return;
    }
    instance.context = newContext;
    fiber.memoizedProps = instance.props = props;
    fiber.memoizedState = instance.state;
    if (instance.getChildContext) {
        var context = instance.getChildContext();
        context = Object.assign({}, newContext, context);
        fiber.shiftContext = true;
        contextStack.unshift(context);
    }
    fiber.effectTag *= HOOK;
    if (fiber.hasError) {
        return;
    }
    fiber._hydrating = true;
    Renderer.currentOwner = instance;
    var rendered = applyCallback(instance, "render", []);
    if (fiber.hasError) {
        return;
    }
    diffChildren(fiber, rendered);
}
function applybeforeMountHooks(fiber, instance, newProps) {
    fiber.setout = true;
    if (instance.__useNewHooks) {
        setStateByProps(instance, fiber, newProps, instance.state);
    } else {
        callUnsafeHook(instance, "componentWillMount", []);
    }
    delete fiber.setout;
    mergeStates(fiber, newProps);
    fiber.updateQueue = UpdateQueue();
}
function applybeforeUpdateHooks(fiber, instance, newProps, newContext, contextStack) {
    var oldProps = fiber.memoizedProps;
    var oldState = fiber.memoizedState;
    var updater = instance.updater;
    updater.prevProps = oldProps;
    updater.prevState = oldState;
    var propsChanged = oldProps !== newProps;
    var contextChanged = instance.context !== newContext;
    fiber.setout = true;
    if (!instance.__useNewHooks) {
        if (propsChanged || contextChanged) {
            var prevState = instance.state;
            callUnsafeHook(instance, "componentWillReceiveProps", [newProps, newContext]);
            if (prevState !== instance.state) {
                fiber.memoizedState = instance.state;
            }
        }
    }
    var newState = instance.state = oldState;
    var updateQueue = fiber.updateQueue;
    mergeStates(fiber, newProps);
    newState = fiber.memoizedState;
    setStateByProps(instance, fiber, newProps, newState);
    newState = fiber.memoizedState;
    delete fiber.setout;
    fiber._hydrating = true;
    if (!propsChanged && newState === oldState && contextStack.length == 1 && !updateQueue.isForced) {
        fiber.updateFail = true;
    } else {
        var args = [newProps, newState, newContext];
        fiber.updateQueue = UpdateQueue();
        if (!updateQueue.isForced && !applyCallback(instance, "shouldComponentUpdate", args)) {
            fiber.updateFail = true;
        } else if (!instance.__useNewHooks) {
            callUnsafeHook(instance, "componentWillUpdate", args);
        }
    }
}
function callUnsafeHook(a, b, c) {
    applyCallback(a, b, c);
    applyCallback(a, "UNSAFE_" + b, c);
}
function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key
                                                                              ) {
            return true;
        }
}
function setStateByProps(instance, fiber, nextProps, prevState) {
    fiber.errorHook = gDSFP;
    var fn = fiber.type[gDSFP];
    if (fn) {
        var partialState = fn.call(null, nextProps, prevState);
        if (typeNumber(partialState) === 8) {
            fiber.memoizedState = Object.assign({}, prevState, partialState);
        }
    }
}
function cloneChildren(fiber) {
    var prev = fiber.alternate;
    if (prev && prev.child) {
        var pc = prev.children;
        var cc = fiber.children = {};
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
    var oldFibers = parentFiber.children;
    if (oldFibers) {
        parentFiber.oldChildren = oldFibers;
    } else {
        oldFibers = {};
    }
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
        index = 0;
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
            _newFiber.effectTag = NOWORK;
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

function collectWork(fiber, updateFail, isTop) {
    if (!fiber) {
        return [];
    }
    if (fiber.hasError) {
        removeFormBoundaries(fiber);
        var ret = collectDeletion(fiber);
        delete fiber.child;
        fiber.oldChildren = fiber.children = {};
        return ret;
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
    if (fiber.dirty) {
        delete fiber.dirty;
        if (fiber.parent) {
            fiber.parent.insertPoint = fiber.insertPoint;
        }
    }
    var c = fiber.children || {};
    for (var i in c) {
        var child = c[i];
        var isHost = child.tag > 3;
        if (isHost) {
            if (child.framentParent) {
                var arr = getChildren$1(child.parent);
                var index = arr.indexOf(child.stateNode);
                child.insertPoint = index < 1 ? child.parent.insertPoint : arr[index - 1];
            } else {
                child.insertPoint = child.parent.insertPoint;
            }
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
                arrayPush.apply(effects$$1, collectWork(child, true));
            }
        } else {
            arrayPush.apply(effects$$1, collectWork(child));
        }
        if (child.effectTag) {
            effects$$1.push(child);
        }
    }
    return effects$$1;
}
function getChildren$1(parent) {
    return Array.from(parent.childNodes || parent.children);
}
function markDeletion(el) {
    el.disposed = true;
    el.effectTag = DETACH;
    if (el.ref) {
        el.effectTag *= NULLREF;
    }
}
function collectDeletion(fiber) {
    var effects$$1 = fiber.effects;
    if (effects$$1) {
        effects$$1.forEach(markDeletion);
        delete fiber.effects;
    } else {
        effects$$1 = [];
    }
    var c = fiber.oldChildren || emptyObject;
    for (var i in c) {
        var child = c[i];
        if (child.disposed) {
            continue;
        }
        markDeletion(child);
        arrayPush.apply(effects$$1, collectDeletion(child));
        effects$$1.push(child);
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
            pushError(fiber, "ref", e);
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

function commitWork() {
    Renderer.batchedUpdates(function () {
        commitPlaceEffects(effects);
        var tasks = effects,
            task;
        while (task = tasks.shift()) {
            commitOtherEffects(task, tasks);
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
            fiber.parent.insertPoint = null;
            Renderer.insertElement(fiber);
            fiber.hasMounted = true;
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
                        if (fiber.hasMounted) {
                            updater.enqueueSetState = returnFalse;
                            guardCallback(instance, "componentWillUnmount", []);
                        }
                    }
                    delete fiber.hasMounted;
                    delete fiber.stateNode;
                    delete fiber.alternate;
                    break;
                case HOOK:
                    if (fiber.hasMounted) {
                        guardCallback(instance, "componentDidUpdate", [updater.prevProps, updater.prevState, updater.snapshot]);
                    } else {
                        fiber.hasMounted = true;
                        guardCallback(instance, "componentDidMount", []);
                    }
                    delete fiber._hydrating;
                    if (fiber.hasError) {
                        removeFormBoundaries(fiber);
                        Renderer.diffChildren(fiber, []);
                        tasks.push.apply(tasks, fiber.effects);
                        delete fiber.effects;
                        var n = Object.assign({}, fiber);
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
                    var queue = fiber.pendingCbs;
                    fiber._hydrating = true;
                    queue.forEach(function (fn) {
                        fn.call(instance);
                    });
                    delete fiber._hydrating;
                    delete fiber.pendingCbs;
                    break;
                case CAPTURE:
                    var values = fiber.capturedValues;
                    fiber.effectTag = amount;
                    fiber.hasCatch = true;
                    var a = values.shift();
                    var b = values.shift();
                    if (!values.length) {
                        delete fiber.capturedValues;
                    }
                    instance.componentDidCatch(a, b);
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
var fn$1 = inherit(Unbatch, Component);
fn$1.render = function () {
    return this.state.child;
};

var macrotasks = Renderer.macrotasks;
var batchedtasks = [];
function render$1(vnode, root, callback) {
    var container = createContainer(root),
        immediateUpdate = false;
    if (!container.hostRoot) {
        var fiber = new Fiber({
            type: Unbatch,
            tag: 2,
            props: {},
            hasMounted: true,
            memoizedState: {},
            return: container
        });
        container.child = fiber;
        var instance = createInstance(fiber, {});
        instance.updater.isMounted = isMounted;
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
    var boundaries = Renderer.boundaries;
    if (boundaries.length) {
        var elem = boundaries.pop();
        macrotasks.push(elem);
    }
    topFibers.forEach(function (el) {
        var microtasks = el.microtasks;
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
Renderer.batchedUpdates = function (callback, event) {
    var keepbook = isBatching;
    isBatching = true;
    try {
        return callback(event);
    } finally {
        isBatching = keepbook;
        if (!isBatching) {
            var el = void 0;
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
                containerStack: [dom],
                contextStack: [{}]
            };
        }
        while (fiber && !fiber.disposed && deadline.timeRemaining() > ENOUGH_TIME) {
            fiber = updateEffects(fiber, topWork, info);
        }
        arrayPush.apply(effects, collectWork(topWork, null, true));
        effects.push(topWork);
        if (macrotasks.length && deadline.timeRemaining() > ENOUGH_TIME) {
            workLoop(deadline);
        } else {
            resetStack(info);
            commitWork();
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
function mergeUpdates(fiber, state, isForced, callback) {
    var updateQueue = fiber.updateQueue;
    if (isForced) {
        updateQueue.isForced = true;
    }
    if (state) {
        updateQueue.pendingStates.push(state);
    }
    if (isFn(callback)) {
        updateQueue.pendingCbs.push(callback);
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
        el.updateQueue.batching = true;
    });
    if (enqueue) {
        queue.push(fiber);
    }
}
function updateComponent(instance, state, callback, immediateUpdate) {
    var fiber = get(instance);
    fiber.dirty = true;
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
        root.anuProp = void 0;
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

function cleanChildren(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    return array.map(function (el) {
        if (el.type == "#text") {
            return el.children;
        } else {
            return {
                type: el.type,
                props: el.props,
                children: cleanChildren(el.children)
            };
        }
    });
}
var autoContainer = {
    type: "root",
    appendChild: noop,
    props: null,
    children: []
};
var yieldData = [];
var NoopRenderer = createRenderer({
    render: function render$$1(vnode) {
        return render$1(vnode, autoContainer);
    },
    updateAttribute: function updateAttribute() {},
    updateContext: function updateContext(fiber) {
        fiber.stateNode.children = fiber.props.children;
    },
    reset: function reset() {
        var index = topNodes.indexOf(autoContainer);
        if (index !== -1) {
            topNodes.splice(index, 1);
            topFibers.splice(index, 1);
        }
        autoContainer = {
            type: "root",
            appendChild: noop,
            props: null,
            children: []
        };
    },
    getRoot: function getRoot() {
        return autoContainer;
    },
    getChildren: function getChildren() {
        return cleanChildren(autoContainer.children || []);
    },
    yield: function _yield(a) {
        yieldData.push(a);
    },
    flush: function flush() {
        var ret = yieldData.concat();
        yieldData.length = 0;
        return ret;
    },
    createElement: function createElement(fiber) {
        return {
            type: fiber.type,
            props: null,
            children: fiber.tag === 6 ? fiber.props.children : []
        };
    },
    insertElement: function insertElement(fiber) {
        var dom = fiber.stateNode,
            parentNode = fiber.parent,
            before = fiber.insertPoint,
            children = parentNode.children;
        try {
            if (before == null) {
                if (dom !== children[0]) {
                    remove(children, dom);
                    children.unshift(dom);
                }
            } else {
                if (dom !== children[children.length - 1]) {
                    remove(children, dom);
                    var i = children.indexOf(before);
                    children.splice(i + 1, 0, dom);
                }
            }
        } catch (e) {
            throw e;
        }
    },
    emptyElement: function emptyElement(fiber) {
        var dom = fiber.stateNode;
        var children = dom && dom.children;
        if (dom && Array.isArray(children)) {
            children.forEach(NoopRenderer.removeElement);
        }
    },
    removeElement: function removeElement(fiber) {
        if (fiber.parent) {
            var parent = fiber.parent;
            var node = fiber.stateNode;
            remove(parent.children, node);
        }
    }
});
function remove(children, node) {
    var index = children.indexOf(node);
    if (index !== -1) {
        children.splice(index, 1);
    }
}

var win = getWindow();
var prevReact = win.ReactNoop;
var ReactNoop = void 0;
if (prevReact && prevReact.isReactNoop) {
    ReactNoop = prevReact;
} else {
    var render = NoopRenderer.render,
        flush = NoopRenderer.flush,
        reset = NoopRenderer.reset,
        getRoot = NoopRenderer.getRoot,
        getChildren = NoopRenderer.getChildren;
    ReactNoop = win.ReactNoop = {
        yield: NoopRenderer.yield,
        flush: flush,
        reset: reset,
        getRoot: getRoot,
        getChildren: getChildren,
        isReactNoop: true,
        version: "1.4.0",
        render: render,
        Fragment: Fragment,
        PropTypes: PropTypes,
        Children: Children,
        createPortal: createPortal,
        createContext: createContext,
        Component: Component,
        createRef: createRef,
        forwardRef: forwardRef,
        createElement: createElement,
        cloneElement: cloneElement,
        PureComponent: PureComponent,
        isValidElement: isValidElement,
        createFactory: createFactory
    };
}
var ReactNoop$1 = ReactNoop;

return ReactNoop$1;

})));
