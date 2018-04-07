/**
 * 此个版本专门用于测试
 * by 司徒正美 Copyright 2018-04-07
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

function createRenderer(methods) {
    extend(Renderer, methods);
}
var Renderer = {
    interactQueue: null,
    mainThread: [],
    controlledCbs: [],
    mountOrder: 1,
    currentOwner: null
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
                    key = "" + val;
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
    return Vnode(type, tag, props, key, ref);
}
function isValidElement(vnode) {
    return !!vnode && vnode.tag > 0 && vnode.tag !== 6;
}
function createVText(type, text) {
    var vnode = Vnode(type, 6);
    vnode.props = { children: text };
    return vnode;
}
var lastText = void 0;
var flattenIndex = void 0;
var flattenObject = void 0;

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
function operateArray(children, prefix, isTop, callback) {
    children.forEach(function (el, i) {
        operateChildren(el, computeName(el, i, prefix, isTop), callback, typeNumber(el), false);
    });
}
function operateChildren(children, prefix, callback, number, isTop) {
    var key = void 0,
        el = void 0,
        iterator = void 0;
    switch (number) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            callback(children, key, number);
            break;
        case 7:
            operateArray(children, prefix, isTop, callback);
            break;
        case 8:
            if (children.forEach) {
                operateArray(children, prefix, isTop, callback);
                return;
            } else if (children.type === Fragment) {
                key = children.key ? "$" + children.key : "";
                key = isTop ? key : prefix ? prefix + ":0" : key || "0";
                el = children.props.children;
                var innerNumber = typeNumber(el);
                if (innerNumber < 7 || !isIterable(el)) {
                    el = [el];
                    innerNumber = 7;
                }
                operateChildren(el, key, callback, innerNumber, false);
                return;
            }
            var cursor = getIteractor(children);
            if (cursor) {
                iterator = cursor.call(children);
                var ii = 0,
                    step;
                while (!(step = iterator.next()).done) {
                    el = step.value;
                    operateChildren(el, computeName(el, ii, prefix, isTop), callback, typeNumber(el), false);
                    ii++;
                }
            } else {
                if (Object(children) === children && !children.call && !children.type) {
                    throw "children中存在非法的对象";
                }
                key = prefix || children.key ? "$" + children.key : "0";
                callback(children, key, number);
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
function createFactory(type) {
    var factory = createElement.bind(null, type);
    factory.type = type;
    return factory;
}
function Vnode(type, tag, props, key, ref) {
    var ret = {
        type: type,
        tag: tag,
        $$typeof: REACT_ELEMENT_TYPE,
        key: key || null,
        ref: null
    };
    if (tag !== 6) {
        ret.props = props;
        ret._owner = Renderer.currentOwner;
        var refType = typeNumber(ref);
        if (refType === 2 || refType === 3 || refType === 4 || refType === 5 || refType === 8) {
            if (refType < 4) {
                ref += "";
            }
            ret.ref = ref;
        }
    }
    options.afterCreate(ret);
    return ret;
}

function cloneElement(vnode, props) {
    if (!vnode.tag === 6) {
        var clone = extend({}, vnode);
        delete clone._disposed;
        return clone;
    }
    var owner = vnode._owner,
        lastOwn = Renderer.currentOwner,
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
    Renderer.currentOwner = owner;
    var args = [].slice.call(arguments, 0),
        argsLength = args.length;
    args[0] = vnode.type;
    args[1] = configs;
    if (argsLength === 2 && configs.children) {
        delete configs.children._disposed;
        args.push(configs.children);
    }
    var ret = createElement.apply(null, args);
    Renderer.currentOwner = lastOwn;
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

function AnuPortal(props) {
    return props.children;
}
function createPortal(children, node) {
    var child = createElement(AnuPortal, { children: children });
    Renderer.render(vnode, child);
    child.parent = node;
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

function cleanChildren(array) {
	if (!Array.isArray(array)) {
		return array;
	}
	return array.map(function (el) {
		if (el.type == '#text') {
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
	type: 'root',
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
			type: 'root',
			props: null,
			children: []
		};
	},
	updateRoot: function updateRoot(vnode) {
		return {
			type: 'root',
			root: true,
			stateNode: rootContainer,
			props: {
				children: vnode
			},
			tag: 5,
			alternate: get(rootContainer)
		};
	},
	getRoot: function getRoot() {
		return rootContainer;
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
        render: NoopRenderer.render,
        flush: NoopRenderer.flush,
        reset: NoopRenderer.reset,
        getRoot: NoopRenderer.getRoot,
        getChildren: NoopRenderer.getChildren,
        options: options,
        isReactNoop: true,
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
