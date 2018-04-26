/**
 * 此个版本专门用于测试
 * by 司徒正美 Copyright 2018-04-26
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ReactNoop = factory());
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
	var carrier = {};
	var boundary = findCatchComponent(fiber, names, carrier);
	var stack = describeError(names, hook);
	Renderer.hasError = true;
	if (boundary) {
		var old = carrier.fiber;
		while (old && old.return) {
			if (old == boundary) {
				Renderer.catchTry = carrier.fiber;
				break;
			}
			old = old.return;
		}
		fiber.effectTag = NOWORK;
		var inst = fiber.stateNode;
		if (inst && inst.updater && inst.updater.isMounted()) {
		} else {
			fiber.stateNode = {
				updater: fakeObject
			};
		}
		fiber._children = {};
		delete fiber.child;
		boundary.effectTag *= CAPTURE;
		boundary.errorInfo = [error, { ownerStack: stack }];
		Renderer.catchBoundary = boundary;
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
	if (hook == 'componentWillUnmount') {
		host[hook] = noop;
	}
	if (fn) {
		return fn.apply(host, args);
	}
	return true;
}
function describeError(names, hook) {
	var segments = ['**' + hook + '** method occur error '];
	names.forEach(function (name, i) {
		if (names[i + 1]) {
			segments.push('in ' + name + ' (created By ' + names[i + 1] + ')');
		}
	});
	return segments.join('\n').trim();
}
function findCatchComponent(topFiber, names, carrier) {
	var instance = void 0,
	    name = void 0,
	    fiber = topFiber;
	if (!topFiber) {
		return;
	}
	while (fiber.return) {
		name = fiber.name;
		if (fiber.tag < 4) {
			names.push(name);
			instance = fiber.stateNode || {};
			if (instance.componentDidCatch) {
				if (fiber.hasTry) {
					carrier.fiber = fiber;
				} else if (fiber !== topFiber) {
					return fiber;
				}
			}
		} else if (fiber.tag === 5) {
			names.push(name);
		}
		fiber = fiber.return;
	}
}
function detachFiber(fiber, effects) {
	fiber.effectTag = DETACH;
	fiber.disposed = true;
	effects.push(fiber);
	if (fiber.ref && fiber.stateNode && fiber.stateNode.parentNode) {
		fiber.effectTag *= NULLREF;
	}
	for (var child = fiber.child; child; child = child.sibling) {
		detachFiber(child, effects);
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
    if (!fiber.updateFail && !Renderer.hasError) {
        if (fiber.child) {
            return fiber.child;
        }
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
        containerStack = info.containerStack;
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
    fiber._hydrating = true;
    var lastOwn = Renderer.currentOwner;
    Renderer.currentOwner = instance;
    var rendered = applyCallback(instance, "render", []);
    Renderer.currentOwner = lastOwn;
    if (Renderer.hasError) {
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
        var propsChange = instance.props !== nextProps;
        if (instance.__useNewHooks) {
            return "update";
        } else {
            var willReceive = propsChange || contextStack.length > 1 || instance.context !== nextContext;
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
    if (fiber === Renderer.catchBoundary) {
        delete Renderer.hasError;
        Renderer.diffChildren(fiber, []);
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
            if (child.type != AnuPortal) {
                child.insertPoint = child.parent.insertPoint;
            }
        }
        if (updateFail || child.updateFail) {
            if (isHost) {
                if (!child.disposed) {
                    child.effectTag *= PLACE;
                    effects.push(child);
                }
            } else {
                delete child.updateFail;
                __push.apply(effects, collectEffects(child, true));
            }
        } else {
            __push.apply(effects, collectEffects(child));
        }
        if (child.effectTag && !child.hasTry) {
            effects.push(child);
        }
    }
    return effects;
}

function getDOMNode() {
    return this;
}
var Refs = {
    fireRef: function fireRef(fiber, dom) {
        var ref = fiber.ref;
        var canCall = isFn(ref);
        var owner = fiber._owner;
        try {
            if (canCall) {
                ref(dom);
                return;
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
            pushError(fiber, "ref", e);
        }
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
		delete Renderer.hasError;
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
	__push.apply(tasks, ret);
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
							guardCallback(instance, 'componentWillUnmount', []);
							updater.isMounted = returnFalse;
						}
					}
					delete fiber.stateNode;
					delete fiber.alternate;
					break;
				case HOOK:
					if (updater.isMounted()) {
						guardCallback(instance, 'componentDidUpdate', [updater.lastProps, updater.lastState, updater.snapshot]);
					} else {
						instance.parentNode = instance.parentNode || true;
						updater.isMounted = returnTrue;
						guardCallback(instance, 'componentDidMount', []);
					}
					delete fiber._hydrating;
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
					fiber.effectTag = amount;
					fiber.hasTry = true;
					fiber._children = fiber.child = null;
					instance.componentDidCatch.apply(instance, fiber.errorInfo);
					delete fiber.errorInfo;
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
function performWork(deadline, el) {
	workLoop(deadline);
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
			var retry = Renderer.catchTry;
			var boundary = Renderer.catchBoundary;
			if (retry) {
				retry.effectTag = DETACH;
				macrotasks.push(retry);
				delete Renderer.catchTry;
			}
			if (boundary) {
				macrotasks.push(boundary);
				delete Renderer.hasError;
				delete Renderer.catchBoundary;
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
		__push.apply(effects, collectEffects(topWork, null, true));
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
		throw 'container is not a element';
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
		name: 'hostRoot',
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
