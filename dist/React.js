/**
 * by 司徒正美 Copyright 2018-03-22
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
    }
}
function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
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
        elem.type = inputType;
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
var insertContainer = null;
var insertPoint = null;
function insertElement(fiber) {
    var p = fiber.return,
        dom = fiber.stateNode,
        parentNode = void 0;
    while (p) {
        if (p.tag === 5) {
            parentNode = p.stateNode;
            break;
        }
        p = p._return || p.return;
    }
    if (parentNode !== insertContainer) {
        insertContainer = parentNode;
        insertPoint = null;
    }
    var offset = insertPoint ? insertPoint.nextSibling : parentNode.firstChild;
    if (offset === dom) {
        return;
    }
    if (offset === null && dom === parentNode.lastChild) {
        return;
    }
    var isElement = fiber.tag === 5;
    var prevFocus = isElement && document.activeElement;
    insertContainer.insertBefore(dom, offset);
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
    "focus": "focus",
    "blur": "blur"
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
    var curry = Function("ReactComponent", "blacklist", "spec", "return function " + className + "(props, context) {\n      ReactComponent.call(this, props, context);\n\n     for (var methodName in this) {\n        var method = this[methodName];\n        if (typeof method  === \"function\"&& !blacklist[methodName]) {\n          this[methodName] = method.bind(this);\n        }\n      }\n\n      if (spec.getInitialState) {\n        var test = this.state = spec.getInitialState.call(this);\n        if(!(test === null || ({}).toString.call(test) == \"[object Object]\")){\n          throw \"getInitialState\u53EA\u80FD\u8FD4\u56DE\u7EAFJS\u5BF9\u8C61\u6216\u8005null\"\n        }\n      }\n  };");
    return curry(Component, NOBIND, spec);
}
function createClass(spec) {
    deprecatedWarn("createClass");
    if (!isFn(spec.render)) {
        throw "请实现render方法";
    }
    var Constructor = newCtor(spec.displayName || "Component", spec);
    var proto = inherit(Constructor, Component);
    if (spec.mixins) {
        applyMixins(spec, collectMixins(spec.mixins));
    }
    extend(proto, spec);
    if (spec.statics) {
        extend(Constructor, spec.statics);
    }
    "propTypes,contextTypes,childContextTypes,displayName".replace(/\w+/g, function (name) {
        if (spec[name]) {
            var props = Constructor[name] = spec[name];
            if (name !== "displayName") {
                for (var i in props) {
                    if (!isFn(props[i])) {
                        console.error(i + " in " + name + " must be a function");
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

function ComponentFiber(vnode) {
    extend(this, vnode);
    var type = vnode.type;
    this.name = type.displayName || type.name;
}
function createUpdater() {
    return {
        _mountOrder: Refs.mountOrder++,
        enqueueSetState: noop,
        _isMounted: returnFalse
    };
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

function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
function isValidElement(vnode) {
    return vnode && vnode.tag > 0 && vnode.tag !== 6;
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
var contextStack = [emptyObject];
var updateQueue = [];
var ENOUGH_TIME = 1;
function renderByAnu(vnode, root, _callback) {
    if (!(root && root.appendChild)) {
        throw "ReactDOM.render\u7684\u7B2C\u4E8C\u4E2A\u53C2\u6570\u9519\u8BEF";
    }
    var instance = void 0;
    var hostRoot = {
        stateNode: root,
        from: "root",
        tag: 5,
        type: root.tagName.toLowerCase(),
        props: Object.assign(getProps(root), {
            children: vnode
        }),
        effectTag: CALLBACK,
        alternate: root.__component,
        callback: function callback() {
            instance = hostRoot.child ? hostRoot.child.stateNode : null;
            _callback && _callback.call(instance);
        }
    };
    updateQueue.push(hostRoot);
    workLoop({
        timeRemaining: function timeRemaining() {
            return 2;
        }
    });
    return instance;
}
function getNextUnitOfWork() {
    var fiber = updateQueue.shift();
    if (!fiber) {
        return;
    }
    if (fiber.from == "root") {
        if (!fiber.stateNode.__component) {
            emptyElement(fiber.stateNode);
        }
        fiber.stateNode.__component = fiber;
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
    if (fiber.tag > 4) {
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
var MOUNT = 2;
var ATTR = 3;
var CONTENT = 5;
var NULLREF = 7;
var HOOK = 11;
var REF = 13;
var DELETE = 17;
var CALLBACK = 19;
var effectNames = [MOUNT, ATTR, CONTENT, NULLREF, HOOK, REF, DELETE, CALLBACK];
var effectLength = effectNames.length;
function commitWork(fiber) {
    var instance = fiber.stateNode;
    var amount = fiber.effectTag;
    for (var i = 0; i < effectLength; i++) {
        var effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        var remainder = amount / effectNo;
        if (remainder == ~~remainder) {
            amount = remainder;
            switch (effectNo) {
                case MOUNT:
                    if (fiber.tag > 3) {
                        insertElement(fiber);
                    }
                    break;
                case ATTR:
                    break;
                case DELETE:
                    if (fiber.tag > 3) {
                        removeElement(fiber.stateNode);
                    }
                    delete fiber.stateNode;
                    break;
                case HOOK:
                    if (fiber.disposed) {
                        captureError(instance, "componentWillUnmount", []);
                        instance.updater._isMounted = returnFalse;
                    } else {
                        if (instance.isMounted()) {
                            captureError(instance, "componentDidUpdate", []);
                        } else {
                            captureError(instance, "componentDidMount", []);
                            instance.updater._isMounted = returnTrue;
                        }
                    }
                    break;
                case CONTENT:
                    fiber.stateNode.nodeValue = fiber.props.children;
                    break;
                case REF:
                    Refs.fireRef(fiber, instance);
                    break;
                case NULLREF:
                    Refs.fireRef(fiber, null);
                    break;
                case CALLBACK:
                    fiber.callback.call(fiber.stateNode);
                    break;
            }
        }
    }
    fiber.effectTag = amount;
    fiber.effects = null;
}
function updateHostComponent(fiber) {
    if (!fiber.stateNode) {
        try {
            fiber.stateNode = createElement$1(fiber);
        } catch (e) {
            throw e;
        }
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
function get(key) {
    return key._reactInternalFiber;
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
    var nextState = partialState ? Object.assign({}, lastState, partialState) : lastState;
    if (instance.isMounted()) {
        var propsChange = lastProps !== nextProps;
        var willReceive = propsChange && instance.context !== nextContext;
        var updater = instance.updater;
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
        return;
    }
    var children = instance.render();
    diffChildren(fiber, children);
}
function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
function disposeFiber(fiber, effects) {
    if (fiber.ref) {
        fiber.effectTag *= NULLREF;
    }
    fiber.effectTag *= DELETE;
    fiber.disposed = true;
    if (fiber.tag < 3) {
        fiber.effectTag *= HOOK;
    }
    effects.push(fiber);
    for (var child = fiber.child; child; child = child.sibling) {
        disposeFiber(child, effects);
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
        disposeFiber(oldFiber, effects);
    }
    var prevFiber = void 0,
        index = 0;
    for (var _i in newFibers) {
        var _newFiber = newFibers[_i] = new ComponentFiber(newFibers[_i]);
        _newFiber.effectTag = WORKING;
        var _oldFiber = matchFibers[_i];
        if (_oldFiber) {
            _newFiber.effectTag *= MOUNT;
            if (isSameNode(_oldFiber, _newFiber)) {
                _newFiber.stateNode = _oldFiber.stateNode;
                _newFiber.alternate = _oldFiber;
            } else {
                disposeFiber(_oldFiber, effects);
            }
        } else {
            _newFiber.effectTag *= MOUNT;
        }
        _newFiber.index = index++;
        _newFiber.return = parentFiber;
        if (_newFiber.ref) {
            _newFiber.effectTag *= REF;
        }
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
function getDerivedStateFromProps(instance, type, props, state) {
    if (isFn(type.getDerivedStateFromProps)) {
        state = type.getDerivedStateFromProps.call(null, props, state);
        if (state != null) {
            instance.setState(state);
        }
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

var React = void 0;
if (win.React && win.React.options) {
    React = win.React;
} else {
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
        createFactory: function createFactory(type) {
            console.warn("createFactory is deprecated");
            var factory = createElement.bind(null, type);
            factory.type = type;
            return factory;
        }
    };
}
var React$1 = React;

return React$1;

})));
