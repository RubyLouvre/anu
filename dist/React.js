/**
 * by 司徒正美 Copyright 2017-11-21
 * IE9+
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
        console.warn(methodName + " is deprecated");
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
function returnFalse() {
    return false;
}
function returnTrue() {
    return true;
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
var options = oneObject(["beforeProps", "afterCreate", "beforeInsert", "beforeDelete", "beforeUpdate", "afterUpdate", "beforePatch", "afterPatch", "beforeUnmount", "afterMount"], noop);
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

var toArray = Array.from || function (a) {
    var ret = [];
    for (var i = 0, n = a.length; i < n; i++) {
        ret[i] = a[i];
    }
    return ret;
};
function createUnique() {
    return typeof Set === "function" ? new Set() : new InnerSet();
}
function InnerSet() {
    this.elems = [];
}
InnerSet.prototype = {
    add: function add(el) {
        this.elems.push(el);
    },
    has: function has(el) {
        return this.elems.indexOf(el) !== -1;
    }
};

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
    math: "http://www.w3.org/1998/Math/MathML"
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
    } else if (!ns || check.type.toLowerCase() === "foreignobject") {
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

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
var pendingRefs = [];
window.pendingRefs = pendingRefs;
var Refs = {
    currentOwner: null,
    eraseElementRefs: function eraseElementRefs() {
        pendingRefs.length = 0;
    },
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
    }
};

function Vnode(type, vtype, props, key, ref, _hasProps) {
    this.type = type;
    this.vtype = vtype;
    if (vtype) {
        this.props = props;
        this._owner = Refs.currentOwner;

        if (key) {
            this.key = key;
        }

        if (vtype === 1) {
            this.childNodes = [];
            this._hasProps = _hasProps;
        }

        var refType = typeNumber(ref);
        if (refType === 3 || refType === 4 || refType === 5) {
            //number, string, function
            this._hasRef = true;
            this.ref = ref;
        }
    }
    /*
      this.stateNode = null
    */

    options.afterCreate(this);
}

Vnode.prototype = {
    getDOMNode: function getDOMNode() {
        return this.stateNode || null;
    },
    collectNodes: function collectNodes(isChild, ret) {
        ret = ret || [];

        if (isChild && this.vtype < 2) {
            if (!this.stateNode) {
                ret.isError = true;
            }
            ret.push(this.stateNode);
        } else {
            for (var a = this.child; a; a = a.sibling) {
                a.collectNodes(true, ret);
            }
        }
        return ret;
    },
    batchMount: function batchMount(tag) {
        var parentNode = this.stateNode;
        if (!parentNode.childNodes.length) {
            //父节点必须没有孩子
            var childNodes = this.collectNodes();
            if (childNodes.isError) {
                return;
            }
            //console.log(tag, "!!!!",childNodes,parentNode);
            childNodes.forEach(function (dom) {
                parentNode.appendChild(dom);
            });
        } else {
            //console.log(tag, "已经有节点",this.collectNodes(),parentNode);
        }
    },
    batchUpdate: function batchUpdate(updateMeta, nextChildren) {
        var parentVnode = updateMeta.parentVElement,
            parentNode = parentVnode.stateNode,
            lastChildren = updateMeta.lastChilds,
            newLength = nextChildren.length,
            oldLength = lastChildren.length,
            unique = createUnique();
        var fullNodes = toArray(parentNode.childNodes);
        var startIndex = fullNodes.indexOf(lastChildren[0]);
        var insertPoint = fullNodes[startIndex] || null;
        for (var i = 0; i < newLength; i++) {
            var child = nextChildren[i];
            var last = lastChildren[i];
            if (last === child) {
                //如果相同
            } else if (last && !unique.has(last)) {
                parentNode.replaceChild(child, last); //如果这个位置有DOM，并且它不在新的nextChildren之中
            } else if (insertPoint) {
                parentNode.insertBefore(child, insertPoint.nextSibling);
            } else {
                parentNode.appendChild(child);
            }
            insertPoint = child;
            unique.add(child);
        }
        if (newLength < oldLength) {
            for (var _i = newLength; _i < oldLength; _i++) {
                if (!unique.has(lastChildren[_i])) {
                    removeElement(lastChildren[_i]);
                }
            }
        }

        delete parentVnode.updateMeta;
    },


    $$typeof: REACT_ELEMENT_TYPE
};

/**
 * 虚拟DOM工厂
 *
 * @param {string|function|Component} type
 * @param {object} props
 * @param {array} ...children
 * @returns
 */

function createElement(type, config) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
    }

    var props = {},
        _hasProps = 0,
        vtype = 1,
        key = null,
        ref = null,
        argsLen = children.length;
    if (type && type.call) {
        vtype = type.prototype && type.prototype.render ? 2 : 4;
    } else if (type + "" !== type) {
        console.error("React.createElement的第一个参数有问题");
        type = "#comment";
        vtype = 0;
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
                _hasProps = 1;
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
                _hasProps = 1;
                props[propName] = defaultProps[propName];
            }
        }
    }
    return new Vnode(type, vtype, props, key, ref, _hasProps);
}

function createVText(type, text) {
    var vnode = new Vnode(type, 0);
    vnode.text = text;
    return vnode;
}

// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中
function createVnode(node) {
    var type = node.nodeName,
        vnode;
    if (node.nodeType === 1) {
        vnode = new Vnode(type, 1);
        var ns = node.namespaceURI;
        if (!ns || ns.indexOf("html") >= 22) {
            vnode.type = type.toLowerCase(); //HTML的虚拟DOM的type需要小写化
        } else {
            //非HTML需要加上命名空间
            vnode.namespaceURI = ns;
        }
    } else {
        vnode = createVText(type, node.nodeValue);
    }
    vnode.stateNode = node;
    return vnode;
}

function restoreChildren(parent) {
    var ret = [];
    for (var el = parent.child; el; el = el.sibling) {
        if (!el._disposed) {
            ret.push(el);
        }
    }
    return ret;
}

function fiberizeChildren(vnode) {
    var c = vnode.props.children,
        ret = [],
        prev = void 0;
    if (c !== void 666) {
        var lastText,
            compareObj = {};
        var lastIndex = 0;
        operateChildren(c, "", function (child, index) {
            var childType = typeNumber(child);
            if (childType < 3) {
                //在React16中undefined, null, boolean不会产生节点 
                lastText = null;
                return;
            } else if (childType < 5) {
                //number string
                if (lastText) {
                    //合并相邻的文本节点
                    lastText.text += child;
                    return;
                }
                lastText = child = createVText("#text", child + "");
            } else {
                lastText = null;
            }
            var key = child.key;

            if (key && !compareObj[".$" + key]) {
                compareObj[".$" + key] = child;
            } else {
                if (index === ".") {
                    index = "." + lastIndex;
                }
                compareObj[index] = child;
            }
            child.index = ret.length;
            child.return = vnode;
            if (prev) {
                prev.sibling = child;
            }
            lastIndex++;
            prev = child;
            ret.push(child);
        });
        var child = ret[0];
        if (child) {
            vnode.child = child;
            child.compareObj = compareObj;
        }
    }

    return ret;
}

function operateChildren(children, prefix, callback) {
    var iteratorFn;
    if (children) {
        if (children.forEach) {
            children.forEach(function (el, i) {
                operateChildren(el, prefix ? prefix + ":" + i : "." + i, callback);
            });
            return;
        } else if (iteratorFn = getIteractor(children)) {
            var iterator = iteratorFn.call(children),
                ii = 0,
                step;
            while (!(step = iterator.next()).done) {
                operateChildren(step.value, prefix ? prefix + ":" + ii : "." + ii, callback);
                ii++;
            }
            return;
        }
    }
    if (Object(children) === children && !children.type) {
        throw "children中存在非法的对象";
    }
    callback(children, prefix || ".");
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
        var index = 0;
        operateChildren(children, "", function () {
            index++;
        });
        return index;
    },
    map: function map(children, callback, context) {
        if (children == null) {
            return children;
        }
        var index = 0,
            ret = [];
        operateChildren(children, "", function (old, prefix) {
            if (old == null || old === false || old === true) {
                old = null;
            }
            var outerIndex = index;
            var el = callback.call(context, old, index);
            index++;
            if (el == null) {
                return;
            }
            if (el.vtype) {
                //如果返回的el等于old,还需要使用原来的key, _prefix
                var key = computeKey(old, el, prefix, outerIndex);
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
            var index = 0;
            operateChildren(children, "", function (el) {
                if (el == null || el === false || el === true) {
                    el = null;
                }
                callback.call(context, el, index++);
            });
        }
    },

    toArray: function toArray$$1(children) {
        if (children == null) {
            return [];
        }
        return Children.map(children, function (el) {
            return el;
        });
    }
};
var rthimNumer = /\d+\$/;
function computeKey(old, el, prefix, index) {
    var curKey = el && el.key != null ? escapeKey(el.key) : null;
    var oldKey = old && old.key != null ? escapeKey(old.key) : null;
    var key = void 0;
    if (oldKey && curKey) {
        key = prefix + "$" + oldKey;
        if (oldKey !== curKey) {
            key = curKey + "/" + key;
        }
    } else {
        key = curKey || oldKey;
        if (key) {
            key = prefix + "$" + key;
        } else {
            key = prefix === "." ? prefix + index : prefix;
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

var dirtyComponents = [];
function mountSorter(u1, u2) {
    //按文档顺序执行
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

function enqueueUpdater(updater) {
    if (!updater._dirty) {
        updater.addJob("hydrate");
        updater._dirty = true;
        dirtyComponents.push(updater);
    }
}

function drainQueue(queue) {
    options.beforePatch();
    //先执行所有元素虚拟DOMrefs方法（从上到下）
    Refs.clearElementRefs();
    var needSort = [],
        unique = {},
        updater = void 0;
    while (updater = queue.shift()) {
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }

        if (!unique[updater._mountOrder]) {
            unique[updater._mountOrder] = 1;
            needSort.push(updater);
        }
        updater.exec(queue);
        var catchError = Refs.catchError;
        if (catchError) {
            delete Refs.catchError;
            // queue.length = needSort.length = 0;
            // unique = {};
            catchError.addJob("resolve");
            queue.push(catchError);
        }
    }

    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    needSort.sort(mountSorter).forEach(function (updater) {
        clearArray(updater._pendingCallbacks).forEach(function (fn) {
            fn.call(updater.instance);
        });
    });
    options.afterPatch();
    //  showError();
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
    flushUpdaters();
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
        //如果跑到document上
        return paths;
    }
    var vnode = node.__events.vnode;
    do {
        if (vnode.vtype === 1) {
            var dom = vnode.stateNode;
            if (dom === end) {
                break;
            }
            if (!dom) {
                // console.log(vnode,"没有实例化");
                break;
            }
            if (dom.__events) {
                paths.push({ dom: dom, events: dom.__events });
            }
        }
    } while (vnode = vnode.return); // eslint-disable-line
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
    eventHooks.click = eventHooks.clickcapture = noop;
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
    fixEvent: noop, //留给以后扩展用
    preventDefault: function preventDefault() {
        var e = this.nativeEvent || {};
        e.returnValue = this.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
        }
    },
    fixHooks: noop,
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
    enqueueSetState: returnFalse,
    isMounted: returnFalse
};

Component.prototype = {
    constructor: Component, //必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState: function replaceState() {
        deprecatedWarn("replaceState");
    },
    isMounted: function isMounted() {
        deprecatedWarn("isMounted");
        return (this.updater || fakeObject).isMounted();
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
    var curry = Function("ReactComponent", "blacklist", "spec", "return function " + className + "(props, context) {\n      ReactComponent.call(this, props, context);\n\n     for (var methodName in this) {\n        var method = this[methodName];\n        if (typeof method  === \"function\"&& !blacklist[methodName]) {\n          this[methodName] = method.bind(this);\n        }\n      }\n\n      if (spec.getInitialState) {\n        var test = this.state = spec.getInitialState.call(this);\n        if(!(test === null || ({}).toString.call(test) == \"[object Object]\")){\n          throw \"getInitialState\u53EA\u80FD\u8FD4\u56DE\u7EAFJS\u5BF9\u8C61\u6216\u8005null\"\n        }\n      }\n\n  };");
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

function Portal(props) {
    this.container = props.container;
}
Portal.prototype = {
    constructor: Portal,
    componentWillUnmount: function componentWillUnmount() {
        var parentVnode = this.container;
        var lastChildren = restoreChildren(parentVnode);
        options.diffChildren(lastChildren, [], parentVnode, {}, []);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps, context) {
        var parentVnode = this.container;
        options.alignVnode(parentVnode, nextProps.container, context, []);
    },
    componentWillMount: function componentWillMount() {
        var parentVnode = this.container;
        var nextChildren = fiberizeChildren(parentVnode);
        options.diffChildren([], nextChildren, parentVnode, {}, []);
        parentVnode.batchMount();
    },
    render: function render() {
        return null;
    }
};
//[Top API] ReactDOM.createPortal
function createPortal(children, node) {
    var container = createVnode(node);
    container.props = container.props || {};
    var props = container.props;
    props.children = children;
    var portal = createElement(Portal, {
        container: container
    });
    container.return = portal;
    return portal;
}

var catchHook = "componentDidCatch";
function pushError(instance, hook, error) {
    var names = [];
    instance._hasError = true;
    Refs.eraseElementRefs();
    var catchUpdater = findCatchComponent(instance, names);
    if (catchUpdater) {
        //移除医生节点下方的所有真实节点
        catchUpdater._hasCatch = [error, describeError(names, hook), instance];
        // todo!
        // var vnode = catchUpdater.vnode;
        // 清空医生节点的所有子孙节点（但不包括自己）
        // vnode.collectNodes().forEach(removeElement);
        // discontinue(vnode.child);
        // delete instance.updater.vnode.return.child;
        delete catchUpdater.pendingVnode;
        Refs.catchError = catchUpdater;
    } else {
        //不做任何处理，遵循React15的逻辑
        console.warn(describeError(names, hook)); // eslint-disable-line
        var vnode = instance.updater.vnode,
            top = void 0;
        do {
            top = vnode;
            if (vnode.isTop) {
                break;
            }
        } while (vnode = vnode.return);
        disposeVnode(top, true);

        throw error;
    }
}
function captureError(instance, hook, args) {
    try {
        var fn = instance[hook];
        if (fn && !instance._hasError) {
            return fn.apply(instance, args);
        }
        return true;
    } catch (error) {
        pushError(instance, hook, error);
    }
}
function describeError(names, hook) {
    return hook + " occur error in " + names.map(function (componentName) {
        return "<" + componentName + " />";
    }).join(" created By ");
}

function findCatchComponent(instance, names) {
    var target = instance.updater.vnode;
    do {
        var type = target.type;
        if (target.isTop) {
            break;
        } else if (target.vtype > 1) {
            names.push(type.displayName || type.name);
            var dist = target.stateNode;
            if (dist[catchHook]) {
                if (dist._hasTry) {
                    //治不好的医生要自杀
                    dist._hasError = false;
                    disposeVnode(dist.updater.vnode);
                } else if (dist !== instance) {
                    //自已不能治愈自己
                    return dist.updater; //移交更上级的医师处理
                }
            }
        } else if (target.vtype === 1) {
            names.push(type);
        }
    } while (target = target.return);
}
function showError() {}

var topVnodes = [];
var topNodes = [];

function disposeVnode(vnode, silent) {
    if (vnode && !vnode._disposed) {
        options.beforeDelete(vnode);
        var instance = vnode.stateNode;
        var updater = instance.updater;
        if (vnode._hasRef && !silent) {
            vnode._hasRef = false;
            Refs.fireRef(vnode, null);
        }
        if (vnode.isTop) {
            var i = topVnodes.indexOf(vnode);
            if (i !== -1) {
                topVnodes.splice(i, 1);
                topNodes.splice(i, 1);
            }
        }
        vnode._disposed = true;
        if (updater) {
            disposeComponent(vnode, instance, updater, silent);
        } else if (vnode.vtype === 1) {
            disposeElement(vnode);
            delete vnode.stateNode;
        } else {
            delete vnode.stateNode;
        }
    }
}

function disposeElement(vnode, silent) {
    var props = vnode.props;

    if (props[innerHTML]) {
        removeElement(vnode.stateNode);
    } else {
        disposeChildren(restoreChildren(vnode), silent);
    }
}

function disposeComponent(vnode, instance, updater, silent) {
    options.beforeUnmount(instance);
    instance.setState = instance.forceUpdate = noop;
    if (!silent) {
        captureError(instance, "componentWillUnmount", []);
    }
    disposeChildren(restoreChildren(vnode));
    showError();
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
    updater._disposed = true;
    updater.isMounted = returnFalse;
    updater._renderInNextCycle = null;
}

function disposeChildren(children, silent) {
    for (var i = 0, n = children.length; i < n; i++) {
        var vnode = children[i];
        if (vnode) {
            disposeVnode(vnode, silent);
        }
    }
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function alwaysNull() {
    return null;
}
var mountOrder = 1;
var support16 = true;
var errorType = {
    0: "undefined",
    2: "boolean",
    3: "number",
    4: "string",
    7: "array"
};
/**
 * 为了防止污染用户的实例，需要将操作组件虚拟DOM与生命周期钩子的逻辑全部抽象到这个类中
 * 
 * @export
 * @param {any} instance 
 * @param {any} vnode 
 */
function Updater(instance, vnode) {
    vnode.stateNode = instance;
    instance.updater = this;
    this.instance = instance;
    this.vnode = vnode;
    this._pendingCallbacks = [];
    this._pendingStates = [];
    this._jobs = ["resolve"];
    this._mountOrder = mountOrder++;
    var type = vnode.type;
    this.name = type.displayName || type.name;
    // update总是保存最新的数据，如state, props, context, parentContext, parentVnode
    //  this._hydrating = true 表示组件会调用render方法及componentDidMount/Update钩子
    //  this._renderInNextCycle = true 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
    if (instance.__isStateless) {
        this.mergeStates = alwaysNull;
    }
}

Updater.prototype = {
    addJob: function addJob(newJob) {
        var jobs = this._jobs;
        if (jobs[jobs.length - 1] !== newJob) {
            jobs.push(newJob);
        }
    },
    exec: function exec(updateQueue) {
        var job = this._jobs.shift();
        if (job) {
            this[job](updateQueue);
        }
    },
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

        if (this.isMounted === returnFalse) {
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
            this.addJob("hydrate");
            drainQueue([this]);
        }
    },
    mergeStates: function mergeStates() {
        var instance = this.instance,
            pendings = this._pendingStates,
            n = pendings.length,
            state = instance.state;
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


    isMounted: returnFalse,
    hydrate: function hydrate(updateQueue) {
        var instance = this.instance,
            context = this.context,
            props = this.props,
            vnode = this.vnode,
            pendingVnode = this.pendingVnode;


        if (this._receiving) {
            var _receiving = _slicedToArray(this._receiving, 3),
                lastVnode = _receiving[0],
                nextVnode = _receiving[1],
                nextContext = _receiving[2];

            nextVnode.stateNode = instance;
            // instance._hasError = false;
            //如果context与props都没有改变，那么就不会触发组件的receive，render，update等一系列钩子
            //但还会继续向下比较
            captureError(instance, "componentWillReceiveProps", [this.props, nextContext]);
            delete this._receiving;
            Refs.detachRef(lastVnode, nextVnode);
        }
        Refs.clearElementRefs();
        var state = this.mergeStates();
        var shouldUpdate = true;

        if (!this._forceUpdate && !captureError(instance, "shouldComponentUpdate", [props, state, context])) {
            shouldUpdate = false;
            if (pendingVnode) {
                this.vnode = pendingVnode;
                delete this.pendingVnode;
            }
        } else {
            captureError(instance, "componentWillUpdate", [props, state, context]);
            var lastProps = instance.props,
                lastContext = instance.context,
                lastState = instance.state;

            this._hookArgs = [lastProps, lastState, lastContext];
        }
        vnode.stateNode = instance;
        delete this._forceUpdate;
        //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
        instance.props = props;
        instance.state = state;
        instance.context = context;
        this.addJob("resolve");
        if (shouldUpdate) {
            this._hydrating = true;
            this.render(updateQueue);
        }
        updateQueue.push(this);
    },
    render: function render(updateQueue) {
        var vnode = this.vnode,
            pendingVnode = this.pendingVnode,
            instance = this.instance,
            parentContext = this.parentContext,
            nextChildren = [],
            childContext = parentContext,
            rendered = void 0,
            number = void 0,
            lastChildren = void 0,
            target = pendingVnode || vnode;

        if (this.willReceive === false) {
            rendered = vnode.child;
            delete this.willReceive;
        } else {
            var lastOwn = Refs.currentOwner;
            Refs.currentOwner = instance;
            rendered = captureError(instance, "render", []);
            if (instance._hasError) {
                rendered = true;
            }
            Refs.currentOwner = lastOwn;
        }
        number = typeNumber(rendered);

        if (this.isMounted()) {
            lastChildren = restoreChildren(this.vnode);
        } else {
            lastChildren = [];
        }
        if (pendingVnode) {
            delete pendingVnode.child;
        }
        if (number > 2) {
            var oldProps = target.props;
            target.props = { children: rendered };
            nextChildren = fiberizeChildren(target);
            target.props = oldProps;
        }
        if (number === 7) {
            if (!support16) {
                pushError(instance, "render", new Error("React15 fail to render array"));
            }
        } else {
            if (number < 5) {
                var noSupport = !support16 && errorType[number];
                if (noSupport) {
                    pushError(instance, "render", new Error("React15 fail to render " + noSupport));
                }
            } else {
                childContext = getChildContext(instance, parentContext);
            }
        }
        //child在React16总是表示它是父节点的第一个节点
        options.diffChildren(lastChildren, nextChildren, target, childContext, updateQueue, this.name);
        var u = this;
        do {
            if (u.pendingVnode) {
                u.vnode = u.pendingVnode;
                delete u.pendingVnode;
            }
        } while (u = u.parentUpdater); // eslint-disable-line
    },

    //此方法用于处理元素ref, ComponentDidMount/update钩子，React Chrome DevTools的钩子， 组件ref, 及错误边界
    resolve: function resolve(updateQueue) {

        var instance = this.instance;
        var hasMounted = this.isMounted();
        var hasCatch = this._hasCatch;
        if (!hasMounted) {
            this.isMounted = returnTrue;
        }
        //如果发生错误，之前收集的元素ref也不会执行，因为结构都不对，没有意义
        Refs.clearElementRefs();
        if (this._hydrating) {
            var hookName = hasMounted ? "componentDidUpdate" : "componentDidMount";
            captureError(instance, hookName, this._hookArgs || []);
            //执行React Chrome DevTools的钩子
            if (hasMounted) {
                options.afterUpdate(instance);
            } else {
                options.afterMount(instance);
            }

            delete this._hookArgs;
            delete this._hydrating;
        }
        var vnode = this.vnode;

        if (hasCatch) {
            delete this._hasCatch;
            this._hydrating = true;
            instance._hasTry = true;
            instance.componentDidCatch.apply(instance, hasCatch);
            this._hydrating = false;
        } else {
            //执行组件ref（发生错误时不执行）
            if (vnode._hasRef) {
                Refs.fireRef(vnode, instance.__isStateless ? null : instance);
            }
        }

        //如果在componentDidMount/Update钩子里执行了setState，那么再次渲染此组件
        if (this._renderInNextCycle) {
            delete this._renderInNextCycle;
            this.addJob("hydrate");
            updateQueue.push(this);
        }
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
    var isStateless = vnode.vtype === 4,
        mixin = void 0;
    var instance = isStateless ? {
        refs: {},
        __proto__: type.prototype,
        render: function render() {
            return type(this.props, this.context);
        }
    } : new type(props, context);
    var updater = new Updater(instance, vnode, props, context);
    //props, context是不可变的
    instance.props = updater.props = props;
    instance.context = updater.context = context;
    instance.constructor = type;

    if (isStateless) {
        var lastOwn = Refs.currentOwner;
        Refs.currentOwner = instance;
        mixin = captureError(instance, "render", []);
        Refs.currentOwner = lastOwn;
        if (mixin && mixin.render) {
            //支持module pattern component
            extend(instance, mixin);
        } else {
            instance.__isStateless = true;
            vnode.child = mixin;
            updater.willReceive = false;
        }
    }

    return instance;
}

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
    options.beforeProps(vnode);
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
            actionStrategy[action](dom, name, val, lastProps, vnode);
        }
    }
    //如果旧属性在新属性对象不存在，那么移除DOM eslint-disable-next-line
    for (var _name in lastProps) {
        if (!nextProps.hasOwnProperty(_name)) {
            var _which = tag + isSVG + _name;
            var _action = strategyCache[_which];
            actionStrategy[_action](dom, _name, false, lastProps, vnode);
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
    event: function event(dom, name, val, lastProps, vnode) {
        var events = dom.__events || (dom.__events = {});
        events.vnode = vnode;
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
    var nodeIndex = topNodes.indexOf(container);
    if (nodeIndex > -1) {
        var lastVnode = topVnodes[nodeIndex];
        disposeVnode(lastVnode);
        emptyElement(container);
        container.__component = null;
    }
}
//[Top API] ReactDOM.findDOMNode
function findDOMNode(ref) {
    if (ref == null) {
        //如果是null
        return null;
    }
    if (ref.nodeType) {
        //如果本身是元素节
        return ref;
    }
    if (ref.updater) {
        //如果是组件实例
        return findDOMNode(ref.updater.vnode);
    }
    var vnode = ref.stateNode; //如果是虚拟DOM或组件实例
    if (vnode.nodeType) {
        return vnode.nodeType === 8 ? null : vnode;
    } else {
        return findDOMNode(ref.child);
    }
}

var AnuWrapper = function AnuWrapper() {};
AnuWrapper.prototype.render = function () {
    return this.props.child;
};

// ReactDOM.render的内部实现
function renderByAnu(vnode, container, callback) {
    var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (!isValidElement(vnode)) {
        throw "ReactDOM.render\u7684\u7B2C\u4E00\u4E2A\u53C2\u6570\u9519\u8BEF"; // eslint-disable-line
    }
    if (!(container && container.getElementsByTagName)) {
        throw "ReactDOM.render\u7684\u7B2C\u4E8C\u4E2A\u53C2\u6570\u9519\u8BEF"; // eslint-disable-line
    }

    //__component用来标识这个真实DOM是ReactDOM.render的容器，通过它可以取得上一次的虚拟DOM
    // 但是在IE6－8中，文本/注释节点不能通过添加自定义属性来引用虚拟DOM，这时我们额外引进topVnode,
    //topNode来寻找它们。

    var nodeIndex = topNodes.indexOf(container),
        lastVnode = void 0,
        updateQueue = [];
    if (nodeIndex !== -1) {
        lastVnode = topVnodes[nodeIndex];
    } else {
        topNodes.push(container);
        nodeIndex = topNodes.length - 1;
    }

    Refs.currentOwner = null; //防止干扰
    var child = vnode;
    vnode = createElement(AnuWrapper, {
        child: child
    });
    vnode.isTop = true;
    topVnodes[nodeIndex] = vnode;

    if (lastVnode) {
        vnode.return = lastVnode.return;
        alignVnode(lastVnode, vnode, context, updateQueue);
    } else {
        var parent = vnode.return = createVnode(container);
        vnode.child = child;
        parent.child = vnode;
        genVnodes(vnode, context, updateQueue);
    }

    container.__component = vnode; //兼容旧的
    drainQueue(updateQueue);

    var rootNode = vnode.child.stateNode;
    if (callback) {
        callback.call(rootNode); //坑
    }
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return rootNode;
}

function genVnodes(vnode, context, updateQueue) {
    var parentNode = vnode.return.stateNode;
    var nodes = toArray(parentNode.childNodes || emptyArray);
    var lastVnode = null;
    for (var i = 0, dom; dom = nodes[i++];) {
        if (toLowerCase(dom.nodeName) === vnode.type) {
            lastVnode = createVnode(dom);
        } else {
            parentNode.removeChild(dom);
        }
    }
    if (lastVnode) {
        alignVnode(lastVnode, vnode, context, updateQueue);
    } else {
        mountVnode(vnode, context, updateQueue);
        vnode.return.batchMount("genVnodes");
    }
}

//mountVnode只是转换虚拟DOM为真实DOM，不做插入DOM树操作
function mountVnode(vnode, context, updateQueue) {
    options.beforeInsert(vnode);
    if (vnode.vtype === 0 || vnode.vtype === 1) {
        var dom = createElement$1(vnode, vnode.return);
        vnode.stateNode = dom;
        if (vnode.vtype === 1) {
            var _hasRef = vnode._hasRef,
                _hasProps = vnode._hasProps,
                type = vnode.type,
                props = vnode.props;

            var children = fiberizeChildren(vnode);
            vnode.selfMount = true;
            mountChildren(vnode, children, context, updateQueue);
            vnode.selfMount = false;
            vnode.batchMount("元素"); //批量插入 dom节点
            if (_hasProps) {
                diffProps(dom, emptyObject, props, vnode);
            }
            if (formElements[type]) {
                processFormElement(vnode, dom, props);
            }
            if (_hasRef) {
                pendingRefs.push(vnode, dom);
            }
        }
    } else {
        mountComponent(vnode, context, updateQueue);
    }
    return dom;
}

//通过组件虚拟DOM产生组件实例与内部操作实例updater
function mountComponent(vnode, parentContext, updateQueue, parentUpdater) {
    var type = vnode.type,
        props = vnode.props,
        instance = void 0;

    try {
        instance = instantiateComponent(type, vnode, props, parentContext); //互相持有引用
    } catch (e) {
        instance = {
            updateQueue: updateQueue
        };
        new Updater(instance, vnode);
        pushError(instance, "constructor", e);
    }
    var updater = instance.updater;
    if (parentUpdater) {
        updater.parentUpdater = parentUpdater;
    }
    updater.parentContext = parentContext;

    if (instance.componentWillMount) {
        instance.updateQueue = updateQueue;
        captureError(instance, "componentWillMount", []);
        instance.state = updater.mergeStates();
    }
    updater._hydrating = true;
    updater.render(updateQueue);
    updateQueue.push(updater);
}

function mountChildren(vnode, children, context, updateQueue) {
    var child = children[0];
    for (vnode.child = child; child; child = child.sibling) {
        mountVnode(child, context, updateQueue);
        if (Refs.catchError) {
            break;
        }
    }
}

var formElements = {
    select: 1,
    textarea: 1,
    input: 1,
    option: 1
};

function updateVnode(lastVnode, nextVnode, context, updateQueue) {
    var dom = nextVnode.stateNode = lastVnode.stateNode;
    options.beforeUpdate(nextVnode);

    if (lastVnode.vtype === 0) {
        if (nextVnode.text !== lastVnode.text) {
            dom.nodeValue = nextVnode.text;
        }
    } else if (lastVnode.vtype === 1) {
        nextVnode.childNodes = lastVnode.childNodes;
        if (lastVnode.namespaceURI) {
            nextVnode.namespaceURI = lastVnode.namespaceURI;
        }
        var lastProps = lastVnode.props,
            _dom = lastVnode.stateNode,
            _hasProps = lastVnode._hasProps,
            type = lastVnode.type;
        var nextProps = nextVnode.props,
            nextCheckProps = nextVnode._hasProps;

        var lastChildren = restoreChildren(lastVnode);
        if (nextProps[innerHTML]) {
            disposeChildren(lastChildren);
        } else {
            diffChildren(lastChildren, fiberizeChildren(nextVnode), nextVnode, context, updateQueue);
        }
        if (_hasProps || nextCheckProps) {
            diffProps(_dom, lastProps, nextProps, nextVnode);
        }
        if (formElements[type]) {
            processFormElement(nextVnode, _dom, nextProps);
        }
        Refs.detachRef(lastVnode, nextVnode, _dom);
    } else {

        dom = receiveComponent(lastVnode, nextVnode, context, updateQueue);
    }
    return dom;
}

function receiveComponent(lastVnode, nextVnode, parentContext, updateQueue) {
    var type = lastVnode.type,
        stateNode = lastVnode.stateNode;

    var updater = stateNode.updater,
        nextContext = void 0;

    //如果正在更新过程中接受新属性，那么去掉update,加上receive
    var willReceive = lastVnode !== nextVnode;
    if (!type.contextTypes) {
        nextContext = stateNode.context;
    } else {
        nextContext = getContextByTypes(parentContext, type.contextTypes);
        willReceive = true;
    }
    updater.context = nextContext;
    //parentContext在官方中被称之不nextUnmaskedContext， parentVnode称之为nextParentElement
    updater.props = nextVnode.props;
    updater.parentContext = parentContext;
    updater.pendingVnode = nextVnode;
    updater.willReceive = willReceive;
    nextVnode.child = nextVnode.child || lastVnode.child;
    if (!updater._dirty) {
        //如果在事件中使用了setState
        updater._receiving = [lastVnode, nextVnode, nextContext];
        updater.addJob("hydrate");
        updateQueue.push(updater);
    }
    return updater.stateNode;
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function genkey(vnode) {
    return vnode.key ? "@" + vnode.key : vnode.type.name || vnode.type;
}

function alignVnode(lastVnode, nextVnode, context, updateQueue, single) {

    if (isSameNode(lastVnode, nextVnode)) {
        //组件虚拟DOM已经在diffChildren生成并插入DOM树
        updateVnode(lastVnode, nextVnode, context, updateQueue);
    } else {
        disposeVnode(lastVnode);
        mountVnode(nextVnode, context, updateQueue, single);
    }

    return nextVnode.stateNode;
}

options.alignVnode = alignVnode;
function getNearestNode(vnodes, ii) {
    var distance = Infinity,
        hit = null,
        vnode,
        i = 0;
    while (vnode = vnodes[i]) {
        var delta = vnode.index - ii;
        if (delta === 0) {
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
    return hit;
}

function diffChildren(lastChildren, nextChildren, parentVnode, parentContext, updateQueue, xxx) {
    var parentVElement = parentVnode,
        priorityQueue = [],
        lastLength = lastChildren.length,
        nextLength = nextChildren.length,
        fuzzyHits = {},
        hit,
        lastChild,
        nextChild,
        i = 0;
    console.log(lastChildren[0], nextChildren[0]);
    if (parentVnode.vtype === 1) {
        var firstChild = parentVnode.stateNode.firstChild;
        var child = lastChildren[0];
        if (firstChild && child) {
            do {
                if (child.vtype < 2) {
                    break;
                }
            } while (child = child.child);
            if (child) {
                child.stateNode = firstChild;
            }
        }
    }
    do {
        if (parentVElement.vtype === 1) {
            break;
        }
    } while (parentVElement = parentVElement.return);
    if (nextChildren) {
        parentVnode.child = nextChildren[0];
    }
    if (!lastLength && nextLength) {
        mountChildren(parentVnode, nextChildren, parentContext, updateQueue);
        if (!parentVElement.selfMount) {
            parentVElement.batchMount("只添加" + xxx);
        }
        return;
    }

    if (!parentVElement.updateMeta) {
        var lastChilds = mergeNodes(lastChildren);
        parentVElement.childNodes.length = 0; //清空数组，以方便收集节点
        parentVElement.updateMeta = {
            parentVnode: parentVnode,
            parentVElement: parentVElement,
            lastChilds: lastChilds
        };
    }
    lastChildren.forEach(function (lastChild) {
        hit = genkey(lastChild);
        var hits = fuzzyHits[hit];
        if (hits) {
            hits.push(lastChild);
        } else {
            fuzzyHits[hit] = [lastChild];
        }
    });
    //step2: 碰撞检测，并筛选离新节点最新的节点，执行null ref与updateComponent
    var React15 = false;
    var mainQueue = [];
    while (i < nextLength) {
        nextChild = nextChildren[i];
        hit = genkey(nextChild);
        var fLength = fuzzyHits[hit] && fuzzyHits[hit].length,
            hitVnode = null;
        if (fLength) {
            var fnodes = fuzzyHits[hit];
            React15 = true;
            if (fLength > 1) {
                hitVnode = getNearestNode(fnodes, i);
            } else {
                hitVnode = fnodes[0];
                delete fuzzyHits[hit];
            }
            if (hitVnode) {
                lastChildren[hitVnode.index] = NaN;
                if (hitVnode.vtype > 1) {
                    if (hitVnode.type === nextChild.type) {

                        receiveComponent(hitVnode, nextChild, parentContext, priorityQueue);
                    } else {
                        alignVnode(hitVnode, nextChild, parentContext, priorityQueue, true);
                    }
                } else {
                    mainQueue.push(hitVnode, nextChild);
                    Refs.detachRef(hitVnode, nextChild);
                }
            }
        } else {
            mainQueue.push(null, nextChild);
        }
        i++;
    }
    //step3: 移除没有命中的虚拟DOM，执行它们的钩子与ref
    if (React15) {
        disposeChildren(lastChildren);
    }
    drainQueue(priorityQueue); //原来updateQueue为priorityQueue
    //step4: 更新元素，调整位置或插入新元素
    for (var _i = 0, n = mainQueue.length; _i < n; _i += 2) {
        lastChild = mainQueue[_i];
        nextChild = mainQueue[_i + 1];
        if (lastChild) {
            alignVnode(lastChild, nextChild, parentContext, updateQueue, true);
        } else {
            mountVnode(nextChild, parentContext, updateQueue, true);
        }
        if (Refs.catchError) {
            parentVElement.updateMeta = null;
            return;
        }
    }

    //React的怪异行为，如果没有组件发生更新，那么先执行添加，再执行移除
    disposeChildren(lastChildren);

    if (parentVElement.updateMeta && parentVElement.updateMeta.parentVnode == parentVnode) {
        parentVnode.batchUpdate(parentVElement.updateMeta, mergeNodes(nextChildren), nextChildren);
    }
}

options.diffChildren = diffChildren;
function mergeNodes(children) {
    var nodes = [];
    for (var i = 0, el; el = children[i++];) {
        if (!el._disposed) {
            if (el.stateNode && el.stateNode.nodeType) {
                nodes.push(el.stateNode);
            } else {
                nodes.push.apply(nodes, el.collectNodes());
            }
        }
    }
    return nodes;
}

var React = {
    version: "1.1.5-pre4",
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
        console.warn("createFactory is deprecated"); // eslint-disable-line
        var factory = createElement.bind(null, type);
        factory.type = type;
        return factory;
    }
};

win.React = win.ReactDOM = React;

return React;

})));
