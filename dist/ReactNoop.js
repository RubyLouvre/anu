/**
 * 此个版本专门用于测试
 * by 司徒正美 Copyright 2018-03-29
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ReactNoop = factory());
}(this, (function () {

var hasSymbol = typeof Symbol === "function" && Symbol["for"];

var hasOwnProperty = Object.prototype.hasOwnProperty;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;
function Fragment(props) {
    return props.children;
}
function get(key) {
    return key._reactInternalFiber;
}
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
function createRenderer(methods) {
    extend(Flutter, methods);
}
var Flutter = {
    interactQueue: null,
    mainThread: [],
    controlledCbs: [],
    mountOrder: 1,
    currentOwner: null
};
function deprecatedWarn(methodName) {
    if (!deprecatedWarn[methodName]) {
        console.warn(methodName + ' is deprecated');
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

function Vnode(type, tag, props, key, ref) {
    this.type = type;
    this.tag = tag;
    if (tag !== 6) {
        this.props = props;
        this._owner = Flutter.currentOwner;
        if (key) {
            this.key = key;
        }
        var refType = typeNumber(ref);
        if (refType === 2 || refType === 3 || refType === 4 || refType === 5 || refType === 8) {
            if (refType < 4) {
                ref += "";
            }
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
    vnode.props = { children: text };
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
        lastOwn = Flutter.currentOwner,
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
    Flutter.currentOwner = owner;
    var args = [].slice.call(arguments, 0),
        argsLength = args.length;
    args[0] = vnode.type;
    args[1] = configs;
    if (argsLength === 2 && configs.children) {
        delete configs.children._disposed;
        args.push(configs.children);
    }
    var ret = createElement.apply(null, args);
    Flutter.currentOwner = lastOwn;
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
    Flutter.currentOwner = this;
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
        return (this.updater || fakeObject)._isMounted(this);
    },
    setState: function setState(state, cb) {
        (this.updater || fakeObject).enqueueSetState(this, state, cb);
    },
    forceUpdate: function forceUpdate(cb) {
        (this.updater || fakeObject).enqueueSetState(this, true, cb);
    },
    render: function render() {}
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
fn.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
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

var NOWORK = 0;
var WORKING = 1;
var PLACE = 2;
var CONTENT = 3;
var ATTR = 5;
var NULLREF = 7;
var HOOK = 11;
var REF = 13;
var DETACH = 17;
var NOUPDATE = 19;
var CALLBACK = 23;
var CAPTURE = 29;
var effectNames = [PLACE, CONTENT, ATTR, NULLREF, HOOK, REF, DETACH, NOUPDATE, CALLBACK, CAPTURE];
var effectLength = effectNames.length;

var updateQueue = Flutter.mainThread;
function pushError(instance, hook, error) {
    var names = [],
        fiber = get(instance);
    var catchFiber = findCatchComponent(fiber, names);
    var stack = describeError(names, hook);
    if (catchFiber) {
        disableEffect(fiber);
        catchFiber.errorInfo = catchFiber.errorInfo || [error, { componentStack: stack }, instance];
        delete catchFiber._children;
        delete catchFiber.child;
        catchFiber.effectTag = CALLBACK;
        updateQueue.push(catchFiber);
    } else {
        console.log(error);
        console.warn(stack);
        if (!Flutter.error) {
            Flutter.error = error;
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

var componentStack = [];
var topFibers = [];
var topNodes = [];

var emptyObject = {};
var contextStack = [emptyObject];

function createInstance(fiber, context) {
    var updater = {
        mountOrder: Flutter.mountOrder++,
        enqueueSetState: returnFalse,
        _isMounted: returnFalse
    };
    var props = fiber.props,
        type = fiber.type,
        tag = fiber.tag,
        isStateless = tag === 1,
        lastOwn = Flutter.currentOwner,
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
            Flutter.currentOwner = instance;
            if (type.isRef) {
                instance.render = function () {
                    return type(this.props, this.ref);
                };
            } else {
                fiber.child = instance.render();
                if (lifeCycleHook) {
                    for (var i in lifeCycleHook) {
                        if (i !== "render") {
                            instance[i] = lifeCycleHook[i];
                        }
                    }
                    lifeCycleHook = false;
                } else {
                    instance._isStateless = returnTrue;
                    fiber._willReceive = false;
                }
                delete instance.__init__;
            }
        } else {
            instance = new type(props, context);
        }
    } catch (e) {
        instance = {};
    } finally {
        Flutter.currentOwner = lastOwn;
    }
    fiber.stateNode = instance;
    instance.updater = updater;
    return instance;
}

function beginWork(fiber) {
    if (!fiber.effectTag) {
        fiber.effectTag = WORKING;
    }
    if (fiber.tag > 3) {
        updateHostComponent(fiber);
    } else {
        updateClassComponent(fiber);
    }
}
function Fiber(vnode) {
    extend(this, vnode);
    var type = vnode.type;
    this.name = type.displayName || type.name || type;
    this.effectTag = 1;
}
function updateHostComponent(fiber) {
    if (!fiber.stateNode) {
        try {
            fiber.stateNode = Flutter.createElement(fiber);
        } catch (e) {
            throw e;
        }
    }
    var props = fiber.props,
        tag = fiber.tag,
        onlyPlace = fiber.onlyPlace,
        parent = fiber.parent,
        root = fiber.root;
    var children = props && props.children;
    if (parent) {
        var b = parent.beforeNode;
        fiber.mountPoint = b;
        parent.beforeNode = fiber.stateNode;
    }
    if (tag == 5 && !root) {
        fiber.effectTag *= ATTR;
    }
    if (fiber.tag === 6) {
        var prev = fiber.alternate;
        if (!prev || prev.props.children !== children) {
            fiber.effectTag *= CONTENT;
        }
    } else if (props) {
        diffChildren(fiber, children);
    }
}
function updateClassComponent(fiber) {
    var type = fiber.type,
        instance = fiber.stateNode,
        nextProps = fiber.props,
        nextState = fiber.partialState,
        isForceUpdate = fiber.isForceUpdate;
    var nextContext = getMaskedContext(type.contextTypes),
        c = void 0;
    if (instance == null) {
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = Flutter.updateComponent;
        var willReceive = fiber._willReceive;
        delete fiber._willReceive;
        var propsChange = false;
    } else {
        var _instance = instance,
            lastProps = _instance.props,
            lastState = _instance.state;
        fiber.lastProps = lastProps;
        fiber.lastState = lastState;
        propsChange = lastProps !== nextProps;
    }
    var shouldUpdate = true;
    var updater = instance.updater;
    var stateNoChange = !nextState;
    instance._reactInternalFiber = fiber;
    if (fiber.parent) {
        fiber.mountPoint = fiber.parent.beforeNode;
    }
    if (instance.getChildContext) {
        try {
            c = instance.getChildContext();
            c = Object.assign({}, nextContext, c);
        } catch (e) {
            c = {};
        }
        contextStack.unshift(c);
    }
    if (!instance._isStateless) {
        updater._hooking = true;
        if (updater._isMounted()) {
            delete fiber.isForceUpdate;
            if (stateNoChange) {
                willReceive = propsChange || instance.context !== nextContext;
                if (willReceive) {
                    callLifeCycleHook(instance, "componentWillReceiveProps", [nextProps, nextContext]);
                }
                if (propsChange) {
                    getDerivedStateFromProps(instance, type, nextProps, lastState);
                }
            }
            var args = [nextProps, nextState, nextContext];
            if (!isForceUpdate && !callLifeCycleHook(instance, "shouldComponentUpdate", args)) {
                shouldUpdate = false;
            } else {
                callLifeCycleHook(instance, "componentWillUpdate", args);
            }
        } else {
            getDerivedStateFromProps(instance, type, nextProps, lastState);
            callLifeCycleHook(instance, "componentWillMount", []);
        }
        updater._hooking = false;
        if (!shouldUpdate || fiber.onlyPlace) {
            console.log("shouldRender", nextProps.char);
            diffChildren(fiber, fiber._children, true);
            if (componentStack[0] === instance) {
                componentStack.shift();
            }
            return;
        }
    }
    instance.context = nextContext;
    instance.props = nextProps;
    instance.state = fiber.partialState || lastState;
    fiber.effectTag *= HOOK;
    var rendered;
    updater._hydrating = true;
    if (!isForceUpdate && willReceive === false) {
        delete fiber._willReceive;
        var a = fiber.child;
        if (a && a.sibling) {
            rendered = [];
            for (; a; a = a.sibling) {
                rendered.push(a);
            }
        } else {
            rendered = a;
        }
    } else {
        var lastOwn = Flutter.currentOwner;
        Flutter.currentOwner = instance;
        rendered = callLifeCycleHook(instance, "render", []);
        if (componentStack[0] === instance) {
            componentStack.shift();
        }
        if (updater._hasError) {
            rendered = [];
        }
        Flutter.currentOwner = lastOwn;
    }
    diffChildren(fiber, rendered);
}
function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
function detachFiber(fiber, effects) {
    fiber.effectTag = DETACH;
    if (fiber.ref) {
        fiber.effectTag *= NULLREF;
    }
    fiber.disposed = true;
    if (fiber.tag < 3) {
        fiber.effectTag *= HOOK;
    }
    effects.push(fiber);
    for (var child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects);
    }
}
var gDSFP = "getDerivedStateFromProps";
function getDerivedStateFromProps(instance, type, nextProps, lastState) {
    try {
        var method = type[gDSFP];
        if (method) {
            var partialState = method.call(null, nextProps, lastState);
            if (partialState != null) {
                var fiber = get(instance);
                fiber.partialState = Object.assign({}, fiber.partialState || lastState, partialState);
            }
        }
    } catch (error) {
        pushError(instance, gDSFP, error);
    }
}
function getMaskedContext(contextTypes) {
    var context = {};
    if (!contextTypes) {
        return emptyObject;
    }
    var parentContext = contextStack[0],
        hasKey = void 0;
    for (var key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            hasKey = true;
            context[key] = parentContext[key];
        }
    }
    return hasKey ? context : emptyObject;
}
function diffChildren(parentFiber, children, isClone) {
    var prev = parentFiber.alternate;
    var oldFibers = prev ? prev._children : {};
    if (!isClone) {
        var newFibers = fiberizeChildren(children, parentFiber);
        var effects = parentFiber.effects || (parentFiber.effects = []);
    } else {
        newFibers = Object.assign({}, oldFibers);
    }
    var matchFibers = {};
    var parent = parentFiber;
    do {
        if (parent.tag === 5) {
            break;
        }
    } while (parent = parent.return);
    parent = parent.stateNode;
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
        detachFiber(oldFiber, effects);
    }
    var prevFiber = void 0,
        index = 0;
    for (var _i in newFibers) {
        var _newFiber = newFibers[_i] = new Fiber(newFibers[_i]);
        _newFiber.parent = parent;
        if (isClone) {
            _newFiber.onlyPlace = true;
            console.log(_newFiber.name, "被mark");
        }
        var _oldFiber = matchFibers[_i];
        if (_oldFiber) {
            if (isSameNode(_oldFiber, _newFiber)) {
                _newFiber.stateNode = _oldFiber.stateNode;
                _newFiber.stateNode._reactInternalFiber = _newFiber;
                _newFiber.alternate = _oldFiber;
                _oldFiber.old = true;
                if (_oldFiber.ref && _oldFiber.ref !== _newFiber.ref && !isClone) {
                    _oldFiber.effectTag = NULLREF;
                    effects.push(_oldFiber);
                }
                if (_newFiber.tag === 5) {
                    _newFiber.lastProps = _oldFiber.props;
                }
            } else {
                detachFiber(_oldFiber, effects);
            }
        }
        if (_newFiber.tag > 3 && (isClone ? _newFiber.return.tag !== 5 : true)) {
            _newFiber.effectTag *= PLACE;
            console.log("让" + _newFiber.type + " PLACE");
        }
        if (_newFiber.ref && !isClone) {
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
        fiber = new Fiber(vnode);
        events.vnode = fiber;
    }
    fiber._isPortal = true;
    var child = createElement(AnuPortal, { children: children });
    child._return = fiber;
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

function completeWork(fiber, topWork) {
    var parentFiber = fiber.return;
    if (fiber.tag < 3) {
        fiber.stateNode._reactInternalFiber = fiber;
        if (fiber.stateNode.getChildContext) {
            contextStack.pop();
        }
    }
    if (parentFiber && fiber !== topWork) {
        var childEffects = fiber.effects || [];
        var thisEffect = fiber.effectTag > 1 ? [fiber] : [];
        var parentEffects = parentFiber.effects || [];
        parentFiber.effects = parentEffects.concat(childEffects, thisEffect);
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
            if (ref && Object.prototype.hasOwnProperty.call(ref, "current")) {
                ref.current = dom;
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
        } catch (e) {
            pushError(owner, "ref", e);
        }
    }
};

function commitAppendEffect(fibers) {
    var ret = [];
    for (var i = 0, n = fibers.length; i < n; i++) {
        var fiber = fibers[i];
        var amount = fiber.effectTag;
        var remainder = amount / PLACE;
        var hasEffect = remainder > 1;
        if (hasEffect) {
            ret.push(fiber);
        }
    }
    return ret;
}
function commitWork(fiber) {
    var instance = fiber.stateNode;
    var amount = fiber.effectTag;
    var updater = instance.updater;
    console.log("提交", fiber.name, amount, fiber.disposed);
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
                    Flutter.insertElement(fiber);
                    break;
                case ATTR:
                    delete instance.beforeNode;
                    Flutter.updateAttribute(fiber);
                    break;
                case DETACH:
                    if (fiber.tag > 3) {
                        Flutter.removeElement(fiber);
                    }
                    break;
                case HOOK:
                    if (fiber.disposed) {
                        updater._isMounted = updater.enqueueSetState = returnFalse;
                        callLifeCycleHook(instance, "componentWillUnmount", []);
                    } else {
                        if (updater._isMounted()) {
                            callLifeCycleHook(instance, "componentDidUpdate", []);
                        } else {
                            updater._isMounted = returnTrue;
                            callLifeCycleHook(instance, "componentDidMount", []);
                        }
                    }
                    delete fiber.pendingFiber;
                    delete updater._hydrating;
                    break;
                case CONTENT:
                    Flutter.updateContext(fiber);
                    break;
                case REF:
                    if (!instance._isStateless) {
                        Refs.fireRef(fiber, instance);
                    }
                    break;
                case NULLREF:
                    if (!instance._isStateless) {
                        Refs.fireRef(fiber, null);
                    }
                    break;
                case CALLBACK:
                    var queue = Array.isArray(fiber.callback) ? fiber.callback : [fiber.callback];
                    queue.forEach(function (fn) {
                        fn.call(instance);
                    });
                    delete fiber.callback;
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
    fiber.effectTag = fiber.effects = null;
}

var updateQueue$2 = Flutter.mainThread;
function isValidElement(vnode) {
    return vnode && vnode.tag > 0 && vnode.tag !== 6;
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
}
function render(vnode, root, callback) {
    var hostRoot = Flutter.updateRoot(vnode, root);
    var instance = null;
    hostRoot.effectTag = CALLBACK;
    hostRoot._hydrating = true;
    hostRoot.callback = function () {
        instance = hostRoot.child ? hostRoot.child.stateNode : null;
        callback && callback.call(instance);
        hostRoot._hydrating = false;
    };
    updateQueue$2.push(hostRoot);
    var prev = hostRoot.alternate;
    if (prev && prev._hydrating) {
        return;
    }
    Flutter.scheduleWork();
    return instance;
}
Flutter.scheduleWork = function () {
    performWork({
        timeRemaining: function timeRemaining() {
            return 2;
        }
    });
};
var isBatchingUpdates = false;
Flutter.batchedUpdates = function () {
    var keepbook = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
        Flutter.scheduleWork();
    } finally {
        isBatchingUpdates = keepbook;
        if (!isBatchingUpdates) {
            commitAllWork();
        }
    }
};
var effects = [];
function workLoop(deadline) {
    var topWork = getNextUnitOfWork();
    var fiber = topWork;
    while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
        fiber = performUnitOfWork(fiber, topWork);
    }
    if (topWork) {
        effects = effects.concat(topWork.effects || [], topWork);
    }
    if (!isBatchingUpdates) {
        commitAllWork();
    }
}
function commitAllWork(a) {
    var arr = commitAppendEffect(a || effects);
    arr.forEach(commitWork);
    effects.length = 0;
}
function performWork(deadline) {
    workLoop(deadline);
    if (updateQueue$2.length > 0) {
        requestIdleCallback(performWork);
    }
}

function unmountComponentAtNode(container) {
    var rootIndex = topNodes.indexOf(container);
    if (rootIndex > -1) {
        var lastFiber = topFibers[rootIndex],
            _effects = [];
        detachFiber(lastFiber, _effects);
        commitAllWork(_effects);
        topNodes.splice(rootIndex, 1);
        topFibers.splice(rootIndex, 1);
        container._reactInternalFiber = null;
        return true;
    }
    return false;
}
var ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
    fn({
        timeRemaining: function timeRemaining() {
            return 2;
        }
    });
}
function getNextUnitOfWork() {
    var fiber = updateQueue$2.shift();
    if (!fiber) {
        return;
    }
    if (fiber.root) {
        fiber.stateNode = fiber.stateNode || {};
        if (!get(fiber.stateNode)) {
            Flutter.emptyElement(fiber);
        }
        fiber.stateNode._reactInternalFiber = fiber;
    }
    return fiber;
}
function performUnitOfWork(fiber, topWork) {
    beginWork(fiber);
    if (fiber.child) {
        return fiber.child;
    }
    var f = fiber;
    while (f) {
        completeWork(f, topWork);
        if (f === topWork) {
            break;
        }
        if (f.sibling) {
            return f.sibling;
        }
        f = f.return;
    }
}
function mergeState(fiber, state, isForceUpdate, callback) {
    if (isForceUpdate) {
        fiber.isForceUpdate = isForceUpdate;
    }
    fiber.alternate = fiber;
    if (state) {
        var instance = fiber.stateNode;
        var old = fiber.partialState || instance.state;
        if (isFn(state)) {
            state = state.call(instance, old, instance.props);
        }
        fiber.partialState = Object.assign({}, old, state);
    }
    if (callback) {
        if (fiber.callback) {
            fiber.callback = [].concat(fiber.callback, callback);
        } else {
            fiber.callback = callback;
            fiber.effectTag *= CALLBACK;
        }
    }
}
Flutter.updateComponent = function (instance, state, callback) {
    var fiber = get(instance);
    var isForceUpdate = state === true;
    state = isForceUpdate ? null : state;
    if (this._hydrating || Flutter.interactQueue) {
        if (!fiber.pendingFiber) {
            var target = fiber.pendingFiber = Object.assign({}, fiber, {
                alternate: fiber,
                mountOrder: this.mountOrder,
                effectTag: callback ? CALLBACK : 1
            });
            delete target.partialState;
            delete target.isForceUpdate;
            delete target.callback;
            var queue = Flutter.interactQueue || updateQueue$2;
            queue.push(target);
        }
        mergeState(fiber.pendingFiber, state, isForceUpdate, callback);
    } else {
        mergeState(fiber, state, isForceUpdate, callback);
        if (!this._hooking) {
            updateQueue$2.push(fiber);
            Flutter.scheduleWork();
        }
    }
};

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
var rootContainer = {
    type: "root",
    props: null,
    children: []
};
var yieldData = [];
var NoopRenderer = {
    updateAttribute: function updateAttribute() {},
    updateContext: function updateContext(fiber) {
        fiber.stateNode.children = fiber.props.children;
    },
    reset: function reset() {
        rootContainer = {
            type: "root",
            props: null,
            children: []
        };
    },
    updateRoot: function updateRoot(vnode) {
        return {
            type: "root",
            root: true,
            stateNode: rootContainer,
            props: {
                children: vnode
            },
            tag: 5,
            alternate: get(rootContainer)
        };
    },
    getChildren: function getChildren() {
        return cleanChildren(rootContainer.children || []);
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
            before = fiber.mountPoint,
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
                    children.push(dom);
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
};
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
    createRenderer(NoopRenderer);
    ReactNoop = win.ReactNoop = {
        version: "1.3.1",
        render: render,
        flush: NoopRenderer.flush,
        reset: NoopRenderer.reset,
        getChildren: NoopRenderer.getChildren,
        options: options,
        isReactNoop: true,
        Fragment: Fragment,
        PropTypes: PropTypes,
        Children: Children,
        createPortal: createPortal,
        createContext: createContext,
        Component: Component,
        findDOMNode: findDOMNode,
        createRef: createRef,
        forwardRef: forwardRef,
        createElement: createElement,
        cloneElement: cloneElement,
        PureComponent: PureComponent,
        isValidElement: isValidElement,
        unmountComponentAtNode: unmountComponentAtNode,
        createFactory: function createFactory(type) {
            console.warn('createFactory is deprecated');
            var factory = createElement.bind(null, type);
            factory.type = type;
            return factory;
        }
    };
}
var ReactNoop$1 = ReactNoop;

return ReactNoop$1;

})));
