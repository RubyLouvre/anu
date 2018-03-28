/**
 * by 司徒正美 Copyright 2018-03-28
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

function DOMElement(type) {
	this.nodeName = type;
	this.style = {};
	this.children = [];
}
var NAMESPACE = {
	svg: 'http://www.w3.org/2000/svg',
	xmlns: 'http://www.w3.org/2000/xmlns/',
	xlink: 'http://www.w3.org/1999/xlink',
	math: 'http://www.w3.org/1998/Math/MathML'
};
var fn = DOMElement.prototype = {
	contains: Boolean
};
String('replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute' + ',getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent' + ',detachEvent').replace(/\w+/g, function (name) {
	fn[name] = function () {
		console.log('fire ' + name);
	};
});
var fakeDoc = new DOMElement();
fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function (type) {
	return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement('html');
fakeDoc.body = new DOMElement('body');
fakeDoc.nodeName = '#document';
fakeDoc.textContent = '';
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
	'datetime-local': 1,
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
	'select-one': 3,
	'select-multiple': 3
};
var isStandard = 'textContent' in document;
var fragment = document.createDocumentFragment();
function emptyElement(node) {
	var child = void 0;
	while (child = node.firstChild) {
		emptyElement(child);
		if (child === Flutter.focusNode) {
			Flutter.focusNode = false;
		}
		node.removeChild(child);
	}
}
var recyclables = {
	'#text': []
};
function removeElement(node) {
	if (!node) {
		return;
	}
	if (node.nodeType === 1) {
		if (isStandard) {
			node.textContent = '';
		} else {
			emptyElement(node);
		}
		node.__events = null;
	} else if (node.nodeType === 3) {
		if (recyclables['#text'].length < 100) {
			recyclables['#text'].push(node);
		}
	}
	if (node === Flutter.focusNode) {
		Flutter.focusNode = false;
	}
	fragment.appendChild(node);
	fragment.removeChild(node);
}
var versions = {
	88: 7,
	80: 6,
	'00': NaN,
	'08': NaN
};
var msie = document.documentMode || versions[typeNumber(document.all) + '' + typeNumber(win$1.XMLHttpRequest)];
var modern = /NaN|undefined/.test(msie) || msie > 8;
function createElement$1(vnode) {
	var p = vnode.return;
	var type = vnode.type,
	    props = vnode.props,
	    ns = vnode.namespaceURI,
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
		case 'div':
		case 'span':
		case 'p':
		case 'tr':
		case 'td':
		case 'li':
			ns = '';
			break;
		default:
			if (!ns) {
				do {
					if (p.tag === 5) {
						ns = p.namespaceURI;
						if (p.type === 'foreignObject') {
							ns = '';
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
function insertElement(fiber) {
	var p = fiber.return,
	    dom = fiber.stateNode,
	    parentNode = fiber.parent,
	    before = fiber.mountPoint;
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
			Flutter.focusNode = prevFocus;
			prevFocus.__inner__ = true;
			prevFocus.focus();
		} catch (e) {
			prevFocus.__inner__ = false;
		}
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
function mountSorter(u1, u2) {
    return u1.mountOrder - u2.mountOrder;
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
    var fibers = Flutter.interactQueue || (Flutter.interactQueue = []);
    triggerEventFlow(paths, captured, e);
    if (!e._stopPropagation) {
        triggerEventFlow(paths.reverse(), bubble, e);
    }
    fibers.sort(mountSorter);
    __push.apply(Flutter.mainThread, fibers);
    Flutter.interactQueue = null;
    Flutter.batchedUpdates();
    Flutter.controlledCbs.forEach(function (el) {
        if (el.stateNode) {
            el.controlledCb({
                target: el.stateNode
            });
        }
    });
    Flutter.controlledCbs.length = 0;
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
    if (!isFocus && Flutter.focusNode === dom) {
        Flutter.focusNode = null;
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
    if (fiber.tag == 5 && !fiber.root) {
        fiber.effectTag *= ATTR;
    }
    if (fiber.parent) {
        var b = fiber.parent.beforeNode;
        fiber.mountPoint = b;
        fiber.parent.beforeNode = fiber.stateNode;
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
    }
    var _instance = instance,
        lastProps = _instance.props,
        lastState = _instance.state;
    var shouldUpdate = true;
    var updater = instance.updater;
    var propsChange = lastProps !== nextProps;
    var stateNoChange = !nextState;
    fiber.lastProps = lastProps;
    fiber.lastState = lastState;
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
        if (!shouldUpdate) {
            fiber.effectTag *= NOUPDATE;
            cloneChildren(fiber);
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
function diffChildren(parentFiber, children) {
    var prev = parentFiber.alternate;
    var oldFibers = prev ? prev._children : {};
    var newFibers = fiberizeChildren(children, parentFiber);
    var effects = parentFiber.effects || (parentFiber.effects = []);
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
        _newFiber.effectTag = WORKING;
        _newFiber.parent = parent;
        var _oldFiber = matchFibers[_i];
        if (_oldFiber) {
            if (isSameNode(_oldFiber, _newFiber)) {
                _newFiber.stateNode = _oldFiber.stateNode;
                _newFiber.alternate = _oldFiber;
                if (_oldFiber.ref && _oldFiber.ref !== _newFiber.ref) {
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
        if (hasEffect && remainder == ~~remainder) {
            Flutter.insertElement(fiber);
            fiber.effectTag = remainder;
        }
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
                    delete fiber.beforeNode;
                    Flutter.updateAttribute(fiber);
                    break;
                case DETACH:
                    if (fiber.tag > 3) {
                        Flutter.removeElement(fiber);
                    }
                    break;
                case HOOK:
                    delete fiber.beforeNode;
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
function unstable_renderSubtreeIntoContainer(instance, vnode, container, callback) {
    deprecatedWarn("unstable_renderSubtreeIntoContainer");
    return Flutter.render(vnode, container, callback);
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
    if (fiber.child && fiber.effectTag !== NOUPDATE) {
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
        if (!fiber.effectTag) {
            console.log("它为null");
        }
        if (!this._hooking) {
            updateQueue$2.push(fiber);
            Flutter.scheduleWork();
        }
    }
};

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
            Flutter.controlledCbs.push(vnode);
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
        options$$1 = target.options;
    if (target.multiple) {
        updateOptionsMore(options$$1, options$$1.length, value);
    } else {
        updateOptionsOne(options$$1, options$$1.length, value);
    }
    target._setSelected = true;
}
function updateOptionsOne(options$$1, n, propValue) {
    var stringValues = {},
        noDisableds = [];
    for (var i = 0; i < n; i++) {
        var option = options$$1[i];
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
function updateOptionsMore(options$$1, n, propValue) {
    var selectedValue = {};
    try {
        for (var i = 0; i < propValue.length; i++) {
            selectedValue["&" + propValue[i]] = true;
        }
    } catch (e) {
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组');
    }
    for (var _i = 0; _i < n; _i++) {
        var option = options$$1[_i];
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

var DOMRenderer = {
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
    updateRoot: function updateRoot(vnode, root) {
        if (!(root && root.appendChild)) {
            throw "ReactDOM.render\u7684\u7B2C\u4E8C\u4E2A\u53C2\u6570\u9519\u8BEF";
        }
        var hostRoot = {
            stateNode: root,
            root: true,
            tag: 5,
            type: root.tagName.toLowerCase(),
            props: {
                children: vnode
            },
            namespaceURI: root.namespaceURI,
            alternate: get(root)
        };
        if (topNodes.indexOf(root) == -1) {
            topNodes.push(root);
            topFibers.push(hostRoot);
        }
        return hostRoot;
    },
    createElement: createElement$1,
    insertElement: insertElement,
    emptyElement: function emptyElement$$1(fiber) {
        emptyElement(fiber.stateNode);
    },
    removeElement: function removeElement$$1(fiber) {
        var instance = fiber.stateNode;
        removeElement(instance);
        var j = topNodes.indexOf(instance);
        if (j !== -1) {
            topFibers.splice(j, 1);
            topNodes.splice(j, 1);
        }
    }
};

var win = getWindow();
var prevReact = win.React;
var React = void 0;
if (prevReact && prevReact.options) {
    React = prevReact;
} else {
    createRenderer(DOMRenderer);
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
