(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

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
/**
 * 一个空函数
 *
 * @export
 */

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
}



/**
 * 收集该虚拟DOM的所有组件实例，方便依次执行它们的生命周期钩子
 *
 * @param {any} instance
 * @returns
 */
function getInstances(instance) {
    var instances = [instance];
    while (instance = instance.parentInstance) {
        instances.push(instance);
    }
    return instances;
}

/**
 *
 *
 * @param {any} type
 * @returns
 */
function isFn(type) {
    return typeof type === 'function';
}

/**
 *
 *
 * @export
 * @param {any} type
 * @returns
 */
function isStateless(type) {
    var fn = type.prototype;
    return isFn(type) && (!fn || !fn.render);
}

var rword = /[^, ]+/g;

function oneObject(array, val) {
    if (typeof array === 'string') {
        array = array.match(rword) || [];
    }
    var result = {},
        value = val !== void 0 ? val : 1;
    for (var i = 0, n = array.length; i < n; i++) {
        result[array[i]] = value;
    }
    return result;
}

function getContext(instance, context) {
    if (instance.getChildContext) {
        return extend(extend({}, context), instance.getChildContext());
    }
    return context;
}
var rcamelize = /[-_][^-_]/g;
function camelize(target) {
    //提前判断，提高getStyle等的效率
    if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
        return target;
    }
    //转换为驼峰风格
    return target.replace(rcamelize, function (match) {
        return match.charAt(1).toUpperCase();
    });
}
var midway = {
    updateBatchNumber: 1,
    immune: {} // Object.freeze(midway) ;midway.aaa = 'throw err';midway.immune.aaa = 'safe'
};

/**
 * 获取虚拟DOM对应的顶层组件实例的类型
 *
 * @param {any} vnode
 * @param {any} instance
 * @param {any} pool
 */

function getComponentName(type) {
    return typeof type === 'function' ? type.displayName || type.name : type;
}
var recyclableNodes = [];

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

//用于后端的元素节点
function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
}
var fn = DOMElement.prototype = {
    contains: Boolean
};
String('replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute' + ',getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent' + ',detachEvent').replace(/\w+/g, function (name) {
    fn[name] = function () {
        console.log('fire ' + name);
    };
});

//用于后端的document
var fakeDoc = new DOMElement();
fakeDoc.createElement = fakeDoc.createElementNS = function (type) {
    return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement('html');
fakeDoc.nodeName = '#document';
var win = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : {
    document: fakeDoc
};



var document = win.document || fakeDoc;

var versions = {
    objectobject: 7, //IE7-8
    objectundefined: 6, //IE6
    undefinedfunction: NaN, // other modern browsers
    undefinedobject: NaN
};
/* istanbul ignore next  */
var msie = document.documentMode || versions[_typeof(document.all) + (typeof XMLHttpRequest === 'undefined' ? 'undefined' : _typeof(XMLHttpRequest))];

var modern = /NaN|undefined/.test(msie) || msie > 8;

function createDOMElement(vnode) {
    var type = vnode.type;
    if (type === '#text') {
        var node = recyclableNodes.pop();
        if (node) {
            node.nodeValue = vnode.text;
            return node;
        }
        return document.createTextNode(vnode.text);
    }
    if (type === '#comment') {
        return document.createComment(vnode.text);
    }

    try {
        if (vnode.ns) {
            return document.createElementNS(vnode.ns, type);
        }
    } catch (e) {}
    return document.createElement(type);
}
// https://developer.mozilla.org/en-US/docs/Web/MathML/Element/math
// http://demo.yanue.net/HTML5element/
var mhtml = {
    meter: 1,
    menu: 1,
    map: 1,
    meta: 1,
    mark: 1
};
var svgTags = oneObject('' +
// structure
'svg,g,defs,desc,metadata,symbol,use,' +
// image & shape
'image,path,rect,circle,line,ellipse,polyline,polygon,' +
// text
'text,tspan,tref,textpath,' +
// other
'marker,pattern,clippath,mask,filter,cursor,view,animate,' +
// font
'font,font-face,glyph,missing-glyph', svgNs);

var rmathTags = /^m/;
var mathNs = 'http://www.w3.org/1998/Math/MathML';
var svgNs = 'http://www.w3.org/2000/svg';
var mathTags = {
    semantics: mathNs
};

function getNs(type) {
    if (svgTags[type]) {
        return svgNs;
    } else if (mathTags[type]) {
        return mathNs;
    } else {
        if (!mhtml[type] && rmathTags.test(type)) {
            return mathTags[type] = mathNs;
        }
    }
}

var CurrentOwner = {
    cur: null
};

var shallowEqualHack = Object.freeze([]); //用于绕过shallowEqual
/**
 * 创建虚拟DOM
 *
 * @param {string} type
 * @param {object} props
 * @param {array} children
 * @returns
 */
function createElement(type, configs, children) {
    var props = {};
    var key = null;
    configs = configs || {};
    if (configs.key != null) {
        key = configs.key + '';
        delete configs.key;
    }
    extend(props, configs);
    var c = [].slice.call(arguments, 2);
    var useEmpty = true;
    if (!c.length) {
        if (props.children && props.children.length) {
            c = props.children;
            useEmpty = false;
        }
    } else {
        useEmpty = false;
    }
    if (useEmpty) {
        c = shallowEqualHack;
    } else {
        c = flatChildren(c);
        delete c.merge; //注意这里的顺序
        Object.freeze(c);
    }

    props.children = c;
    Object.freeze(props);
    return new Vnode(type, props, key, CurrentOwner.cur);
}

function Vnode(type, props, key, owner) {
    this.type = type;
    this.props = props;

    if (key) {
        this.key;
    }
    var ns = getNs(type);
    if (ns) {
        this.ns = ns;
    }
    /*
    this._hostNode = null
    this._instance = null
    this._hostParent = null
    */
    if (owner) {
        this._owner = owner;
    }
}

Vnode.prototype = {
    getDOMNode: function getDOMNode() {
        return this._hostNode || null;
    },
    $$typeof: 1
};
// 如果是组件的虚拟DOM，如果它
/**
 * 遍平化children，并合并相邻的简单数据类型
 *
 * @param {array} children
 * @param {any} [ret=[]]
 * @returns
 */

function flatChildren(children, ret, deep) {
    ret = ret || [];
    deep = deep || 0;
    for (var i = children.length; i--;) {
        //从后向前添加
        var el = children[i];
        if (el == null) {
            el = '';
        }
        var type = typeof el === 'undefined' ? 'undefined' : _typeof(el);
        if (el === '' || type === 'boolean') {
            continue;
        }
        if (/number|string/.test(type) || el.type === '#text') {
            if (el === '' || el.text == '') {
                continue;
            }
            if (ret.merge) {
                ret[0].text = (el.type ? el.text : el) + ret[0].text;
            } else {
                ret.unshift(el.type ? el : {
                    type: '#text',
                    text: String(el),
                    deep: deep
                });
                ret.merge = true;
            }
        } else if (Array.isArray(el)) {
            flatChildren(el, ret, deep + 1);
        } else {
            ret.unshift(el);
            el.deep = deep;
            ret.merge = false;
        }
    }
    return ret;
}

var queue = [];
var callbacks = [];

function setStateWarn() {
    /* istanbul ignore next */
    if (transaction.isInTransation) {
        console.warn('\u8BF7\u4E0D\u8981\u5728\'render\', \'componentWillUpdate\',\'componentDidUpdate\',\u6216\u7EC4\u4EF6\u7684\u6784\u9020\u5668\u4E2D\n       \xA0\u8C03\u7528setState\uFF0CforceUpdate\u65B9\u6CD5\uFF0C\u5426\u5219\u4F1A\u9020\u6210\u6B7B\u5FAA\u73AF\uFF0C\u4F60\u53EF\u4EE5\u5C06\u76F8\u5173\u903B\u8F91\u653E\u5230\'componentWillMount\'\u94A9\u5B50');
    }
}

var transaction = {
    isInTransation: false,
    enqueueCallback: function enqueueCallback(obj) {
        //它们是保证在ComponentDidUpdate后执行
        callbacks.push(obj);
    },
    renderWithoutSetState: function renderWithoutSetState(instance, nextProps, context) {
        instance.setState = instance.forceUpdate = setStateWarn;
        try {
            CurrentOwner.cur = instance;
            var vnode = instance.render(nextProps, context);
            if (vnode === null) {
                vnode = {
                    type: '#comment',
                    text: 'empty'
                };
            }
        } finally {
            CurrentOwner.cur = null;
            delete instance.setState;
            delete instance.forceUpdate;
        }

        return vnode;
    },
    enqueue: function enqueue(instance) {
        if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) === 'object') {
            queue.push(instance);
        }
        if (!this.isInTransation) {
            this.isInTransation = true;

            if (instance) midway.updateBatchNumber++;
            var globalBatchNumber = midway.updateBatchNumber;

            var renderQueue = queue.concat();
            var processingCallbacks = callbacks.concat();

            queue.length = callbacks.length = 0;
            renderQueue.forEach(function (inst) {
                try {
                    if (inst._updateBatchNumber === globalBatchNumber) {
                        midway.immune.updateComponent(inst);
                    }
                } catch (e) {
                    /* istanbul ignore next */
                    console.warn(e);
                }
            });
            this.isInTransation = false;
            processingCallbacks.forEach(function (request) {
                request.cb.call(request.instance);
            });
            /* istanbul ignore next */
            if (queue.length) {
                this.enqueue(); //用于递归调用自身)
            }
        }
    }
};

/**
 *
 *
 * @param {any} props
 * @param {any} context
 */

function Component(props, context) {
    this.context = context;
    this.props = props;
    // this.uuid = Math.random()
    this.refs = {};
    if (!this.state) this.state = {};
}

Component.prototype = {
    setState: function setState(state, cb) {
        var arr = this._pendingStateQueue = this._pendingStateQueue || [];
        arr.push(state);
        setStateProxy(this, cb);
    },
    getBaseVnode: function getBaseVnode() {
        var p = this;
        do {
            if (p.vnode) {
                return p.vnode;
            }
        } while (p = p.parentInstance);
    },
    forceUpdate: function forceUpdate(cb) {
        this._pendingForceUpdate = true;
        setStateProxy(this, cb);
    },

    _processPendingState: function _processPendingState(props, context) {

        var queue = this._pendingStateQueue;
        delete this._pendingStateQueue;

        if (!queue) {
            return this.state;
        }

        var nextState = extend({}, this.state);
        for (var i = 0; i < queue.length; i++) {
            var partial = queue[i];
            extend(nextState, isFn(partial) ? partial.call(this, nextState, props, context) : partial);
        }

        return nextState;
    },

    render: function render() {}
};

/**
 * 让外面的setState与forceUpdate都共用同一通道
 *
 * @param {any} instance
 * @param {any} state
 * @param {any} cb fire by component did update
 * @param {any} force ignore shouldComponentUpdate
 */

function setStateProxy(instance, cb) {
    if (isFn(cb)) transaction.enqueueCallback({ //确保回调先进入
        component: instance,
        cb: cb
    });
    if (!instance._updateBatchNumber) {
        instance._updateBatchNumber = midway.updateBatchNumber + 1;
    }
    transaction.enqueue(instance);
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
        return true;
    }

    if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

function PureComponent(props, context) {
    this.props = props;
    this.context = context;
}

inherit(PureComponent, Component);

var fn$1 = PureComponent.prototype;

fn$1.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
    var a = shallowEqual(this.props, nextProps);
    var b = shallowEqual(this.state, nextState);
    return !a || !b;
};
fn$1.isPureComponent = true;

var Children = {
	only: function only(children) {
		return children && children[0] || null;
	},
	count: function count(children) {
		return children && children.length || 0;
	}
};
/*
function proptype() {}
proptype.isRequired = proptype;

export const PropTypes = {
	element: proptype,
	func: proptype,
	shape: () => proptype,
	instanceOf: ()=> proptype
};
*/

var lifecycle = {
    '-2': 'getDefaultProps',
    '-1': 'getInitialState',
    '0': 'componentWillMount',
    '1': 'render',
    '2': 'componentDidMount',
    '3': 'componentWillReceiveProps',
    '4': 'shouldComponentUpdate',
    '5': 'componentWillUpdate',
    '6': 'componentDidUpdate',
    '7': 'componentWillUnmount'
};

/**
 * 
 * 
 * @export
 * @param {Component} instance 
 * @param {number} index 
 * @returns 
 */
function applyComponentHook(instance, index) {
    if (instance) {
        var method = lifecycle[index];
        if (instance[method]) {
            return instance[method].apply(instance, [].slice.call(arguments, 2));
        }
    }
}

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}

/**
 * 收集DOM到组件实例的refs中
 * 
 * @param {any} instance 
 * @param {any} ref 
 * @param {any} dom 
 */
function patchRef(instance, ref, dom) {
    if (typeof ref === 'function') {
        ref(dom);
    } else if (instance && typeof ref === 'string') {
        instance.refs[ref] = dom;
        dom.getDOMNode = getDOMNode;
    }
}

function removeRef(instance, ref) {
    if (typeof ref === 'function') {
        ref(null);
    } else if (instance && typeof ref === 'string') {
        delete instance.refs[ref];
    }
}

/**
 * 将组件节点转化为简单的虚拟节点
 * 
 * @export
 * @param {any} vnode 
 * @param {any} context 
 * @param {any} parentInstance 
 * @returns 
 */
function toVnode(vnode, context, parentInstance) {

    var Type = vnode.type,
        instance,
        rendered;

    if (isFn(Type)) {
        var props = vnode.props;
        if (isStateless(Type)) {
            //处理无状态组件
            instance = new Component(null, context);
            instance.render = instance.statelessRender = Type;
            rendered = transaction.renderWithoutSetState(instance, props, context);
        } else {

            //处理普通组件
            var defaultProps = Type.defaultProps || applyComponentHook(Type, -2) || {};
            props = extend({}, props); //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
            for (var i in defaultProps) {
                if (props[i] === void 666) {
                    props[i] = defaultProps[i];
                }
            }
            instance = new Type(props, context);

            //必须在这里添加vnode，因为willComponent里可能进行setState操作
            Component.call(instance, props, context); //重点！！
            applyComponentHook(instance, 0); //componentWillMount
            rendered = transaction.renderWithoutSetState(instance);
        }
        instance._rendered = rendered;
        if (vnode.key) rendered.key = vnode.key;
        vnode._instance = instance;

        if (parentInstance) {

            instance.parentInstance = parentInstance;
        } else {
            instance.vnode = vnode;
        }

        //<App />下面存在<A ref="a"/>那么AppInstance.refs.a = AInstance
        patchRef(vnode._owner, vnode.props.ref, instance);

        if (instance.getChildContext) {
            context = rendered.context = getContext(instance, context); //将context往下传
        }
        return toVnode(rendered, context, instance);
    } else {

        vnode.context = context;
        return vnode;
    }
}

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
    var old = {};
    for (var name in newStyle) {
        var val = newStyle[name];
        if (oldStyle[name] !== val) {
            name = cssName(name, dom);
            if (val === void 0 || val === null || val === false) {
                val = ''; //清除样式
            } else if (rnumber.test(val) && !cssNumber[name]) {
                val = val + 'px'; //添加单位
            }
            dom.style[name] = val; //应用样式
        }
    }
    // 如果旧样式存在，但新样式已经去掉
    for (var name in oldStyle) {
        if (!(name in newStyle)) {
            dom.style[name] = ''; //清除样式
        }
    }
}

var cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom');

var cssMap = oneObject('float', 'cssFloat');

//var testStyle = document.documentElement.style
var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'];

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

var eventMap = {};
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

function dispatchEvent(e) {
    e = new SyntheticEvent(e);
    var target = e.target;
    var paths = [];
    do {
        var events = target.__events;
        if (events) {
            paths.push({ dom: target, props: events });
        }
    } while ((target = target.parentNode) && target.nodeType === 1);

    var type = eventMap[e.type] || e.type;

    var capitalized = capitalize(type);
    var bubble = 'on' + capitalized;
    var captured = 'on' + capitalized + 'Capture';
    transaction.isInTransation = true;
    for (var i = paths.length; i--;) {
        //从上到下
        var path = paths[i];
        var fn = path.props[captured];
        if (typeof fn === 'function') {
            e.currentTarget = path._hostNode;
            fn.call(path._hostNode, e);
            if (e._stopPropagation) {
                break;
            }
        }
    }

    for (var i = 0, n = paths.length; i < n; i++) {
        //从下到上
        var path = paths[i];
        var fn = path.props[bubble];
        if (typeof fn === 'function') {
            e.currentTarget = path._hostNode;
            fn.call(path._hostNode, e);
            if (e._stopPropagation) {
                break;
            }
        }
    }
    transaction.isInTransation = false;
    transaction.enqueue(true);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

var globalEvents = {};
function addGlobalEventListener(name) {
    if (!globalEvents[name]) {
        globalEvents[name] = true;
        addEvent(document, name, dispatchEvent);
    }
}
function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
}

var eventLowerCache = {};
var ron = /^on/;
var rcapture = /Capture$/;
function getBrowserName(onStr) {
    var lower = eventLowerCache[onStr];
    if (lower) {
        return lower;
    }
    var hump = onStr.replace(ron, '').replace(rcapture, '');
    lower = hump.toLowerCase();
    eventLowerCache[onStr] = lower;
    eventMap[lower] = hump;
    return lower;
}

function SyntheticEvent(event) {
    if (event.originalEvent) {
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
    var target = this.target;
    this.fixEvent();
    this.timeStamp = new Date() - 0;
    this.originalEvent = event;
}

var eventProto = SyntheticEvent.prototype = {
    fixEvent: function fixEvent() {}, //留给以后扩展用
    preventDefault: function preventDefault() {
        var e = this.originalEvent || {};
        e.returnValue = this.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
        }
    },
    stopPropagation: function stopPropagation() {
        var e = this.originalEvent || {};
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
        return '[object Event]';
    }
};

function clickHack() {}
var inMobile = 'ontouchstart' in document;

var xlink = "http://www.w3.org/1999/xlink";
var stringAttributes = {};
var builtIdProperties = {}; //不规则的属性名映射

//防止压缩时出错

/*
  contenteditable不是布尔属性
  http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/
  contenteditable=''
  contenteditable='events'
  contenteditable='caret'
  contenteditable='plaintext-only'
  contenteditable='true'
  contenteditable='false'
   */
var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls', 'declare,disabled,defer,defaultChecked,defaultSelected,', 'isMap,loop,multiple,noHref,noResize,noShade', 'open,readOnly,selected'].join(',');
var boolAttributes = {};
bools.replace(/\w+/g, function (name) {
    boolAttributes[name] = true;
});

var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan', 'dateTime,defaultValue,contentEditable,frameBorder,maxLength,marginWidth', 'marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'].join(',');

anomaly.replace(/\w+/g, function (name) {
    builtIdProperties[name] = name;
});
String('value,id,title,alt,htmlFor,longDesc,className').replace(/\w+/g, function (name) {
    builtIdProperties[name] = name;
    stringAttributes[name] = name;
});
/**
 *
 * 修改dom的属性与事件
 * @export
 * @param {any} props
 * @param {any} prevProps
 * @param {any} vnode
 * @param {any} prevVnode
 */
function diffProps(props, prevProps, vnode, prevVnode) {
    /* istanbul ignore if */
    if (props === prevProps) {
        return;
    }
    var dom = vnode._hostNode;

    var instance = vnode._owner;
    if (prevVnode._wrapperState) {
        vnode._wrapperState = prevVnode._wrapperState;
        delete prevVnode._wrapperState;
    }
    var isHTML = !vnode.ns;
    var diffRef = false;
    for (var name in props) {
        var val = props[name];
        switch (name) {
            case 'children':
            case 'key':
                break;
            case 'style':
                patchStyle(dom, prevProps.style || {}, val);
                break;
            case 'ref':
                if (prevProps[name] !== val) {
                    diffRef = {
                        val: val
                    };
                }
                break;
            case 'dangerouslySetInnerHTML':
                var oldhtml = prevProps[name] && prevProps[name].__html;
                if (val && val.__html !== oldhtml) {
                    dom.innerHTML = val.__html;
                }
                break;
            default:
                if (isEventName(name)) {
                    if (!prevProps[name]) {
                        //添加全局监听事件
                        var eventName = getBrowserName(name); //带on

                        var curType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
                        /* istanbul ignore if */
                        if (curType !== 'function') throw 'Expected ' + name + ' listener to be a function, instead got type ' + curType;
                        addGlobalEventListener(eventName);
                    }
                    /* istanbul ignore if */
                    if (inMobile && eventName === 'click') {
                        elem.addEventListener('click', clickHack);
                    }
                    var events = dom.__events || (dom.__events = {});
                    events[name] = val;
                } else if (val !== prevProps[name]) {
                    if (isHTML && boolAttributes[name] && typeof dom[name] === 'boolean') {
                        // 布尔属性必须使用el.xxx = true|false方式设值 如果为false, IE全系列下相当于setAttribute(xxx,''),
                        // 会影响到样式,需要进一步处理
                        dom[name] = !!val;
                    }
                    if (val === false || val === void 666 || val === null) {
                        operateAttribute(dom, name, '', !isHTML);
                        continue;
                    }
                    if (isHTML && builtIdProperties[name]) {
                        // 特殊照顾value, 因为value可以是用户自己输入的，这时再触发onInput，再修改value，但这时它们是一致的 <input
                        // value={this.state.value} onInput={(e)=>setState({value: e.target.value})} />
                        if (stringAttributes[name]) val = val + '';
                        if (name !== 'value' || dom[name] !== val) {
                            dom[name] = val;
                        }
                    } else {
                        operateAttribute(dom, name, val, !isHTML);
                    }
                }
        }
    }
    //如果旧属性在新属性对象不存在，那么移除DOM
    for (var _name in prevProps) {
        if (!(_name in props)) {
            if (_name === 'ref') {
                removeRef(instance, prevProps.ref);
            } else if (isEventName(_name)) {
                //移除事件
                var events = dom.__events || {};
                delete events[_name];
            } else {
                //移除属性
                if (isHTML && builtIdProperties[_name]) {
                    dom[_name] = builtIdProperties[_name] === true ? false : '';
                } else {
                    operateAttribute(dom, _name, '', !isHTML);
                }
            }
        }
    }
    if (diffRef) {
        patchRef(instance, diffRef.val, dom);
    }
}

function operateAttribute(dom, name, value, isSVG) {

    var method = value === '' ? 'removeAttribute' : 'setAttribute',
        namespace = null;
    // http://www.w3school.com.cn/xlink/xlink_reference.asp
    // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enha
    // ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
    // xlinkTitle, xlinkType
    if (isSVG && name.indexOf('xlink') === 0) {
        name = name.replace(/^xlink\:?/, '');
        namespace = xlink;
    }
    try {
        if (isSVG) {
            method = method + 'NS';
            dom[method](namespace, name.toLowerCase(), value + '');
        } else {
            dom[method](name, value + '');
        }
    } catch (e) {
        /* istanbul ignore next */
        console.log(e, method, dom.nodeName);
    }
}

var hasReadOnlyValue = {
    'button': true,
    'image': true,
    'hidden': true,
    'reset': true,
    'submit': true
};
function setControlledComponent(vnode) {
    var props = vnode.props;
    var type = props.type;
    // input, select, textarea, datalist这几个元素都会包装成受控组件或非受控组件 **受控组件**
    // 是指定指定了value或checked 并绑定了事件的元素 **非受控组件** 是指定指定了value或checked，
    // 但没有绑定事件，也没有使用readOnly, disabled来限制状态变化的元素
    // 这时框架会弹出为它绑定事件，以重置用户的输入，确保它的value或checked值不被改变 但如果用户使用了defaultValue,
    // defaultChecked，那么它不做任何转换

    switch (vnode.type) {
        case "select":
        case "datalist":
            type = 'select';
        case 'textarea':
            if (!type) {
                //必须指定
                type = 'textarea';
            }
        case 'input':
            if (hasReadOnlyValue[type]) return;

            if (!type) {
                type = 'text';
            }

            var isChecked = type === 'radio' || type === 'checkbox';
            var propName = isChecked ? 'checked' : 'value';
            var defaultName = propName === 'value' ? 'defaultValue' : 'defaultChecked';
            var initValue = props[propName] != null ? props[propName] : props[defaultName];
            var isControlled = props.onChange || props.readOnly || props.disabled;
            if (/text|password/.test(type)) {
                isControlled = isControlled || props.onInput;
            }
            if (!isControlled && propName in props) {
                var keepInitValue = function keepInitValue(e) {
                    dom[propName] = initValue;
                };

                var dom = vnode._hostNode;
                console.warn('你在表单元素指定了' + propName + '属性,但没有添加onChange或onInput事件或readOnly或disabled，它将变成非受控组件，无法更换' + propName);

                vnode._hostNode.addEventListener('change', keepInitValue);
                if (type !== 'select') {
                    vnode._hostNode.addEventListener(isChecked ? 'click' : 'input', keepInitValue);
                }
            }
            break;
        case "option":
            return vnode._wrapperState = {
                value: getOptionValue(props)
            };
    }
    if (type === 'select') {
        postUpdateSelectedOptions(vnode); //先在mount时执行一次
        return vnode._wrapperState = {
            postUpdate: postUpdateSelectedOptions
        };
    }
}

function getOptionValue(props) {
    return typeof props.value != 'undefined' ? props.value : props.children[0].text;
}

function postUpdateSelectedOptions(vnode) {
    var props = vnode.props;
    var multiple = !!props.multiple;
    var value = props.value != null ? props.value : props.defaultValue != null ? props.defaultValue : multiple ? [] : '';
    updateOptions(vnode, multiple, value);
}

function collectOptions(vnode, ret) {
    ret = ret || [];
    for (var i = 0, el; el = vnode.props.children[i++];) {
        if (el.type === 'option') {
            ret.push(el);
        } else if (el.type === 'optgroup') {
            collectOptions(el, ret);
        }
    }
    return ret;
}

function updateOptions(vnode, multiple, propValue) {

    var options = collectOptions(vnode),
        selectedValue;
    if (multiple) {
        selectedValue = {};
        try {
            for (i = 0; i < propValue.length; i++) {
                selectedValue['' + propValue[i]] = true;
            }
        } catch (e) {
            /* istanbul ignore next */
            console.warn('<select multiple="true"> 的value应该对应一个字符串数组');
        }
        for (var i = 0, option; option = options[i++];) {
            var state = option._wrapperState || /* istanbul ignore next */handleSpecialNode(option);
            var selected = selectedValue.hasOwnProperty(state.value);
            if (state.selected !== selected) {
                state.selected = selected;
                setDomSelected(option, selected);
            }
        }
    } else {
        // Do not set `select.value` as exact behavior isn't consistent across all
        // browsers for all cases.
        selectedValue = '' + propValue;
        for (var i = 0, option; option = options[i++];) {
            var state = option._wrapperState;
            if (state.value === selectedValue) {
                setDomSelected(option, true);
                return;
            }
        }
        if (options.length) {
            setDomSelected(options[0], true);
        }
    }
}

function setDomSelected(option, selected) {
    if (option._hostNode) {
        option._hostNode.selected = selected;
    }
}

//react的单向流动是由生命周期钩子的setState选择性调用（不是所有钩子都能用setState）,受控组件，事务机制

// createElement创建的虚拟DOM叫baseVnode,用于确定DOM树的结构与保存原始数据与DOM节点
// 如果baseVnode的type类型为函数，那么产生实例

/**
 * 渲染组件
 *
 * @param {any} instance
 */
function updateComponent(instance) {
    var props = instance.props,
        state = instance.state,
        context = instance.context,
        prevProps = instance.prevProps;

    var oldRendered = instance._rendered;
    var baseVnode = instance.getBaseVnode();
    var hostParent = baseVnode._hostParent || oldRendered._hostParent;

    var nextProps = props;
    prevProps = prevProps || props;
    var nextState = instance._processPendingState(props, context);

    instance.props = prevProps;
    delete instance.prevProps;
    //生命周期 shouldComponentUpdate(nextProps, nextState, nextContext)
    if (!instance._forceUpdate && applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
        return baseVnode._hostNode; //注意
    }
    //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
    applyComponentHook(instance, 5, nextProps, nextState, context);
    instance.props = nextProps;
    instance.state = nextState;
    delete instance._updateBatchNumber;

    var rendered = transaction.renderWithoutSetState(instance, nextProps, context);
    context = getContext(instance, context);
    instance._rendered = rendered;
    // rendered的type为函数时，会多次进入toVnode  var dom = diff(rendered, oldRendered,
    // hostParent, context, baseVnode._hostNode)
    var dom = diffChildren([rendered], [oldRendered], hostParent, context);
    baseVnode._hostNode = dom;
    //生命周期 componentDidUpdate(prevProps, prevState, prevContext)
    applyComponentHook(instance, 6, nextProps, nextState, context);

    return dom; //注意
}
/**
 * call componentWillUnmount
 *
 * @param {any} vnode
 */
function removeComponent(vnode) {
    if (vnode._hostNode && vnode.type === '#text' && recyclableNodes.length < 512) {
        recyclableNodes.push(vnode._hostNode);
    }
    var instance = vnode._instance;

    instance && applyComponentHook(instance, 7); //componentWillUnmount hook

    '_hostNode,_hostParent,_instance,_wrapperState,_owner'.replace(/\w+/g, function (name) {
        vnode[name] = NaN;
    });
    var props = vnode.props;
    if (props) {
        removeRef(instance, props.ref);
        props.children.forEach(function (el) {
            removeComponent(el);
        });
    }
}

function removeComponents(nodes) {
    for (var i = 0, el; el = nodes[i++];) {
        var dom = el._hostNode;
        if (!dom && el._instance) {
            var a = el._instance.getBaseVnode();
            dom = a && a._hostNode;
        }

        if (dom && dom.parentNode) {
            dom.parentNode.removeChild(dom);
        }
        removeComponent(el);
    }
}

/**
 * 参数不要出现DOM,以便在后端也能运行
 *
 * @param {VNode} vnode 新的虚拟DOM
 * @param {VNode} prevVnode 旧的虚拟DOM
 * @param {VNode} hostParent 父虚拟DOM
 * @param {Object} context
 * @param {DOM} prevNode
 * @returns
 */
function diff(vnode, prevVnode, hostParent, context, prevNode, prevInstance) {
    //updateComponent

    var baseVnode = vnode;
    var hostNode = prevVnode._hostNode;

    prevInstance = prevInstance || prevVnode._instance;

    var prevProps = prevVnode.props || {};
    if (prevInstance) {
        var instance = prevInstance;
        vnode._instance = prevInstance;
        baseVnode = prevInstance.getBaseVnode();
        hostNode = baseVnode._hostNode;

        vnode._instance = instance;

        instance.context = context; //更新context
        instance.prevProps = prevProps;
        var nextProps = vnode.props;
        //处理非状态组件
        if (instance.statelessRender) {
            instance.props = nextProps;
            return updateComponent(instance, context);
        }
        //componentWillReceiveProps(nextProps, nextContext)
        applyComponentHook(instance, 3, nextProps, context);

        instance.props = nextProps;

        return updateComponent(instance, context);
    }

    if (isFn(vnode.type)) {
        var parentInstance = prevInstance && prevInstance.parentInstance;

        return toDOM(vnode, context, hostParent, prevNode, parentInstance);
    }
    var parentNode = hostParent._hostNode;
    var prevChildren = prevProps.children || [];
    if (!hostNode) {
        //如果元素类型不一致
        var nextNode = createDOMElement(vnode);
        parentNode.insertBefore(nextNode, hostNode || null);
        prevChildren = [];
        prevProps = {};
        if (prevNode) {
            parentNode.removeChild(prevNode);
        }
        removeComponent(prevVnode);
        hostNode = nextNode;
    }

    //必须在diffProps前添加它的真实节点

    baseVnode._hostNode = hostNode;
    baseVnode._hostParent = hostParent;

    if (prevProps.dangerouslySetInnerHTML) {
        while (hostNode.firstChild) {
            hostNode.removeChild(hostNode.firstChild);
        }
    }
    var props = vnode.props;
    if (props) {
        if (!props.angerouslySetInnerHTML) {
            var currChildren = props.children;
            var n1 = currChildren.length;
            var n2 = prevChildren.length;
            var old = prevChildren[0];
            var neo = currChildren[0];
            if (!neo && old) {
                removeComponents(prevChildren);
            } else if (neo && !old) {
                var beforeDOM = null;
                for (var i = 0, el; el = currChildren[i++];) {
                    var dom = el._hostNode = toDOM(el, context, baseVnode, beforeDOM);
                    beforeDOM = dom.nextSibling;
                }

                //    } else if (n1 + n2 === 2 && neo.type === old.type) {

                //         neo._hostNode = diff(neo, old, baseVnode, context, old._hostNode, old._instance)
            } else {
                diffChildren(currChildren, prevChildren, baseVnode, context);
            }
        }
        diffProps(props, prevProps, vnode, prevVnode);
    }

    var wrapperState = vnode._wrapperState;
    if (wrapperState && wrapperState.postUpdate) {
        //处理select
        wrapperState.postUpdate(vnode);
    }
    return hostNode;
}

/**
 *
 *
 * @param {any} type
 * @param {any} vnode
 * @returns
 */
function computeUUID(type, vnode) {
    if (type === '#text') {
        return type + '/' + vnode.deep;
    }

    return type + '/' + vnode.deep + (vnode.key ? '/' + vnode.key : '');
}

/**
 *
 *
 * @param {any} newChildren
 * @param {any} oldChildren
 * @param {any} hostParent
 * @param {any} context
 */
function diffChildren(newChildren, oldChildren, hostParent, context) {
    //第一步，根据实例的类型，nodeName, nodeValue, key与数组深度 构建hash
    var mapping = {},
        debugString = '',
        returnDOM,
        hashmap = {},
        parentNode = hostParent._hostNode,
        branch;

    for (var i = 0, n = oldChildren.length; i < n; i++) {
        var vnode = oldChildren[i];

        vnode.uuid = '.' + i;
        hashmap[vnode.uuid] = vnode;
        var uuid = computeUUID(getComponentName(vnode.type), vnode);
        debugString += uuid + ' ';
        if (mapping[uuid]) {
            mapping[uuid].push(vnode);
        } else {
            mapping[uuid] = [vnode];
        }
    }

    //console.log('旧的',debugString) 第2步，遍历新children, 从hash中取出旧节点, 然后一一比较
    debugString = '';
    var firstDOM = oldChildren[0] && oldChildren[0]._hostNode;
    var insertPoint = firstDOM;
    for (var _i = 0, _n = newChildren.length; _i < _n; _i++) {
        var _vnode = newChildren[_i];
        var tag = getComponentName(_vnode.type);

        var _uuid = computeUUID(tag, _vnode);
        debugString += _uuid + ' ';
        var prevVnode = null;
        if (mapping[_uuid]) {
            prevVnode = mapping[_uuid].shift();

            if (!mapping[_uuid].length) {
                delete mapping[_uuid];
            }
            delete hashmap[prevVnode.uuid];
        }

        _vnode._hostParent = hostParent;

        if (prevVnode) {
            //它们的组件类型， 或者标签类型相同
            var prevInstance = prevVnode._instance;

            if ('text' in _vnode) {
                var textNode = _vnode._hostNode = prevVnode._hostNode;
                if (_vnode.text !== prevVnode.text) {
                    textNode.nodeValue = _vnode.text;
                }
                branch = 'B';
                if (textNode !== insertPoint) {
                    parentNode.insertBefore(textNode, insertPoint);
                }
            } else {
                _vnode._hostNode = diff(_vnode, prevVnode, hostParent, context, insertPoint, prevInstance);
                branch = 'C';
            }
        } else {
            //添加新节点

            _vnode._hostNode = toDOM(_vnode, context, hostParent, insertPoint, null);
            branch = 'D';
        }
        if (_i === 0) {
            returnDOM = _vnode._hostNode;
            if (branch != 'D' && firstDOM && _vnode._hostNode !== firstDOM) {
                // console.log('调整位置。。。。')
                parentNode.replaceChild(_vnode._hostNode, firstDOM);
            }
        }

        insertPoint = _vnode._hostNode.nextSibling;
    }
    //console.log('新的',debugString) 第3步，移除无用节点
    var removedChildren = [];
    for (var key in hashmap) {
        removedChildren.push(hashmap[key]);
    }
    if (removedChildren.length) {
        removeComponents(removedChildren);
    }
    return returnDOM;
}

/**
 *
 * @export
 * @param {VNode} vnode
 * @param {DOM} context
 * @param {DOM} parentNode ?
 * @param {DOM} replaced ?
 * @returns
 */
function toDOM(vnode, context, hostParent, prevNode, parentIntance) {
    //如果一个虚拟DOM的type为字符串 或 它拥有instance，且这个instance不再存在parentInstance, 那么它就可以拥有_dom属性
    vnode = toVnode(vnode, context, parentIntance);
    if (vnode.context) {
        context = vnode.context;
        if (vnode.refs) delete vnode.context;
    }
    var hostNode = createDOMElement(vnode);
    var props = vnode.props;
    var parentNode = hostParent._hostNode;
    var instance = vnode._instance || vnode._owner;
    var canComponentDidMount = instance && !vnode._hostNode;
    //每个实例保存其虚拟DOM 最开始的虚拟DOM保存instance

    if (typeof vnode.type === 'string') {
        vnode._hostNode = hostNode;
        vnode._hostParent = hostParent;
    }
    if (instance) {
        var baseVnode = instance.getBaseVnode();
        if (!baseVnode._hostNode) {
            baseVnode._hostNode = hostNode;
            baseVnode._hostParent = hostParent;
        }
    }

    //文本是没有instance, 只有empty与元素节点有instance

    if (parentNode) {
        parentNode.insertBefore(hostNode, prevNode || null);
    }
    //只有元素与组件才有props
    if (props && !props.dangerouslySetInnerHTML) {
        // 先diff Children 再 diff Props 最后是 diff ref
        diffChildren(props.children, [], vnode, context); //添加第4参数
    }
    //尝试插入DOM树
    if (parentNode) {
        var instances;
        if (canComponentDidMount) {
            //判定能否调用componentDidMount方法
            instances = getInstances(instance);
        }
        if (props) {
            diffProps(props, {}, vnode, {});
            setControlledComponent(vnode);
        }
        if (instances) {

            while (instance = instances.shift()) {
                applyComponentHook(instance, 2);
            }
        }
    }

    return hostNode;
}
//将Component中这个东西移动这里
midway.immune.updateComponent = function updateComponentProxy(instance) {
    //这里触发视图更新

    updateComponent(instance);
    instance._forceUpdate = false;
};

//import {transaction} from './transaction'
var React = {
    Children: Children, //为了react-redux
    render: render,
    createElement: createElement,
    PureComponent: PureComponent,
    Component: Component
};

/**
 *
 * @param {any} vnode
 * @param {any} container
 */
function render(vnode, container, cb) {
    var context = {};
    if (!container.oldVnode) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    var hostParent = {
        _hostNode: container
    };

    var rootVnode = diff(vnode, container.oldVnode || {}, hostParent, context);
    if (rootVnode.setAttribute) {
        rootVnode.setAttribute('data-reactroot', '');
    }
    var instance = vnode._instance;
    if (instance) {
        //组件返回组件实例，而普通虚拟DOM 返回元素节点
        while (instance.parentInstance) {
            instance = instance.parentInstance;
        }
        return instance;
    } else {
        return rootVnode;
    }
}

win.ReactDOM = React;

return React;

})));
