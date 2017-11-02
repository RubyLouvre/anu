/**
 * IE6+，有问题请加QQ 370262116 by 司徒正美 Copyright 2017-11-02
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7;
var innerHTML = "dangerouslySetInnerHTML";
var emptyArray = [];
var emptyObject = {};
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
    for (var i in props) {
        if (props.hasOwnProperty(i)) {
            obj[i] = props[i];
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

var lowerCache = {};
function toLowerCase(s) {
    return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
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
        //利用字符串的特征进行优化，字符串加上一个空字符串等于自身
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
    dirtyComponents: [],
    queue: [],
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

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
var pendingRefs = [];
window.pendingRefs = pendingRefs;
var Refs = {
    currentOwner: null,
    clearElementRefs: function clearElementRefs() {
        var callback = Refs.fireRef;
        var refs = clearArray(pendingRefs);
        for (var i = 0, n = refs.length; i < n; i += 2) {
            var vnode = refs[i];
            var data = refs[i + 1];
            callback(vnode, data);
        }
    },
    detachRef: function detachRef(lastVnode, nextVnode, dom) {
        if (lastVnode.ref === nextVnode.ref) {
            return;
        }
        if (lastVnode._hasRef) {
            pendingRefs.push(lastVnode, null);
            delete lastVnode._hasRef;
        }

        if (nextVnode._hasRef && dom) {
            pendingRefs.push(nextVnode, dom);
        }
    },
    fireRef: function fireRef(vnode, dom) {
        var ref = vnode.ref;
        if (typeof ref === "function") {
            return ref(dom);
        }
        var owner = vnode._owner;
        if (!owner) {
            throw "ref位置错误";
        }
        if (dom) {
            if (dom.nodeType) {
                dom.getDOMNode = getDOMNode;
            }
            owner.refs[ref] = dom;
        } else {
            delete owner.refs[ref];
        }
    }
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
    this._owner = Refs.currentOwner;

    if (key) {
        this.key = key;
    }

    if (vtype === 1) {
        this.checkProps = checkProps;
    }

    var refType = typeNumber(ref);
    if (refType === 3 || refType === 4 || refType === 5) {
        //number, string, function
        this._hasRef = true;

        this.ref = ref;
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

    $$typeof: REACT_ELEMENT_TYPE
};

function flattenChildren(vnode) {
    var arr = emptyArray,
        c = vnode.props.children;
    if (c !== null) {
        arr = _flattenChildren(c, true);
        if (arr.length === 0) {
            arr = emptyArray;
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
                        $$typeof: REACT_ELEMENT_TYPE,
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
        return extend({}, vnode);
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
        args.push(configs.children);
    }
    var ret = createElement.apply(null, args);
    Refs.currentOwner = lastOwn;
    return ret;
}

var Children = {
    only: function only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
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
        if (children == null) {
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
                ret.push(extend({}, el));
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

    aa: _flattenChildren,
    toArray: function toArray(children) {
        if (children == null) {
            return [];
        }
        return Children.map(children, function (el) {
            return el;
        });
    }
};
var rthimNumer = /\d+\$/;
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
    return key.replace(rthimNumer, "$");
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
// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中
function createVnode(container) {
    var ns = container.namespaceURI;
    var type = container.nodeName;
    if (!ns || NAMESPACE.xhtml) {
        ns = NAMESPACE.xhtml;
        type = type.toLowerCase();
    }
    return {
        vtype: container.nodeType === 1 ? 1 : 0,
        _hostNode: container,
        type: type,
        namespaceURI: ns
    };
}
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

var recyclables = {
    "#text": []
};

function removeElement(node) {
    if (node.nodeType === 1) {
        if (isStandard) {
            node.textContent = "";
        } else {
            emptyElement(node);
        }
        node.__events = null;
    } else if (node.nodeType === 3) {
        //只回收文本节点
        if (recyclables["#text"].length < 100) {
            recyclables["#text"].push(node);
        }
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
function insertElement(container, target, insertPoint) {
    if (insertPoint) {
        container.insertBefore(target, insertPoint);
    } else {
        container.appendChild(target);
    }
}
function createElement$1(vnode, vparent) {
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

var dirtyMap = {};
var currentQueue = [];
var dirtyComponents = [];
var mainQueue = [currentQueue];
function mountSorter(u1, u2) {
    //按文档顺序执行
    return u1.host._mountOrder - u2.host._mountOrder;
}

function flushUpdaters() {
    var first = mainQueue.shift(); //dirtyComponent必须移除
    if (first && first.length) {
        dirtyMap = {};
        currentQueue = clearArray(first).sort(mountSorter);
        mainQueue.unshift(currentQueue);
        drainQueue();
    }
    if (!mainQueue.length) {
        mainQueue.push(currentQueue);
    }
    currentQueue = mainQueue[0];
}

function switchUpdaters() {
    if (currentQueue !== dirtyComponents) {
        currentQueue = dirtyComponents;
        mainQueue.unshift(currentQueue);
    }
}

function enqueueUpdater(updater) {
    if (!dirtyMap[updater._mountOrder]) {
        dirtyMap[updater._mountOrder] = 1;
        updater._dirty = true;
        dirtyComponents.push({
            host: updater,
            exec: updater.onUpdate
        });
    }
}

function enqueueQueue(job) {
    currentQueue.push(job);
}

function spwanChildQueue(cb) {
    if (currentQueue.length) {
        currentQueue = [];
        mainQueue.unshift(currentQueue);
    }

    cb(currentQueue);
    if (currentQueue.length) {
        drainQueue();
    } else if (mainQueue.length > 1) {
        mainQueue.shift();
    }
    currentQueue = mainQueue[0];
}
function drainQueue() {
    var queue = mainQueue[0];
    //如果父元素拥有多个子组件，如果第一个组件在mounted/updated钩子里再次更新父元素，
    //那么mainQueue可能没有子数组了，需要置换queue为currentQueue，执行里面的mounted/updated钩子
    if (!queue && currentQueue.length) {
        queue = currentQueue;
    }
    options.beforePatch();
    //先执行所有元素虚拟DOMrefs方法（从上到下）
    Refs.clearElementRefs();
    var needSort = [],
        unique = {},
        job = void 0,
        updater = void 0;

    while (job = queue.shift()) {
        updater = job.host;
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }

        if (!unique[updater._mountOrder]) {
            unique[updater._mountOrder] = 1;
            needSort.push(job);
        }
        // currentQueue = queue;    
        // var command = job.exec === updater.onUpdate ? "update" : job.exec === updater.onEnd ? "end" : "receive";
        // console.log(updater.name, command,updater._hookName );

        job.exec.call(updater);
    }

    if (mainQueue.length > 1) {
        mainQueue.shift();
    }
    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    needSort.sort(mountSorter).forEach(function (job) {
        var updater = job.host;
        clearArray(updater._pendingCallbacks).forEach(function (fn) {
            fn.call(updater._instance);
        });
    });
    options.afterPatch();
    showError();
}
//mainQueue就是传送带，currentQueue或其他queue就是托运箱，job就是要加工的材料，exec是决定如何加工。
//在diffChildren有需要立即解决的任务，先进先出

var errIntance;
var errObject;
var errMethod;
var catchHook = "componentDidCatch";
function captureError(instance, hook, args) {
    try {
        var fn = instance[hook];
        if (fn) {
            return fn.apply(instance, args);
        }
        return true;
    } catch (e) {
        if (!errIntance) {
            errIntance = instance;
            errMethod = hook;
            errObject = e;
        }
    }
}
function showError() {
    if (errIntance) {
        var instance = errIntance;
        errIntance = null;
        var names = [errMethod + " in "];
        do {
            names.push(instance.updater.name);
            if (instance[catchHook]) {
                return instance[catchHook](errObject, {
                    componentStack: names.join(" create By  ")
                });
            }
        } while (instance = instance.updater.vnode._owner);
        throw errObject;
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

    switchUpdaters();

    triggerEventFlow(paths, captured, e);

    if (!e._stopPropagation) {
        triggerEventFlow(paths.reverse(), bubble, e);
    }
    options.async = false;
    flushUpdaters();
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
    Refs.currentOwner = this;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null;
}
var fakeObject = {
    enqueueSetState: noop
};
Component.prototype = {
    constructor: Component, //必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState: function replaceState() {
        deprecatedWarn("replaceState");
    },
    isMounted: function isMounted() {
        deprecatedWarn("isMounted");
        return !!(this.updater || fakeObject)._hostNode;
    },
    setState: function setState(state, cb) {
        (this.updater || fakeObject).enqueueSetState(state, cb);
    },
    forceUpdate: function forceUpdate(cb) {
        (this.updater || fakeObject).enqueueSetState(true, cb);
    },
    render: function render() {}
};

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

/**
 input, select, textarea这几个元素如果指定了value/checked的**状态属性**，就会包装成受控组件或非受控组件
 受控组件是指，用户除了为它指定**状态属性**，还为它指定了onChange/onInput/disabled等用于控制此状态属性
 变动的属性
 反之，它就是非受控组件，非受控组件会在框架内部添加一些事件，阻止**状态属性**被用户的行为改变，只能被setState改变
 */
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
            postUpdateSelectedOptions(vnode, dom);
        }
    } else {
        dom.duplexValue = props.value === undefined ? typeNumber(props.children) > 4 ? dom.text : props.children : props.value;
    }
}

function hasOtherControllProperty(props, keys) {
    for (var key in props) {
        if (keys[key]) {
            return true;
        }
    }
}

function preventUserInput(e) {
    var target = e.target;
    var name = e.type === "textarea" ? "innerHTML" : "value";
    target[name] = target._lastValue;
}

function preventUserClick(e) {
    e.preventDefault();
}

function preventUserChange(e) {
    var target = e.target,
        value = target._lastValue,
        options$$1 = target.options;
    if (target.multiple) {
        updateOptionsMore(options$$1, options$$1.length, value);
    } else {
        updateOptionsOne(options$$1, options$$1.length, value);
    }
}

function postUpdateSelectedOptions(vnode, target) {
    var props = vnode.props,
        multiple = !!props.multiple;
    target._lastValue = typeNumber(props.value) > 1 ? props.value : typeNumber(props.defaultValue) > 1 ? props.defaultValue : multiple ? [] : "";
    preventUserChange({
        target: target
    });
}

function updateOptionsOne(options$$1, n, propValue) {
    var stringValues = {};
    for (var i = 0; i < n; i++) {
        var option = options$$1[i];
        var value = option.duplexValue;
        if (value === propValue) {
            //精确匹配
            return setOptionSelected(option, true);
        }
        stringValues[value] = option;
    }
    var match = stringValues[propValue];
    if (match) {
        //字符串模糊匹配
        return setOptionSelected(match, true);
    }
    if (n) {
        //选中第一个
        setOptionSelected(options$$1[0], true);
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
        var value = option.duplexValue;
        var selected = selectedValue.hasOwnProperty("&" + value);
        setOptionSelected(option, selected);
    }
}

function setOptionSelected(dom, selected) {
    dom.selected = selected;
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function alwaysNull() {
    return null;
}
var mountOrder = 1;

/**
 * 为了防止污染用户的实例，需要将操作组件虚拟DOM与生命周期钩子的逻辑全部抽象到这个类中
 * 
 * @export
 * @param {any} instance 
 * @param {any} vnode 
 */
function Updater(instance, vnode) {
    vnode._instance = instance;
    instance.updater = this;
    this._mountOrder = mountOrder++;
    this._instance = instance;
    this._pendingCallbacks = [];
    this._didHook = noop;
    this._pendingStates = [];
    this._hookName = "componentDidMount";
    //update总是保存最新的数据，如state, props, context, parentContext, parentVnode
    this.vnode = vnode;
    //  this._hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    //  this._renderInNextCycle = true 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
    if (instance.__isStateless) {
        this.mergeStates = alwaysNull;
    }
}

Updater.prototype = {
    enqueueSetState: function enqueueSetState(state, cb) {
        if (isFn(cb)) {
            this._pendingCallbacks.push(cb);
        }
        if (state === true) {
            //forceUpdate
            this._forceUpdate = true;
        } else {
            //setState
            this._pendingStates.push(state);
        }
        if (options.async) {
            //在事件句柄中执行setState会进行合并
            enqueueUpdater(this);
            return;
        }

        if (this._hookName === "componentDidMount") {
            //组件挂载期
            //componentWillUpdate中的setState/forceUpdate应该被忽略
            if (this._hydrating) {
                //在render方法中调用setState也会被延迟到下一周期更新.这存在两种情况，
                //1. 组件直接调用自己的setState
                //2. 子组件调用父组件的setState，
                this._renderInNextCycle = true;
            }
        } else {
            //组件更新期
            if (this._receiving) {
                //componentWillReceiveProps中的setState/forceUpdate应该被忽略
                return;
            }
            if (this._hydrating) {
                //在componentDidMount方法里面可能执行多次setState方法，来引发update，但我们只需要一次update
                this._renderInNextCycle = true;
                // 在componentDidMount里调用自己的setState，延迟到下一周期更新
                // 在更新过程中， 子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
                return;
            }
            var u = this;
            spwanChildQueue(function (queue) {
                queue.push({
                    host: u,
                    exec: u.onUpdate
                });
            });
        }
    },
    mergeStates: function mergeStates() {
        var instance = this._instance,
            pendings = this._pendingStates,
            state = instance.state,
            n = pendings.length;
        if (n === 0) {
            return state;
        }
        var nextState = extend({}, state); //每次都返回新的state
        for (var i = 0; i < n; i++) {
            var pending = pendings[i];
            if (pending && pending.call) {
                pending = pending.call(instance, nextState, this.props);
            }
            extend(nextState, pending);
        }
        pendings.length = 0;
        return nextState;
    },
    onUpdate: function onUpdate() {
        var instance = this._instance,
            dom = this._hostNode,
            context = this.context,
            props = this.props,
            vnode = this.vnode;


        if (this.inReceiveStage) {
            var _inReceiveStage = _slicedToArray(this.inReceiveStage, 3),
                lastVnode = _inReceiveStage[0],
                nextVnode = _inReceiveStage[1],
                nextContext = _inReceiveStage[2];

            delete this.inReceiveStage;
            nextVnode._hostNode = dom;
            nextVnode._instance = instance;
            //如果context与props都没有改变，那么就不会触发组件的receive，render，update等一系列钩子
            //但还会继续向下比较
            this._receiving = true;
            captureError(instance, "componentWillReceiveProps", [this.props, nextContext]);
            this._receiving = false;
            Refs.detachRef(lastVnode, nextVnode);
        }

        Refs.clearElementRefs();
        var state = this.mergeStates();
        var shouldUpdate = true;
        if (!this._forceUpdate && !captureError(instance, "shouldComponentUpdate", [props, state, context])) {
            shouldUpdate = false;
            if (this.nextVnode) {
                this.vnode = this.nextVnode;
                delete this.nextVnode;
            }
        } else {
            var lastProps = instance.props,
                lastContext = instance.context,
                lastState = instance.state;

            captureError(instance, "componentWillUpdate", [props, state, context]);
        }
        vnode._instance = instance;
        this._forceUpdate = false;
        //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
        instance.props = props;
        instance.state = state;
        instance.context = context;
        var updater = this;
        enqueueQueue({
            host: this,
            exec: this.onEnd
        });
        if (shouldUpdate) {
            this._hydrating = true;
            updater.oldDatas = [lastProps, lastState, lastContext];
            updater._hookName = "componentDidUpdate";
            spwanChildQueue(function () {
                dom = updater.renderComponent(updater.rendered);
            });
        }

        return dom;
    },


    onEnd: function onEnd() {
        Refs.clearElementRefs();
        var instance = this._instance;
        var vnode = this.vnode;
        //执行componentDidMount/Update钩子
        captureError(instance, this._hookName, this.oldDatas);
        if (this._dirty) {
            delete this._dirty;
        }

        this.oldDatas = emptyArray;
        //执行React Chrome DevTools的钩子
        if (this._hookName === "componentDidMount") {
            options.afterMount(instance);
        } else {
            options.afterUpdate(instance);
        }
        delete this._hookName;
        this._hydrating = false;
        //执行组件虚拟DOM的ref回调
        if (vnode._hasRef) {
            Refs.fireRef(vnode, instance.__isStateless ? null : instance);
        }
        //如果在componentDidMount/Update钩子里执行了setState，那么再次渲染此组件
        if (this._renderInNextCycle) {
            delete this._renderInNextCycle;
            enqueueQueue({
                host: this,
                exec: this.onUpdate
            });
        }
    },
    renderComponent: function renderComponent(node) {
        var vnode = this.vnode,
            parentContext = this.parentContext,
            instance = this._instance;
        //调整全局的 CurrentOwner.cur

        var rendered = void 0;

        if (this.willReceive === false) {
            rendered = this.rendered;
            delete this.willReceive;
        } else {
            var lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            rendered = captureError(instance, "render", []);
            Refs.currentOwner = lastOwn;
        }

        //组件只能返回组件或null
        if (rendered === null || rendered === false) {
            rendered = { type: "#comment", text: "empty", vtype: 0, $$typeof: REACT_ELEMENT_TYPE };
        } else if (!rendered || !rendered.type) {
            //true, undefined, array, {}
            throw new Error("@" + vnode.type.name + "#render:You may have returned undefined, an array or some other invalid object");
        }

        var childContext = rendered.vtype ? getChildContext(instance, parentContext) : parentContext;
        var dom = options.alignVnode(node, rendered, this.parentVnode, childContext, this);
        if (rendered._hostNode) {
            this.rendered = rendered;
        }
        var u = this;
        do {
            if (u.nextVnode) {
                u.vnode = u.nextVnode;
                delete u.nextVnode;
            }
            u.vnode._hostNode = u._hostNode = dom;
        } while (u = u.parentUpdater);

        return dom;
    }
};

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

function instantiateComponent(type, vnode, props, parentContext) {
    var context = getContextByTypes(parentContext, type.contextTypes);
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
    updater.name = type.displayName || type.name;

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
            extend(instance, mixin);
        } else {
            instance.__isStateless = true;
            updater.rendered = mixin;
            updater.willReceive = false;
        }
    }

    return instance;
}

var rnumber = /^-?\d+(\.\d+)?$/;
/**
     * 为元素样子设置样式
     * 
     * @export
     * @param {any} dom 
     * @param {any} lastStyle 
     * @param {any} nextStyle 
     */
function patchStyle(dom, lastStyle, nextStyle) {
    if (lastStyle === nextStyle) {
        return;
    }

    for (var name in nextStyle) {
        var val = nextStyle[name];
        if (lastStyle[name] !== val) {
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
    for (var _name in lastStyle) {
        if (!(_name in nextStyle)) {
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

function diffProps(dom, lastProps, nextProps, vnode) {
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
var builtinStringProps = {
    className: 1,
    title: 1,
    name: 1,
    alt: 1,
    lang: 1,
    value: 1
};
var actionStrategy = {
    innerHTML: noop,
    children: noop,
    style: function style(dom, _, val, lastProps) {
        patchStyle(dom, lastProps.style || emptyObject, val || emptyObject);
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
                    // if (typeNumber(dom[name]) === 4 && dom[name] !== "") {
                    if (builtinStringProps[name]) {
                        dom[name] = "";
                    }
                    // }
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

function disposeVnode(vnode) {
    if (!vnode || vnode._disposed) {
        return;
    }
    var instance = vnode._instance;
    if (vnode._hasRef) {
        vnode._hasRef = false;
        Refs.fireRef(vnode, null);
    }
    if (instance) {
        disposeComponent(vnode, instance);
    } else if (vnode.vtype === 1) {
        disposeElement(vnode);
    }
    vnode._disposed = true;
}

function disposeElement(vnode) {
    var props = vnode.props,
        vchildren = vnode.vchildren;

    if (props[innerHTML]) {
        removeElement(vnode._hostNode);
    } else {
        for (var i = 0, n = vchildren.length; i < n; i++) {
            disposeVnode(vchildren[i]);
        }
        vchildren.length = 0;
    }
}

function disposeComponent(vnode, instance) {
    options.beforeUnmount(instance);
    instance.setState = instance.forceUpdate = noop;
    captureError(instance, "componentWillUnmount", []);
    var updater = instance.updater;
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
    disposeVnode(updater.rendered);
    updater._disposed = true;
    updater._renderInNextCycle = vnode._instance = instance.updater = null;
}

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
    var dom = (ref.updater || ref)._hostNode;
    return dom.nodeType === 8 ? null : dom;
}
//[Top API] ReactDOM.createPortal
function createPortal(vchildren, container) {
    var parentVnode = createVnode(container);
    parentVnode.vchildren = container.vchildren || emptyArray;
    diffChildren(parentVnode, vchildren, container, {});
    parentVnode.vchildren = vchildren;
    return null;
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
    var rootNode = void 0,
        lastVnode = container.__component;

    if (lastVnode) {
        rootNode = alignVnode(lastVnode, vnode, createVnode(container), context);
    } else {
        //如果是后端渲染生成，它的孩子中存在一个拥有data-reactroot属性的元素节点
        rootNode = genVnodes(container, vnode, context);
    }

    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container.__component = vnode;
    drainQueue();
    instance = vnode._instance;
    container.__component = vnode;
    Refs.currentOwner = null; //防止干扰
    var ret = instance || rootNode;
    if (callback) {
        callback.call(ret); //坑
    }
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return ret;
}
var toArray = Array.from || function (a) {
    var ret = [];
    for (var i = 0, n = a.length; i < n; i++) {
        ret[i] = a[i];
    }
    return ret;
};
function genVnodes(container, vnode, context) {
    var nodes = toArray(container.childNodes || emptyArray);
    var lastNode = null;
    for (var i = 0, el; el = nodes[i++];) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            lastNode = el;
        } else {
            container.removeChild(el);
        }
    }
    return container.appendChild(mountVnode(lastNode, vnode, createVnode(container), context));
}

var patchStrategy = {
    0: mountText,
    1: mountElement,
    2: mountComponent,
    4: mountComponent,
    10: updateText,
    11: updateElement,
    12: receiveComponent,
    14: receiveComponent
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
        lastNode = createElement$1(vnode);
    }
    return vnode._hostNode = lastNode;
}

function updateText(lastVnode, nextVnode) {
    var dom = lastVnode._hostNode;
    nextVnode._hostNode = dom;
    if (lastVnode.text !== nextVnode.text) {
        dom.nodeValue = nextVnode.text;
    }
    return dom;
}

function genMountElement(lastNode, vnode, parentVnode, type) {
    if (lastNode && toLowerCase(lastNode.nodeName) === type) {
        return lastNode;
    } else {
        var dom = createElement$1(vnode, parentVnode);
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
    input: 1,
    option: 1
};

function mountElement(lastNode, vnode, parentVnode, context) {
    var type = vnode.type,
        props = vnode.props,
        _hasRef = vnode._hasRef;

    var dom = genMountElement(lastNode, vnode, parentVnode, type);
    vnode._hostNode = dom;
    var children = flattenChildren(vnode);
    var method = lastNode ? alignChildren : mountChildren;
    method(dom, children, vnode, context);
    // dom.vchildren = children;/** fatal 不再访问真实DOM */
    if (vnode.checkProps) {
        diffProps(dom, emptyObject, props, vnode);
    }
    if (formElements[type]) {
        processFormElement(vnode, dom, props);
    }
    if (_hasRef) {
        pendingRefs.push(vnode, dom);
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, parentVnode, context) {
    var lastProps = lastVnode.props,
        dom = lastVnode._hostNode,
        checkProps = lastVnode.checkProps,
        type = lastVnode.type;
    var nextProps = nextVnode.props,
        nextCheckProps = nextVnode.checkProps;

    nextVnode._hostNode = dom;
    var vchildren = lastVnode.vchildren || emptyArray,
        newChildren = void 0;

    nextVnode.old = lastVnode;
    if (nextProps[innerHTML]) {
        vchildren.forEach(function (el) {
            disposeVnode(el);
        });
        vchildren.length = 0;
    } else {
        if (nextVnode === lastVnode) {
            //如果新旧节点一样，为了防止旧vchildren被重写，需要restore一下
            newChildren = vchildren.concat();
        } else {
            newChildren = flattenChildren(nextVnode);
        }
        if (lastProps[innerHTML]) {
            vchildren.length = 0;
        }
        diffChildren(nextVnode, newChildren, dom, context);

        nextVnode.vchildren = newChildren;
    }
    if (checkProps || nextCheckProps) {
        diffProps(dom, lastProps, nextProps, nextVnode);
    }
    if (formElements[type]) {
        processFormElement(nextVnode, dom, nextProps);
    }
    Refs.detachRef(lastVnode, nextVnode, dom);

    return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(parentNode, children, parentVnode, context) {
    for (var i = 0, n = children.length; i < n; i++) {
        var vnode = children[i];
        parentNode.appendChild(mountVnode(null, vnode, parentVnode, context));
    }
}

function alignChildren(parentNode, children, parentVnode, context) {
    var childNodes = parentNode.childNodes,
        insertPoint = childNodes[0] || null,
        j = 0,
        n = children.length;
    for (var i = 0; i < n; i++) {
        var vnode = children[i];
        var lastNode = childNodes[j];
        var dom = mountVnode(lastNode, vnode, parentVnode, context);
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

function mountComponent(lastNode, vnode, parentVnode, parentContext, parentUpdater) {
    var type = vnode.type,
        props = vnode.props;

    var instance = instantiateComponent(type, vnode, props, parentContext); //互相持有引用
    var updater = instance.updater;
    if (parentUpdater) {
        updater.parentUpdater = parentUpdater;
    }
    updater.parentVnode = parentVnode;
    updater.parentContext = parentContext;
    if (instance.componentWillMount) {
        captureError(instance, "componentWillMount", []);
        showError();
        instance.state = updater.mergeStates();
    }

    updater._hydrating = true;
    var dom = updater.renderComponent(lastNode);
    updater.oldDatas = emptyArray;
    enqueueQueue({
        host: updater,
        exec: updater.onEnd
    });

    return dom;
}

function receiveComponent(lastVnode, nextVnode, parentVnode, parentContext) {
    var type = lastVnode.type,
        _instance = lastVnode._instance;

    var updater = _instance.updater,
        nextContext = void 0;

    //如果正在更新过程中接受新属性，那么去掉update,加上receive
    var willReceive = lastVnode !== nextVnode;
    if (!type.contextTypes) {
        nextContext = _instance.context;
    } else {
        nextContext = getContextByTypes(parentContext, type.contextTypes);
        willReceive = true;
    }
    updater.context = nextContext;
    //parentContext在官方中被称之不nextUnmaskedContext， parentVnode称之为nextParentElement
    updater.props = nextVnode.props;
    updater.parentContext = parentContext;
    updater.nextVnode = nextVnode;
    updater.parentVnode = parentVnode;
    updater.willReceive = willReceive;

    if (!updater._dirty) {
        //如果在事件中使用了setState
        updater.inReceiveStage = [lastVnode, nextVnode, nextContext];
        enqueueQueue({
            host: updater,
            exec: updater.onUpdate
        });
    }
    return updater._hostNode;
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function alignVnode(lastVnode, nextVnode, parentVnode, context, parentUpdater) {
    if (!lastVnode || lastVnode.nodeType) {
        return mountVnode(null, nextVnode, parentVnode, context, parentUpdater);
    }
    var dom = void 0;
    if (isSameNode(lastVnode, nextVnode)) {
        dom = updateVnode(lastVnode, nextVnode, parentVnode, context);
    } else {
        disposeVnode(lastVnode);
        var node = lastVnode._hostNode,
            parentNode = node.parentNode;
        dom = mountVnode(null, nextVnode, parentVnode, context, parentUpdater);
        parentNode.replaceChild(dom, node);
    }
    return dom;
}
options.alignVnode = alignVnode;

function genkey(vnode) {
    return vnode.key ? "@" + vnode.key : vnode.type.name || vnode.type;
}

function getNearestNode(vnodes, ii, newVnode) {
    var distance = Infinity,
        hit = null,
        vnode,
        i = 0;
    while (vnode = vnodes[i]) {
        var delta = vnode._i - ii;
        if (delta === 0) {
            newVnode._new = vnode;
            vnodes.splice(i, 1);
            return vnode;
        } else {
            var d = Math.abs(delta);
            if (d < distance) {
                distance = d;
                hit = vnode;
            }
        }
        i++;
    }
    newVnode._new = hit;
    return hit;
}
function diffChildren(a, nextChildren, parentNode, context) {
    var parentVnode = a.old;
    var lastChildren = parentVnode.vchildren || emptyArray,
        //parentNode.vchildren,
    nextLength = nextChildren.length,
        insertPoint = parentNode.firstChild,
        lastLength = lastChildren.length;
    //optimize 1： 如果旧数组长度为零, 只进行添加
    if (!lastLength) {
        emptyElement(parentNode);
        return mountChildren(parentNode, nextChildren, parentVnode, context);
    }
    //optimize 2： 如果新数组长度为零, 只进行删除
    if (!nextLength) {
        return lastChildren.forEach(function (el) {
            removeElement(el._hostNode);
            disposeVnode(el);
        });
    }
    //optimize 3： 如果1vs1, 不用进入下面复杂的循环
    if (nextLength === lastLength && lastLength === 1) {
        if (insertPoint) {
            lastChildren[0]._hostNode = insertPoint;
        }
        return alignVnode(lastChildren[0], nextChildren[0], parentVnode, context);
    }
    //从这里开始非常复杂的节点排序算法
    //step1: 构建模糊匹配对象fuzzyHits，以虚拟DOM的key/type为键名，并记录它的旧位置
    var fuzzyHits = {},
        hit = void 0,
        i = 0,
        nextChild = void 0;

    lastChildren.forEach(function (lastChild, i) {
        hit = genkey(lastChild);
        lastChild._i = i;
        var hits = fuzzyHits[hit];
        if (hits) {
            hits.push(lastChild);
        } else {
            fuzzyHits[hit] = [lastChild];
        }
    });
    //step2: 碰撞检测，并筛选离新节点最新的节点，执行nul ref与updateComponent
    var hitIt = false;
    while (i < nextLength) {
        nextChild = nextChildren[i];
        hit = genkey(nextChild);
        var fLength = fuzzyHits[hit] && fuzzyHits[hit].length,
            hitVnode = null;
        if (fLength) {
            var fnodes = fuzzyHits[hit];
            hitIt = true;
            if (fLength > 1) {
                hitVnode = getNearestNode(fnodes, i, nextChild);
            } else {
                hitVnode = nextChild._new = fnodes[0];
                delete fuzzyHits[hit];
            }
            if (hitVnode) {
                hitVnode._hit = true;
                if (hitVnode.vtype > 1) {
                    alignVnode(hitVnode, nextChild, parentVnode, context);
                } else {
                    Refs.detachRef(hitVnode, nextChild);
                }
            }
        }
        i++;
    }
    drainQueue();
    //step3: 移除没有命中的虚拟DOM，执行它们的钩子与ref
    switchUpdaters();
    if (hitIt) {
        for (var _i = 0; _i < lastLength; _i++) {
            var _lastChild = lastChildren[_i];
            if (!_lastChild._hit) {
                disposeVnode(_lastChild);
                parentNode.removeChild(_lastChild._hostNode);
            }
        }
    }
    //step4: 更新元素，调整位置或插入新元素
    insertPoint = parentNode.firstChild;

    for (var _i2 = 0, dom, oldDom; _i2 < nextLength; _i2++) {
        nextChild = nextChildren[_i2];
        if (dom) {
            insertPoint = dom.nextSibling;
        }
        if (nextChild._new && nextChild.vtype < 2) {
            //需要防止旧的组件虚拟DOM的真实DOM又加回去
            var lastChild = nextChild._new;
            delete nextChild._new;
            oldDom = lastChild._hostNode;
            if (oldDom !== insertPoint) {
                insertElement(parentNode, oldDom, insertPoint);
            }
            dom = alignVnode(lastChild, nextChild, parentVnode, context);
        } else if (dom = nextChild._hostNode) {
            delete nextChild._new;
            //调整updateComponent的真实DOM位置
            if (dom !== insertPoint) {
                insertElement(parentNode, dom, insertPoint);
            }
        } else if (!nextChild._new) {
            dom = mountVnode(null, nextChild, parentVnode, context);
            insertElement(parentNode, dom, insertPoint);
        }
    }
    //React的怪异行为，如果没有组件发生更新，那么先执行添加，再执行移除
    if (!hitIt) {
        for (var _i3 = 0; _i3 < lastLength; _i3++) {
            var _lastChild2 = lastChildren[_i3];
            if (!_lastChild2._hit) {
                disposeVnode(_lastChild2);
                parentNode.removeChild(_lastChild2._hostNode);
            }
        }
    }
    //执行新组件的componentDidMount
    flushUpdaters();
}

//IE8中select.value不会在onchange事件中随用户的选中而改变其value值，也不让用户直接修改value 只能通过这个hack改变
var noCheck = false;
function setSelectValue(e) {
    if (e.propertyName === "value" && !noCheck) {
        syncValueByOptionValue(e.srcElement);
    }
}

function syncValueByOptionValue(dom) {
    var idx = dom.selectedIndex,
        option = void 0,
        attr = void 0;
    if (idx > -1) {
        //IE 下select.value不会改变
        option = dom.options[idx];
        attr = option.attributes.value;
        dom.value = attr && attr.specified ? option.value : option.text;
    }
}

var fixIEChangeHandle = createHandle("change", function (e) {
    var dom = e.srcElement;
    if (dom.type === "select-one") {
        if (!dom.__bindFixValueFn) {
            addEvent(dom, "propertychange", setSelectValue);
            dom.__bindFixValueFn = true;
        }
        noCheck = true;
        syncValueByOptionValue(dom);
        noCheck = false;
    }
    if (e.type === "propertychange") {
        return e.propertyName === "value";
    }
});

var fixIEInputHandle = createHandle("input", function (e) {
    return e.propertyName === "value";
});

var IEHandleFix = {
    input: function input(dom) {
        addEvent(dom, "propertychange", fixIEInputHandle);
    },
    change: function change(dom) {
        //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发 select则需要做更多补丁工件
        var mask = /radio|check/.test(dom.type) ? "click" : /text|password/.test(dom.type) ? "propertychange" : "change";
        addEvent(dom, mask, fixIEChangeHandle);
    },
    submit: function submit(dom) {
        if (dom.nodeName === "FORM") {
            addEvent(dom, "submit", dispatchEvent);
        }
    }
};

if (msie < 9) {
    actionStrategy[innerHTML] = function (dom, name, val, lastProps) {
        var oldhtml = lastProps[name] && lastProps[name].__html;
        var html = val && val.__html;
        if (html !== oldhtml) {
            //IE8-会吃掉最前面的空白
            dom.innerHTML = String.fromCharCode(0xFEFF) + html;
            var textNode = dom.firstChild;
            if (textNode.data.length === 1) {
                dom.removeChild(textNode);
            } else {
                textNode.deleteData(0, 1);
            }
        }
    };

    String("focus,blur").replace(/\w+/g, function (type) {
        eventHooks[type] = function (dom, name) {
            var mark = "__" + name;
            if (!dom[mark]) {
                dom[mark] = true;
                var mask = name === "focus" ? "focusin" : "focusout";
                addEvent(dom, mask, function (e) {
                    //https://www.ibm.com/developerworks/cn/web/1407_zhangyao_IE11Dojo/ window
                    var tagName = e.srcElement.tagName;
                    if (!tagName) {
                        return;
                    }
                    // <body> #document
                    var tag = toLowerCase(tagName);
                    if (tag == "#document" || tag == "body") {
                        return;
                    }
                    e.target = dom; //因此focusin事件的srcElement有问题，强行修正
                    dispatchEvent(e, name, dom.parentNode);
                });
            }
        };
    });

    Object.assign(eventPropHooks, oneObject("mousemove, mouseout,mouseenter, mouseleave, mouseout,mousewheel, mousewheel, whe" + "el, click", function (event) {
        if (!("pageX" in event)) {
            var doc = event.target.ownerDocument || document;
            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement;
            event.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
            event.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
        }
    }));

    Object.assign(eventPropHooks, oneObject("keyup, keydown, keypress", function (event) {
        /* istanbul ignore next  */
        if (event.which == null && event.type.indexOf("key") === 0) {
            /* istanbul ignore next  */
            event.which = event.charCode != null ? event.charCode : event.keyCode;
        }
    }));

    for (var i in IEHandleFix) {
        eventHooks[i] = eventHooks[i + "capture"] = IEHandleFix[i];
    }
}

function needFix(fn) {
    return !/native code/.test(fn);
}
function keysPolyfill() {
    //解决IE下Object.keys的性能问题
    if (needFix(Object.keys)) {
        Object.keys = function keys(obj) {
            var a = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    a.push(k);
                }
            }
            return a;
        };
    }
}
keysPolyfill();
setTimeout(keysPolyfill, 0);
setTimeout(keysPolyfill, 100);
var React = {
    version: "1.1.5-pre",
    render: render,
    options: options,
    PropTypes: PropTypes,
    Children: Children, //为了react-redux
    Component: Component,
    eventSystem: eventSystem,
    findDOMNode: findDOMNode,
    createClass: createClass,
    createPortal: createPortal,
    createElement: createElement,
    cloneElement: cloneElement,
    PureComponent: PureComponent,
    isValidElement: isValidElement,
    unmountComponentAtNode: unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,

    createFactory: function createFactory(type) {
        console.error("createFactory is deprecated"); // eslint-disable-line
        var factory = createElement.bind(null, type);
        factory.type = type;
        return factory;
    }
};

win.React = win.ReactDOM = React;

return React;

})));
