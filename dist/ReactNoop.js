/**
 * by 司徒正美 Copyright 2018-03-23
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
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
    extend(shader, methods);
}
var shader = {};
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

var updateQueue = [];
var componentStack = [];
var topFibers = [];
var topNodes = [];

var emptyObject = {};
var contextStack = [emptyObject];

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
        catchFiber.effectTag = 23;
        updateQueue.push(catchFiber);
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
function disableEffect(fiber) {
    if (fiber.stateNode) {
        fiber.stateNode.render = noop;
    }
    fiber.effectTag = 0;
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

function getDOMNode() {
    return this;
}

var Refs = {
    mountOrder: 1,
    currentOwner: null,
    controlledCbs: [],
    fireRef: function fireRef(fiber, dom) {
        if (fiber._isStateless) {
            dom = null;
        }
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

function ComponentFiber(vnode) {
    extend(this, vnode);
    var type = vnode.type;
    this.name = type.displayName || type.name || type;
}
function createUpdater() {
    return {
        _mountOrder: Refs.mountOrder++,
        enqueueSetState: returnFalse,
        _isMounted: returnFalse
    };
}
function getDerivedStateFromProps(instance, type, props, state) {
    if (isFn(type.getDerivedStateFromProps)) {
        state = type.getDerivedStateFromProps.call(null, props, state);
        if (state != null) {
            instance.setState(state);
        }
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
function createInstance(fiber, context) {
    var updater = createUpdater();
    var props = fiber.props,
        type = fiber.type,
        tag = fiber.tag,
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
                    updater._willReceive = false;
                    updater._isStateless = true;
                }
                delete instance.__init__;
            }
        } else {
            instance = new type(props, context);
        }
    } catch (e) {
        instance = {};
    } finally {
        Refs.currentOwner = lastOwn;
    }
    fiber.stateNode = instance;
    instance.updater = updater;
    return instance;
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
        fiber = new ComponentFiber(vnode);
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

function unmountComponentAtNode(container) {
    var rootIndex = topNodes.indexOf(container);
    if (rootIndex > -1) {
        var lastFiber = topFibers[rootIndex],
            effects = [];
        detachFiber(lastFiber, effects);
        lastFiber.effects = effects;
        commitWork(lastFiber);
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
    var fiber = updateQueue.shift();
    if (!fiber) {
        return;
    }
    if (fiber.root) {
        if (!get(fiber.stateNode)) {
            shader.emptyElement(fiber);
        }
        fiber.stateNode._reactInternalFiber = fiber;
    }
    return fiber;
}
function workLoop(deadline) {
    var topWork = getNextUnitOfWork();
    var fiber = topWork;
    while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
        fiber = performUnitOfWork(fiber, topWork);
    }
    if (topWork) {
        commitAllWork(topWork);
    }
}
Refs.workLoop = workLoop;
function commitAllWork(fiber) {
    fiber.effects.concat(fiber).forEach(function (f) {
        commitWork(f);
    });
}
function performUnitOfWork(fiber, topWork) {
    beginWork(fiber);
    if (fiber.child && fiber.effectTag !== NOWORK) {
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
function completeWork(fiber, topWork) {
    if (fiber.tag == 2) {
        fiber.stateNode._reactInternalFiber = fiber;
        if (fiber.stateNode.getChildContext) {
            contextStack.pop();
        }
    }
    if (fiber.return && fiber.effectTag !== NOWORK && fiber !== topWork) {
        var childEffects = fiber.effects || [];
        var thisEffect = fiber.effectTag > 1 ? [fiber] : [];
        var parentEffects = fiber.return.effects || [];
        fiber.return.effects = parentEffects.concat(childEffects, thisEffect);
    }
}
var NOWORK = 0;
var WORKING = 1;
var PLACE = 2;
var ATTR = 3;
var CONTENT = 5;
var NULLREF = 7;
var HOOK = 11;
var REF = 13;
var DETACH = 17;
var CALLBACK = 19;
var CAPTURE = 23;
var effectNames = [PLACE, ATTR, CONTENT, NULLREF, HOOK, REF, DETACH, CALLBACK, CAPTURE];
var effectLength = effectNames.length;
function commitWork(fiber) {
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
                    shader.insertElement(fiber);
                    break;
                case ATTR:
                    shader.updateAttribute(fiber);
                    break;
                case DETACH:
                    if (fiber.tag > 3) {
                        shader.removeElement(fiber);
                    }
                    delete fiber.stateNode;
                    break;
                case HOOK:
                    if (fiber.disposed) {
                        captureError(instance, "componentWillUnmount", []);
                        updater._isMounted = returnFalse;
                    } else {
                        if (updater._isMounted()) {
                            captureError(instance, "componentDidUpdate", []);
                        } else {
                            captureError(instance, "componentDidMount", []);
                            updater._isMounted = returnTrue;
                        }
                    }
                    break;
                case CONTENT:
                    shader.updateContext(fiber);
                    break;
                case REF:
                    Refs.fireRef(fiber, instance);
                    break;
                case NULLREF:
                    Refs.fireRef(fiber, null);
                    break;
                case CALLBACK:
                    fiber.callback.call(instance);
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
    fiber.effectTag = amount;
    fiber.effects = null;
}
function enqueueSetState(instance, state, callback) {
    var fiber = get(instance);
    var isForceUpdate = state === true;
    state = isForceUpdate ? null : state;
    var prevEffect = void 0;
    updateQueue.some(function (el) {
        if (el.stateNode === instance) {
            prevEffect = el;
        }
    });
    if (prevEffect) {
        if (isForceUpdate) {
            prevEffect.isForceUpdate = isForceUpdate;
        }
        if (state) {
            prevEffect.partialState = Object.assign(prevEffect.partialState || {}, state);
        }
        if (callback) {
            prevEffect.effectTag = CALLBACK;
            var prev = prevEffect.callback;
            if (prev) {
                prevEffect.callback = function () {
                    prev.call(this);
                    callback.call(this);
                };
            } else {
                prevEffect.callback = callback;
            }
        }
    } else {
        updateQueue.unshift(Object.assign({}, fiber, {
            stateNode: instance,
            alternate: fiber,
            effectTag: callback ? CALLBACK : null,
            partialState: state,
            isForceUpdate: isForceUpdate,
            callback: callback
        }));
    }
    if (this._isMounted === returnTrue) {
        if (this._receiving) {
            return;
        }
        requestIdleCallback(performWork);
    }
}
function performWork(deadline) {
    workLoop(deadline);
    if (updateQueue.length > 0) {
        requestIdleCallback(performWork);
    }
}
function updateHostComponent(fiber) {
    if (!fiber.stateNode) {
        try {
            fiber.stateNode = shader.createElement(fiber);
        } catch (e) {
            throw e;
        }
    }
    if (fiber.tag == 5 && !fiber.root) {
        fiber.effectTag *= ATTR;
    }
    var children = fiber.props && fiber.props.children;
    if (fiber.tag === 6) {
        var prev = fiber.alternate;
        if (!prev || prev.props.children !== children) {
            fiber.effectTag *= CONTENT;
        }
    } else if (fiber.props) {
        diffChildren(fiber, children);
    }
}
function updateClassComponent(fiber) {
    var type = fiber.type,
        nextProps = fiber.props,
        instance = fiber.stateNode,
        partialState = fiber.partialState;
    var nextContext = getMaskedContext(type.contextTypes);
    if (instance == null) {
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = enqueueSetState;
    }
    var _instance = instance,
        lastProps = _instance.props,
        lastState = _instance.state,
        c = void 0;
    fiber.lastState = lastProps;
    fiber.lastProps = lastState;
    instance._reactInternalFiber = fiber;
    fiber.partialState = null;
    if (instance.getChildContext) {
        try {
            c = instance.getChildContext();
            c = Object.assign({}, nextContext, c);
        } catch (e) {
            c = {};
        }
        contextStack.unshift(c);
    }
    var shouldUpdate = true;
    var updater = instance.updater;
    var nextState = partialState ? Object.assign({}, lastState, partialState) : lastState;
    if (updater._isMounted()) {
        var propsChange = lastProps !== nextProps;
        var willReceive = propsChange && instance.context !== nextContext;
        updater._receiving = true;
        if (willReceive) {
            captureError(instance, "componentWillReceiveProps", [nextProps, nextContext]);
        }
        if (propsChange) {
            try {
                getDerivedStateFromProps(instance, type, nextProps, lastState);
            } catch (error) {
                pushError(instance, "getDerivedStateFromProps", error);
            }
        }
        delete updater._receiving;
        var args = [nextProps, nextState, nextContext];
        if (!fiber.isForceUpdate && !captureError(instance, "shouldComponentUpdate", args)) {
            shouldUpdate = false;
        } else {
            captureError(instance, "componentWillUpdate", args);
        }
    } else {
        try {
            getDerivedStateFromProps(instance, type, nextProps, lastState);
        } catch (error) {
            pushError(instance, "getDerivedStateFromProps", error);
        }
        captureError(instance, "componentWillMount", []);
    }
    fiber.effectTag *= HOOK;
    instance.context = nextContext;
    instance.props = nextProps;
    instance.state = nextState;
    if (!shouldUpdate) {
        fiber.effectTag = NOWORK;
        cloneChildren(fiber);
        if (componentStack[0] === instance) {
            componentStack.shift();
        }
        return;
    }
    var lastOwn = Refs.currentOwner,
        children;
    Refs.currentOwner = instance;
    try {
        children = instance.render();
    } finally {
        if (componentStack[0] === instance) {
            componentStack.shift();
        }
        Refs.currentOwner = lastOwn;
    }
    diffChildren(fiber, children);
}
function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
function detachFiber(fiber, effects) {
    if (fiber.ref) {
        fiber.effectTag *= NULLREF;
    }
    fiber.effectTag *= DETACH;
    fiber.disposed = true;
    if (fiber.tag < 3) {
        fiber.effectTag *= HOOK;
    }
    effects.push(fiber);
    for (var child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects);
    }
}
function diffChildren(parentFiber, children) {
    var oldFibers = parentFiber.alternate ? parentFiber.alternate._children : {};
    var newFibers = fiberizeChildren(children, parentFiber);
    var effects = parentFiber.effects || (parentFiber.effects = []);
    var matchFibers = {};
    for (var i in oldFibers) {
        var newFiber = newFibers[i];
        var oldFiber = oldFibers[i];
        if (newFiber && newFiber.type === oldFiber.type) {
            matchFibers[i] = oldFiber;
            if (newFiber.key != null) {
                oldFiber.key = newFiber.key;
            }
            if (oldFiber.ref !== newFiber.ref) {
                oldFiber.effectTag *= NULLREF;
                effects.push(oldFiber);
            }
            continue;
        }
        detachFiber(oldFiber, effects);
    }
    var prevFiber = void 0,
        index = 0;
    for (var _i in newFibers) {
        var _newFiber = newFibers[_i] = new ComponentFiber(newFibers[_i]);
        _newFiber.effectTag = WORKING;
        var _oldFiber = matchFibers[_i];
        if (_oldFiber) {
            if (isSameNode(_oldFiber, _newFiber)) {
                _newFiber.stateNode = _oldFiber.stateNode;
                _newFiber.alternate = _oldFiber;
            } else {
                detachFiber(_oldFiber, effects);
            }
        }
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
function cloneChildren(parentFiber) {
    var oldFiber = parentFiber.alternate;
    if (!oldFiber) {
        return;
    }
    parentFiber._children = oldFiber._children;
    if (oldFiber.child) {
        parentFiber.child = oldFiber.child;
    }
}

var rootContainer = {};
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
var yieldData = [];
var NoopRenderer = {
    updateAttribute: function updateAttribute(fiber) {},
    updateContext: function updateContext(fiber) {
        fiber.stateNode.nodeValue = fiber.props.children;
    },
    render: function render(vnode) {
        updateQueue.push(Object.assign({}, vnode, {
            alternate: vnode,
            effectTag: 2
        }));
        Refs.workLoop({
            timeRemaining: function timeRemaining() {
                return 2;
            }
        });
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
        var p = fiber.return,
            dom = fiber.stateNode,
            parentNode = void 0;
        if (!fiber.return) {
            rootContainer = dom;
            return;
        }
        while (p) {
            if (p.tag === 5) {
                parentNode = p.stateNode;
                break;
            }
            p = p._return || p.return;
        }
        var children = parentNode.children;
        var offset = parentNode._justInsert ? children.indexOf(parentNode._justInsert) : 0;
        parentNode._justInsert = dom;
        if (offset === 0) {
            if (children[0] === dom) {
                return;
            } else {
                children.unshift(dom);
            }
        } else {
            if (children[offset + 1] === dom) {
                return;
            } else {
                children.splice(offset + 1, 0, dom);
            }
        }
    },
    emptyElement: function emptyElement(fiber) {
    },
    removeElement: function removeElement(fiber) {}
};

var win = getWindow();
var prevReact = win.React;
var React = void 0;
if (prevReact && prevReact.options) {
    React = prevReact;
} else {
    createRenderer(NoopRenderer);
    var render = NoopRenderer.render;
    React = win.React = win.ReactNoop = {
        version: "1.3.1",
        render: render,
        hydrate: render,
        flush: NoopRenderer.flush,
        getChildren: NoopRenderer.getChildren,
        options: options,
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
var React$1 = React;

return React$1;

})));
