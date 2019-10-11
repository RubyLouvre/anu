/**
 * 运行于快应用的React by 司徒正美 Copyright 2019-10-09
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
var rname = /function\s+(\w+)/;
function miniCreateClass(ctor, superClass, methods, statics) {
    var className = ctor.name || (ctor.toString().match(rname) || ['', 'Anonymous'])[1];
    var Ctor = supportEval ? Function('superClass', 'ctor', 'return function ' + className + ' (props, context) {\n            superClass.apply(this, arguments); \n            ctor.apply(this, arguments);\n      }')(superClass, ctor) : function ReactInstance() {
        superClass.apply(this, arguments);
        ctor.apply(this, arguments);
    };
    Ctor.displayName = className;
    var proto = inherit(Ctor, superClass);
    extend(proto, methods);
    extend(Ctor, superClass);
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
        this.updater.enqueueSetState(get(this), state, cb);
    },
    forceUpdate: function forceUpdate(cb) {
        this.updater.enqueueSetState(get(this), true, cb);
    },
    render: function render() {
        throw "must implement render";
    }
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
    if (Object(component).key != null) {
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

var MAX_NUMBER = 1073741823;
function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits == void 0) {
        calculateChangedBits = null;
    }
    var instance = {
        value: defaultValue,
        subscribers: []
    };
    var Provider = miniCreateClass(function Provider(props) {
        this.value = props.value;
        getContext.subscribers = this.subscribers = [];
        instance = this;
    }, Component, {
        componentWillUnmount: function componentWillUnmount() {
            this.subscribers.length = 0;
        },
        UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
            if (this.props.value !== nextProps.value) {
                var oldValue = this.props.value;
                var newValue = nextProps.value;
                var changedBits = void 0;
                if (Object.is(oldValue, newValue)) {
                    changedBits = 0;
                } else {
                    this.value = newValue;
                    changedBits = isFn(calculateChangedBits) ? calculateChangedBits(oldValue, newValue) : MAX_NUMBER;
                    changedBits |= 0;
                    if (changedBits !== 0) {
                        instance.subscribers.forEach(function (fiber) {
                            if (fiber.setState) {
                                fiber.setState({ value: newValue });
                                fiber = get(fiber);
                            }
                            Renderer.updateComponent(fiber, true);
                        });
                    }
                }
            }
        },
        render: function render() {
            return this.props.children;
        }
    });
    var Consumer = miniCreateClass(function Consumer() {
        instance.subscribers.push(this);
        this.observedBits = 0;
        this.state = {
            value: instance.value
        };
    }, Component, {
        componentWillUnmount: function componentWillUnmount() {
            var i = instance.subscribers.indexOf(this);
            instance.subscribers.splice(i, 1);
        },
        render: function render() {
            return this.props.children(getContext(get(this)));
        }
    });
    function getContext(fiber) {
        while (fiber.return) {
            if (fiber.type == Provider) {
                return instance.value;
            }
            fiber = fiber.return;
        }
        return defaultValue;
    }
    getContext.subscribers = [];
    getContext.Provider = Provider;
    getContext.Consumer = Consumer;
    return getContext;
}

function createRef() {
    return {
        current: null
    };
}

function getDataSetFromAttr(obj) {
    var ret = {};
    for (var name in obj) {
        if (name.slice(0, 4) == 'data') {
            var key = toLowerCase(name[4]) + name.slice(5);
            ret[key] = obj[name];
        }
    }
    return ret;
}
var beaconType = /click|tap|change|blur|input/i;
function dispatchEvent(e) {
    var instance = this.reactInstance;
    if (!instance || !instance.$$eventCached) {
        return;
    }
    var eventType = toLowerCase(e._type || e.type);
    var target = e.currentTarget || e.target;
    var dataset = target.dataset || getDataSetFromAttr(target.attr || target._attr);
    var app = this.$app.$def;
    if (dataset[eventType + 'Alias']) {
        eventType = dataset[eventType + 'Alias'];
    }
    var eventUid = dataset[eventType + 'Uid'];
    var fiber = instance.$$eventCached[eventUid + 'Fiber'] || {
        props: {},
        type: 'unknown'
    };
    var value = e.value;
    if (eventType == "change" && !Array.isArray(value) && fiber.props.value + "" == value) {
        return;
    }
    var safeTarget = {
        dataset: dataset,
        nodeName: target._nodeName || target.nodeName || target.type,
        value: value
    };
    if (app && app.onCollectLogs && beaconType.test(eventType)) {
        app.onCollectLogs(dataset, eventType, fiber.stateNode);
    }
    Renderer.batchedUpdates(function () {
        try {
            var fn = instance.$$eventCached[eventUid];
            fn && fn.call(instance, createEvent(e, safeTarget, eventType));
        } catch (err) {
            console.log(err.stack);
        }
    }, e);
}
function createEvent(e, target, type) {
    var event = {};
    for (var i in e) {
        if (i.indexOf('_') !== 0) {
            event[i] = e[i];
        }
    }
    var touches = event.touches = e._touches || e._changeTouches;
    event.changeTouches = e._changeTouches;
    var touch = touches && touches[0];
    if (touch) {
        event.pageX = touch.pageX;
        event.pageY = touch.pageY;
    }
    event.nativeEvent = e;
    event.stopPropagation = e.stopPropagation.bind(e);
    if (e.preventDefault) {
        event.preventDefault = e.preventDefault.bind(e);
    } else {
        event.preventDefault = Date;
    }
    event.target = target;
    event.type = type;
    event.timeStamp = Date.now();
    return event;
}

var fakeApp = {
    app: {
        globalData: {}
    }
};
function _getApp() {
    if (isFn(getApp)) {
        return getApp();
    }
    return fakeApp;
}
function getWrappedComponent(fiber, instance) {
    var ctor = instance.constructor;
    if (ctor.WrappedComponent) {
        if (ctor.contextTypes) {
            instance = fiber.child.stateNode;
        } else {
            instance = fiber.child.child.stateNode;
        }
    }
    return instance;
}
if (typeof getApp === 'function') {
    _getApp = getApp;
}
function callGlobalHook(method, e) {
    var app = _getApp();
    if (app && app[method]) {
        return app[method](e);
    }
}
var delayMounts = [];
var usingComponents = [];
var registeredComponents = {};
function getCurrentPage() {
    var app = _getApp();
    return app.$$page && app.$$page.reactInstance;
}
function updateMiniApp(instance) {
    if (!instance || !instance.wx) {
        return;
    }
    var data = safeClone({
        props: instance.props,
        state: instance.state || null,
        context: instance.context
    });
    if (instance.wx.setData) {
        instance.wx.setData(data);
    } else {
        updateQuickApp(instance.wx, data);
    }
}
function refreshComponent(instances, wx, uuid) {
    if (wx.disposed) {
        return;
    }
    var pagePath = Object(_getApp()).$$pagePath;
    for (var i = 0, n = instances.length; i < n; i++) {
        var instance = instances[i];
        if (instance.$$pagePath === pagePath && !instance.wx && instance.instanceUid === uuid) {
            var fiber = get(instance);
            if (fiber.disposed) {
                console.log("fiber.disposed by nanachi");
                continue;
            }
            if (fiber.child && fiber.type.wrappedComponent) {
                instance = fiber.child.stateNode;
            } else {
                instance = getWrappedComponent(fiber, instance);
            }
            instance.wx = wx;
            wx.reactInstance = instance;
            updateMiniApp(instance);
            return instances.splice(i, 1);
        }
    }
}
function detachComponent() {
    var t = this.reactInstance;
    this.disposed = true;
    if (t) {
        t.wx = null;
        this.reactInstance = null;
    }
}
function updateQuickApp(quick, data) {
    for (var i in data) {
        quick.$set(i, data[i]);
    }
}
function isReferenceType(val) {
    return typeNumber(val) > 6;
}
function runCallbacks(cb, success, fail, complete) {
    try {
        cb();
        success && success();
    } catch (error) {
        fail && fail(error);
    } finally {
        complete && complete();
    }
}
function useComponent(props) {
    var is = props.is;
    var clazz = registeredComponents[is];
    props.key = this.key != null ? this.key : props['data-instance-uid'] || new Date() - 0;
    clazz.displayName = is;
    if (this.ref !== null) {
        props.ref = this.ref;
    }
    var owner = Renderer.currentOwner;
    if (owner) {
        Renderer.currentOwner = get(owner)._owner;
    }
    return createElement(clazz, props);
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

var HTTP_OK_CODE = 200;
var JSON_TYPE_STRING = 'json';
function uploadFile(_ref) {
    var url = _ref.url,
        filePath = _ref.filePath,
        name = _ref.name,
        header = _ref.header,
        formData = _ref.formData,
        _ref$success = _ref.success,
        success = _ref$success === undefined ? noop : _ref$success,
        _ref$fail = _ref.fail,
        fail = _ref$fail === undefined ? noop : _ref$fail,
        _ref$complete = _ref.complete,
        complete = _ref$complete === undefined ? noop : _ref$complete;
    var request = require('@system.request');
    var data = [];
    Object.keys(formData).map(function (key) {
        var value = formData[key];
        var item = {
            value: value,
            name: key
        };
        data.push(item);
    });
    function successForMi(_ref2) {
        var statusCode = _ref2.code,
            data = _ref2.data;
        success({
            statusCode: statusCode,
            data: data
        });
    }
    request.upload({
        url: url,
        header: header,
        data: data,
        files: [{ uri: filePath, name: name }],
        success: successForMi,
        fail: fail,
        complete: complete
    });
}
function downloadFile(_ref3) {
    var url = _ref3.url,
        header = _ref3.header,
        _ref3$success = _ref3.success,
        success = _ref3$success === undefined ? noop : _ref3$success,
        _ref3$fail = _ref3.fail,
        fail = _ref3$fail === undefined ? noop : _ref3$fail,
        _ref3$complete = _ref3.complete,
        complete = _ref3$complete === undefined ? noop : _ref3$complete;
    function downloadSuccess(_ref4) {
        var tempFilePath = _ref4.uri;
        success({
            statusCode: HTTP_OK_CODE,
            tempFilePath: tempFilePath
        });
    }
    function downloadTaskStarted(_ref5) {
        var token = _ref5.token;
        request.onDownloadComplete({
            token: token,
            success: downloadSuccess,
            fail: fail,
            complete: complete
        });
    }
    var request = require('@system.request');
    request.download({
        url: url,
        header: header,
        success: downloadTaskStarted,
        fail: fail,
        complete: complete
    });
}
function request(_ref6) {
    var url = _ref6.url,
        data = _ref6.data,
        header = _ref6.header,
        method = _ref6.method,
        _ref6$dataType = _ref6.dataType,
        dataType = _ref6$dataType === undefined ? JSON_TYPE_STRING : _ref6$dataType,
        _ref6$success = _ref6.success,
        success = _ref6$success === undefined ? noop : _ref6$success,
        _ref6$fail = _ref6.fail,
        fail = _ref6$fail === undefined ? noop : _ref6$fail,
        _ref6$complete = _ref6.complete,
        complete = _ref6$complete === undefined ? noop : _ref6$complete;
    var fetch = require('@system.fetch');
    function onFetchSuccess(_ref7) {
        var statusCode = _ref7.code,
            data = _ref7.data,
            headers = _ref7.headers;
        if (dataType === JSON_TYPE_STRING) {
            try {
                data = JSON.parse(data);
            } catch (error) {}
        }
        success({
            statusCode: statusCode,
            data: data,
            headers: headers
        });
    }
    fetch.fetch({
        url: url,
        data: data,
        header: header,
        method: method,
        success: onFetchSuccess,
        fail: fail,
        complete: complete
    });
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var storage = require('@system.storage');
function saveParse(str) {
    try {
        return JSON.parse(str);
    } catch (err) {
    }
    return str;
}
function setStorage(_ref) {
    var key = _ref.key,
        data = _ref.data,
        success = _ref.success,
        _ref$fail = _ref.fail,
        fail = _ref$fail === undefined ? noop : _ref$fail,
        complete = _ref.complete;
    var value = data;
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        try {
            value = JSON.stringify(value);
        } catch (error) {
            return fail(error);
        }
    }
    storage.set({ key: key, value: value, success: success, fail: fail, complete: complete });
}
function getStorage(_ref2) {
    var key = _ref2.key,
        _ref2$success = _ref2.success,
        _success = _ref2$success === undefined ? noop : _ref2$success,
        complete = _ref2.complete;
    storage.get({
        key: key,
        success: function success(data) {
            _success({
                data: saveParse(data)
            });
        },
        fail: function fail() {
            _success({});
        }, complete: complete });
}
function removeStorage(obj) {
    storage.delete(obj);
}
function clearStorage(obj) {
    storage.clear(obj);
}
function initStorageSync(storageCache) {
    if ((typeof ReactQuick === 'undefined' ? 'undefined' : _typeof(ReactQuick)) !== 'object') {
        return;
    }
    var apis = ReactQuick.api;
    var n = storage.length;
    var j = 0;
    for (var i = 0; i < n; i++) {
        storage.key({
            index: i,
            success: function success(key) {
                storage.get({
                    key: key,
                    success: function success(value) {
                        storageCache[key] = value;
                        if (++j == n) {
                            console.log('init storage success');
                        }
                    }
                });
            }
        });
    }
    apis.setStorageSync = function (key, value) {
        setStorage({
            key: key,
            data: value
        });
        return storageCache[key] = value;
    };
    apis.getStorageSync = function (key) {
        return saveParse(storageCache[key]);
    };
    apis.removeStorageSync = function (key) {
        delete storageCache[key];
        removeStorage({ key: key });
    };
    apis.clearStorageSync = function () {
        for (var i in storageCache) {
            delete storageCache[i];
        }
        clearStorage({});
    };
}
function warnToInitStorage() {
    {
        console.log('还没有初始化storageSync');
    }
}
var setStorageSync = warnToInitStorage;
var getStorageSync = warnToInitStorage;
var removeStorageSync = warnToInitStorage;
var clearStorageSync = warnToInitStorage;

var file = require('@system.file');
var SUCCESS_MESSAGE = 'ok';
function getSavedFileInfo(_ref) {
    var uri = _ref.filePath,
        _ref$success = _ref.success,
        success = _ref$success === undefined ? noop : _ref$success,
        _ref$fail = _ref.fail,
        fail = _ref$fail === undefined ? noop : _ref$fail,
        _ref$complete = _ref.complete,
        complete = _ref$complete === undefined ? noop : _ref$complete;
    function gotFile(_ref2) {
        var length = _ref2.length,
            lastModifiedTime = _ref2.lastModifiedTime;
        success({
            errMsg: SUCCESS_MESSAGE,
            size: length,
            createTime: lastModifiedTime
        });
    }
    file.get({
        uri: uri,
        success: gotFile,
        fail: fail,
        complete: complete
    });
}
function getSavedFileList(_ref3) {
    var uri = _ref3.uri,
        _ref3$success = _ref3.success,
        success = _ref3$success === undefined ? noop : _ref3$success,
        _ref3$fail = _ref3.fail,
        fail = _ref3$fail === undefined ? noop : _ref3$fail,
        _ref3$complete = _ref3.complete,
        complete = _ref3$complete === undefined ? noop : _ref3$complete;
    if (!uri) {
        fail(new Error('小米需要指定目录'));
    }
    function gotFileList(fileList) {
        var newFileList = fileList.map(function (item) {
            return {
                fileList: item.uri,
                size: item.length,
                createTime: item.lastModifiedTime
            };
        });
        success({
            fileList: newFileList,
            errMsg: SUCCESS_MESSAGE
        });
    }
    file.list({
        uri: uri,
        success: gotFileList,
        fail: fail,
        complete: complete
    });
}
function removeSavedFile(_ref4) {
    var uri = _ref4.filePath,
        _ref4$success = _ref4.success,
        success = _ref4$success === undefined ? noop : _ref4$success,
        _ref4$fail = _ref4.fail,
        fail = _ref4$fail === undefined ? noop : _ref4$fail,
        _ref4$complete = _ref4.complete,
        complete = _ref4$complete === undefined ? noop : _ref4$complete;
    file.delete({
        uri: uri,
        success: success,
        fail: fail,
        complete: complete
    });
}
function saveFile(_ref5) {
    var srcUri = _ref5.tempFilePath,
        dstUri = _ref5.destinationFilePath,
        _ref5$success = _ref5.success,
        success = _ref5$success === undefined ? noop : _ref5$success,
        _ref5$fail = _ref5.fail,
        fail = _ref5$fail === undefined ? noop : _ref5$fail,
        _ref5$complete = _ref5.complete,
        complete = _ref5$complete === undefined ? noop : _ref5$complete;
    if (!dstUri) {
        fail(new Error('小米需要指定需要指定目标路径'));
    }
    function gotSuccess(uri) {
        success({
            savedFilePath: uri
        });
    }
    file.move({
        srcUri: srcUri,
        dstUri: dstUri,
        success: gotSuccess,
        fail: fail,
        complete: complete
    });
}

var clipboard = require('@system.clipboard');
function setClipboardData(_ref) {
    var text = _ref.data,
        success = _ref.success,
        fail = _ref.fail,
        complete = _ref.complete;
    clipboard.set({
        text: text,
        success: success || noop,
        fail: fail || noop,
        complete: complete || noop
    });
}
function getClipboardData(_ref2) {
    var _ref2$success = _ref2.success,
        _success = _ref2$success === undefined ? noop : _ref2$success,
        _ref2$fail = _ref2.fail,
        fail = _ref2$fail === undefined ? noop : _ref2$fail,
        _ref2$complete = _ref2.complete,
        complete = _ref2$complete === undefined ? noop : _ref2$complete;
    clipboard.get({
        success: function success(obj) {
            _success({
                data: obj.text
            });
        },
        fail: fail,
        complete: complete
    });
}

var network = require('@system.network');
function getNetworkType(_ref) {
    var success = _ref.success,
        fail = _ref.fail,
        complete = _ref.complete;
    network.getType({
        success: function networkTypeGot(res) {
            success({ networkType: res.type });
        },
        fail: fail,
        complete: complete
    });
}
function onNetworkStatusChange(callback) {
    function networkChanged(_ref2) {
        var networkType = _ref2.type;
        var connectedTypes = ['wifi', '4g', '3g', '2g'];
        callback({
            isConnected: connectedTypes.includes(networkType),
            networkType: networkType
        });
    }
    network.subscribe({ callback: networkChanged });
}

function setNavigationBarTitle(_ref) {
    var title = _ref.title,
        success = _ref.success,
        fail = _ref.fail,
        complete = _ref.complete;
    runCallbacks(function () {
        var currentPage = _getApp().$$page;
        currentPage.$page.setTitleBar({ text: title });
    }, success, fail, complete);
}

var device = require('@system.device');
var mapNames = {
    osVersionName: 'version',
    osVersionCode: 'system',
    platformVersionName: 'platform',
    platformVersionCode: 'SDKVersion'
};
function getSystemInfo(_ref) {
    var _success = _ref.success,
        fail = _ref.fail,
        complete = _ref.complete;
    device.getInfo({
        success: function success(rawObject) {
            var result = {
                fontSizeSetting: 14
            };
            for (var name in rawObject) {
                result[mapNames[name] || name] = rawObject[name];
            }
            _success && _success(result);
        },
        fail: fail,
        complete: complete
    });
}
function getDeviceId(options) {
    return device.getDeviceId(options);
}
function getUserId(options) {
    return device.getUserId(options);
}

function chooseImage(_ref) {
    var _ref$count = _ref.count,
        count = _ref$count === undefined ? 1 : _ref$count,
        _ref$sourceType = _ref.sourceType,
        sourceType = _ref$sourceType === undefined ? [] : _ref$sourceType,
        _success = _ref.success,
        _ref$fail = _ref.fail,
        fail = _ref$fail === undefined ? noop : _ref$fail,
        _ref$complete = _ref.complete,
        complete = _ref$complete === undefined ? noop : _ref$complete;
    if (count > 1) {
        return fail(new Error('快应用选择图片的数量不能大于1'));
    }
    function imagePicked(_ref2) {
        var path = _ref2.uri;
        var file = require('@system.file');
        file.get({
            uri: path,
            success: function success(_ref3) {
                var size = _ref3.length;
                var tempFilePaths = [path];
                var tempFiles = [{ path: path, size: size }];
                _success({
                    tempFilePaths: tempFilePaths,
                    tempFiles: tempFiles
                });
            },
            fail: fail
        });
    }
    var media = require('@system.media');
    var pick = sourceType.length === 1 && sourceType[0] === 'camera' ? media.takePhoto : media.pickImage;
    pick({
        success: imagePicked,
        fail: fail,
        complete: complete,
        cancel: fail
    });
}

var prompt = require('@system.prompt');
function showModal(obj) {
    obj.showCancel = obj.showCancel === false ? false : true;
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
    var fn = obj['success'];
    obj['success'] = function (res) {
        res.confirm = !res.index;
        fn && fn(res);
    };
    prompt.showDialog(obj);
}
function showToast(obj) {
    obj.message = obj.title;
    obj.duration = obj.duration / 1000 >= 1 ? 1 : 0;
    runCallbacks(function () {
        prompt.showToast(obj);
    }, obj.success, obj.fail, obj.complete);
}
function showActionSheet(obj) {
    prompt.showContextMenu(obj);
}
function showLoading(obj) {
    obj.message = obj.title;
    obj.duration = 1;
    prompt.showToast(obj);
}

var shortcut = require('@system.shortcut');
function createShortcut() {
    shortcut.hasInstalled({
        success: function success(ok) {
            if (ok) {
                showToast({ title: '已创建桌面图标' });
            } else {
                shortcut.install({
                    success: function success() {
                        showToast({ title: '成功创建桌面图标' });
                    },
                    fail: function fail(errmsg, errcode) {
                        if (errcode === 200) {
                            showToast({ title: '请打开系统授权后再试' });
                            return;
                        }
                        console.log(errcode, errmsg);
                    }
                });
            }
        }
    });
}
function shortcutInstall(obj) {
    return shortcut.install(obj);
}
function hasInstalled(obj) {
    return shortcut.hasInstalled(obj);
}

var push = require('@service.push');
function getPushProvider() {
    return push.getProvider();
}
function subscribe(obj) {
    return push.subscribe(obj);
}
function unsubscribe(obj) {
    return push.unsubscribe(obj);
}
function pushOn(obj) {
    return push.on(obj);
}
function pushOff() {
    return push.off();
}

function getCurrentPages$1() {
    console.warn('getCurrentPages存在严重的平台差异性，不建议再使用');
    var globalData = _getApp().globalData;
    var c = globalData.__currentPages;
    if (!c || !c.length) {
        var router = require('@system.router');
        globalData.__currentPages = [router.getState()['path']];
    }
    return globalData.__currentPages;
}

var router = require('@system.router');
var rQuery = /\?(.*)/;
var urlReg = /(((http|https)\:\/\/)|(www)){1}[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g;
function getQueryFromUri(uri, query) {
    return uri.replace(rQuery, function (a, b) {
        b.split('&').forEach(function (param) {
            param = param.split('=');
            query[param[0]] = param[1];
        });
        return '';
    });
}
function createRouter(name) {
    return function (obj, inner) {
        var uri = "",
            params = {},
            delta = 0;
        if (name === 'back') {
            delta = Object(obj).delta;
            if (delta + 0 !== delta) {
                console.warn('navigateBack的传参应该为({delta: number})');
            }
        } else {
            var href = Object(obj).url || "";
            if (urlReg.test(href)) {
                var webview = require('@system.webview');
                webview.loadUrl({
                    url: href,
                    allowthirdpartycookies: true
                });
                return;
            }
            uri = href.slice(href.indexOf('/pages') + 1);
            if (process.env.ANU_WEBVIEW) {
                var webViewRoutes = {};
                try {
                    webViewRoutes = require('./webviewConfig.js');
                    var effectPath = uri.split('?')[0];
                    if (webViewRoutes[effectPath]) {
                        var config = webViewRoutes[effectPath];
                        params = {
                            src: config.src || '',
                            allowthirdpartycookies: config.allowthirdpartycookies || false,
                            trustedurl: config.trustedurl || []
                        };
                    }
                } catch (err) {
                }
                if (webViewRoutes[uri.split('?')[0]]) {
                    uri = '/pages/__web__view__';
                }
            }
            uri = getQueryFromUri(uri, params).replace(/\/index$/, '');
            if (uri.charAt(0) !== '/' && !uri.match(/^(hap|https?)\:/)) {
                uri = '/' + uri;
            }
        }
        if (typeof getApp !== 'undefined') {
            var globalData = getApp().globalData;
            var queryObject = globalData.__quickQuery || (globalData.__quickQuery = {});
            var currentPages = getCurrentPages$1();
            switch (name) {
                case 'push':
                    currentPages.push(uri);
                    break;
                case 'replace':
                    var last = currentPages.pop();
                    delete queryObject[last];
                    if (inner === 'clear') {
                        currentPages.length = 0;
                    }
                    currentPages.push(uri);
                    break;
                case 'back':
                    while (delta) {
                        uri = currentPages.pop();
                        if (uri) {
                            delta = delta - 1;
                            console.log("DEBUG::", router.getState().path == uri);
                            params = queryObject[uri];
                        } else {
                            return;
                        }
                    }
            }
        }
        if (name !== 'back') {
            queryObject[uri] = params;
        }
        router[name]({
            uri: uri,
            params: params
        });
    };
}
var navigateTo = createRouter('push');
var redirectTo = createRouter('replace');
var navigateBack = createRouter('back');
var reLaunch = function reLaunch(obj) {
    router.clear();
    redirectTo(obj, 'clear');
};
function makePhoneCall(_ref) {
    var phoneNumber = _ref.phoneNumber,
        success = _ref.success,
        fail = _ref.fail,
        complete = _ref.complete;
    runCallbacks(function () {
        router.push({
            uri: 'tel:' + phoneNumber
        });
    }, success, fail, complete);
}

var vibrator = require('@system.vibrator');
function vibrateLong() {
    vibrator.vibrate({
        mode: 'long'
    });
}
function vibrateShort() {
    vibrator.vibrate({
        mode: 'short'
    });
}

function share(obj) {
    var share = require('@service.share');
    share.getAvailablePlatforms({
        success: function success() {
            share.share(obj);
        }
    });
}

function createCanvasContext(id, obj) {
    if (obj.wx && obj.wx.$element) {
        var el = obj.wx.$element(id);
        var ctx = el && el.getContext('2d');
        'strokeStyle,textAlign,textBaseline,fillStyle,lineWidth,lineCap,lineJoin,miterLimit,globalAlpha'.split(',').map(function (item) {
            var method = 'set' + item.substring(0, 1).toUpperCase() + item.substring(1);
            ctx[method] = function (value) {
                ctx[item] = value;
            };
        });
        ctx.setFontSize = function (value) {
            ctx.font = value + 'px';
        };
        ctx.draw = function () {
            ctx.closePath();
        };
        return ctx;
    } else {
        throw new Error('createCanvasContext 第二个 字段 this 必须添加');
    }
}

var payAPI = require('@service.pay');
var wxpayAPI = require('@service.wxpay');
var alipayAPI = require('@service.alipay');
function pay(obj) {
    payAPI.pay(obj);
}
function getProvider() {
    return payAPI.getProvider();
}
function wxpayGetType() {
    return wxpayAPI.getType();
}
function wxpay(obj) {
    wxpayAPI.pay(obj);
}
function alipay(obj) {
    alipayAPI.pay(obj);
}

var account = require('@service.account');
function accountGetProvider() {
    return account.getProvider();
}
function accountAuthorize(options) {
    return account.authorize(options);
}

function stopPullDownRefresh() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        success = _ref.success,
        fail = _ref.fail,
        complete = _ref.complete;
    runCallbacks(Number, success, fail, complete);
}
var facade = {
    showModal: showModal,
    showActionSheet: showActionSheet,
    showToast: showToast,
    showLoading: showLoading,
    navigateTo: navigateTo,
    redirectTo: redirectTo,
    switchTab: redirectTo,
    reLaunch: reLaunch,
    navigateBack: navigateBack,
    vibrateLong: vibrateLong,
    vibrateShort: vibrateShort,
    uploadFile: uploadFile,
    downloadFile: downloadFile,
    request: request,
    makePhoneCall: makePhoneCall,
    scanCode: function scanCode(_ref2) {
        var success = _ref2.success,
            fail = _ref2.fail,
            complete = _ref2.complete;
        var barcode = require('@system.barcode');
        barcode.scan({
            success: success,
            fail: fail,
            cancel: fail,
            complete: complete
        });
    },
    setStorage: setStorage,
    getStorage: getStorage,
    removeStorage: removeStorage,
    clearStorage: clearStorage,
    setStorageSync: setStorageSync,
    getStorageSync: getStorageSync,
    removeStorageSync: removeStorageSync,
    clearStorageSync: clearStorageSync,
    getSavedFileInfo: getSavedFileInfo,
    getSavedFileList: getSavedFileList,
    removeSavedFile: removeSavedFile,
    saveFile: saveFile,
    setClipboardData: setClipboardData,
    getClipboardData: getClipboardData,
    getLocation: function getLocation(obj) {
        var geolocation = require('@system.geolocation');
        geolocation.getLocation(obj);
    },
    getNetworkType: getNetworkType,
    onNetworkStatusChange: onNetworkStatusChange,
    getSystemInfo: getSystemInfo,
    chooseImage: chooseImage,
    setNavigationBarTitle: setNavigationBarTitle,
    createCanvasContext: createCanvasContext,
    stopPullDownRefresh: stopPullDownRefresh,
    createAnimation: stopPullDownRefresh
};
function more() {
    return {
        initStorageSync: initStorageSync,
        createShortcut: createShortcut,
        share: share,
        hasInstalled: hasInstalled,
        shortcutInstall: shortcutInstall,
        getPushProvider: getPushProvider, subscribe: subscribe, unsubscribe: unsubscribe, pushOn: pushOn, pushOff: pushOff,
        pay: pay,
        getProvider: getProvider,
        wxpayGetType: wxpayGetType,
        wxpay: wxpay,
        alipay: alipay,
        getDeviceId: getDeviceId,
        getUserId: getUserId,
        accountGetProvider: accountGetProvider,
        accountAuthorize: accountAuthorize
    };
}

var onAndSyncApis = {
  onSocketOpen: true,
  onSocketError: true,
  onSocketMessage: true,
  onSocketClose: true,
  onBackgroundAudioPlay: true,
  onBackgroundAudioPause: true,
  onBackgroundAudioStop: true,
  onNetworkStatusChange: true,
  onAccelerometerChange: true,
  onCompassChange: true,
  onBluetoothAdapterStateChange: true,
  onBluetoothDeviceFound: true,
  onBLEConnectionStateChange: true,
  onBLECharacteristicValueChange: true,
  onBeaconUpdate: true,
  onBeaconServiceChange: true,
  onUserCaptureScreen: true,
  onHCEMessage: true,
  onGetWifiList: true,
  onWifiConnected: true,
  setStorageSync: true,
  getStorageSync: true,
  getStorageInfoSync: true,
  removeStorageSync: true,
  clearStorageSync: true,
  getSystemInfoSync: true,
  getExtConfigSync: true,
  getLogManager: true
};
var noPromiseApis = {
  stopRecord: true,
  getRecorderManager: true,
  pauseVoice: true,
  stopVoice: true,
  pauseBackgroundAudio: true,
  stopBackgroundAudio: true,
  getBackgroundAudioManager: true,
  createAudioContext: true,
  createInnerAudioContext: true,
  createVideoContext: true,
  createCameraContext: true,
  wxpayGetType: true,
  navigateBack: true,
  createMapContext: true,
  canIUse: true,
  startAccelerometer: true,
  stopAccelerometer: true,
  startCompass: true,
  stopCompass: true,
  hideToast: true,
  hideLoading: true,
  showNavigationBarLoading: true,
  hideNavigationBarLoading: true,
  createAnimation: true,
  pageScrollTo: true,
  createSelectorQuery: true,
  createCanvasContext: true,
  createContext: true,
  drawCanvas: true,
  hideKeyboard: true,
  stopPullDownRefresh: true,
  arrayBufferToBase64: true,
  base64ToArrayBuffer: true,
  getUpdateManager: true,
  createWorker: true,
  getPushProvider: true,
  getProvider: true,
  canvasToTempFilePath: true,
  createModal: true
};
var otherApis = {
  uploadFile: true,
  downloadFile: true,
  connectSocket: true,
  sendSocketMessage: true,
  closeSocket: true,
  chooseImage: true,
  previewImage: true,
  getImageInfo: true,
  saveImageToPhotosAlbum: true,
  startRecord: true,
  playVoice: true,
  getBackgroundAudioPlayerState: true,
  playBackgroundAudio: true,
  seekBackgroundAudio: true,
  chooseVideo: true,
  saveVideoToPhotosAlbum: true,
  loadFontFace: true,
  saveFile: true,
  getFileInfo: true,
  getSavedFileList: true,
  getSavedFileInfo: true,
  removeSavedFile: true,
  openDocument: true,
  setStorage: true,
  getStorage: true,
  getStorageInfo: true,
  removeStorage: true,
  clearStorage: true,
  navigateTo: true,
  redirectTo: true,
  switchTab: true,
  reLaunch: true,
  getLocation: true,
  chooseLocation: true,
  openLocation: true,
  getSystemInfo: true,
  getNetworkType: true,
  makePhoneCall: true,
  scanCode: true,
  setClipboardData: true,
  getClipboardData: true,
  openBluetoothAdapter: true,
  closeBluetoothAdapter: true,
  getBluetoothAdapterState: true,
  startBluetoothDevicesDiscovery: true,
  stopBluetoothDevicesDiscovery: true,
  getBluetoothDevices: true,
  getConnectedBluetoothDevices: true,
  createBLEConnection: true,
  closeBLEConnection: true,
  getBLEDeviceServices: true,
  getBLEDeviceCharacteristics: true,
  readBLECharacteristicValue: true,
  writeBLECharacteristicValue: true,
  notifyBLECharacteristicValueChange: true,
  startBeaconDiscovery: true,
  stopBeaconDiscovery: true,
  getBeacons: true,
  setScreenBrightness: true,
  getScreenBrightness: true,
  setKeepScreenOn: true,
  vibrateLong: true,
  vibrateShort: true,
  addPhoneContact: true,
  getHCEState: true,
  startHCE: true,
  stopHCE: true,
  sendHCEMessage: true,
  startWifi: true,
  stopWifi: true,
  connectWifi: true,
  getWifiList: true,
  setWifiList: true,
  getConnectedWifi: true,
  showToast: true,
  showLoading: true,
  showModal: true,
  showActionSheet: true,
  setNavigationBarTitle: true,
  setNavigationBarColor: true,
  setTabBarBadge: true,
  removeTabBarBadge: true,
  showTabBarRedDot: true,
  hideTabBarRedDot: true,
  setTabBarStyle: true,
  setTabBarItem: true,
  showTabBar: true,
  hideTabBar: true,
  setTopBarText: true,
  startPullDownRefresh: true,
  canvasGetImageData: true,
  canvasPutImageData: true,
  getExtConfig: true,
  request: true,
  login: true,
  checkSession: true,
  authorize: true,
  getUserInfo: true,
  requestPayment: true,
  showShareMenu: true,
  hideShareMenu: true,
  updateShareMenu: true,
  getShareInfo: true,
  chooseAddress: true,
  addCard: true,
  openCard: true,
  openSetting: true,
  getSetting: true,
  getWeRunData: true,
  navigateToMiniProgram: true,
  navigateBackMiniProgram: true,
  chooseInvoiceTitle: true,
  checkIsSupportSoterAuthentication: true,
  startSoterAuthentication: true,
  checkIsSoterEnrolledInDevice: true,
  setBackgroundColor: true,
  setBackgroundTextStyle: true
};

function promisefyApis(ReactWX, facade, more) {
    var weApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis, more);
    Object.keys(weApis).forEach(function (key) {
        var needWrapper = more[key] || facade[key] || noop;
        if (!onAndSyncApis[key] && !noPromiseApis[key]) {
            ReactWX.api[key] = function (options) {
                var args = [].slice.call(arguments);
                if (!options || Object(options) !== options) {
                    return needWrapper.apply(facade, args);
                }
                var task = null;
                var obj = Object.assign({}, options);
                args[0] = obj;
                var p = new Promise(function (resolve, reject) {
                    ['fail', 'success', 'complete'].forEach(function (k) {
                        obj[k] = function (res) {
                            options[k] && options[k](res);
                            if (k === 'success') {
                                resolve(key === 'connectSocket' ? task : res);
                            } else if (k === 'fail') {
                                reject(res);
                            }
                        };
                    });
                    if (needWrapper === noop) {
                        console.warn('平台未不支持', key, '方法');
                    } else {
                        task = needWrapper.apply(facade, args);
                        if (task && options.getRawResult) {
                            options.getRawResult(task);
                        }
                    }
                });
                return p;
            };
        } else {
            if (needWrapper == noop) {
                ReactWX.api[key] = noop;
            } else {
                ReactWX.api[key] = function () {
                    return needWrapper.apply(facade, arguments);
                };
            }
        }
    });
}
function registerAPIsQuick(ReactWX, facade, override) {
    if (!ReactWX.api) {
        ReactWX.api = {};
        promisefyApis(ReactWX, facade, override(facade));
    }
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
        key = fiber.key,
        isStateless = tag === 1,
        lastOwn = Renderer.currentOwner,
        instance = {
        refs: {},
        props: props,
        key: key,
        context: context,
        ref: ref,
        _reactInternalFiber: fiber,
        __proto__: type.prototype
    };
    fiber.updateQueue = UpdateQueue();
    fiber.errorHook = 'constructor';
    try {
        if (isStateless) {
            Renderer.currentOwner = instance;
            extend(instance, {
                __isStateless: true,
                renderImpl: type,
                render: function f1() {
                    return this.renderImpl(this.props, this.context);
                }
            });
            Renderer.currentOwner = instance;
        } else {
            instance = new type(props, context);
            if (!(instance instanceof Component)) {
                if (!instance.updater || !instance.updater.enqueueSetState) {
                    throw type.name + ' doesn\'t extend React.Component';
                }
            }
        }
    } finally {
        Renderer.currentOwner = lastOwn;
        fiber.stateNode = instance;
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
var PASSIVE = 29;
var CAPTURE = 31;
var effectNames = [DUPLEX, HOOK, REF, DETACH, CALLBACK, PASSIVE, CAPTURE].sort(function (a, b) {
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

function setter(compute, cursor, value) {
    var _this = this;
    Renderer.batchedUpdates(function () {
        _this.updateQueue[cursor] = compute(cursor, value);
        Renderer.updateComponent(_this, true);
    });
}
var hookCursor = 0;
function resetCursor() {
    hookCursor = 0;
}
function getCurrentKey() {
    var key = hookCursor + 'Hook';
    hookCursor++;
    return key;
}
function useContext(getContext) {
    if (isFn(getContext)) {
        var fiber = getCurrentFiber();
        var context = getContext(fiber);
        var list = getContext.subscribers;
        if (list.indexOf(fiber) === -1) {
            list.push(fiber);
        }
        return context;
    }
    return null;
}
function useReducerImpl(reducer, initValue, initAction) {
    var fiber = getCurrentFiber();
    var key = getCurrentKey();
    var updateQueue = fiber.updateQueue;
    var compute = reducer ? function (cursor, action) {
        return reducer(updateQueue[cursor], action || { type: Math.random() });
    } : function (cursor, value) {
        var other = updateQueue[cursor];
        return isFn(value) ? value(other) : value;
    };
    var dispatch = setter.bind(fiber, compute, key);
    if (key in updateQueue) {
        delete updateQueue.isForced;
        return [updateQueue[key], dispatch];
    }
    var value = updateQueue[key] = initAction ? reducer(initValue, initAction) : initValue;
    return [value, dispatch];
}
function useCallbackImpl(create, deps, isMemo, isEffect) {
    var fiber = getCurrentFiber();
    var key = getCurrentKey();
    var updateQueue = fiber.updateQueue;
    var nextInputs = Array.isArray(deps) ? deps : [create];
    var prevState = updateQueue[key];
    if (prevState) {
        var prevInputs = prevState[1];
        if (areHookInputsEqual(nextInputs, prevInputs)) {
            return isEffect ? null : prevState[0];
        }
    }
    var fn = isMemo ? create() : create;
    updateQueue[key] = [fn, nextInputs];
    return fn;
}
function useEffectImpl(create, deps, EffectTag, createList, destroyList) {
    var fiber = getCurrentFiber();
    var updateQueue = fiber.updateQueue;
    if (useCallbackImpl(create, deps, false, true)) {
        if (fiber.effectTag % EffectTag) {
            fiber.effectTag *= EffectTag;
        }
        var list = updateQueue[createList] || (updateQueue[createList] = []);
        updateQueue[destroyList] || (updateQueue[destroyList] = []);
        list.push(create);
    }
}
function useRef(initValue) {
    var fiber = getCurrentFiber();
    var key = getCurrentKey();
    var updateQueue = fiber.updateQueue;
    if (key in updateQueue) {
        return updateQueue[key];
    }
    return updateQueue[key] = { current: initValue };
}
function getCurrentFiber() {
    return get(Renderer.currentOwner);
}
function areHookInputsEqual(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        if (Object.is(arr1[i], arr2[i])) {
            continue;
        }
        return false;
    }
    return true;
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
    var getContext = type.contextType;
    var unmaskedContext = contextStack[0];
    var isStaticContextType = isFn(type.contextType);
    var newContext = isStaticContextType ? getContext(fiber) : getMaskedContext(instance, type.contextTypes, unmaskedContext);
    if (instance == null) {
        fiber.parent = type === AnuPortal ? props.parent : containerStack[0];
        instance = createInstance(fiber, newContext);
        if (isStaticContextType) {
            getContext.subscribers.push(instance);
        }
    }
    if (!isStaticContextType) {
        cacheContext(instance, unmaskedContext, newContext);
    }
    var isStateful = !instance.__isStateless;
    instance._reactInternalFiber = fiber;
    if (isStateful) {
        var updateQueue = fiber.updateQueue;
        delete fiber.updateFail;
        if (fiber.hasMounted) {
            applybeforeUpdateHooks(fiber, instance, props, newContext, contextStack);
        } else {
            applybeforeMountHooks(fiber, instance, props);
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
        context = Object.assign({}, unmaskedContext, context);
        fiber.shiftContext = true;
        contextStack.unshift(context);
    }
    if (fiber.parent && fiber.hasMounted && fiber.dirty) {
        fiber.parent.insertPoint = getInsertPoint(fiber);
    }
    if (isStateful) {
        if (fiber.updateFail) {
            cloneChildren(fiber);
            fiber._hydrating = false;
            return;
        }
        delete fiber.dirty;
        fiber.effectTag *= HOOK;
    } else if (fiber.effectTag == 1) {
        fiber.effectTag = WORKING;
    }
    if (fiber.catchError) {
        return;
    }
    Renderer.onBeforeRender(fiber);
    fiber._hydrating = true;
    Renderer.currentOwner = instance;
    var rendered = applyCallback(instance, 'render', []);
    resetCursor();
    diffChildren(fiber, rendered);
    Renderer.onAfterRender(fiber);
}
function applybeforeMountHooks(fiber, instance, newProps) {
    fiber.setout = true;
    if (instance.__useNewHooks) {
        setStateByProps(fiber, newProps, instance.state);
    } else {
        callUnsafeHook(instance, 'componentWillMount', []);
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
    fiber.setout = true;
    if (!instance.__useNewHooks) {
        var contextChanged = instance.context !== newContext;
        if (propsChanged || contextChanged) {
            var prevState = instance.state;
            callUnsafeHook(instance, 'componentWillReceiveProps', [newProps, newContext]);
            if (prevState !== instance.state) {
                fiber.memoizedState = instance.state;
            }
        }
    }
    var newState = instance.state = oldState;
    var updateQueue = fiber.updateQueue;
    mergeStates(fiber, newProps);
    newState = fiber.memoizedState;
    setStateByProps(fiber, newProps, newState);
    newState = fiber.memoizedState;
    delete fiber.setout;
    fiber._hydrating = true;
    if (!propsChanged && newState === oldState && contextStack.length == 1 && !updateQueue.isForced) {
        fiber.updateFail = true;
    } else {
        var args = [newProps, newState, newContext];
        fiber.updateQueue = UpdateQueue();
        if (!updateQueue.isForced && !applyCallback(instance, 'shouldComponentUpdate', args)) {
            fiber.updateFail = true;
        } else if (!instance.__useNewHooks) {
            callUnsafeHook(instance, 'componentWillUpdate', args);
        }
    }
}
function callUnsafeHook(a, b, c) {
    applyCallback(a, b, c);
    applyCallback(a, 'UNSAFE_' + b, c);
}
function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
function setStateByProps(fiber, nextProps, prevState) {
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
function getMaskedContext(instance, contextTypes, unmaskedContext) {
    var noContext = !contextTypes;
    if (instance) {
        if (noContext) {
            return instance.context;
        }
        var cachedUnmasked = instance.__unmaskedContext;
        if (cachedUnmasked === unmaskedContext) {
            return instance.__maskedContext;
        }
    }
    var context = {};
    if (noContext) {
        return context;
    }
    for (var key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = unmaskedContext[key];
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

var domFns = ['insertElement', 'updateContent', 'updateAttribute'];
var domEffects = [PLACE, CONTENT, ATTR];
var domRemoved = [];
var passiveFibers = [];
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
                f.hasMounted = true;
            } else if (f.effectTag > WORKING) {
                commitEffects(f);
                f.hasMounted = true;
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
            if (passiveFibers.length) {
                passiveFibers.forEach(function (fiber) {
                    safeInvokeHooks(fiber.updateQueue, 'passive', 'unpassive');
                });
                passiveFibers.length = 0;
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
                    if (instance.__isStateless) {
                        safeInvokeHooks(fiber.updateQueue, 'layout', 'unlayout');
                    } else if (fiber.hasMounted) {
                        guardCallback(instance, 'componentDidUpdate', [updater.prevProps, updater.prevState, updater.snapshot]);
                    } else {
                        fiber.hasMounted = true;
                        guardCallback(instance, 'componentDidMount', []);
                    }
                    delete fiber._hydrating;
                    if (fiber.catchError) {
                        fiber.effectTag = amount;
                        return;
                    }
                    break;
                case PASSIVE:
                    passiveFibers.push(fiber);
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
function safeInvokeHooks(upateQueue, create, destory) {
    var uneffects = upateQueue[destory],
        effects$$1 = upateQueue[create],
        fn;
    if (!uneffects) {
        return;
    }
    while (fn = uneffects.shift()) {
        try {
            fn();
        } catch (e) {      }
    }
    while (fn = effects$$1.shift()) {
        try {
            var f = fn();
            if (typeof f === 'function') {
                uneffects.push(f);
            }
        } catch (e) {      }
    }
}
function disposeFiber(fiber, force) {
    var stateNode = fiber.stateNode,
        effectTag = fiber.effectTag;
    if (!stateNode) {
        return;
    }
    var isStateless = stateNode.__isStateless;
    if (!isStateless && fiber.ref) {
        Refs.fireRef(fiber, null);
    }
    if (effectTag % DETACH == 0 || force === true) {
        if (fiber.tag > 3) {
            domRemoved.push(fiber);
        } else {
            Renderer.onDispose(fiber);
            if (fiber.hasMounted) {
                if (isStateless) {
                    safeInvokeHooks(fiber.updateQueue, 'layout', 'unlayout');
                    safeInvokeHooks(fiber.updateQueue, 'passive', 'unpassive');
                }
                stateNode.updater.enqueueSetState = returnFalse;
                guardCallback(stateNode, 'componentWillUnmount', []);
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
    render: function f3() {
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
    updateComponent(container.child, {
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
function updateComponent(fiber, state, callback, immediateUpdate) {
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
        throw 'container is not a element';
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

var onEvent = /(?:on|catch)[A-Z]/;
function getEventUid(name, props) {
    var n = name.charAt(0) == 'o' ? 2 : 5;
    var type = toLowerCase(name.slice(n));
    return props['data-' + type + '-uid'];
}
var Renderer$1 = createRenderer({
    render: render,
    updateAttribute: function updateAttribute(fiber) {
        var props = fiber.props,
            lastProps = fiber.lastProps;
        var beaconId = props['data-beacon-uid'];
        var instance = fiber._owner;
        if (instance && beaconId) {
            var cached = instance.$$eventCached || (instance.$$eventCached = {});
            for (var name in props) {
                if (onEvent.test(name) && isFn(props[name])) {
                    var code = getEventUid(name, props);
                    cached[code] = props[name];
                    cached[code + 'Fiber'] = fiber;
                }
            }
            if (lastProps) {
                for (var _name in lastProps) {
                    if (onEvent.test(_name) && !props[_name]) {
                        var _code = getEventUid(_name, lastProps);
                        delete cached[_code];
                        delete cached[_code + 'Fiber'];
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
        var instance = fiber.stateNode;
        var app = _getApp();
        if (type.reactInstances) {
            var uuid = fiber.props['data-instance-uid'] || null;
            if (!instance.instanceUid) {
                instance.instanceUid = uuid;
            }
            if (type.isMPComponent) {
                if (!instance.wx) {
                    instance.$$pagePath = Object(_getApp()).$$pagePath;
                    type.reactInstances.push(instance);
                }
            }
        }
        if (!app.$$pageIsReady && instance.componentDidMount) {
            delayMounts.push({
                instance: instance,
                fn: instance.componentDidMount
            });
            instance.componentDidMount = Boolean;
        }
    },
    onAfterRender: function onAfterRender(fiber) {
        updateMiniApp(fiber.stateNode);
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
    insertElement: function insertElement() {},
    emptyElement: function emptyElement() {},
    removeElement: function removeElement() {}
});

var rcamel = /-(\w)/g;
var rpx = /(\d[\d\.]*)(r?px)/gi;
function camel(target) {
    return target.replace(rcamel, function (all, letter) {
        return letter.toUpperCase();
    });
}
function transform(obj) {
    var ret = {};
    for (var i in obj) {
        var value = obj[i] + '';
        value = value.replace(rpx, function (str, match, unit) {
            if (unit.toLowerCase() === 'px') {
                match = parseFloat(match) * 2;
            }
            return match + 'px';
        });
        ret[camel(i)] = value;
    }
    return ret;
}
function toStyle(obj, props, key) {
    if (props) {
        if (obj + '' === obj) {
            var ret = {};
            obj.split(';').forEach(function (el) {
                var index = el.indexOf(':');
                var name = el.slice(0, index).trim();
                var value = el.slice(index).trim();
                if (name) {
                    ret[name] = value;
                }
            });
            obj = ret;
        }
        var str = transform.call(this, obj);
        props[key] = str;
    } else {
        console.warn('toStyle生成样式失败，key为', key);
    }
    return obj;
}

var appMethods = {
    onLaunch: 'onCreate',
    onHide: 'onDestroy'
};
function registerApp(demo, containProvider) {
    var app = {};
    if (containProvider) {
        demo.globalData._GlobalApp = demo.constructor;
    }
    for (var name in demo) {
        var value = demo[name];
        name = appMethods[name] || name;
        app[name] = value;
    }
    for (var _name in demo.constructor) {
        var _value = demo.constructor[_name];
        if (!app[_name]) {
            app[_name] = _value;
        } else {
            throw 'app.js已经存在同名的静态属性与实例属性 ' + _name + ' !';
        }
    }
    delete app.constructor;
    return app;
}

function registerComponent(type, name) {
    type.isMPComponent = true;
    registeredComponents[name] = type;
    var reactInstances = type.reactInstances = [];
    return {
        data: function data() {
            return {
                props: {},
                state: {},
                context: {}
            };
        },
        onInit: function onInit() {
            usingComponents[name] = type;
            var uuid = this.dataInstanceUid || null;
            refreshComponent(reactInstances, this, uuid);
        },
        onDestroy: detachComponent,
        dispatchEvent: dispatchEvent
    };
}

var GlobalApp = void 0;
function _getGlobalApp(app) {
    return GlobalApp || app.globalData._GlobalApp;
}

function onLoad(PageClass, path, query, fire) {
    var app = _getApp();
    var GlobalApp = _getGlobalApp(app);
    app.$$pageIsReady = false;
    app.$$page = this;
    app.$$pagePath = path;
    var dom = PageClass.container;
    var pageInstance;
    if (typeof GlobalApp === "function") {
        this.needReRender = true;
        render(createElement(GlobalApp, {}, createElement(PageClass, {
            path: path,
            key: path,
            query: query,
            isPageComponent: true
        })), dom, function () {
            var fiber = get(this).child;
            while (!fiber.stateNode.classUid) {
                fiber = fiber.child;
            }
            pageInstance = fiber.stateNode;
        });
    } else {
        pageInstance = render(
        createElement(PageClass, {
            path: path,
            query: query,
            isPageComponent: true
        }), dom);
    }
    this.reactContainer = dom;
    this.reactInstance = pageInstance;
    pageInstance.wx = this;
    if (fire) {
        callGlobalHook("onGlobalLoad");
        updateMiniApp(pageInstance);
    }
    return pageInstance;
}
function onReady() {
    var app = _getApp();
    app.$$pageIsReady = true;
    var el = void 0;
    while (el = delayMounts.pop()) {
        el.fn.call(el.instance);
        el.instance.componentDidMount = el.fn;
    }
    callGlobalHook("onGlobalReady");
}
function onUnload() {
    for (var i in usingComponents) {
        var a = usingComponents[i];
        if (a.reactInstances) {
            a.reactInstances.length = 0;
        }
        delete usingComponents[i];
    }
    var root = this.reactContainer;
    var container = root && root._reactInternalFiber;
    if (container) {
        Renderer.updateComponent(container.child, {
            child: null
        }, function () {
            root._reactInternalFiber = null;
            var j = topNodes.indexOf(root);
            if (j !== -1) {
                topFibers.splice(j, 1);
                topNodes.splice(j, 1);
            }
        }, true);
    }
    callGlobalHook("onGlobalUnload");
    this.reactContainer = null;
}

function registerPageHook(appHooks, pageHook, app, instance, args) {
    for (var i = 0; i < 2; i++) {
        var method = i ? appHooks[pageHook] : pageHook;
        var host = i ? app : instance;
        if (host && host[method] && isFn(host[method])) {
            var ret = host[method](args);
            if (ret !== void 0) {
                if (ret && ret.then && ret['catch']) {
                    continue;
                }
                return ret;
            }
        }
    }
}

var appHooks = {
    onShow: 'onGlobalShow',
    onHide: 'onGlobalHide'
};
function getQuery(wx, huaweiHack) {
    var page = wx.$page;
    if (page.query) {
        return page.query;
    }
    var query = {};
    if (page.uri) {
        getQueryFromUri(page.uri, query);
        for (var i in query) {
            return query;
        }
    }
    var data = _getApp().globalData;
    var routerQuery = data && data.__quickQuery && data.__quickQuery[page.path] || query;
    if (huaweiHack && Object.keys(huaweiHack).length) {
        for (var _i in huaweiHack) {
            routerQuery[_i] = wx[_i];
        }
    }
    return routerQuery;
}
function registerPage(PageClass, path) {
    PageClass.reactInstances = [];
    PageClass.container = {
        type: "page",
        props: {},
        children: [],
        root: true,
        appendChild: noop
    };
    var def = _getApp().$def;
    var appInner = def.innerQuery;
    var appOuter = def.outerQuery;
    var pageInner = PageClass.innerQuery;
    var pageOuter = PageClass.outerQuery;
    if (!pageInner && PageClass.protected) {
        console.warn('protected静态对象已经被废弃，请改用pageQuery静态对象');
        pageInner = PageClass.protected;
    }
    var innerQuery = pageInner ? Object.assign({}, appInner, pageInner) : appInner;
    var outerQuery = pageOuter ? Object.assign({}, appOuter, pageOuter) : appOuter;
    var duplicate = {};
    if (innerQuery) {
        for (var i in innerQuery) {
            duplicate[i] = true;
        }
    }
    if (outerQuery) {
        var keys = [];
        for (var i in outerQuery) {
            if (duplicate[i] === true) {
                keys.push(i);
            }
            duplicate[i] = true;
        }
        if (keys.length) {
            throw '页面 ' + path + ' 的两个参数对象存在重复的键名 ' + keys;
        }
    }
    var config = {
        private: {
            props: Object,
            context: Object,
            state: Object
        },
        protected: innerQuery,
        public: outerQuery,
        dispatchEvent: dispatchEvent,
        onInit: function onInit() {
            var app = this.$app;
            var instance = onLoad.call(this, PageClass, path, getQuery(this, duplicate), true);
            var pageConfig = PageClass.config || instance.config || emptyObject;
            app.$$pageConfig = Object.keys(pageConfig).length ? pageConfig : null;
        },
        onReady: onReady,
        onDestroy: onUnload
    };
    Array('onShow', 'onHide', 'onMenuPress', "onBackPress").forEach(function (pageHook) {
        config[pageHook] = function (e) {
            var instance = this.reactInstance,
                app = _getApp(),
                query = e;
            if (pageHook === 'onShow') {
                query = instance.props.query = getQuery(this, duplicate);
                app.$$page = instance.wx;
                var path = app.$$pagePath = instance.props.path;
                if (this.needReRender) {
                    onLoad.call(this, PageClass, path, query);
                }
            } else if (pageHook === 'onMenuPress') {
                app.onShowMenu && app.onShowMenu(instance, this.$app);
                return;
            } else if (pageHook == 'onBackPress') {
                if (instance[pageHook] && instance[pageHook]() === true) {
                    return;
                }
                getCurrentPages$1().pop();
            }
            return registerPageHook(appHooks, pageHook, app, instance, query);
        };
    });
    return config;
}

function useState(initValue) {
    return useReducerImpl(null, initValue);
}
function useReducer(reducer, initValue, initAction) {
    return useReducerImpl(reducer, initValue, initAction);
}
function useEffect(create, deps) {
    return useEffectImpl(create, deps, PASSIVE, "passive", "unpassive");
}
function useMemo(create, deps) {
    return useCallbackImpl(create, deps, true);
}
function useCallback(create, deps) {
    return useCallbackImpl(create, deps);
}

var MemoComponent = miniCreateClass(function MemoComponent(obj) {
    this.render = obj.render;
    this.shouldComponentUpdate = obj.shouldComponentUpdate;
}, Component, {});
function memo(render, shouldComponentUpdate) {
    return function (props) {
        return createElement(MemoComponent, Object.assign(props, {
            render: render.bind(this, props),
            shouldComponentUpdate: shouldComponentUpdate
        }));
    };
}

var render$1 = Renderer$1.render;
var React = getWindow().React = {
    eventSystem: {
        dispatchEvent: dispatchEvent
    },
    findDOMNode: function findDOMNode() {
        console.log("小程序不支持findDOMNode");
    },
    version: "1.5.10",
    render: render$1,
    hydrate: render$1,
    Fragment: Fragment,
    PropTypes: PropTypes,
    createRef: createRef,
    Component: Component,
    createElement: createElement,
    createFactory: createFactory,
    memo: memo,
    PureComponent: PureComponent,
    isValidElement: isValidElement,
    createContext: createContext,
    toClass: miniCreateClass,
    registerComponent: registerComponent,
    getCurrentPage: getCurrentPage,
    getCurrentPages: getCurrentPages$1,
    getApp: _getApp,
    registerPage: registerPage,
    toStyle: toStyle,
    useState: useState,
    useReducer: useReducer,
    useCallback: useCallback,
    useMemo: useMemo,
    useEffect: useEffect,
    useContext: useContext,
    useComponent: useComponent,
    useRef: useRef,
    appType: "quick",
    registerApp: registerApp
};
if (typeof global !== "undefined") {
    var ref = Object.getPrototypeOf(global) || global;
    ref.ReactQuick = React;
}
registerAPIsQuick(React, facade, more);

export default React;
export { Children, createElement, Component, PureComponent, memo, useState, useReducer, useCallback, useMemo, useEffect, useContext, useComponent, useRef };
