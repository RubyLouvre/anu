/**
 * by 司徒正美 Copyright 2017-09-10
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

var innerHTML = "dangerouslySetInnerHTML";
var EMPTY_CHILDREN = [];

var limitWarn = {
    createClass: 1,
    renderSubtree: 1
};
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
            if (props.hasOwnProperty(i)) obj[i] = props[i];
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

function getChildContext(instance, context) {
    if (instance.getChildContext) {
        return Object.assign({}, context, instance.getChildContext());
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
    return target.replace(rcamelize, function (match) {
        return match.charAt(1).toUpperCase();
    });
}

var options = {
    beforeUnmount: noop,
    afterMount: noop,
    afterUpdate: noop
};

function checkNull(vnode, type) {
    // if (Array.isArray(vnode) && vnode.length === 1) {
    //  vnode = vnode[0];
    // }
    if (vnode === null || vnode === false) {
        return { type: "#comment", text: "empty", vtype: 0 };
    } else if (!vnode || !vnode.vtype) {
        throw new Error("@" + type.name + "#render:You may have returned undefined, an array or some other invalid object");
    }
    return vnode;
}

var numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, array: 6, object:8
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

function createElement(type, config, children) {
    var props = {},
        checkProps = 0,
        vtype = 1,
        key = null,
        ref = null,
        argsLen = arguments.length - 2;
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
                checkProps = 1;
                props[i] = val;
            }
        }
    }

    if (argsLen === 1) {
        if (children !== void 0) {
            props.children = children;
        }
    } else if (argsLen > 1) {
        var childArray = Array(argsLen);
        for (var _i = 0; _i < argsLen; _i++) {
            childArray[_i] = arguments[_i + 2];
        }
        props.children = childArray;
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
    if (typeNumber(type) === 5) {
        //fn
        vtype = type.prototype && type.prototype.render ? 2 : 4;
    }
    return new Vnode(type, key, ref, props, vtype, checkProps);
}

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}

function createStringRef(owner, ref) {
    function stringRef(dom) {
        if (dom) {
            if (dom.nodeType) {
                dom.getDOMNode = getDOMNode;
            }
            owner.refs[ref] = dom;
        }
    }
    stringRef.string = ref;
    return stringRef;
}
function Vnode(type, key, ref, props, vtype, checkProps) {
    this.type = type;
    this.props = props;
    this.vtype = vtype;
    var owner = CurrentOwner.cur;
    this._owner = owner;

    if (key) {
        this.key = key;
    }

    if (vtype === 1) {
        this.checkProps = checkProps;
    }
    var refType = typeNumber(ref);
    if (refType === 4) {
        //string
        this.ref = createStringRef(owner, ref);
    } else if (refType === 5) {
        if (ref.string) {
            var ref2 = createStringRef(owner, ref.string);
            this.ref = function (dom) {
                ref(dom);
                ref2(dom);
            };
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

function _flattenChildren(original, convert) {
    var children = [],
        lastText = void 0,
        child = void 0,
        temp = Array.isArray(original) ? original.slice(0) : [original];

    while (temp.length) {
        //比较巧妙地判定是否为子数组
        if ((child = temp.pop()) && child.pop) {
            if (child.toJS) {
                //兼容Immutable.js
                child = child.toJS();
            }
            for (var i = 0; i < child.length; i++) {
                temp[temp.length] = child[i];
            }
        } else {
            // eslint-disable-next-line
            var childType = typeNumber(child);

            if (childType < 3 // 0, 1, 2
            ) {
                    continue;
                }

            if (childType < 6) {
                if (lastText && convert) {
                    //false模式下不进行合并与转换
                    children[0].text = child + children[0].text;
                    continue;
                }
                child = child + "";
                if (convert) {
                    child = {
                        type: "#text",
                        text: child,
                        vtype: 0
                    };
                }
                lastText = true;
            } else {
                lastText = false;
            }

            children.unshift(child);
        }
    }
    return children;
}

function flattenChildren(vnode) {
    var arr = _flattenChildren(vnode.props.children, true);
    if (arr.length === 0) {
        arr = EMPTY_CHILDREN;
    }
    return vnode.vchildren = arr;
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
        return _flattenChildren(children, false).length;
    },
    forEach: function forEach(children, callback, context) {
        _flattenChildren(children, false).forEach(callback, context);
    },
    map: function map(children, callback, context) {
        return _flattenChildren(children, false).map(callback, context);
    },

    toArray: function toArray(children) {
        return _flattenChildren(children, false);
    }
};

var _loop = function _loop(key) {
    var fn = Children[key];
    limitWarn[key] = 1;
    Children[key] = function () {
        if (limitWarn[key]-- > 0) {
            console.warn("请限制使用Children." + key + ",不要窥探虚拟DOM的内部实现,会导致升级问题");
        }
        return fn.apply(null, arguments);
    };
};

for (var key in Children) {
    _loop(key);
}

//用于后端的元素节点
function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
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
        if (child.nodeType === 1) {
            emptyElement(child);
        }
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

function createDOMElement(vnode) {
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

    try {
        if (vnode.ns) {
            return document.createElementNS(vnode.ns, type);
        }
        //eslint-disable-next-line
    } catch (e) {}
    return document.createElement(type);
}
// https://developer.mozilla.org/en-US/docs/Web/MathML/Element/math
var rmathTags = /^m/;
var mathNs = "http://www.w3.org/1998/Math/MathML";
var svgNs = "http://www.w3.org/2000/svg";
var namespaceMap = oneObject("svg", svgNs);
namespaceMap.semantics = mathNs;
// http://demo.yanue.net/HTML5element/
"meter,menu,map,meta,mark".replace(/\w+/g, function (tag) {
    namespaceMap[tag] = null;
});
function getNs(type) {
    if (namespaceMap[type] !== void 666) {
        return namespaceMap[type];
    } else {
        return namespaceMap[type] = rmathTags.test(type) ? mathNs : null;
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
    options.flushBatchedUpdates();
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
        // Unable to preventDefault inside passive event listener due to target being
        // treated as passive
        el.addEventListener(type, fn, /true|false/.test(bool) ? bool : supportsPassive ? {
            passive: false
        } : false);
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
var supportsPassive = false;
try {
    var opts = Object.defineProperty({}, "passive", {
        get: function get() {
            supportsPassive = true;
        }
    });
    document.addEventListener("test", null, opts);
} catch (e) {
    // no catch
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
    var mask = /text|password/.test(dom.type) ? "input" : "change";
    addEvent(document, mask, changeHandle);
};

eventHooks.doubleclick = eventHooks.doubleclickcapture = function () {
    addEvent(document, "dblclick", doubleClickHandle);
};

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
    this.__pendingCallbacks = [];
    this.__pendingStates = [];
    this.__current = {};
    /*
    * this.__hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    * this.__renderInNextCycle = true 表示组件需要在下一周期重新渲染
    * this.__forceUpdate = true 表示会无视shouldComponentUpdate的结果
    */
}

Component.prototype = {
    replaceState: function replaceState() {
        console.warn("此方法末实现"); // eslint-disable-line
    },
    setState: function setState(state, cb) {
        debounceSetState(this, state, cb);
    },
    isMounted: function isMounted() {
        return this.__current._hostNode;
    },
    forceUpdate: function forceUpdate(cb) {
        debounceSetState(this, true, cb);
    },

    __mergeStates: function __mergeStates(props, context) {
        var n = this.__pendingStates.length;
        if (n === 0) {
            return this.state;
        }
        var states = clearArray(this.__pendingStates);
        var nextState = extend({}, this.state);
        for (var i = 0; i < n; i++) {
            var partial = states[i];
            extend(nextState, isFn(partial) ? partial.call(this, nextState, props, context) : partial);
        }
        return nextState;
    },

    render: function render() {}
};

function debounceSetState(a, b, c) {
    if (a.__didUpdate) {
        //如果用户在componentDidUpdate中使用setState，要防止其卡死
        setTimeout(function () {
            a.__didUpdate = false;
            setStateImpl.call(a, b, c);
        }, 300);
        return;
    }
    setStateImpl.call(a, b, c);
}
function setStateImpl(state, cb) {
    if (isFn(cb)) {
        this.__pendingCallbacks.push(cb);
    }
    var hasDOM = this.__current._hostNode;
    if (state === true) {
        //forceUpdate
        this.__forceUpdate = true;
    } else {
        //setState
        this.__pendingStates.push(state);
    }
    if (!hasDOM) {
        //组件挂载期
        //componentWillUpdate中的setState/forceUpdate应该被忽略 
        if (this.__hydrating) {
            //在挂载过程中，子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
            this.__renderInNextCycle = true;
        }
    } else {
        //组件更新期
        if (this.__receiving) {
            //componentWillReceiveProps中的setState/forceUpdate应该被忽略 
            return;
        }
        this.__renderInNextCycle = true;
        if (options.async) {
            //在事件句柄中执行setState会进行合并
            options.enqueueUpdate(this);
            return;
        }
        if (this.__hydrating) {
            // 在componentDidMount里调用自己的setState，延迟到下一周期更新
            // 在更新过程中， 子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
            return;
        }
        //  不在生命周期钩子内执行setState
        options.flushBatchedUpdates([this]);
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
    var curry = Function("ReactComponent", "blacklist", "spec", "return function " + className + "(props, context) {\n      ReactComponent.call(this, props, context);\n\n     for (var methodName in this) {\n        var method = this[methodName];\n        if (typeof method  === \"function\"&& !blacklist[methodName]) {\n          this[methodName] = method.bind(this);\n        }\n      }\n\n      if (spec.getInitialState) {\n        this.state = spec.getInitialState.call(this);\n      }\n\n  };");
    return curry(Component, NOBIND, spec);
}

function createClass(spec) {
    if (limitWarn.createClass-- > 0) {
        console.warn("createClass已经废弃,请改用es6方式定义类"); // eslint-disable-line
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
            Constructor[name] = spec[name];
        }
    });

    if (isFn(spec.getDefaultProps)) {
        Constructor.defaultProps = spec.getDefaultProps();
    }

    return Constructor;
}

function cloneElement(vnode, props) {
    if (Array.isArray(vnode)) {
        vnode = vnode[0];
    }
    if (!vnode.vtype) {
        return Object.assign({}, vnode);
    }
    var owner = vnode._owner,
        lastOwn = CurrentOwner.cur,
        configs = {
        key: vnode.key,
        ref: vnode.ref
    };
    if (props && props.ref) {
        owner = lastOwn;
    }
    Object.assign(configs, vnode.props, props);
    CurrentOwner.cur = owner;
    var ret = createElement(vnode.type, configs, arguments.length > 2 ? [].slice.call(arguments, 2) : configs.children);
    CurrentOwner.cur = lastOwn;
    return ret;
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

// XML 的命名空间对应的 URI
var NAMESPACE_MAP = {
    svg: "http://www.w3.org/2000/svg",
    xmlns: "http://www.w3.org/2000/xmlns/",
    xml: "http://www.w3.org/XML/1998/namespace",
    xlink: "http://www.w3.org/1999/xlink",
    xhtml: "http://www.w3.org/1999/xhtml"
};

//布尔属性的值末必为true,false
//https://github.com/facebook/react/issues/10589
var controlled = {
    value: 1,
    defaultValue: 1
};

var isSpecialAttr = {
    children: 1,
    style: 1,
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
    var isSVG = vnode.ns === NAMESPACE_MAP.svg;
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
var booleanAttr = {};
function isBooleanAttr(dom, name) {
    if (booleanAttr[name]) {
        return true;
    }
    var val = dom[name];
    if (val === true || val === false) {
        return booleanAttr[name] = true;
    }
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
            dom[method + "NS"](NAMESPACE_MAP[prefix], nameRes.name, val || "");
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
                dom[name] = !val ? "" : val;
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
    collectOptions(vnode, props, options$$1);
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
 * @param {any} props
 * @param {Array} ret
 */
function collectOptions(vnode, props, ret) {
    var arr = props.children;
    for (var i = 0, n = arr.length; i < n; i++) {
        var el = arr[i];
        if (el.type === "option") {
            ret.push(el);
        } else if (el.type === "optgroup") {
            collectOptions(el, el.props, ret);
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
        disposeVnode(instance._renderedVnode);
        vnode._instance = null;
    }
}

function disposeElement(vnode) {
    var props = vnode.props,
        vchildren = vnode.vchildren;

    if (props[innerHTML]) {
        removeDOMElement(vnode._hostNode);
    } else {
        for (var i = 0, n = vchildren.length; i < n; i++) {
            disposeVnode(vchildren[i]);
        }
    }
    //eslint-disable-next-line
    vnode.ref && vnode.ref(null);
}

function disposeComponent(vnode) {
    var instance = vnode._instance;
    if (instance) {
        options.beforeUnmount(instance);
        if (instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        var dom = instance.__current._hostNode;
        if (dom) {
            dom.__component = null;
        }
        vnode.ref && vnode.ref(null);
        instance.__current = instance.setState = instance.forceUpdate = noop;
        vnode._instance = instance.__renderInNextCycle = null;
        disposeVnode(vnode._renderedVnode);
    }
}

/**
 * ReactDOM.render 方法
 *
 */
function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
/**
 * ReactDOM.unstable_renderSubtreeIntoContainer 方法， React.render的包装
 *
 */
var pendingRefs = [];
function unstable_renderSubtreeIntoContainer(component, vnode, container, callback) {
    if (limitWarn.renderSubtree-- > 0) {
        console.warn("请限制使用unstable_renderSubtreeIntoContainer,它末见于文档,会导致升级问题"); // eslint-disable-line
    }
    var parentContext = component && component.context || {};
    return renderByAnu(vnode, container, callback, parentContext);
}
function unmountComponentAtNode(dom) {
    var prevVnode = dom.__component;
    if (prevVnode) {
        alignVnode(prevVnode, {
            type: "#comment",
            text: "empty",
            vtype: 0
        }, dom.firstChild, {}, EMPTY_CHILDREN);
    }
}
function isValidElement(vnode) {
    return vnode && vnode.vtype;
}

function clearRefsAndMounts(queue) {
    var refs = pendingRefs.slice(0);
    pendingRefs.length = 0;
    refs.forEach(function (fn) {
        fn();
    });
    queue.forEach(function (instance) {
        if (instance.componentDidMount) {
            instance.componentDidMount();
            instance.componentDidMount = null;
        }
        instance.__hydrating = false;

        while (instance.__renderInNextCycle) {
            _refreshComponent(instance, instance.__current._hostNode, []);
        }
        clearArray(instance.__pendingCallbacks).forEach(function (fn) {
            fn.call(instance);
        });
    });
    queue.length = 0;
}

var dirtyComponents = [];
options.flushBatchedUpdates = function (queue) {
    clearRefsAndMounts(queue || dirtyComponents);
};
options.enqueueUpdate = function (instance) {
    dirtyComponents.push(instance);
};

function refreshComponent(instance, mountQueue) {
    // shouldComponentUpdate为false时不能阻止setState/forceUpdate cb的触发
    var dom = instance.__current._hostNode;
    dom = _refreshComponent(instance, dom, mountQueue);
    while (instance.__renderInNextCycle) {
        dom = _refreshComponent(instance, dom, mountQueue);
    }
    clearArray(instance.__pendingCallbacks).forEach(function (fn) {
        fn.call(instance);
    });

    return dom;
}
/**
 * ReactDOM.render
 * 用于驱动视图第一次刷新
 * @param {any} vnode 
 * @param {any} container 
 * @param {any} callback 
 * @param {any} parentContext 
 * @returns 
 */
function renderByAnu(vnode, container, callback, parentContext) {
    if (!isValidElement(vnode)) {
        throw new Error(vnode + "\u5FC5\u987B\u4E3A\u7EC4\u4EF6\u6216\u5143\u7D20\u8282\u70B9, \u4F46\u73B0\u5728\u4F60\u7684\u7C7B\u578B\u5374\u662F" + Object.prototype.toString.call(vnode));
    }
    if (!container || container.nodeType !== 1) {
        console.warn(container + "\u5FC5\u987B\u4E3A\u5143\u7D20\u8282\u70B9"); // eslint-disable-line
        return;
    }
    var mountQueue = [];
    var lastVnode = container.__component;
    mountQueue.mountAll = true;

    parentContext = parentContext || {};

    var rootNode = lastVnode ? alignVnode(lastVnode, vnode, container.firstChild, parentContext, mountQueue) : genVnodes(vnode, container, parentContext, mountQueue);

    // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
    // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数

    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container.__component = vnode;
    clearRefsAndMounts(mountQueue);
    var ret = instance || rootNode;

    if (callback) {
        callback.call(ret); //坑
    }

    return ret;
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
}

function genVnodes(vnode, container, context, mountQueue) {
    var nodes = getNodes(container);
    var prevRendered = null;
    //eslint-disable-next-line
    for (var i = 0, el; el = nodes[i++];) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            prevRendered = el;
        } else {
            el.parentNode.removeChild(el);
        }
    }

    var rootNode = mountVnode(vnode, context, prevRendered, mountQueue);
    container.appendChild(rootNode);

    return rootNode;
}

var formElements = {
    select: 1,
    textarea: 1,
    input: 1
};

var patchStrategy = {
    0: mountText,
    1: mountElement,
    2: mountComponent,
    4: mountStateless,
    10: updateText,
    11: updateElement,
    12: updateComponent,
    14: updateStateless
};

function mountVnode(vnode, context, prevRendered, mountQueue) {
    return patchStrategy[vnode.vtype](vnode, context, prevRendered, mountQueue);
}

function mountText(vnode, context, prevRendered) {
    var node = prevRendered && prevRendered.nodeName === vnode.type ? prevRendered : createDOMElement(vnode);
    vnode._hostNode = node;
    return node;
}

function addNS(vnode) {
    var type = typeNumber(vnode.props.children);

    if (type < 7) {
        return;
    } else if (type === 7) {
        vnode.props.children.forEach(function (child) {
            child.ns = vnode.ns;
        });
    } else if (type === 8) {
        vnode.props.children.ns = vnode.ns;
    }
}

function genMountElement(vnode, type, prevRendered) {
    if (prevRendered && toLowerCase(prevRendered.nodeName) === type) {
        return prevRendered;
    } else {
        vnode.ns = !vnode.ns ? getNs(type) : vnode.ns;
        if (vnode.ns) {
            addNS(vnode);
        }
        var dom = createDOMElement(vnode);
        if (prevRendered) {
            while (prevRendered.firstChild) {
                dom.appendChild(prevRendered.firstChild);
            }
        }

        return dom;
    }
}

function mountElement(vnode, context, prevRendered, mountQueue) {
    var type = vnode.type,
        props = vnode.props,
        ref = vnode.ref;

    var dom = genMountElement(vnode, type, prevRendered);

    vnode._hostNode = dom;

    var method = prevRendered ? alignChildren : mountChildren;
    method(vnode, dom, context, mountQueue);

    if (vnode.checkProps) {
        diffProps(props, {}, vnode, {}, dom);
    }
    if (ref) {
        pendingRefs.push(ref.bind(0, dom));
    }
    if (formElements[type]) {
        processFormElement(vnode, dom, props);
    }

    return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(vnode, parentNode, context, mountQueue) {
    var children = flattenChildren(vnode);
    for (var i = 0, n = children.length; i < n; i++) {
        var el = children[i];
        var curNode = mountVnode(el, context, null, mountQueue);

        parentNode.appendChild(curNode);
    }
}

function alignChildren(vnode, parentNode, context, mountQueue) {
    var children = flattenChildren(vnode),
        childNodes = parentNode.childNodes,
        insertPoint = childNodes[0] || null,
        j = 0,
        n = children.length;
    for (var i = 0; i < n; i++) {
        var el = children[i];
        var lastDom = childNodes[j];
        var dom = mountVnode(el, context, lastDom, mountQueue);
        if (dom === lastDom) {
            j++;
        }
        parentNode.insertBefore(dom, insertPoint);
        insertPoint = dom.nextSibling;
    }
    while (childNodes[n]) {
        parentNode.removeChild(childNodes[n]);
    }
}

function mountComponent(vnode, context, prevRendered, mountQueue) {
    var type = vnode.type,
        ref = vnode.ref,
        props = vnode.props;

    var lastOwn = CurrentOwner.cur;
    var instance = new type(props, context); //互相持有引用
    // CurrentOwner.reset();
    CurrentOwner.cur = lastOwn;
    vnode._instance = instance;
    //防止用户没有调用super或没有传够参数
    instance.props = instance.props || props;
    instance.context = instance.context || context;

    if (instance.componentWillMount) {
        instance.componentWillMount();
        instance.state = instance.__mergeStates(props, context);
    }

    var rendered = renderComponent.call(instance, vnode, props, context);
    instance.__hydrating = true;
    var childContext = rendered.vtype ? getChildContext(instance, context) : context;
    instance.__childContext = context; //用于在updateChange中比较
    var dom = mountVnode(rendered, childContext, prevRendered, mountQueue);
    vnode._hostNode = dom;
    mountQueue.push(instance);
    if (ref) {
        pendingRefs.push(ref.bind(0, instance));
    }

    options.afterMount(instance);
    return dom;
}

function Stateless(render) {
    this.refs = {};
    this.__render = render;
    this.__current = {};
}

var renderComponent = function renderComponent(vnode, props, context) {
    var lastOwn = CurrentOwner.cur;
    CurrentOwner.cur = this;
    var rendered = this.__render ? this.__render(props, context) : this.render();
    CurrentOwner.cur = lastOwn;
    rendered = checkNull(rendered, vnode.type);
    this.context = context;
    this.props = props;
    vnode._instance = this;
    var dom = this.__current._hostNode;
    this.__current = vnode;
    vnode._hostNode = dom;
    vnode._renderedVnode = rendered;
    return rendered;
};

Stateless.prototype.render = renderComponent;
function mountStateless(vnode, context, prevRendered, mountQueue) {
    var type = vnode.type,
        props = vnode.props,
        ref = vnode.ref;

    var instance = new Stateless(type);
    var rendered = instance.render(vnode, props, context);
    var dom = mountVnode(rendered, context, prevRendered, mountQueue);
    if (ref) {
        pendingRefs.push(ref.bind(0, null));
    }
    return vnode._hostNode = dom;
}

function updateStateless(lastTypeVnode, nextTypeVnode, context, mountQueue) {
    var instance = lastTypeVnode._instance;
    var lastVnode = lastTypeVnode._renderedVnode;
    var nextVnode = instance.render(nextTypeVnode, nextTypeVnode.props, context);
    var dom = alignVnode(lastVnode, nextVnode, lastVnode._hostNode, context, mountQueue);
    nextTypeVnode._hostNode = dom;
    return dom;
}
var contextHasChange = false;
var contextStatus = [];
function isEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return 1;
        }
    }
    return 0;
}
function _refreshComponent(instance, dom, mountQueue) {
    var lastProps = instance.lastProps,
        lastContext = instance.lastContext,
        lastState = instance.state,
        nextContext = instance.context,
        vnode = instance.__current,
        nextProps = instance.props;


    lastProps = lastProps || nextProps;
    var nextState = instance.__mergeStates(nextProps, nextContext);
    instance.props = lastProps;

    instance.__renderInNextCycle = null;
    if (!instance.__forceUpdate && instance.shouldComponentUpdate && instance.shouldComponentUpdate(nextProps, nextState, nextContext) === false) {
        instance.__forceUpdate = false;
        return dom;
    }
    instance.__hydrating = true;
    instance.__forceUpdate = false;
    if (instance.componentWillUpdate) {
        instance.componentWillUpdate(nextProps, nextState, nextContext);
    }
    instance.props = nextProps;
    instance.state = nextState;

    var lastRendered = vnode._renderedVnode;
    var nextElement = instance.__next || vnode;
    if (!lastRendered._hostNode) {
        lastRendered._hostNode = dom;
    }
    var rendered = renderComponent.call(instance, nextElement, nextProps, nextContext);
    delete instance.__next;
    var childContext = rendered.vtype ? getChildContext(instance, nextContext) : nextContext;

    contextStatus.push(contextHasChange);

    var prevChildContext = instance.__childContext;
    instance.__childContext = childContext;
    //如果两个context都为空对象，就不比较引用，认为它们没有变
    contextHasChange = isEmpty(prevChildContext) + isEmpty(childContext) && prevChildContext !== childContext;

    dom = alignVnode(lastRendered, rendered, dom, childContext, mountQueue);

    contextHasChange = contextStatus.pop();

    nextElement._hostNode = dom;

    if (instance.componentDidUpdate) {
        instance.__didUpdate = true;
        instance.componentDidUpdate(lastProps, lastState, lastContext);
        if (!instance.__renderInNextCycle) {
            instance.__didUpdate = false;
        }
    }

    instance.__hydrating = false;

    options.afterUpdate(instance);
    if (instance.__renderInNextCycle && mountQueue.mountAll) {
        mountQueue.push(instance);
    }
    return dom;
}

function updateComponent(lastVnode, nextVnode, context, mountQueue) {
    var instance = nextVnode._instance = lastVnode._instance;
    instance.__next = nextVnode;
    var nextProps = nextVnode.props;
    instance.lastProps = instance.props;
    instance.lastContext = instance.context;

    if (instance.componentWillReceiveProps) {
        instance.__receiving = true;
        instance.componentWillReceiveProps(nextProps, context);
        instance.__receiving = false;
    }

    instance.props = nextProps;
    instance.context = context;
    if (nextVnode.ref) {
        pendingRefs.push(nextVnode.ref.bind(0, instance));
    }
    return refreshComponent(instance, mountQueue);
}

function alignVnode(lastVnode, nextVnode, node, context, mountQueue) {

    var dom = node;
    //eslint-disable-next-line

    if (lastVnode.type !== nextVnode.type || lastVnode.key !== nextVnode.key) {

        disposeVnode(lastVnode);
        var innerMountQueue = mountQueue.mountAll ? mountQueue : nextVnode.vtype === 2 ? [] : mountQueue;
        dom = mountVnode(nextVnode, context, null, innerMountQueue);
        var p = node.parentNode;
        if (p) {
            p.replaceChild(dom, node);
            removeDOMElement(node);
        }
        if (innerMountQueue !== mountQueue) {
            clearRefsAndMounts(innerMountQueue);
        }
    } else if (lastVnode !== nextVnode || contextHasChange) {
        dom = updateVnode(lastVnode, nextVnode, context, mountQueue);
    }

    return dom;
}

function findDOMNode(ref) {
    if (ref == null) {
        return null;
    }
    if (ref.nodeType === 1) {
        return ref;
    }
    var vnode = ref.__current;
    return vnode._hostNode || null;
}

function updateText(lastVnode, nextVnode) {
    var dom = lastVnode._hostNode;
    nextVnode._hostNode = dom;
    if (lastVnode.text !== nextVnode.text) {
        dom.nodeValue = nextVnode.text;
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, context, mountQueue) {
    var dom = lastVnode._hostNode;
    var lastProps = lastVnode.props;
    var nextProps = nextVnode.props;
    var ref = nextVnode.ref;
    nextVnode._hostNode = dom;
    if (nextProps[innerHTML]) {
        var list = lastVnode.vchildren || [];
        list.forEach(function (el) {
            disposeVnode(el);
        });
    } else {
        if (lastProps[innerHTML]) {
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
            mountChildren(nextVnode, dom, context, mountQueue);
        } else {
            updateChildren(lastVnode, nextVnode, nextVnode._hostNode, context, mountQueue);
        }
    }

    if (lastVnode.checkProps || nextVnode.checkProps) {
        diffProps(nextProps, lastProps, nextVnode, lastVnode, dom);
    }
    if (nextVnode.type === "select") {
        postUpdateSelectedOptions(nextVnode);
    }
    if (ref) {
        pendingRefs.push(ref.bind(0, dom));
    }
    return dom;
}

function updateVnode(lastVnode, nextVnode, context, mountQueue) {
    return patchStrategy[lastVnode.vtype + 10](lastVnode, nextVnode, context, mountQueue);
}

function updateChildren(lastVnode, nextVnode, parentNode, context, mountQueue) {
    var lastChildren = lastVnode.vchildren;
    var nextChildren = flattenChildren(nextVnode); //nextVnode.props.children;
    var childNodes = parentNode.childNodes;
    var mountAll = mountQueue.mountAll;
    if (nextChildren.length == 0) {
        lastChildren.forEach(function (el) {
            var node = el._hostNode;
            if (node) {
                removeDOMElement(node);
            }
            disposeVnode(el);
        });
        return;
    }
    var hashcode = {};
    lastChildren.forEach(function (el) {
        var key = el.type + (el.key || "");
        var list = hashcode[key];
        if (list) {
            list.push(el);
        } else {
            hashcode[key] = [el];
        }
    });
    nextChildren.forEach(function (el) {
        var key = el.type + (el.key || "");
        var list = hashcode[key];
        if (list) {
            var old = list.shift();
            if (old) {
                el.old = old;
                if (!list.length) {
                    delete hashcode[key];
                }
            }
        }
    });
    for (var i in hashcode) {
        var list = hashcode[i];
        if (Array.isArray(list)) {
            list.forEach(function (el) {
                var node = el._hostNode;
                if (node) {
                    removeDOMElement(node);
                }
                disposeVnode(el);
            });
        }
    }
    nextChildren.forEach(function (el, index) {
        var old = el.old,
            ref = void 0,
            dom = void 0,
            queue = mountAll ? mountQueue : [];
        if (old) {
            delete el.old;

            if (el === old && old._hostNode && !contextHasChange) {
                //cloneElement
                dom = old._hostNode;
            } else {
                dom = updateVnode(old, el, context, queue);
            }
        } else {
            dom = mountVnode(el, context, null, queue);
        }
        ref = childNodes[index];
        if (dom !== ref) {
            insertDOM(parentNode, dom, ref);
        }
        if (!mountAll && queue.length) {
            clearRefsAndMounts(queue);
        }
    });
    var n = nextChildren.length;
    while (childNodes[n]) {
        parentNode.removeChild(childNodes[n]);
    }
}
function insertDOM(parentNode, dom, ref) {
    if (!dom) {
        return console.warn("元素末初始化"); // eslint-disable-line
    }
    if (!ref) {
        parentNode.appendChild(dom);
    } else {
        parentNode.insertBefore(dom, ref);
    }
}

var React = {
    version: "1.1.1",
    render: render,
    options: options,
    PropTypes: PropTypes,
    Children: Children, //为了react-redux
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
