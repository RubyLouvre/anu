/**
 * 运行于快应用的React by 司徒正美 Copyright 2018-10-21
 * IE9+
 */

var arrayPush = Array.prototype.push;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var gSBU = 'getSnapshotBeforeUpdate';
var gDSFP = 'getDerivedStateFromProps';
var hasSymbol = typeof Symbol === 'function' && Symbol['for'];
var effects = [];
var topFibers = [];
var topNodes = [];
var emptyObject = {};
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
function noop() {}
function Fragment(props) {
    return props.children;
}
function returnFalse() {
    return false;
}
function returnTrue() {
    return true;
}
function resetStack(info) {
    keepLast(info.containerStack);
    keepLast(info.contextStack);
}
function keepLast(list) {
    var n = list.length;
    list.splice(0, n - 1);
}
function get(key) {
    return key._reactInternalFiber;
}
var __type = Object.prototype.toString;
var fakeWindow = {};
function getWindow() {
    try {
        if (window) {
            return window;
        }
    } catch (e) {        }
    try {
        if (global) {
            return global;
        }
    } catch (e) {        }
    return fakeWindow;
}
function isMounted(instance) {
    var fiber = get(instance);
    return !!(fiber && fiber.hasMounted);
}
function toWarnDev(msg, deprecated) {
    msg = deprecated ? msg + ' is deprecated' : msg;
    var process = getWindow().process;
    if (process && process.env.NODE_ENV === 'development') {
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
function inherit(SubClass, SupClass) {
    function Bridge() {}
    var orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    var fn = SubClass.prototype = new Bridge();
    extend(fn, orig);
    fn.constructor = SubClass;
    return fn;
}
try {
    var supportEval = Function('a', 'return a + 1')(2) == 3;
} catch (e) {}
function miniCreateClass(ctor, superClass, methods, statics) {
    var className = ctor.name || 'IEComponent';
    var Ctor = supportEval ? Function('superClass', 'ctor', 'return function ' + className + ' (props, context) {\n            superClass.apply(this, arguments); \n            ctor.apply(this, arguments);\n      }')(superClass, ctor) : function ReactInstance() {
        superClass.apply(this, arguments);
        ctor.apply(this, arguments);
    };
    Ctor.displayName = className;
    var fn = inherit(Ctor, superClass);
    extend(fn, methods);
    if (statics) {
        extend(Ctor, statics);
    }
    return Ctor;
}
var lowerCache = {};
function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}
function isFn(obj) {
    return __type.call(obj) === '[object Function]';
}
var numberMap = {
    '[object Boolean]': 2,
    '[object Number]': 3,
    '[object String]': 4,
    '[object Function]': 5,
    '[object Symbol]': 6,
    '[object Array]': 7
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
var middlewares = [];
var Renderer = {
    controlledCbs: [],
    mountOrder: 1,
    macrotasks: [],
    boundaries: [],
    onBeforeRender: noop,
    onAfterRender: noop,
    onDispose: noop,
    middleware: function middleware(obj) {
        if (obj.begin && obj.end) {
            middlewares.push(obj);
        }
    },
    updateControlled: function updateControlled() {},
    fireMiddlewares: function fireMiddlewares(begin) {
        var index = begin ? middlewares.length - 1 : 0,
            delta = begin ? -1 : 1,
            method = begin ? "begin" : "end",
            obj = void 0;
        while (obj = middlewares[index]) {
            obj[method]();
            index += delta;
        }
    },
    currentOwner: null
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
    } else if (type + '' !== type) {
        toWarnDev('React.createElement: type is invalid.');
    }
    if (config != null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) {
            key = '' + config.key;
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
            key = '' + config.key;
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
                ref += '';
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
    return ReactElement('#text', 6, text + '');
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
var lastText = void 0,
    flattenIndex = void 0,
    flattenObject = void 0;
function flattenCb(context, child, key, childType) {
    if (child === null) {
        lastText = null;
        return;
    }
    if (childType === 3 || childType === 4) {
        if (lastText) {
            lastText.props += child;
            return;
        }
        lastText = child = createVText(child);
    } else {
        lastText = null;
    }
    if (!flattenObject[key]) {
        flattenObject[key] = child;
    } else {
        key = '.' + flattenIndex;
        flattenObject[key] = child;
    }
    flattenIndex++;
}
function fiberizeChildren(children, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    if (children !== void 666) {
        lastText = null;
        traverseAllChildren(children, '', flattenCb);
    }
    flattenIndex = 0;
    return fiber.children = flattenObject;
}
function getComponentKey(component, index) {
    if ((typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && component !== null && component.key != null) {
        return escape(component.key);
    }
    return index.toString(36);
}
var SEPARATOR = '.';
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
            if (children.$$typeof || children instanceof Component) {
                invokeCallback = true;
            } else if (children.hasOwnProperty('toString')) {
                children = children + '';
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
        var iterator = iteratorFn.call(children),
            child = void 0,
            ii = 0,
            step = void 0,
            nextName = void 0;
        while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildren(child, nextName, callback, bookKeeping);
        }
        return subtreeCount;
    }
    throw 'children: type is invalid.';
}
var REAL_SYMBOL = hasSymbol && Symbol.iterator;
var FAKE_SYMBOL = '@@iterator';
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

var PureComponent = miniCreateClass(function PureComponent() {
    this.isPureComponent = true;
}, Component, {
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        var a = shallowEqual(this.props, nextProps);
        var b = shallowEqual(this.state, nextState);
        return !a || !b;
    }
});

var eventSystem = {
    dispatchEvent: function dispatchEvent(e) {
        if (e.type == 'message') {
            return;
        }
        var instance = this.reactInstance;
        if (!instance || !instance.$$eventCached) {
            return;
        }
        var target = e.currentTarget;
        var dataset = target.dataset || {};
        var eventUid = dataset[toLowerCase(e.type) + 'Uid'];
        var fiber = instance.$$eventCached[eventUid + 'Fiber'];
        if (e.type == 'change' && fiber) {
            if (fiber.props.value + '' == e.detail.value) {
                return;
            }
        }
        var key = dataset['key'];
        eventUid += key != null ? '-' + key : '';
        if (instance) {
            Renderer.batchedUpdates(function () {
                try {
                    var fn = instance.$$eventCached[eventUid];
                    fn && fn.call(instance, createEvent(e, target));
                } catch (err) {
                    console.log(err.stack);
                }
            }, e);
        }
    }
};
function createEvent(e, target) {
    var event = Object.assign({}, e);
    if (e.detail) {
        Object.assign(event, e.detail);
        target.value = e.detail.value;
    }
    event.stopPropagation = function () {
        console.warn("小程序不支持这方法，请使用catchXXX");
    };
    event.preventDefault = returnFalse;
    event.target = target;
    event.timeStamp = new Date() - 0;
    if (!("x" in event)) {
        event.x = event.pageX;
        event.y = event.pageY;
    }
    return event;
}

function AnuPortal(props) {
    return props.children;
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
    var type = vnode.type || "ProxyComponent(react-hot-loader)";
    this.name = type.displayName || type.name || type;
    this.effectTag = 1;
}

var NOWORK = 1;
var WORKING = 2;
var PLACE = 3;
var CONTENT = 5;
var ATTR = 7;
var DUPLEX = 11;
var DETACH = 13;
var HOOK = 17;
var REF = 19;
var CALLBACK = 23;
var CAPTURE = 29;
var effectNames = [DUPLEX, HOOK, REF, DETACH, CALLBACK, CAPTURE].sort(function (a, b) {
    return a - b;
});
var effectLength = effectNames.length;

function pushError(fiber, hook, error) {
    var names = [];
    var boundary = findCatchComponent(fiber, names, hook);
    var stack = describeError(names, hook);
    if (boundary) {
        if (fiber.hasMounted) ; else {
            fiber.stateNode = {
                updater: fakeObject
            };
            fiber.effectTag = NOWORK;
        }
        var values = boundary.capturedValues || (boundary.capturedValues = []);
        values.push(error, {
            componentStack: stack
        });
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
            Renderer.catchStack = stack;
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
    return segments.join("\n\r").trim();
}
function findCatchComponent(fiber, names, hook) {
    var instance = void 0,
        name = void 0,
        topFiber = fiber,
        retry = void 0,
        boundary = void 0;
    while (fiber) {
        name = fiber.name;
        if (fiber.tag < 4) {
            names.push(name);
            instance = fiber.stateNode || {};
            if (instance.componentDidCatch && !boundary) {
                if (!fiber.caughtError && topFiber !== fiber) {
                    boundary = fiber;
                } else if (fiber.caughtError) {
                    retry = fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
        fiber = fiber.return;
        if (boundary) {
            var boundaries = Renderer.boundaries;
            if (!retry || retry !== boundary) {
                var effectTag = boundary.effectTag;
                var f = boundary.alternate;
                if (f && !f.catchError) {
                    f.forward = boundary.forward;
                    f.sibling = boundary.sibling;
                    if (boundary.return.child == boundary) {
                        boundary.return.child = f;
                    }
                    boundary = f;
                }
                if (!boundary.catchError) {
                    if (hook == "componentWillUnmount" || hook == "componentDidUpdate") {
                        boundary.effectTag = CAPTURE;
                    } else {
                        boundary.effectTag = effectTag * CAPTURE;
                    }
                    boundaries.unshift(boundary);
                    boundary.catchError = true;
                }
                if (retry) {
                    var arr = boundary.effects || (boundary.effects = []);
                    arr.push(retry);
                }
            }
            return boundary;
        }
    }
}
function removeFormBoundaries(fiber) {
    delete fiber.catchError;
    var arr = Renderer.boundaries;
    var index = arr.indexOf(fiber);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
function detachFiber(fiber, effects$$1) {
    fiber.effectTag = DETACH;
    effects$$1.push(fiber);
    fiber.disposed = true;
    for (var child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects$$1);
    }
}

function getInsertPoint(fiber) {
    var parent = fiber.parent;
    while (fiber) {
        if (fiber.stateNode === parent || fiber.isPortal) {
            return null;
        }
        var found = forward(fiber);
        if (found) {
            return found;
        }
        fiber = fiber.return;
    }
}
function setInsertPoints(children) {
    for (var i in children) {
        var child = children[i];
        if (child.disposed) {
            continue;
        }
        if (child.tag > 4) {
            var p = child.parent;
            child.effectTag = PLACE;
            child.forwardFiber = p.insertPoint;
            p.insertPoint = child;
            for (var pp = child.return; pp && pp.effectTag === NOWORK; pp = pp.return) {
                pp.effectTag = WORKING;
            }
        } else {
            if (child.child) {
                setInsertPoints(child.children);
            }
        }
    }
}
function forward(fiber) {
    var found;
    while (fiber.forward) {
        fiber = fiber.forward;
        if (fiber.disposed || fiber.isPortal) {
            continue;
        }
        if (fiber.tag > 3) {
            return fiber;
        }
        if (fiber.child) {
            found = downward(fiber);
            if (found) {
                return found;
            }
        }
    }
}
function downward(fiber) {
    var found;
    while (fiber.lastChild) {
        fiber = fiber.lastChild;
        if (fiber.disposed || fiber.isPortal) {
            return;
        }
        if (fiber.tag > 3) {
            return fiber;
        }
        if (fiber.forward) {
            found = forward(fiber);
            if (found) {
                return found;
            }
        }
    }
}

function reconcileDFS(fiber, info, deadline, ENOUGH_TIME) {
    var topWork = fiber;
    outerLoop: while (fiber) {
        if (fiber.disposed || deadline.timeRemaining() <= ENOUGH_TIME) {
            break;
        }
        var occurError = void 0;
        if (fiber.tag < 3) {
            var keepbook = Renderer.currentOwner;
            try {
                updateClassComponent(fiber, info);
            } catch (e) {
                occurError = true;
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
        if (fiber.child && !fiber.updateFail && !occurError) {
            fiber = fiber.child;
            continue outerLoop;
        }
        var f = fiber;
        while (f) {
            var instance = f.stateNode;
            if (f.tag > 3 || f.shiftContainer) {
                if (f.shiftContainer) {
                    delete f.shiftContainer;
                    info.containerStack.shift();
                }
            } else {
                var updater = instance && instance.updater;
                if (f.shiftContext) {
                    delete f.shiftContext;
                    info.contextStack.shift();
                }
                if (f.hasMounted && instance[gSBU]) {
                    updater.snapshot = guardCallback(instance, gSBU, [updater.prevProps, updater.prevState]);
                }
            }
            if (f === topWork) {
                break outerLoop;
            }
            if (f.sibling) {
                fiber = f.sibling;
                continue outerLoop;
            }
            f = f.return;
        }
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
    var parent = fiber.parent;
    fiber.forwardFiber = parent.insertPoint;
    parent.insertPoint = fiber;
    fiber.effectTag = PLACE;
    if (tag === 5) {
        fiber.stateNode.insertPoint = null;
        info.containerStack.unshift(fiber.stateNode);
        fiber.shiftContainer = true;
        fiber.effectTag *= ATTR;
        if (fiber.ref) {
            fiber.effectTag *= REF;
        }
        diffChildren(fiber, props.children);
    } else {
        if (!prev || prev.props !== props) {
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
function updateClassComponent(fiber, info) {
    var type = fiber.type,
        instance = fiber.stateNode,
        props = fiber.props;
    var contextStack = info.contextStack,
        containerStack = info.containerStack;
    var newContext = getMaskedContext(instance, type.contextTypes, contextStack);
    if (instance == null) {
        fiber.parent = type === AnuPortal ? props.parent : containerStack[0];
        instance = createInstance(fiber, newContext);
        cacheContext(instance, contextStack[0], newContext);
    }
    instance._reactInternalFiber = fiber;
    var isStateful = !instance.__isStateless;
    if (isStateful) {
        var updateQueue = fiber.updateQueue;
        delete fiber.updateFail;
        if (fiber.hasMounted) {
            applybeforeUpdateHooks(fiber, instance, props, newContext, contextStack);
        } else {
            applybeforeMountHooks(fiber, instance, props, newContext, contextStack);
        }
        if (fiber.memoizedState) {
            instance.state = fiber.memoizedState;
        }
        fiber.batching = updateQueue.batching;
        var cbs = updateQueue.pendingCbs;
        if (cbs.length) {
            fiber.pendingCbs = cbs;
            fiber.effectTag *= CALLBACK;
        }
        if (fiber.ref) {
            fiber.effectTag *= REF;
        }
    } else if (type === AnuPortal) {
        containerStack.unshift(fiber.parent);
        fiber.shiftContainer = true;
    }
    instance.context = newContext;
    fiber.memoizedProps = instance.props = props;
    fiber.memoizedState = instance.state;
    if (instance.getChildContext) {
        var context = instance.getChildContext();
        context = Object.assign({}, contextStack[0], context);
        fiber.shiftContext = true;
        contextStack.unshift(context);
    }
    if (isStateful) {
        if (fiber.parent && fiber.hasMounted && fiber.dirty) {
            fiber.parent.insertPoint = getInsertPoint(fiber);
        }
        if (fiber.updateFail) {
            cloneChildren(fiber);
            fiber._hydrating = false;
            return;
        }
        delete fiber.dirty;
        fiber.effectTag *= HOOK;
    } else {
        fiber.effectTag = WORKING;
    }
    if (fiber.catchError) {
        return;
    }
    Renderer.onBeforeRender(fiber);
    fiber._hydrating = true;
    Renderer.currentOwner = instance;
    var rendered = applyCallback(instance, "render", []);
    diffChildren(fiber, rendered);
    Renderer.onAfterRender(fiber);
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
    if (a.type === b.type && a.key === b.key) {
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
        fiber.lastChild = prev.lastChild;
        for (var i in pc) {
            var a = pc[i];
            a.return = fiber;
            cc[i] = a;
        }
        setInsertPoints(cc);
    }
}
function cacheContext(instance, unmaskedContext, context) {
    instance.__unmaskedContext = unmaskedContext;
    instance.__maskedContext = context;
}
function getMaskedContext(instance, contextTypes, contextStack) {
    if (instance && !contextTypes) {
        return instance.context;
    }
    var context = {};
    if (!contextTypes) {
        return context;
    }
    var unmaskedContext = contextStack[0];
    if (instance) {
        var cachedUnmasked = instance.__unmaskedContext;
        if (cachedUnmasked === unmaskedContext) {
            return instance.__maskedContext;
        }
    }
    for (var key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = unmaskedContext[key];
        }
    }
    if (instance) {
        cacheContext(instance, unmaskedContext, context);
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
    var matchFibers = new Object();
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
                delete _newFiber.disposed;
                _newFiber.alternate = alternate;
                if (_newFiber.ref && _newFiber.deleteRef) {
                    delete _newFiber.ref;
                    delete _newFiber.deleteRef;
                }
                if (oldRef && oldRef !== _newFiber.ref) {
                    effects$$1.push(alternate);
                }
                if (_newFiber.tag === 5) {
                    _newFiber.lastProps = alternate.props;
                }
            } else {
                detachFiber(_oldFiber, effects$$1);
            }
        } else {
            _newFiber = new Fiber(_newFiber);
        }
        newFibers[_i] = _newFiber;
        _newFiber.index = index++;
        _newFiber.return = parentFiber;
        if (prevFiber) {
            prevFiber.sibling = _newFiber;
            _newFiber.forward = prevFiber;
        } else {
            parentFiber.child = _newFiber;
            _newFiber.forward = null;
        }
        prevFiber = _newFiber;
    }
    parentFiber.lastChild = prevFiber;
    if (prevFiber) {
        prevFiber.sibling = null;
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
            var number = typeNumber(ref);
            refStrategy[number](owner, ref, dom);
            if (owner && owner.__isStateless) {
                delete fiber.ref;
                fiber.deleteRef = true;
            }
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

var domFns = ["insertElement", "updateContent", "updateAttribute"];
var domEffects = [PLACE, CONTENT, ATTR];
var domRemoved = [];
function commitDFSImpl(fiber) {
    var topFiber = fiber;
    outerLoop: while (true) {
        if (fiber.effects && fiber.effects.length) {
            fiber.effects.forEach(disposeFiber);
            delete fiber.effects;
        }
        if (fiber.effectTag % PLACE == 0) {
            domEffects.forEach(function (effect, i) {
                if (fiber.effectTag % effect == 0) {
                    Renderer[domFns[i]](fiber);
                    fiber.effectTag /= effect;
                }
            });
            fiber.hasMounted = true;
        } else {
            if (fiber.catchError) {
                removeFormBoundaries(fiber);
                disposeFibers(fiber);
            }
        }
        if (fiber.updateFail) {
            delete fiber.updateFail;
        }
        if (fiber.child && fiber.child.effectTag > NOWORK) {
            fiber = fiber.child;
            continue;
        }
        var f = fiber;
        while (f) {
            if (f.effectTag === WORKING) {
                f.effectTag = NOWORK;
            } else if (f.effectTag > WORKING) {
                commitEffects(f);
                if (f.capturedValues) {
                    f.effectTag = CAPTURE;
                }
            }
            if (f === topFiber || f.hostRoot) {
                break outerLoop;
            }
            if (f.sibling) {
                fiber = f.sibling;
                continue outerLoop;
            }
            f = f.return;
        }
    }
}
function commitDFS(effects$$1) {
    Renderer.batchedUpdates(function () {
        var el;
        while (el = effects$$1.shift()) {
            if (el.effectTag === DETACH && el.caughtError) {
                disposeFiber(el);
            } else {
                commitDFSImpl(el);
            }
            if (domRemoved.length) {
                domRemoved.forEach(Renderer.removeElement);
                domRemoved.length = 0;
            }
        }
    }, {});
    var error = Renderer.catchError;
    if (error) {
        delete Renderer.catchError;
        throw error;
    }
}
function commitEffects(fiber) {
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
                case WORKING:
                    break;
                case DUPLEX:
                    Renderer.updateControlled(fiber);
                    break;
                case HOOK:
                    if (fiber.hasMounted) {
                        guardCallback(instance, "componentDidUpdate", [updater.prevProps, updater.prevState, updater.snapshot]);
                    } else {
                        fiber.hasMounted = true;
                        guardCallback(instance, "componentDidMount", []);
                    }
                    delete fiber._hydrating;
                    if (fiber.catchError) {
                        fiber.effectTag = amount;
                        return;
                    }
                    break;
                case REF:
                    Refs.fireRef(fiber, instance);
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
                    fiber.caughtError = true;
                    var a = values.shift();
                    var b = values.shift();
                    if (!values.length) {
                        fiber.effectTag = amount;
                        delete fiber.capturedValues;
                    }
                    instance.componentDidCatch(a, b);
                    break;
            }
        }
    }
    fiber.effectTag = NOWORK;
}
function disposeFibers(fiber) {
    var list = [fiber.oldChildren, fiber.children];
    for (var i = 0; i < 2; i++) {
        var c = list[i];
        if (c) {
            for (var _i in c) {
                var child = c[_i];
                if (!child.disposed && child.hasMounted) {
                    disposeFiber(child, true);
                    disposeFibers(child);
                }
            }
        }
    }
    delete fiber.child;
    delete fiber.lastChild;
    delete fiber.oldChildren;
    fiber.children = {};
}
function disposeFiber(fiber, force) {
    var stateNode = fiber.stateNode,
        effectTag = fiber.effectTag;
    if (!stateNode) {
        return;
    }
    if (!stateNode.__isStateless && fiber.ref) {
        Refs.fireRef(fiber, null);
    }
    if (effectTag % DETACH == 0 || force === true) {
        if (fiber.tag > 3) {
            domRemoved.push(fiber);
        } else {
            Renderer.onDispose(fiber);
            if (fiber.hasMounted) {
                stateNode.updater.enqueueSetState = returnFalse;
                guardCallback(stateNode, "componentWillUnmount", []);
                delete fiber.stateNode;
            }
        }
        delete fiber.alternate;
        delete fiber.hasMounted;
        fiber.disposed = true;
    }
    fiber.effectTag = NOWORK;
}

var Unbatch = miniCreateClass(function Unbatch(props) {
    this.state = {
        child: props.child
    };
}, Component, {
    render: function render() {
        return this.state.child;
    }
});

var macrotasks = Renderer.macrotasks;
var boundaries = Renderer.boundaries;
var batchedtasks = [];
function render(vnode, root, callback) {
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
        fiber.index = 0;
        container.child = fiber;
        var instance = createInstance(fiber, {});
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
    if (boundaries.length) {
        macrotasks.unshift.apply(macrotasks, boundaries);
        boundaries.length = 0;
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
var ENOUGH_TIME = 1;
var deadline = {
    didTimeout: false,
    timeRemaining: function timeRemaining() {
        return 2;
    }
};
function requestIdleCallback(fn) {
    fn(deadline);
}
Renderer.scheduleWork = function () {
    performWork(deadline);
};
var isBatching = false;
Renderer.batchedUpdates = function (callback, event) {
    var keepbook = isBatching;
    isBatching = true;
    try {
        event && Renderer.fireMiddlewares(true);
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
            event && Renderer.fireMiddlewares();
            Renderer.scheduleWork();
        }
    }
};
function workLoop(deadline) {
    var fiber = macrotasks.shift(),
        info = void 0;
    if (fiber) {
        if (fiber.type === Unbatch) {
            info = fiber.return;
        } else {
            var dom = getContainer(fiber);
            info = {
                containerStack: [dom],
                contextStack: [fiber.stateNode.__unmaskedContext]
            };
        }
        reconcileDFS(fiber, info, deadline, ENOUGH_TIME);
        updateCommitQueue(fiber);
        resetStack(info);
        if (macrotasks.length && deadline.timeRemaining() > ENOUGH_TIME) {
            workLoop(deadline);
        } else {
            commitDFS(effects);
        }
    }
}
function updateCommitQueue(fiber) {
    var hasBoundary = boundaries.length;
    if (fiber.type !== Unbatch) {
        if (hasBoundary) {
            arrayPush.apply(effects, boundaries);
        } else {
            effects.push(fiber);
        }
    } else {
        effects.push(fiber);
    }
    boundaries.length = 0;
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

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function _uuid() {
    return (Math.random() + '').slice(-4);
}
var delayMounts = [];
function getUUID() {
    return _uuid() + _uuid();
}
function updateMiniApp(instance) {
    if (!instance || !instance.wx) {
        return;
    }
    if (instance.wx.setData) {
        instance.wx.setData(safeClone({
            props: instance.props,
            state: instance.state || null,
            context: instance.context
        }));
    } else {
        updateQuickApp(instance.wx, instance);
    }
}
function updateQuickApp(quick, instance) {
    quick.props = instance.props;
    quick.state = instance.state || null;
    quick.context = instance.context;
}
function isReferenceType(val) {
    return val && ((typeof val === 'undefined' ? 'undefined' : _typeof$1(val)) === 'object' || Object.prototype.toString.call(val) === '[object Array]');
}
function safeClone(originVal) {
    var temp = originVal instanceof Array ? [] : {};
    for (var item in originVal) {
        if (hasOwnProperty.call(originVal, item)) {
            var value = originVal[item];
            if (isReferenceType(value)) {
                if (value.$$typeof) {
                    continue;
                }
                temp[item] = safeClone(value);
            } else {
                temp[item] = value;
            }
        }
    }
    return temp;
}
function toRenderProps(props) {
    return null;
}

var onEvent = /(?:on|catch)[A-Z]/;
function getEventHashCode(name, props, key) {
    var n = name.charAt(0) == 'o' ? 2 : 5;
    var type = toLowerCase(name.slice(n));
    var eventCode = props['data-' + type + '-uid'];
    return eventCode + (key != null ? '-' + key : '');
}
var Renderer$1 = createRenderer({
    render: render,
    updateAttribute: function updateAttribute(fiber) {
        var props = fiber.props,
            lastProps = fiber.lastProps;
        var classId = props['data-class-uid'];
        var instance = fiber._owner;
        if (instance && !instance.classUid) {
            instance = get(instance)._owner;
        }
        if (instance && classId) {
            var cached = instance.$$eventCached || (instance.$$eventCached = {});
            for (var name in props) {
                if (onEvent.test(name) && isFn(props[name])) {
                    var code = getEventHashCode(name, props, props['data-key']);
                    cached[code] = props[name];
                    cached[code + 'Fiber'] = fiber;
                }
            }
            if (lastProps) {
                for (var _name in lastProps) {
                    if (onEvent.test(_name) && !props[_name]) {
                        code = getEventHashCode(_name, lastProps, lastProps['data-key']);
                        delete cached[code];
                        delete cached[code + 'Fiber'];
                    }
                }
            }
        }
    },
    updateContent: function updateContent(fiber) {
        fiber.stateNode.props = fiber.props;
    },
    onBeforeRender: function onBeforeRender(fiber) {
        var type = fiber.type;
        if (type.reactInstances) {
            var name = fiber.name;
            var noMount = !fiber.hasMounted;
            var instance = fiber.stateNode;
            if (!instance.instanceUid) {
                var uuid = 'i' + getUUID();
                instance.instanceUid = uuid;
                type[uuid] = instance;
            }
            instance.props.instanceUid = instance.instanceUid;
            if (type.wxInstances) {
                if (type.wxInstances.length && !instance.wx) {
                    var wx = instance.wx = type.wxInstances.shift();
                    wx.reactInstance = instance;
                    console.log('onBeforeRender时更新', name, instance.props);
                }
                if (!instance.wx) {
                    console.log('onBeforeRender时更新', name, '没有wx');
                    type.reactInstances.push(instance);
                }
            }
        }
        if (noMount && instance.componentDidMount) {
            delayMounts.push({
                instance: instance,
                fn: instance.componentDidMount
            });
            instance.componentDidMount = noop;
        }
    },
    onAfterRender: function onAfterRender(fiber) {
        updateMiniApp(fiber.stateNode);
    },
    onDispose: function onDispose(fiber) {
        var instance = fiber.stateNode;
        var wx = instance.wx;
        if (wx) {
            wx.reactInstance = null;
            instance.wx = null;
        }
    },
    createElement: function createElement(fiber) {
        return fiber.tag === 5 ? {
            type: fiber.type,
            props: fiber.props || {},
            children: []
        } : {
            type: fiber.type,
            props: fiber.props
        };
    },
    insertElement: function insertElement(fiber) {
        var dom = fiber.stateNode,
            parentNode = fiber.parent,
            forwardFiber = fiber.forwardFiber,
            before = forwardFiber ? forwardFiber.stateNode : null,
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
            children.forEach(Renderer$1.removeElement);
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

var rhyphen = /([a-z\d])([A-Z]+)/g;
function hyphen(target) {
    return target.replace(rhyphen, '$1-$2').toLowerCase();
}
function transform(obj) {
    var _this = this;
    return Object.keys(obj).map(function (item) {
        var value = obj[item].toString();
        value = value.replace(/(\d+)px/gi, function (str, match) {
            return _this.pxTransform(match);
        });
        return hyphen(item) + ': ' + value;
    }).join(';');
}
function toStyle(obj, props, key) {
    if (props) {
        var str = transform.call(this, obj);
        props[key] = str;
    } else {
        console.warn('props 为空');
    }
    return obj;
}

var registeredComponents = {};
function useComponent(props) {
    var is = props.is;
    var clazz = registeredComponents[is];
    delete props.is;
    var args = [].slice.call(arguments, 2);
    args.unshift(clazz, props);
    console.log('使用组件', is);
    return createElement.apply(null, args);
}

var shareObject = {};
function getApp() {
    return shareObject.app;
}
function registerPage(PageClass, path) {
    PageClass.reactInstances = [];
    var instance;
    var config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        eventSystem: eventSystem.dispatchEvent,
        onInit: function onInit(query) {
            instance = render(createElement(PageClass, {
                path: path,
                query: query,
                isPageComponent: true
            }), {
                type: 'page',
                props: {},
                children: [],
                root: true,
                appendChild: noop
            });
            transmitData(PageClass, path, instance, this);
        },
        onShow: function onShow() {
            transmitData(PageClass, path, instance, this);
            var fn = this.reactInstance.componentDidShow;
            fn && fn.call(instance);
        },
        onHide: function onHide() {
            var fn = this.reactInstance.componentDidHide;
            fn && fn.call(instance);
        },
        onReady: function onReady() {
            console.log('页面布局完成', path);
            var el;
            while (el = delayMounts.pop()) {
                el.fn.call(el.instance);
                el.instance.componentDidMount = el.fn;
            }
        },
        onMenuPress: function onMenuPress(a) {
            instance.onMenuPress && instance.onMenuPress(a);
        }
    };
    return config;
}
function transmitData(pageClass, pagePath, reactInstance, quickInstance) {
    reactInstance.wx = quickInstance;
    quickInstance.reactInstance = reactInstance;
    updateMiniApp(reactInstance);
    var cc = reactInstance.config || pageClass.config;
    shareObject.pageConfig = cc;
    shareObject.pagePath = pagePath;
    shareObject.page = reactInstance;
    shareObject.app = quickInstance.$app.$def;
}

var api = {
    showModal: function showModal(obj) {
        var buttons = [{
            text: obj.confirmText,
            color: obj.confirmColor
        }];
        if (obj.showCancel) {
            buttons.push({
                text: obj.cancelText,
                color: obj.cancelColor
            });
        }
        obj.buttons = obj.confirmText ? buttons : [];
        obj.message = obj.content;
        delete obj.content;
        var prompt = require('@system.prompt');
        prompt.showDialog(obj);
    }
};

var win = getWindow();
var React = void 0;
var render$1 = Renderer$1.render;
function registerComponent(type, name) {
    registeredComponents[name] = type;
    var reactInstances = type.reactInstances = [];
    var wxInstances = type.wxInstances = [];
    return {
        private: {
            props: {},
            state: {},
            context: {}
        },
        onInit: function onInit() {
            var instance = reactInstances.shift();
            if (instance) {
                console.log("created时为", name, "添加wx");
                instance.wx = this;
                this.reactInstance = instance;
            } else {
                console.log("created时为", name, "没有对应react实例");
                wxInstances.push(this);
            }
        },
        onReady: function onReady() {
            if (this.reactInstance) {
                updateMiniApp(this.reactInstance);
                console.log("attached时更新", name);
            } else {
                console.log("attached时无法更新", name);
            }
        },
        onDestroy: function onDestroy() {
            this.reactInstance = null;
        },
        methods: {
            dispatchEvent: eventSystem.dispatchEvent
        }
    };
}
React = win.React = {
    eventSystem: eventSystem,
    findDOMNode: function findDOMNode() {
        console.log("小程序不支持findDOMNode");
    },
    version: '1.4.8',
    render: render$1,
    hydrate: render$1,
    Fragment: Fragment,
    PropTypes: PropTypes,
    Children: Children,
    Component: Component,
    createElement: createElement,
    cloneElement: cloneElement,
    PureComponent: PureComponent,
    isValidElement: isValidElement,
    createFactory: createFactory,
    toClass: function toClass() {
        return miniCreateClass.apply(null, arguments);
    },
    toRenderProps: toRenderProps,
    useComponent: useComponent,
    registerComponent: registerComponent,
    registerPage: registerPage,
    toStyle: toStyle,
    getApp: getApp,
    appType: 'quick',
    App: function App(demo) {
        var app = {};
        Object.assign(app, demo);
        delete app.constructor;
        return app;
    },
    api: api
};
var React$1 = React;

export default React$1;
export { registerComponent, Children, createElement, Component };
