/**
 * by 司徒正美 Copyright 2017-10-10
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

var innerHTML = "dangerouslySetInnerHTML";
var EMPTY_CHILDREN = [];

function deprecatedWarn(methodName) {
    if (!deprecatedWarn[methodName]) {
        //eslint-disable-next-line
        console.error(methodName + " is deprecated");
        deprecatedWarn[methodName] = 1;
    }
}
/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
function extend(obj, props) {
    if (props) {
        for (var i in props) {
            if (props.hasOwnProperty(i)) {
                obj[i] = props[i];
            }
        }
    }
    return obj;
}

var __type = Object.prototype.toString;

/**
 * 一个空函数
 *
 * @export
 */
function noop() {}

/**
 * 类继承
 *
 * @export
 * @param {any} SubClass
 * @param {any} SupClass
 */
function inherit(SubClass, SupClass) {
    function Bridge() {}
    Bridge.prototype = SupClass.prototype;

    var fn = SubClass.prototype = new Bridge();

    // 避免原型链拉长导致方法查找的性能开销
    extend(fn, SupClass.prototype);
    fn.constructor = SubClass;
    return fn;
}

/**
 * 收集一个元素的所有孩子
 *
 * @export
 * @param {any} dom
 * @returns
 */
function getNodes(dom) {
    var ret = [],
        c = dom.childNodes || [];
    // eslint-disable-next-line
    for (var i = 0, el; el = c[i++];) {
        ret.push(el);
    }
    return ret;
}

var lowerCache = {};
/**
 * 小写化的优化
 *
 * @export
 * @param {any} s
 * @returns
 */
function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}

function clearArray(a) {
    return a.splice(0, a.length);
}

/**
 *
 *
 * @param {any} obj
 * @returns
 */
function isFn(obj) {
    return typeNumber(obj) === 5;
}

var rword = /[^, ]+/g;

function oneObject(array, val) {
    if (typeNumber(array) === 4) {
        array = array.match(rword) || [];
    }
    var result = {},

    //eslint-disable-next-line
    value = val !== void 666 ? val : 1;
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
}

function getChildContext(instance, parentContext) {
    if (instance.getChildContext) {
        var context = instance.getChildContext();
        if (context) {
            parentContext = Object.assign({}, parentContext, context);
        }
    }
    return parentContext;
}

function getContextByTypes(curContext, contextTypes) {
    var context = {};
    if (!contextTypes || !curContext) {
        return context;
    }
    for (var key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = curContext[key];
        }
    }
    return context;
}

var rcamelize = /[-_][^-_]/g;
function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || target.indexOf("-") < 0 && target.indexOf("_") < 0) {
        return target;
    }
    //转换为驼峰风格
    var str = target.replace(rcamelize, function (match) {
        return match.charAt(1).toUpperCase();
    });
    return firstLetterLower(str);
}

function firstLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

var options = {
    beforeUnmount: noop,
    beforeRender: noop,
    beforePatch: noop,
    afterRender: noop,
    afterPatch: noop,
    afterMount: noop,
    afterUpdate: noop
};

var numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
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

var recyclables = {
    "#text": [],
    "#comment": []
};

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
function errRef() {
    throw "ref位置错误";
}
var pendingRefs = [];
var Refs = {
    currentOwner: null,
    clearRefs: function clearRefs() {
        var refs = pendingRefs.splice(0, pendingRefs.length);
        refs.forEach(function (fn) {
            fn();
        });
    },
    detachRef: function detachRef(ref, nextRef, dom) {
        ref = ref || getDOMNode;
        nextRef = nextRef || getDOMNode;
        if (ref === nextRef) {
            return;
        }
        if (ref) {
            if (ref.string && nextRef.string ? ref.string !== nextRef.string : ref !== getDOMNode) {
                ref(null);
            }
        }
        if (dom && nextRef !== getDOMNode) {
            nextRef(dom);
        }
    },
    createInstanceRef: function createInstanceRef(updater, ref) {
        updater._ref = function () {
            if (ref) {
                var inst = updater._instance;
                ref(inst.__isStateless ? null : inst);
            }
            updater._ref = getDOMNode;
        };
    },
    createStringRef: function createStringRef(owner, ref) {
        var stringRef = owner === null ? errRef : function (dom) {
            if (dom) {
                if (dom.nodeType) {
                    dom.getDOMNode = getDOMNode;
                }
                owner.refs[ref] = dom;
            } else {
                delete owner.refs[ref];
            }
        };
        stringRef.string = ref;
        return stringRef;
    }
};

var CurrentOwner = {
    cur: null
};
/**
 * 创建虚拟DOM
 *
 * @param {string} type
 * @param {object} props
 * @param {array} ...children
 * @returns
 */

function createElement(type, config) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    var props = {},
        checkProps = 0,
        vtype = 1,
        key = null,
        ref = null,
        argsLen = children.length;
    if (type && type.call) {
        vtype = type.prototype && type.prototype.render ? 2 : 4;
    } else if (type + "" !== type) {
        console.error("createElement第一个参数类型错误"); // eslint-disable-line
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
            } else if (i === "children") {
                props[i] = val;
            } else {
                checkProps = 1;
                props[i] = val;
            }
        }
    }

    if (argsLen === 1) {
        props.children = children[0];
        // : EMPTY_CHILDREN;
    } else if (argsLen > 1) {
        props.children = children;
    }

    var defaultProps = type.defaultProps;
    if (defaultProps) {
        for (var propName in defaultProps) {
            if (props[propName] === void 666) {
                checkProps = 1;
                props[propName] = defaultProps[propName];
            }
        }
    }
    return new Vnode(type, key, ref, props, vtype, checkProps);
}

function Vnode(type, key, ref, props, vtype, checkProps) {
    this.type = type;
    this.props = props;
    this.vtype = vtype;
    var owner = Refs.currentOwner;
    this._owner = owner;

    if (key) {
        this.key = key;
    }

    if (vtype === 1) {
        this.checkProps = checkProps;
    }
    var refType = typeNumber(ref);
    if (refType === 4 || refType === 3) {
        //string, number
        this.ref = Refs.createStringRef(owner, ref + "");
    } else if (refType === 5) {
        if (ref.string) {
            var ref2 = Refs.createStringRef(owner, ref.string);
            this.ref = function (dom) {
                ref(dom);
                ref2(dom);
            };
            this.ref.string = ref.string;
        } else {
            //function
            this.ref = ref;
        }
    }
    /*
      this._hostNode = null
      this._instance = null
    */
}

Vnode.prototype = {
    getDOMNode: function getDOMNode() {
        return this._hostNode || null;
    },

    $$typeof: 1
};

function flattenChildren(vnode) {
    var arr = EMPTY_CHILDREN,
        c = vnode.props.children;
    if (c !== null) {
        arr = _flattenChildren(c, true);
        if (arr.length === 0) {
            arr = EMPTY_CHILDREN;
        }
    }
    return vnode.vchildren = arr;
}

function _flattenChildren(original, convert) {
    var children = [],
        unidimensionalIndex = 0,
        lastText = void 0,
        child = void 0,
        isMap = convert === "",
        iteractorFn = void 0,
        temp = Array.isArray(original) ? original.slice(0) : [original];

    while (temp.length) {
        if ((child = temp.shift()) && (child.shift || (iteractorFn = getIteractor(child)))) {
            //比较巧妙地判定是否为子数组

            if (iteractorFn) {
                //兼容Immutable.js, Map, Set
                child = callIteractor(iteractorFn, child);
                iteractorFn = false;
                temp.unshift.apply(temp, child);
                continue;
            }
            if (isMap) {
                if (!child._prefix) {
                    child._prefix = "." + unidimensionalIndex;
                    unidimensionalIndex++; //维护第一层元素的索引值
                }
                for (var i = 0; i < child.length; i++) {
                    if (child[i]) {
                        child[i]._prefix = child._prefix + ":" + i;
                    }
                }
            }
            temp.unshift.apply(temp, child);
        } else {
            var childType = typeNumber(child);
            if (childType < 3) {
                // 0, 1, 2
                if (convert) {
                    continue;
                } else {
                    child = null;
                }
            } else if (childType < 6) {
                if (lastText && convert) {
                    //false模式下不进行合并与转换
                    lastText.text += child;
                    continue;
                }
                if (convert) {
                    child = {
                        type: "#text",
                        text: child + "",
                        vtype: 0
                    };
                    unidimensionalIndex++;
                }
                lastText = child;
            } else {
                if (isMap && !child._prefix) {
                    child._prefix = "." + unidimensionalIndex;
                    unidimensionalIndex++;
                }
                if (!child.type) {
                    throw Error("这不是一个虚拟DOM");
                }
                lastText = false;
            }

            children.push(child);
        }
    }
    return children;
}
var REAL_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
var FAKE_SYMBOL = "@@iterator";
function getIteractor(a) {
    if (typeNumber(a) > 7) {
        var iteratorFn = REAL_SYMBOL && a[REAL_SYMBOL] || a[FAKE_SYMBOL];
        if (iteratorFn && iteratorFn.call) {
            return iteratorFn;
        }
    }
}
function callIteractor(iteratorFn, children) {
    var iterator = iteratorFn.call(children),
        step,
        ret = [];
    if (iteratorFn !== children.entries) {
        while (!(step = iterator.next()).done) {
            ret.push(step.value);
        }
    } else {
        //Map, Set
        while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
                ret.push(entry[1]);
            }
        }
    }
    return ret;
}

function cloneElement(vnode, props) {
    if (!vnode.vtype) {
        return Object.assign({}, vnode);
    }
    var owner = vnode._owner,
        lastOwn = Refs.currentOwner,
        old = vnode.props,
        configs = {};
    if (props) {
        Object.assign(configs, old, props);
        configs.key = props.key !== void 666 ? props.key : vnode.key;
        if (props.ref !== void 666) {
            configs.ref = props.ref;
            owner = lastOwn;
        } else {
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
        args.push(configs.children);
    }
    var ret = createElement.apply(null, args);
    Refs.currentOwner = lastOwn;
    return ret;
}

var Children = {
    only: function only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if (Array.isArray(children)) {
            children = children[0];
        }
        if (children && children.vtype) {
            return children;
        }
        throw new Error("expect only one child");
    },
    count: function count(children) {
        if (children == null) {
            return 0;
        }
        return _flattenChildren(children, false).length;
    },
    map: function map(children, callback, context) {
        if (children === null || children === void 0) {
            return children;
        }

        var ret = [];
        _flattenChildren(children, "").forEach(function (old, index) {
            var el = callback.call(context, old, index);
            if (el === null) {
                return;
            }
            if (el.vtype) {
                //如果返回的el等于old,还需要使用原来的key, _prefix
                var key = computeKey(old, el, index);
                ret.push(cloneElement(el, { key: key }));
            } else if (el.type) {
                ret.push(Object.assign({}, el));
            } else {
                ret.push(el);
            }
        });
        return ret;
    },
    forEach: function forEach(children, callback, context) {
        if (children != null) {
            _flattenChildren(children, false).forEach(callback, context);
        }
    },


    toArray: function toArray(children) {
        if (children == null) {
            return [];
        }
        return Children.map(children, function (el) {
            return el;
        });
    }
};

function computeKey(old, el, index) {
    var curKey = el && el.key != null ? escapeKey(el.key) : null;
    var oldKey = old && old.key != null ? escapeKey(old.key) : null;
    var oldFix = old && old._prefix,
        key = void 0;
    if (oldKey && curKey) {
        key = oldFix + "$" + oldKey;
        if (oldKey !== curKey) {
            key = curKey + "/" + key;
        }
    } else {
        key = curKey || oldKey;
        if (key) {
            if (oldFix) {
                key = oldFix + "$" + key;
            }
        } else {
            key = oldFix || "." + index;
        }
    }
    return key.replace(/\d+\$/, "$");
}
function escapeKey(key) {
    return String(key).replace(/[=:]/g, escaperFn);
}
var escaperLookup = {
    "=": "=0",
    ":": "=2"
};
function escaperFn(match) {
    return escaperLookup[match];
}

//用于后端的元素节点
function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
}

var NAMESPACE = {
    svg: "http://www.w3.org/2000/svg",
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    math: "http://www.w3.org/1998/Math/MathML",
    xhtml: "http://www.w3.org/1999/xhtml",
    html: "https://www.w3.org/TR/html4/"
};

var fn = DOMElement.prototype = {
    contains: Boolean
};
String("replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute" + ",getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent" + ",detachEvent").replace(/\w+/g, function (name) {
    fn[name] = function () {
        console.log("fire " + name); // eslint-disable-line
    };
});

//用于后端的document
var fakeDoc = new DOMElement();
fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function (type) {
    return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement("html");
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
    var child;
    while (child = node.firstChild) {
        emptyElement(child);
        node.removeChild(child);
    }
}

function removeDOMElement(node) {
    if (node.nodeType === 1) {
        if (isStandard) {
            node.textContent = "";
        } else {
            emptyElement(node);
        }
        node.__events = null;
    } else if (node.nodeType === 3) {
        //只回收文本节点
        recyclables["#text"].push(node);
    }
    fragment.appendChild(node);
    fragment.removeChild(node);
}

var versions = {
    88: 7, //IE7-8 objectobject
    80: 6, //IE6 objectundefined
    "00": NaN, // other modern browsers
    "08": NaN
};
/* istanbul ignore next  */
var msie = document.documentMode || versions[typeNumber(document.all) + "" + typeNumber(XMLHttpRequest)];

var modern = /NaN|undefined/.test(msie) || msie > 8;

function createDOMElement(vnode, vparent) {
    var type = vnode.type;
    if (type === "#text") {
        //只重复利用文本节点
        var node = recyclables[type].pop();
        if (node) {
            node.nodeValue = vnode.text;
            return node;
        }
        return document.createTextNode(vnode.text);
    }

    if (type === "#comment") {
        return document.createComment(vnode.text);
    }

    var check = vparent || vnode;
    var ns = check.namespaceURI;
    if (type === "svg") {
        ns = NAMESPACE.svg;
    } else if (type === "math") {
        ns = NAMESPACE.math;
    } else if (check.type.toLowerCase() === "foreignobject" || !ns || ns === NAMESPACE.html || ns === NAMESPACE.xhtml) {
        return document.createElement(type);
    }
    try {
        vnode.namespaceURI = ns;
        return document.createElementNS(ns, type);
        //eslint-disable-next-line
    } catch (e) {
        return document.createElement(type);
    }
}

var globalEvents = {};
var eventPropHooks = {}; //用于在事件回调里对事件对象进行
var eventHooks = {}; //用于在元素上绑定特定的事件
//根据onXXX得到其全小写的事件名, onClick --> click, onClickCapture --> click,
// onMouseMove --> mousemove

var eventLowerCache = {
    onClick: "click",
    onChange: "change",
    onWheel: "wheel"
};
/**
 * 判定否为与事件相关
 *
 * @param {any} name
 * @returns
 */
function isEventName(name) {
    return (/^on[A-Z]/.test(name)
    );
}

var isTouch = "ontouchstart" in document;

function dispatchEvent(e, type, end) {
    //__type__ 在injectTapEventPlugin里用到
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
    options.async = true;
    triggerEventFlow(paths, captured, e);

    if (!e._stopPropagation) {
        triggerEventFlow(paths.reverse(), bubble, e);
    }
    options.async = false;
    options.flushUpdaters();
}

function collectPaths(from, end) {
    var paths = [];
    do {
        if (from === end) {
            break;
        }
        var events = from.__events;
        if (events) {
            paths.push({ dom: from, events: events });
        }
    } while ((from = from.parentNode) && from.nodeType === 1);
    // target --> parentNode --> body --> html
    return paths;
}

function triggerEventFlow(paths, prop, e) {
    for (var i = paths.length; i--;) {
        var path = paths[i];
        var fn = path.events[prop];
        if (isFn(fn)) {
            e.currentTarget = path.dom;
            fn.call(path.dom, e);
            if (e._stopPropagation) {
                break;
            }
        }
    }
}

function addGlobalEvent(name) {
    if (!globalEvents[name]) {
        globalEvents[name] = true;
        addEvent(document, name, dispatchEvent);
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

eventPropHooks.click = function (e) {
    return !e.target.disabled;
};

/* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
            firefox DOMMouseScroll detail 下3 上-3
            firefox wheel detlaY 下3 上-3
            IE9-11 wheel deltaY 下40 上-40
            chrome wheel deltaY 下100 上-100 */
/* istanbul ignore next  */
var fixWheelType = "onmousewheel" in document ? "mousewheel" : document.onwheel !== void 666 ? "wheel" : "DOMMouseScroll";
var fixWheelDelta = fixWheelType === "mousewheel" ? "wheelDetla" : fixWheelType === "wheel" ? "deltaY" : "detail";
eventHooks.wheel = function (dom) {
    addEvent(dom, fixWheelType, function (e) {
        var delta = e[fixWheelDelta] > 0 ? -120 : 120;
        var deltaY = ~~dom.__wheel + delta;
        dom.__wheel = deltaY;
        e = new SyntheticEvent(e);
        e.type = "wheel";
        e.deltaY = deltaY;
        dispatchEvent(e);
    });
};

var fixFocus = {};
"blur,focus".replace(/\w+/g, function (type) {
    eventHooks[type] = function () {
        if (!fixFocus[type]) {
            fixFocus[type] = true;
            addEvent(document, type, dispatchEvent, true);
        }
    };
});
/**
 * 
DOM通过event对象的relatedTarget属性提供了相关元素的信息。这个属性只对于mouseover和mouseout事件才包含值；
对于其他事件，这个属性的值是null。IE不支持realtedTarget属性，但提供了保存着同样信息的不同属性。
在mouseover事件触发时，IE的fromElement属性中保存了相关元素；
在mouseout事件出发时，IE的toElement属性中保存着相关元素。
但fromElement与toElement可能同时都有值
 */
function getRelatedTarget(e) {
    if (!e.timeStamp) {
        e.relatedTarget = e.type === "mouseover" ? e.fromElement : e.toElement;
    }
    return e.relatedTarget;
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

String("mouseenter,mouseleave").replace(/\w+/g, function (type) {
    eventHooks[type] = function (dom, name) {
        var mark = "__" + name;
        if (!dom[mark]) {
            dom[mark] = true;
            var mask = name === "mouseenter" ? "mouseover" : "mouseout";
            addEvent(dom, mask, function (e) {
                var t = getRelatedTarget(e);
                if (!t || t !== dom && !contains(dom, t)) {
                    var common = getLowestCommonAncestor(dom, t);
                    //由于不冒泡，因此paths长度为1 
                    dispatchEvent(e, name, common);
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

    // If A is deeper, crawl up.
    while (depthA - depthB > 0) {
        instA = instA.parentNode;
        depthA--;
    }

    // If B is deeper, crawl up.
    while (depthB - depthA > 0) {
        instB = instB.parentNode;
        depthB--;
    }

    // Walk in lockstep until we find a match.
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

if (isTouch) {
    eventHooks.click = noop;
    eventHooks.clickcapture = noop;
}

function createHandle(name, fn) {
    return function (e) {
        if (fn && fn(e) === false) {
            return;
        }
        dispatchEvent(e, name);
    };
}

var changeHandle = createHandle("change");
var doubleClickHandle = createHandle("doubleclick");

//react将text,textarea,password元素中的onChange事件当成onInput事件
eventHooks.changecapture = eventHooks.change = function (dom) {
    if (/text|password/.test(dom.type)) {
        addEvent(document, "input", changeHandle);
    }
};

eventHooks.doubleclick = eventHooks.doubleclickcapture = function () {
    addEvent(document, "dblclick", doubleClickHandle);
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
    fixEvent: function fixEvent() {}, //留给以后扩展用
    preventDefault: function preventDefault() {
        var e = this.nativeEvent || {};
        e.returnValue = this.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
        }
    },
    fixHooks: function fixHooks() {},
    stopPropagation: function stopPropagation() {
        var e = this.nativeEvent || {};
        e.cancelBubble = this._stopPropagation = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },
    persist: noop,
    stopImmediatePropagation: function stopImmediatePropagation() {
        this.stopPropagation();
        this.stopImmediate = true;
    },
    toString: function toString() {
        return "[object Event]";
    }
};
/* istanbul ignore next  */


var eventSystem = extend({
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
	SyntheticEvent: SyntheticEvent
});

//为了兼容yo
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

/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */
function Component(props, context) {
    //防止用户在构造器生成JSX
    CurrentOwner.cur = this;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null;
}

Component.prototype = {
    constructor: Component, //必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState: function replaceState() {
        deprecatedWarn("replaceState");
    },
    setState: function setState(state, cb) {
        debounceSetState(this.updater, state, cb);
    },
    isMounted: function isMounted() {
        deprecatedWarn("isMounted");
        return !!(this.updater || {})._hostNode;
    },
    forceUpdate: function forceUpdate(cb) {
        debounceSetState(this.updater, true, cb);
    },
    render: function render() {}
};

function debounceSetState(updater, state, cb) {
    if (!updater) {
        return;
    }
    if (updater._didUpdate) {
        //如果用户在componentDidUpdate中使用setState，要防止其卡死
        setTimeout(function () {
            updater._didUpdate = false;
            setStateImpl(updater, state, cb);
        }, 300);
        return;
    }
    setStateImpl(updater, state, cb);
}
function setStateImpl(updater, state, cb) {
    if (isFn(cb)) {
        updater._pendingCallbacks.push(cb);
    }
    var hasDOM = updater._hostNode;
    if (state === true) {
        //forceUpdate
        updater._forceUpdate = true;
    } else {
        //setState
        updater._pendingStates.push(state);
    }
    if (!hasDOM) {
        //组件挂载期
        //componentWillUpdate中的setState/forceUpdate应该被忽略
        if (updater._hydrating) {
            //在render方法中调用setState也会被延迟到下一周期更新.这存在两种情况，
            //1. 组件直接调用自己的setState
            //2. 子组件调用父组件的setState，
            updater._renderInNextCycle = true;
        }
    } else {
        //组件更新期
        if (updater._receiving) {
            //componentWillReceiveProps中的setState/forceUpdate应该被忽略
            return;
        }
        updater._renderInNextCycle = true;
        if (options.async) {
            //在事件句柄中执行setState会进行合并
            options.enqueueUpdater(updater);
            return;
        }
        if (updater._hydrating) {
            // 在componentDidMount里调用自己的setState，延迟到下一周期更新
            // 在更新过程中， 子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
            return;
        }
        //  不在生命周期钩子内执行setState
        options.flushUpdaters([updater]);
    }
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 为了兼容0.13之前的版本
 */
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
        // Merge objects
        hooks.unshift({});
        return Object.assign.apply(null, hooks);
    } else if (hookType === "function" && hooks.length > 1) {
        return function () {
            var ret = {},
                r = void 0,
                hasReturn = MANY_MERGED[key];
            for (var i = 0; i < hooks.length; i++) {
                r = hooks[i].apply(this, arguments);
                if (hasReturn && r) {
                    Object.assign(ret, r);
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

//创建一个构造器
function newCtor(className, spec) {
    var curry = Function("ReactComponent", "blacklist", "spec", "return function " + className + "(props, context) {\n      ReactComponent.call(this, props, context);\n\n     for (var methodName in this) {\n        var method = this[methodName];\n        if (typeof method  === \"function\"&& !blacklist[methodName]) {\n          this[methodName] = method.bind(this);\n        }\n      }\n\n      if (spec.getInitialState) {\n        var test = this.state = spec.getInitialState.call(this);\n        if(!(test === null || ({}).toString.call(test) == \"[object Object]\")){\n          throw \"getInitialState(): must return an object or null\"\n        }\n      }\n\n  };");
    return curry(Component, NOBIND, spec);
}

function createClass(spec) {
    deprecatedWarn("createClass");
    if (!isFn(spec.render)) {
        throw "请实现render方法";
    }
    var Constructor = newCtor(spec.displayName || "Component", spec);
    var proto = inherit(Constructor, Component);
    //如果mixins里面非常复杂，可能mixin还包含其他mixin
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
                        console.error(i + " in " + name + " must be a function"); // eslint-disable-line
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

var hasOwnProperty = Object.prototype.hasOwnProperty;
function shallowEqual(objA, objB) {
    if (Object.is(objA, objB)) {
        return true;
    }
    //确保objA, objB都是对象
    if (typeNumber(objA) < 7 || typeNumber(objB) < 7) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
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

var rnumber = /^-?\d+(\.\d+)?$/;
/**
     * 为元素样子设置样式
     * 
     * @export
     * @param {any} dom 
     * @param {any} oldStyle 
     * @param {any} newStyle 
     */
function patchStyle(dom, oldStyle, newStyle) {
    if (oldStyle === newStyle) {
        return;
    }

    for (var name in newStyle) {
        var val = newStyle[name];
        if (oldStyle[name] !== val) {
            name = cssName(name, dom);
            if (val !== 0 && !val) {
                val = ""; //清除样式
            } else if (rnumber.test(val) && !cssNumber[name]) {
                val = val + "px"; //添加单位
            }
            try {
                //node.style.width = NaN;node.style.width = 'xxxxxxx';
                //node.style.width = undefine 在旧式IE下会抛异常
                dom.style[name] = val; //应用样式
            } catch (e) {
                console.log("dom.style[" + name + "] = " + val + "throw error"); // eslint-disable-line
            }
        }
    }
    // 如果旧样式存在，但新样式已经去掉
    for (var _name in oldStyle) {
        if (!(_name in newStyle)) {
            _name = cssName(_name, dom);
            dom.style[_name] = ""; //清除样式
        }
    }
}

var cssNumber = oneObject("animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom");

//var testStyle = document.documentElement.style
var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"];
var cssMap = oneObject("float", "cssFloat");

/**
 * 转换成当前浏览器可用的样式名
 * 
 * @param {any} name 
 * @returns 
 */
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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//布尔属性的值末必为true,false
//https://github.com/facebook/react/issues/10589
var controlled = {
    value: 1,
    defaultValue: 1
};

var isSpecialAttr = {
    style: 1,
    children: 1,
    innerHTML: 1,
    dangerouslySetInnerHTML: 1
};

var emptyStyle = {};
var svgCache = {};
var strategyCache = {};
/**
 * 仅匹配 svg 属性名中的第一个驼峰处，如 viewBox 中的 wB，
 * 数字表示该特征在属性列表中重复的次数
 * -1 表示用 ":" 隔开的属性 (xlink:href, xlink:title 等)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
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

// SVG 属性列表中驼峰命名和短横线分隔命名特征值有重复
// 列出了重复特征中的短横线命名的属性名
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

// 重复属性名的特征值列表
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

/**
 *
 * 修改dom的属性与事件
 * @export
 * @param {any} nextProps
 * @param {any} lastProps
 * @param {any} vnode
 * @param {any} lastVnode
 */
function diffProps(nextProps, lastProps, vnode, lastVnode, dom) {
    var isSVG = vnode.namespaceURI === NAMESPACE.svg;
    var tag = vnode.type;
    //eslint-disable-next-line
    for (var name in nextProps) {
        var val = nextProps[name];
        if (val !== lastProps[name]) {
            var which = tag + isSVG + name;
            var action = strategyCache[which];
            if (!action) {
                action = strategyCache[which] = getPropAction(dom, name, isSVG);
            }
            actionStrategy[action](dom, name, val, lastProps);
        }
    }
    //如果旧属性在新属性对象不存在，那么移除DOM eslint-disable-next-line
    for (var _name in lastProps) {
        if (!nextProps.hasOwnProperty(_name)) {
            var _which = tag + isSVG + _name;
            var _action = strategyCache[_which];
            actionStrategy[_action](dom, _name, false, lastProps);
        }
    }
}

function isBooleanAttr(dom, name) {
    var val = dom[name];
    return val === true || val === false;
}
/**
 * 根据一个属性所在的元素或元素的文档类型，就可以永久决定该使用什么策略操作它
 * 
 * @param {any} dom 元素节点
 * @param {any} name 属性名
 * @param {any} isSVG 
 * @returns 
 */
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
    if (isBooleanAttr(dom, name)) {
        return "booleanAttr";
    }

    return name.indexOf("data-") === 0 || dom[name] === void 666 ? "attribute" : "property";
}

var actionStrategy = {
    innerHTML: noop,
    children: noop,
    style: function style(dom, _, val, lastProps) {
        patchStyle(dom, lastProps.style || emptyStyle, val || emptyStyle);
    },
    svgClass: function svgClass(dom, name, val) {
        if (!val) {
            dom.removeAttribute("class");
        } else {
            dom.setAttribute("class", val);
        }
    },
    svgAttr: function svgAttr(dom, name, val) {
        // http://www.w3school.com.cn/xlink/xlink_reference.asp
        // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enh
        // a ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
        // xlinkTitle, xlinkType eslint-disable-next-line
        var method = typeNumber(val) < 3 && !val ? "removeAttribute" : "setAttribute";
        var nameRes = getSVGAttributeName(name);
        if (nameRes.ifSpecial) {
            var prefix = nameRes.name.split(":")[0];
            // 将xlinkHref 转换为 xlink:href
            dom[method + "NS"](NAMESPACE[prefix], nameRes.name, val || "");
        } else {
            dom[method](nameRes, val || "");
        }
    },
    booleanAttr: function booleanAttr(dom, name, val) {
        // 布尔属性必须使用el.xxx = true|false方式设值 如果为false, IE全系列下相当于setAttribute(xxx,""),
        // 会影响到样式,需要进一步处理 eslint-disable-next-line
        dom[name] = !!val;
        if (dom[name] === false) {
            dom.removeAttribute(name);
        } else if (dom[name] === "false") {
            //字符串属性会将它转换为false
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
            console.warn("setAttribute error", name, val); // eslint-disable-line
        }
    },
    property: function property(dom, name, val) {
        if (name !== "value" || dom[name] !== val) {
            // 尝试直接赋值，部分情况下会失败，如给 input 元素的 size 属性赋值 0 或字符串
            // 这时如果用 setAttribute 则会静默失败
            try {
                if (!val && val !== 0) {
                    //如果它是字符串属性，并且不等于""，清空
                    if (typeNumber(dom[name]) === 4 && dom[name] !== "") {
                        dom[name] = "";
                    }
                    dom.removeAttribute(name);
                } else {
                    dom[name] = val;
                }
            } catch (e) {
                dom.setAttribute(name, val);
            }
            if (controlled[name]) {
                dom._lastValue = val;
            }
        }
    },
    event: function event(dom, name, val, lastProps) {
        var events = dom.__events || (dom.__events = {});
        var refName = toLowerCase(name.slice(2));
        if (val === false) {
            delete events[refName];
        } else {
            if (!lastProps[name]) {
                //添加全局监听事件
                var eventName = getBrowserName(name);
                var hook = eventHooks[eventName];
                addGlobalEvent(eventName);
                if (hook) {
                    hook(dom, eventName);
                }
            }
            //onClick --> click, onClickCapture --> clickcapture
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

var mountOrder = 1;
function alwaysNull() {
    return null;
}
var updateChains = {};
function Updater(instance, vnode) {
    vnode._instance = instance;
    instance.updater = this;
    this._mountOrder = mountOrder++;
    this._mountIndex = this._mountOrder;
    this._instance = instance;
    this._pendingCallbacks = [];
    this._ref = noop;
    this._didHook = noop;
    this._pendingStates = [];
    this._lifeStage = 0; //判断生命周期
    //update总是保存最新的数据，如state, props, context, parentContext, vparent
    this.vnode = vnode;
    //  this._hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    //  this._renderInNextCycle = true 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
    if (instance.__isStateless) {
        this.mergeStates = alwaysNull;
    }
}

Updater.prototype = {
    mergeStates: function mergeStates() {
        var instance = this._instance,
            pendings = this._pendingStates,
            state = instance.state,
            n = pendings.length;
        if (n === 0) {
            return state;
        }
        var nextState = Object.assign({}, state); //每次都返回新的state
        for (var i = 0; i < n; i++) {
            var pending = pendings[i];
            if (pending && pending.call) {
                pending = pending.call(instance, nextState, this.props);
            }
            Object.assign(nextState, pending);
        }
        pendings.length = 0;
        return nextState;
    },
    renderComponent: function renderComponent(cb, rendered) {
        var vnode = this.vnode,
            parentContext = this.parentContext,
            instance = this._instance;
        //调整全局的 CurrentOwner.cur

        if (!rendered) {
            var lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            try {
                if (this.willReceive === false) {
                    rendered = this.rendered;
                    delete this.willReceive;
                } else {
                    rendered = instance.render();
                }
            } finally {
                Refs.currentOwner = lastOwn;
            }
        }

        //组件只能返回组件或null
        if (rendered === null || rendered === false) {
            rendered = { type: "#comment", text: "empty", vtype: 0 };
        } else if (!rendered || !rendered.type) {
            //true, undefined, array, {}
            throw new Error("@" + vnode.type.name + "#render:You may have returned undefined, an array or some other invalid object");
        }
        this.lastRendered = this.rendered;
        this.rendered = rendered;
        var childContext = rendered.vtype ? getChildContext(instance, parentContext) : parentContext;
        var dom = cb(rendered, this.vparent, childContext);
        if (!dom) {
            throw ["必须返回节点", rendered];
        }
        var list = updateChains[this._mountOrder];
        if (!list) {
            list = updateChains[this._mountOrder] = [this];
        }
        list.forEach(function (el) {
            el.vnode._hostNode = el._hostNode = dom;
        });
        return dom;
    }
};

function instantiateComponent(type, vnode, props, context) {
    var isStateless = vnode.vtype === 4;
    var instance = isStateless ? {
        refs: {},
        render: function render() {
            return type(this.props, this.context);
        }
    } : new type(props, context);
    var updater = new Updater(instance, vnode, props, context);
    //props, context是不可变的
    instance.props = updater.props = props;
    instance.context = updater.context = context;
    instance.constructor = type;
    updater.displayName = type.displayName || type.name;

    if (isStateless) {
        var lastOwn = Refs.currentOwner;
        Refs.currentOwner = instance;
        try {
            var mixin = instance.render();
        } finally {
            Refs.currentOwner = lastOwn;
        }
        if (mixin && mixin.render) {
            //支持module pattern component
            Object.assign(instance, mixin);
        } else {
            instance.__isStateless = true;
            updater.rendered = mixin;
        }
    }

    return instance;
}

function disposeVnode(vnode) {
    if (!vnode || vnode._disposed) {
        return;
    }
    disposeStrategy[vnode.vtype](vnode);
    vnode._disposed = true;
}
var disposeStrategy = {
    0: noop,
    1: disposeElement,
    2: disposeComponent,
    4: disposeStateless
};
function disposeStateless(vnode) {
    var instance = vnode._instance;
    if (instance) {
        disposeVnode(instance.updater.rendered);
        vnode._instance = null;
    }
}

function disposeElement(vnode) {
    var props = vnode.props,
        vchildren = vnode.vchildren;

    if (vnode.ref) {
        vnode.ref(null);
        delete vnode.ref;
    }
    if (props[innerHTML]) {
        removeDOMElement(vnode._hostNode);
    } else {
        for (var i = 0, n = vchildren.length; i < n; i++) {
            disposeVnode(vchildren[i]);
        }
    }
}

function disposeComponent(vnode) {
    var instance = vnode._instance;
    if (instance) {
        options.beforeUnmount(instance);
        instance.setState = instance.forceUpdate = noop;
        if (vnode.ref) {
            vnode.ref(null);
        }
        if (instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
        var updater = instance.updater,
            order = updater._mountOrder,
            updaters = updateChains[order];
        updaters.splice(updaters.indexOf(updater), 1);
        if (!updaters.length) {
            delete updateChains[order];
        }
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        disposeVnode(updater.rendered);
        updater._renderInNextCycle = vnode._instance = instance.updater = null;
    }
}

/**
 input, select, textarea这几个元素如果指定了value/checked的**状态属性**，就会包装成受控组件或非受控组件
 受控组件是指，用户除了为它指定**状态属性**，还为它指定了onChange/onInput/disabled等用于控制此状态属性
 变动的属性
 反之，它就是非受控组件，非受控组件会在框架内部添加一些事件，阻止**状态属性**被用户的行为改变，只能被setState改变
 */
function processFormElement(vnode, dom, props) {
    var domType = dom.type;
    var duplexType = duplexMap[domType];
    if (duplexType) {
        var data = duplexData[duplexType];
        var duplexProp = data[0];
        var keys = data[1];
        var eventName = data[2];
        if (duplexProp in props && !hasOtherControllProperty(props, keys)) {
            // eslint-disable-next-line
            console.warn("\u4F60\u4E3A" + vnode.type + "[type=" + domType + "]\u5143\u7D20\u6307\u5B9A\u4E86" + duplexProp + "\u5C5E\u6027\uFF0C\n      \u4F46\u662F\u6CA1\u6709\u63D0\u4F9B\u53E6\u5916\u7684" + Object.keys(keys) + "\u6765\u63A7\u5236" + duplexProp + "\u5C5E\u6027\u7684\u53D8\u5316\n      \u90A3\u4E48\u5B83\u5373\u4E3A\u4E00\u4E2A\u975E\u53D7\u63A7\u7EC4\u4EF6\uFF0C\u7528\u6237\u65E0\u6CD5\u901A\u8FC7\u8F93\u5165\u6539\u53D8\u5143\u7D20\u7684" + duplexProp + "\u503C");
            dom[eventName] = data[3];
        }
        if (duplexType === 3) {
            postUpdateSelectedOptions(vnode);
        }
    }
}

function hasOtherControllProperty(props, keys) {
    for (var key in props) {
        if (keys[key]) {
            return true;
        }
    }
}
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

function preventUserInput(e) {
    var target = e.target;
    var name = e.type === "textarea" ? "innerHTML" : "value";
    target[name] = target._lastValue;
}

function preventUserClick(e) {
    e.preventDefault();
}

function preventUserChange(e) {
    var target = e.target;
    var value = target._lastValue;
    var options$$1 = target.options;
    if (target.multiple) {

        updateOptionsMore(options$$1, options$$1.length, value);
    } else {
        updateOptionsOne(options$$1, options$$1.length, value);
    }
}

var duplexData = {
    1: ["value", {
        onChange: 1,
        onInput: 1,
        readOnly: 1,
        disabled: 1
    }, "oninput", preventUserInput],
    2: ["checked", {
        onChange: 1,
        onClick: 1,
        readOnly: 1,
        disabled: 1
    }, "onclick", preventUserClick],
    3: ["value", {
        onChange: 1,
        disabled: 1
    }, "onchange", preventUserChange]
};

function postUpdateSelectedOptions(vnode) {
    var props = vnode.props,
        multiple = !!props.multiple,
        value = typeNumber(props.value) > 1 ? props.value : typeNumber(props.defaultValue) > 1 ? props.defaultValue : multiple ? [] : "",
        options$$1 = [];
    collectOptions(vnode, options$$1);
    if (multiple) {
        updateOptionsMore(options$$1, options$$1.length, value);
    } else {
        updateOptionsOne(options$$1, options$$1.length, value);
    }
}

/**
 * 收集虚拟DOM select下面的options元素，如果是真实DOM直接用select.options
 *
 * @param {VNode} vnode
 * @param {Array} ret
 */
function collectOptions(vnode, ret) {
    var arr = vnode.vchildren; //option.children不一定存在
    for (var i = 0, n = arr.length; i < n; i++) {
        var el = arr[i];
        if (el.type === "option") {
            ret.push(el);
        } else if (el.type === "optgroup") {
            collectOptions(el, ret);
        }
    }
}

function updateOptionsOne(options$$1, n, propValue) {
    var selectedValue = "" + propValue;
    for (var i = 0; i < n; i++) {
        var option = options$$1[i];
        var value = getOptionValue(option, option.props);
        if (value === selectedValue) {
            getOptionSelected(option, true);
            return;
        }
    }
    if (n) {
        getOptionSelected(options$$1[0], true);
    }
}

function updateOptionsMore(options$$1, n, propValue) {
    var selectedValue = {};
    try {
        for (var i = 0; i < propValue.length; i++) {
            selectedValue["&" + propValue[i]] = true;
        }
    } catch (e) {
        /* istanbul ignore next */
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组'); // eslint-disable-line
    }
    for (var _i = 0; _i < n; _i++) {
        var option = options$$1[_i];
        var value = getOptionValue(option, option.props);
        var selected = selectedValue.hasOwnProperty("&" + value);
        getOptionSelected(option, selected);
    }
}

function getOptionValue(option, props) {
    if (!props) {
        return getDOMOptionValue(option);
    }
    //这里在1.1.1改动过， props.value === undefined ? props.children[0].text : props.value;
    return props.value === undefined ? props.children : props.value;
}

function getDOMOptionValue(node) {
    if (node.hasAttribute && node.hasAttribute("value")) {
        return node.getAttribute("value");
    }
    var attr = node.getAttributeNode("value");
    if (attr && attr.specified) {
        return attr.value;
    }
    return node.innerHTML.trim();
}

function getOptionSelected(option, selected) {
    var dom = option._hostNode || option;
    dom.selected = selected;
}

function drainQueue(queue) {
    options.beforePatch();
    //先执行所有refs方法（从上到下）
    Refs.clearRefs(); //假如一个组件实例也没有，也要把所有元素虚拟DOM的ref执行

    var i = 0;
    while (i < queue.length) {
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        var updater = queue[i];
        i++;
        Refs.clearRefs();
        updater._didUpdate = updater._lifeStage === 2;
        updater._didHook(); //执行所有mount/update钩子（从下到上）
        updater._lifeStage = 1;
        updater._hydrating = false;
        if (!updater._renderInNextCycle) {
            updater._didUpdate = false;
        }
        updater._ref(); //执行组件虚拟DOM的ref
        //如果组件在componentDidMount中调用setState
        if (updater._renderInNextCycle) {
            options.refreshComponent(updater, queue);
        }
    }
    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    queue.sort(mountSorter).forEach(function (updater) {
        clearArray(updater._pendingCallbacks).forEach(function (fn) {
            fn.call(updater._instance);
        });
    });
    queue.length = 0;
    options.afterPatch();
}

var dirtyComponents = [];
function mountSorter(u1, u2) {
    //按文档顺序执行
    return u1._mountIndex - u2._mountIndex;
}

options.flushUpdaters = function (queue) {
    if (!queue) {
        queue = dirtyComponents;
        if (queue.length) {
            queue.sort(mountSorter);
        }
    }
    drainQueue(queue);
};

options.enqueueUpdater = function (updater) {
    if (dirtyComponents.indexOf(updater) == -1) {
        dirtyComponents.push(updater);
    }
};

//[Top API] React.isValidElement
function isValidElement(vnode) {
    return vnode && vnode.vtype;
}
//[Top API] ReactDOM.render
function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
//[Top API] ReactDOM.unstable_renderSubtreeIntoContainer
function unstable_renderSubtreeIntoContainer(lastVnode, nextVnode, container, callback) {
    deprecatedWarn("unstable_renderSubtreeIntoContainer");
    var parentContext = lastVnode && lastVnode.context || {};
    return renderByAnu(nextVnode, container, callback, parentContext);
}
//[Top API] ReactDOM.unmountComponentAtNode
function unmountComponentAtNode(container) {
    var lastVnode = container.__component;
    if (lastVnode) {
        disposeVnode(lastVnode);
        emptyElement(container);
        container.__component = null;
    }
}
//[Top API] ReactDOM.findDOMNode
function findDOMNode(ref) {
    if (ref == null) {
        return null;
    }
    if (ref.nodeType === 1) {
        return ref;
    }

    return ref.updater ? ref.updater._hostNode : ref._hostNode || null;
}
//[Top API] ReactDOM.createPortal
function createPortal(children, container) {
    if (!container.vchildren) {
        container.vchildren = [];
    }
    diffChildren(getVParent(container), children, container, {}, []);
    return null;
}
// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中
function getVParent(container) {
    return {
        type: container.nodeName,
        namespaceURI: container.namespaceURI
    };
}

// ReactDOM.render的内部实现
function renderByAnu(vnode, container, callback) {
    var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (!isValidElement(vnode)) {
        throw "ReactDOM.render\u7684\u7B2C\u4E00\u4E2A\u53C2\u6570\u9519\u8BEF"; // eslint-disable-line
    }
    if (!(container && container.getElementsByTagName)) {
        throw "ReactDOM.render\u7684\u7B2C\u4E8C\u4E2A\u53C2\u6570\u9519\u8BEF"; // eslint-disable-line
    }
    var updateQueue = [],
        rootNode = void 0,
        lastVnode = container.__component;
    if (lastVnode) {
        rootNode = alignVnode(lastVnode, vnode, getVParent(container), context, updateQueue);
    } else {
        updateQueue.isMainProcess = true;
        //如果是后端渲染生成，它的孩子中存在一个拥有data-reactroot属性的元素节点
        rootNode = genVnodes(container, vnode, context, updateQueue);
    }

    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container.__component = vnode;
    drainQueue(updateQueue);
    Refs.currentOwner = null; //防止干扰
    var ret = instance || rootNode;
    if (callback) {
        callback.call(ret); //坑
    }
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return ret;
}

function genVnodes(container, vnode, context, updateQueue) {
    var nodes = getNodes(container);
    var lastNode = null;
    for (var i = 0, el; el = nodes[i++];) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            lastNode = el;
        } else {
            container.removeChild(el);
        }
    }
    return container.appendChild(mountVnode(lastNode, vnode, getVParent(container), context, updateQueue));
}

var patchStrategy = {
    0: mountText,
    1: mountElement,
    2: mountComponent,
    4: mountComponent,
    10: updateText,
    11: updateElement,
    12: updateComponent,
    14: updateComponent
};
//mountVnode只是转换虚拟DOM为真实DOM，不做插入DOM树操作
function mountVnode(lastNode, vnode) {
    return patchStrategy[vnode.vtype].apply(null, arguments);
}

function updateVnode(lastVnode) {
    return patchStrategy[lastVnode.vtype + 10].apply(null, arguments);
}

function mountText(lastNode, vnode) {
    if (!lastNode || lastNode.nodeName !== vnode.type) {
        lastNode = createDOMElement(vnode);
    }
    vnode._hostNode = lastNode;
    return lastNode;
}

function updateText(lastVnode, nextVnode) {
    var dom = lastVnode._hostNode;
    nextVnode._hostNode = dom;
    if (lastVnode.text !== nextVnode.text) {
        dom.nodeValue = nextVnode.text;
    }
    return dom;
}

function genMountElement(lastNode, vnode, vparent, type) {
    if (lastNode && toLowerCase(lastNode.nodeName) === type) {
        return lastNode;
    } else {
        var dom = createDOMElement(vnode, vparent);
        if (lastNode) {
            while (lastNode.firstChild) {
                dom.appendChild(lastNode.firstChild);
            }
        }
        return dom;
    }
}

var formElements = {
    select: 1,
    textarea: 1,
    input: 1
};

function mountElement(lastNode, vnode, vparent, context, updateQueue) {
    var type = vnode.type,
        props = vnode.props,
        ref = vnode.ref;

    var dom = genMountElement(lastNode, vnode, vparent, type);
    vnode._hostNode = dom;
    var children = flattenChildren(vnode);
    var method = lastNode ? alignChildren : mountChildren;
    method(dom, children, vnode, context, updateQueue);
    if (vnode.checkProps && dom) {
        diffProps(props, {}, vnode, {}, dom);
    }
    if (ref) {
        pendingRefs.push(ref.bind(true, dom));
    }
    if (formElements[type]) {
        processFormElement(vnode, dom, props);
    }

    return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(parentNode, children, vparent, context, updateQueue) {
    parentNode.vchildren = children;
    for (var i = 0, n = children.length; i < n; i++) {
        var vnode = children[i];
        parentNode.appendChild(mountVnode(null, vnode, vparent, context, updateQueue));
    }
}

function alignChildren(parentNode, children, vparent, context, updateQueue) {
    var childNodes = parentNode.childNodes,
        insertPoint = childNodes[0] || null,
        j = 0,
        n = children.length;
    parentNode.vchildren = children;
    for (var i = 0; i < n; i++) {
        var vnode = children[i];
        var lastNode = childNodes[j];
        var dom = mountVnode(lastNode, vnode, vparent, context, updateQueue);
        if (dom === lastNode) {
            j++;
        }
        parentNode.insertBefore(dom, insertPoint);
        insertPoint = dom.nextSibling;
    }
    while (childNodes[n]) {
        parentNode.removeChild(childNodes[n]);
    }
}

function mountComponent(lastNode, vnode, vparent, parentContext, updateQueue, parentUpdater) {
    var type = vnode.type,
        props = vnode.props,
        ref = vnode.ref;

    var context = getContextByTypes(parentContext, type.contextTypes);
    var instance = instantiateComponent(type, vnode, props, context); //互相持有引用
    var updater = instance.updater;
    if (parentUpdater) {
        updater._mountOrder = parentUpdater._mountOrder;
    } else {
        updateChains[updater._mountOrder] = [];
    }
    updateChains[updater._mountOrder].push(updater);
    updater.vparent = vparent;
    updater.parentContext = parentContext;
    if (instance.componentWillMount) {
        instance.componentWillMount(); //这里可能执行了setState
        instance.state = updater.mergeStates();
    }

    updater._hydrating = true;
    var dom = updater.renderComponent(function (nextRendered, vparent, childContext) {
        return mountVnode(lastNode, nextRendered, vparent, childContext, updateQueue, updater //作为parentUpater往下传
        );
    }, updater.rendered);
    Refs.createInstanceRef(updater, ref);
    var userHook = instance.componentDidMount;
    updater._didHook = function () {
        userHook && userHook.call(instance);
        updater._didHook = noop;
        options.afterMount(instance);
    };
    updateQueue.push(updater);

    return dom;
}

function updateComponent(lastVnode, nextVnode, vparent, parentContext, updateQueue) {
    var type = lastVnode.type,
        ref = lastVnode.ref,
        instance = lastVnode._instance;

    var nextContext = void 0,
        nextProps = nextVnode.props,
        updater = instance.updater;
    if (type.contextTypes) {
        nextContext = getContextByTypes(parentContext, type.contextTypes);
    } else {
        nextContext = instance.context; //没有定义contextTypes就沿用旧的
    }
    var willReceive = lastVnode !== nextVnode || updater.context !== nextContext;
    updater.willReceive = willReceive;
    //如果context与props都没有改变，那么就不会触发组件的receive，render，update等一系列钩子
    //但还会继续向下比较
    if (willReceive && instance.componentWillReceiveProps) {
        updater._receiving = true;
        instance.componentWillReceiveProps(nextProps, nextContext);
        updater._receiving = false;
    }
    if (!instance.__isStateless) {
        var nextRef = nextVnode.ref;
        ref && Refs.detachRef(ref, nextRef);
        Refs.createInstanceRef(updater, nextRef);
    }

    //updater上总是保持新的数据
    updater.vnode = nextVnode;
    updater.context = nextContext;
    updater.props = nextProps;
    updater.vparent = vparent;
    updater.parentContext = parentContext;
    // nextVnode._instance = instance; //不能放这里
    if (!willReceive) {
        return updater.renderComponent(function (nextRendered, vparent, childContext) {
            return alignVnode(updater.rendered, nextRendered, vparent, childContext, updateQueue, updater);
        });
    }
    refreshComponent(updater, updateQueue);
    //子组件先执行
    updateQueue.push(updater);
    return updater._hostNode;
}

function refreshComponent(updater, updateQueue) {
    var instance = updater._instance,
        dom = updater._hostNode,
        nextContext = updater.context,
        nextProps = updater.props,
        vnode = updater.vnode;


    vnode._instance = instance; //放这里
    updater._renderInNextCycle = null;

    var nextState = updater.mergeStates();
    var shouldUpdate = true;
    if (!updater._forceUpdate && instance.shouldComponentUpdate && !instance.shouldComponentUpdate(nextProps, nextState, nextContext)) {
        shouldUpdate = false;
    } else if (instance.componentWillUpdate) {
        instance.componentWillUpdate(nextProps, nextState, nextContext);
    }
    var lastProps = instance.props,
        lastContext = instance.context,
        lastState = instance.state;


    updater._forceUpdate = false;
    instance.state = nextState; //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
    instance.context = nextContext;
    if (!shouldUpdate) {
        updateQueue.push(updater);
        return dom;
    }
    instance.props = nextProps;
    updater._hydrating = true;
    var lastRendered = updater.rendered;

    dom = updater.renderComponent(function (nextRendered, vparent, childContext) {
        return alignVnode(lastRendered, nextRendered, vparent, childContext, updateQueue, updater);
    });

    updater._lifeStage = 2;
    var userHook = instance.componentDidUpdate;

    updater._didHook = function () {
        userHook && userHook.call(instance, lastProps, lastState, lastContext);
        updater._didHook = noop;
        options.afterUpdate(instance);
    };

    updateQueue.push(updater);
    return dom;
}
options.refreshComponent = refreshComponent;

function alignVnode(lastVnode, nextVnode, vparent, context, updateQueue, parentUpdater) {
    var dom = void 0;
    if (isSameNode(lastVnode, nextVnode)) {
        dom = updateVnode(lastVnode, nextVnode, vparent, context, updateQueue);
    } else {
        disposeVnode(lastVnode);
        var node = lastVnode._hostNode,
            parent = node.parentNode,
            next = node.nextSibling;
        removeDOMElement(node);
        dom = mountVnode(null, nextVnode, vparent, context, updateQueue, parentUpdater);
        parent.insertBefore(dom, next);
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, vparent, context, updateQueue) {
    var lastProps = lastVnode.props,
        dom = lastVnode._hostNode,
        ref = lastVnode.ref,
        checkProps = lastVnode.checkProps;
    var nextProps = nextVnode.props,
        nextRef = nextVnode.ref;

    nextVnode._hostNode = dom;
    if (nextProps[innerHTML]) {
        var list = lastVnode.vchildren || [];
        list.forEach(function (el) {
            disposeVnode(el);
        });
        list.length = 0;
    } else {
        if (lastProps[innerHTML]) {
            dom.vchildren = [];
        }
        if (dom) {
            diffChildren(lastVnode, flattenChildren(nextVnode), dom, context, updateQueue);
        }
    }

    if ((checkProps || nextVnode.checkProps) && dom) {
        diffProps(nextProps, lastProps, nextVnode, lastVnode, dom);
    }
    if (nextVnode.type === "select") {
        postUpdateSelectedOptions(nextVnode);
    }
    Refs.detachRef(ref, nextRef, dom);
    return dom;
}

function diffDomText(pastDom, dom, insertPoint) {
    var dText = dom.innerText.trim();
    var iText = insertPoint.innerText.trim();
    var isTrue = false;

    pastDom.forEach(function (v) {
        if (v.innerText === dText || dText === iText) {
            isTrue = !isTrue;
            return false;
        }
    });
    return isTrue;
}

function diffChildren(lastVnode, nextChildren, parentNode, context, updateQueue) {
    var insertDom = function insertDom(dom) {
        return parentNode.insertBefore(dom, insertPoint);
    };
    var lastChildren = parentNode.vchildren,
        nextLength = nextChildren.length,
        lastLength = lastChildren.length,
        isTrue = false,
        pastDom = [],
        dom = void 0;

    //如果旧数组长度为零, 直接添加
    if (nextLength && !lastLength) {
        emptyElement(parentNode);
        return mountChildren(parentNode, nextChildren, lastVnode, context, updateQueue);
    }
    if (nextLength === lastLength && lastLength === 1) {
        if (parentNode.firstChild) {
            lastChildren[0]._hostNode = parentNode.firstChild;
        }
        return alignVnode(lastChildren[0], nextChildren[0], lastVnode, context, updateQueue);
    }
    var maxLength = Math.max(nextLength, lastLength),
        insertPoint = parentNode.firstChild,
        removeHits = {},
        fuzzyHits = {},
        actions = [],
        i = 0,
        hit = void 0,
        nextChild = void 0,
        lastChild = void 0;
    //第一次循环，构建移动指令（actions）与移除名单(removeHits)与命中名单（fuzzyHits）
    if (nextLength) {
        actions.length = nextLength;
        while (i < maxLength) {
            nextChild = nextChildren[i];
            lastChild = lastChildren[i];
            if (nextChild && lastChild && isSameNode(lastChild, nextChild)) {
                //  如果能直接找到，命名90％的情况
                actions[i] = [lastChild, nextChild];
                removeHits[i] = true;
            } else {
                if (nextChild) {
                    hit = nextChild.type + (nextChild.key || "");
                    if (fuzzyHits[hit] && fuzzyHits[hit].length) {
                        var oldChild = fuzzyHits[hit].shift();
                        // 如果命中旧的节点，将旧的节点移动新节点的位置，向后移动
                        actions[i] = [oldChild, nextChild, "moveAfter"];
                        removeHits[oldChild._i] = true;
                    }
                }
                if (lastChild) {
                    //如果没有命中或多了出来，那么放到命中名单中，留给第二轮循环使用
                    lastChild._i = i;
                    hit = lastChild.type + (lastChild.key || "");
                    var hits = fuzzyHits[hit];
                    if (hits) {
                        hits.push(lastChild);
                    } else {
                        fuzzyHits[hit] = [lastChild];
                    }
                }
            }
            i++;
        }
    }
    for (var j = 0, n = actions.length; j < n; j++) {
        var action = actions[j];
        if (!action) {
            nextChild = nextChildren[j];
            hit = nextChild.type + (nextChild.key || "");
            if (fuzzyHits[hit] && fuzzyHits[hit].length) {
                lastChild = fuzzyHits[hit].shift();
                action = [lastChild, nextChild, "moveAfter"];
            }
        }
        if (action) {
            lastChild = action[0];
            nextChild = action[1];
            dom = lastChild._hostNode;

            if (action[2]) {
                // 如果有旧DOM记录
                if (pastDom.length && insertPoint.innerText && dom.innerText) {
                    isTrue = diffDomText(pastDom, dom, insertPoint);
                    if (!isTrue) {
                        insertDom(dom);
                        isTrue = false;
                    }
                    // 没有旧DOM记录 (这里代码不能合并)
                } else {
                    insertDom(dom);
                }
            }
            insertPoint = updateVnode(lastChild, nextChild, lastVnode, context, updateQueue);
            if (!nextChild._hostNode) {
                nextChildren[j] = lastChild;
            }
            removeHits[lastChild._i] = true;
        } else {
            //为了兼容 react stack reconciliation的执行顺序，添加下面三行，
            //在插入节点前，将原位置上节点对应的组件先移除
            var removed = lastChildren[j];
            if (removed && !removed._disposed && !removeHits[j]) {
                disposeVnode(removed);
            }

            //如果找不到对应的旧节点，创建一个新节点放在这里
            dom = mountVnode(null, nextChild, lastVnode, context, updateQueue);
            pastDom.push(dom);
            parentNode.insertBefore(dom, insertPoint);
            insertPoint = dom;
        }
        insertPoint = insertPoint.nextSibling;
    }

    parentNode.vchildren = nextChildren;

    //移除
    lastChildren.forEach(function (el, i) {
        if (!removeHits[i]) {
            var node = el._hostNode;
            if (node) {
                removeDOMElement(node);
            }
            disposeVnode(el);
        }
    });
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

var React = {
    version: "1.1.3",
    render: render,
    options: options,
    PropTypes: PropTypes,
    Children: Children, //为了react-redux
    createPortal: createPortal,
    Component: Component,
    eventSystem: eventSystem,
    findDOMNode: findDOMNode,
    createClass: createClass,
    createElement: createElement,
    cloneElement: cloneElement,
    PureComponent: PureComponent,
    isValidElement: isValidElement,
    unmountComponentAtNode: unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
    createFactory: function createFactory(type) {
        console.warn("createFactory将被废弃"); // eslint-disable-line
        var factory = createElement.bind(null, type);
        factory.type = type;
        return factory;
    }
};

win.React = win.ReactDOM = React;

return React;

})));
