(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, function () {

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
	 *  收集一个元素的所有孩子
	 *
	 * @export
	 * @param {any} dom
	 * @returns
	 */
	function getNodes(dom) {
	    var ret = [],
	        c = dom.childNodes || [];
	    for (var i = 0, el; el = c[i++];) {
	        ret.push(el);
	    }
	    return ret;
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

	function getChildContext(instance, context) {
	    if (instance.getChildContext) {
	        return extend(extend({}, context), instance.getChildContext());
	    }
	    return context;
	}
	var rcamelize = /[-_][^-_]/g;
	var HTML_KEY = 'dangerouslySetInnerHTML';
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
	var options = {
	    updateBatchNumber: 1,
	    immune: {} // Object.freeze(midway) ;midway.aaa = 'throw err';midway.immune.aaa = 'safe'
	};

	var recyclables = [];

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var asyncGenerator = function () {
	  function AwaitValue(value) {
	    this.value = value;
	  }

	  function AsyncGenerator(gen) {
	    var front, back;

	    function send(key, arg) {
	      return new Promise(function (resolve, reject) {
	        var request = {
	          key: key,
	          arg: arg,
	          resolve: resolve,
	          reject: reject,
	          next: null
	        };

	        if (back) {
	          back = back.next = request;
	        } else {
	          front = back = request;
	          resume(key, arg);
	        }
	      });
	    }

	    function resume(key, arg) {
	      try {
	        var result = gen[key](arg);
	        var value = result.value;

	        if (value instanceof AwaitValue) {
	          Promise.resolve(value.value).then(function (arg) {
	            resume("next", arg);
	          }, function (arg) {
	            resume("throw", arg);
	          });
	        } else {
	          settle(result.done ? "return" : "normal", result.value);
	        }
	      } catch (err) {
	        settle("throw", err);
	      }
	    }

	    function settle(type, value) {
	      switch (type) {
	        case "return":
	          front.resolve({
	            value: value,
	            done: true
	          });
	          break;

	        case "throw":
	          front.reject(value);
	          break;

	        default:
	          front.resolve({
	            value: value,
	            done: false
	          });
	          break;
	      }

	      front = front.next;

	      if (front) {
	        resume(front.key, front.arg);
	      } else {
	        back = null;
	      }
	    }

	    this._invoke = send;

	    if (typeof gen.return !== "function") {
	      this.return = undefined;
	    }
	  }

	  if (typeof Symbol === "function" && Symbol.asyncIterator) {
	    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
	      return this;
	    };
	  }

	  AsyncGenerator.prototype.next = function (arg) {
	    return this._invoke("next", arg);
	  };

	  AsyncGenerator.prototype.throw = function (arg) {
	    return this._invoke("throw", arg);
	  };

	  AsyncGenerator.prototype.return = function (arg) {
	    return this._invoke("return", arg);
	  };

	  return {
	    wrap: function (fn) {
	      return function () {
	        return new AsyncGenerator(fn.apply(this, arguments));
	      };
	    },
	    await: function (value) {
	      return new AwaitValue(value);
	    }
	  };
	}();

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
	var inBrowser = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.alert;

	var win = inBrowser ? window : {
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
	    var node = recyclables[type] && recyclables[type].pop();
	    if (node) {
	        node.nodeValue = vnode.text;
	        return node;
	    }
	    if (type === '#text') {
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

	    var ref = configs.ref;
	    delete configs.ref;

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
	    return new Vnode(type, props, key, CurrentOwner.cur, ref);
	}
	//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
	function getDOMNode() {
	    return this;
	}

	function Vnode(type, props, key, owner, ref) {
	    this.type = type;
	    this.props = props;

	    if (key) {
	        this.key = key;
	    }

	    var refType = typeof ref === 'undefined' ? 'undefined' : _typeof(ref);
	    if (refType === 'string') {
	        var refKey = ref;
	        this.__ref = function (dom) {
	            var instance = this._owner;
	            if (dom) {
	                dom.getDOMNode = getDOMNode;
	            }
	            if (instance) {
	                instance.refs[refKey] = dom;
	            }
	        };
	    } else if (refType === 'function') {
	        this.__ref = ref;
	    }
	    if (typeof type === 'string') {
	        this.vtype = 1;
	        var ns = getNs(type);
	        if (ns) {
	            this.ns = ns;
	        }
	    } else if (typeof type === 'function') {
	        this.vtype = type.prototype && type.prototype.render ? 2 : 4;
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
	                    _deep: deep
	                });
	                ret.merge = true;
	            }
	        } else if (Array.isArray(el)) {
	            flatChildren(el, ret, deep + 1);
	        } else {
	            ret.unshift(el);
	            el._deep = deep;
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

	            if (instance) options.updateBatchNumber++;
	            var globalBatchNumber = options.updateBatchNumber;

	            var renderQueue = queue.concat();
	            var processingCallbacks = callbacks.concat();

	            queue.length = callbacks.length = 0;
	            renderQueue.forEach(function (inst) {
	                try {
	                    if (inst._updateBatchNumber === globalBatchNumber) {
	                        options.immune.updateComponent(inst);
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
	    this.refs = {};
	    this._pendingStateQueue = [];
	    //  if (!this.state)
	    this.state = {};
	}

	Component.prototype = {
	    setState: function setState(state, cb) {
	        this._pendingStateQueue.push(state);

	        setStateProxy(this, cb);
	    },
	    getBaseVnode: function getBaseVnode() {
	        var p = this;
	        do {
	            var pp = p.parentInstance;
	            if (!pp) {
	                return p._currentElement;
	            }
	        } while (p = pp);
	    },
	    forceUpdate: function forceUpdate(cb) {
	        this._pendingForceUpdate = true;
	        setStateProxy(this, cb);
	    },

	    _processPendingState: function _processPendingState(props, context) {
	        var n = this._pendingStateQueue.length;
	        if (n == 0) {
	            return this.state;
	        }
	        var queue = this._pendingStateQueue.concat();
	        this._pendingStateQueue.length = 0;

	        var nextState = extend({}, this.state);
	        for (var i = 0; i < n; i++) {
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
	        instance._updateBatchNumber = options.updateBatchNumber + 1;
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
	    Component.call(this, props, context);
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

	//var testStyle = document.documentElement.style
	var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'];
	var cssMap = oneObject('float', 'cssFloat');

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
	        if (isFn(fn)) {
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
	        if (isFn(fn)) {
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
	 * @param {any} nextProps
	 * @param {any} lastProps
	 * @param {any} vnode
	 * @param {any} lastVnode
	 */
	function diffProps(nextProps, lastProps, vnode, lastVnode) {
	    /* istanbul ignore if */
	    if (nextProps === lastProps) {
	        return;
	    }
	    var dom = vnode._hostNode;

	    var instance = vnode._owner;
	    if (lastVnode._wrapperState) {
	        vnode._wrapperState = lastVnode._wrapperState;
	        delete lastVnode._wrapperState;
	    }

	    var isSVG = vnode.ns === 'http://www.w3.org/2000/svg';
	    var isHTML = !isSVG;
	    for (var name in nextProps) {
	        var val = nextProps[name];
	        switch (name) {
	            case 'children':
	            case 'key':
	            case 'ref':
	                break;
	            case 'style':
	                patchStyle(dom, lastProps.style || {}, val);

	                break;
	            case HTML_KEY:
	                var oldhtml = lastProps[name] && lastProps[name].__html;
	                if (val && val.__html !== oldhtml) {
	                    dom.innerHTML = val.__html;
	                }
	                break;
	            default:
	                if (isEventName(name)) {
	                    if (!lastProps[name]) {
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
	                } else if (val !== lastProps[name]) {
	                    if (isHTML && boolAttributes[name] && typeof dom[name] === 'boolean') {
	                        // 布尔属性必须使用el.xxx = true|false方式设值 如果为false, IE全系列下相当于setAttribute(xxx,''),
	                        // 会影响到样式,需要进一步处理
	                        dom[name] = !!val;
	                    }
	                    if (val === false || val === void 666 || val === null) {
	                        operateAttribute(dom, name, '', isSVG);
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
	                        operateAttribute(dom, name, val, isSVG);
	                    }
	                }
	        }
	    }
	    //如果旧属性在新属性对象不存在，那么移除DOM
	    for (var _name in lastProps) {
	        if (!(_name in nextProps)) {
	            if (isEventName(_name)) {
	                //移除事件
	                var events = dom.__events || {};
	                delete events[_name];
	            } else {
	                //移除属性
	                if (isHTML && builtIdProperties[_name]) {
	                    dom[_name] = builtIdProperties[_name] === true ? false : '';
	                } else {
	                    operateAttribute(dom, _name, '', isSVG);
	                }
	            }
	        }
	    }
	}
	var xlinkProps = /^xlink(.+)/;

	function operateAttribute(dom, name, value, isSVG) {

	    var method = value === '' ? 'removeAttribute' : 'setAttribute',
	        namespace = null;
	    // http://www.w3school.com.cn/xlink/xlink_reference.asp
	    // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enha
	    // ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
	    // xlinkTitle, xlinkType
	    var match;
	    if (isSVG && (match = name.match(xlinkProps))) {
	        name = 'xlink:' + match[1];
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

	function render(vnode, container, callback) {
	    return renderTreeIntoContainer(vnode, container, callback);
	}

	function renderTreeIntoContainer(vnode, container, callback, parentContext) {
	    if (!vnode.vtype) {
	        throw new Error('cannot render ' + vnode + ' to container');
	    }
	    if (!container || container.nodeType !== 1) {
	        throw new Error('container ' + container + ' is not a DOM element');
	    }
	    var prevVnode = container._component,
	        rootNode,
	        hostParent = {
	        _hostNode: container
	    };
	    if (!prevVnode) {

	        var nodes = getNodes(container);
	        for (var i = 0, el; el = nodes[i++];) {
	            if (el.getAttribute && el.getAttribute('data-reactroot') !== null) {
	                hostNode = el;
	                vnode._prevCached = el; //进入节点对齐模块
	            } else {
	                el.parentNode.removeChild(el);
	            }
	        }
	        prevVnode = {};
	        rootNode = initVnode(vnode, {});
	        container.appendChild(rootNode);
	    } else {
	        rootNode = diffVnode(vnode, prevVnode, container.firstChild, {});
	    }
	    // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
	    // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数

	    if (rootNode.setAttribute) {
	        rootNode.setAttribute('data-reactroot', '');
	    }

	    var instance = vnode._instance;
	    container._component = vnode;
	    delete vnode._prevCached;
	    if (instance) {
	        //组件返回组件实例，而普通虚拟DOM 返回元素节点
	        instance._currentElement._hostParent = hostParent;

	        return instance;
	    } else {
	        return rootNode;
	    }
	}

	function diffVnode() {}
	function initVnode(vnode, parentContext) {
	    var vtype = vnode.vtype;

	    var node = null;
	    if (!vtype) {
	        // init text comment
	        node = createDOMElement(vnode);
	        vnode._hostNode = node;
	        return node;
	    }
	    if (vnode.__ref) {
	        readyComponents.push(function () {
	            console.log('attach ref');
	            vnode.__ref(vnode._instance || vnode._hostNode);
	        });
	    }
	    if (vtype === 1) {
	        // init element
	        node = initVelem(vnode, parentContext);
	    } else if (vtype === 2) {
	        // init stateful component
	        node = initVcomponent(vnode, parentContext);
	    } else if (vtype === 4) {
	        // init stateless component
	        node = initVstateless(vnode, parentContext);
	    }
	    return node;
	}

	function initVelem(vnode, parentContext) {
	    var type = vnode.type,
	        props = vnode.props;

	    var node = createDOMElement(vnode);
	    vnode._hostNode = node;
	    initVchildren(vnode, node, parentContext);
	    diffProps(props, {}, vnode, {});
	    return node;
	}
	var readyComponents = [];
	//将虚拟DOM转换为真实DOM并插入父元素
	function initVchildren(vnode, node, parentContext) {
	    var vchildren = vnode.props.children;
	    for (var i = 0, len = vchildren.length; i < len; i++) {
	        node.appendChild(initVnode(vchildren[i], parentContext));
	    }
	    if (readyComponents.length) {
	        fireMount();
	    }
	}

	function fireMount() {
	    var queue = readyComponents.concat();
	    readyComponents.length = 0;
	    for (var i = 0, cb; cb = queue[i++];) {
	        cb();
	    }
	}

	var instanceMap = new Map();

	function initVcomponent(vcomponent, parentContext) {
	    var type = vcomponent.type,
	        props = vcomponent.props,
	        uid = vcomponent.uid;


	    var instance = new type(props, parentContext); //互相持有引用

	    vcomponent._instance = instance;
	    instance._currentElement = vcomponent;
	    instance.props = instance.props || props;
	    instance.context = instance.context || parentContext;

	    if (instance.componentWillMount) {
	        instance.componentWillMount();
	    }
	    //如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说
	    // instance._currentElement = vnode
	    // instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成
	    // 空虚拟DOM {type: '#comment', text: 'empty'}
	    // 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

	    var vnode = renderComponent(instance);
	    instance._rendered = vnode;
	    if (instance.componentDidMount) {
	        readyComponents.push(function () {
	            instance.componentDidMount();
	        });
	    }
	    var node = initVnode(vnode, getChildContext(instance, parentContext), instance);
	    instanceMap.set(instance, node);
	    //vcomponent._instance._rendered._hostNode === node


	    return node;
	}

	function renderComponent(instance, parentContext) {
	    CurrentOwner.cur = instance;
	    var vnode = instance.render();
	    CurrentOwner.cur = null;
	    return checkNull(vnode);
	}

	function checkNull(vnode, type) {
	    if (vnode === null || vnode === false) {
	        return {
	            type: '#comment',
	            text: 'empty'
	        };
	    } else if (!vnode || !vnode.vtype) {
	        throw new Error('@' + type.name + '#render:You may have returned undefined, an array or some other invalid object');
	    }
	    return vnode;
	}

	function initVstateless(vstateless, parentContext) {
	    var vnode = vstateless.type(vstateless, parentContext);
	    vnode = checkNull(vnode);

	    var node = initVnode(vnode, parentContext);
	    stateless._rendered = vnode;

	    return node;
	}

	function updateVstateless(vstateless, newVstateless, node, parentContext) {
	    var vnode = vstateless._rendered;

	    var newVnode = vstateless.type(vstateless, parentContext);
	    newVnode = checkNull(newVnode);

	    var newNode = compareTwoVnodes(vnode, newVnode, node, parentContext);
	    newVstateless._rendered = newVnode;

	    return newNode;
	}

	function destroyVstateless(vnode, node) {
	    destroyVnode(vnode._rendered, node);
	}

	//将Component中这个东西移动这里
	options.immune.updateComponent = function updateComponentProxy(instance) {
	    //这里触发视图更新

	    updateComponent(instance);
	    instance._forceUpdate = false;
	};

	function updateComponent(instance) {
	    // instance._currentElement

	    var props = instance.props,
	        state = instance.state,
	        context = instance.context,
	        lastProps = instance.lastProps;

	    console.log('更新组件');
	    var lastRendered = instance._rendered;
	    var node = instanceMap.get(instance);

	    var baseVnode = instance.getBaseVnode();
	    var hostParent = baseVnode._hostParent; //|| lastRendered._hostParent

	    var nextProps = props;
	    lastProps = lastProps || props;
	    var nextState = instance._processPendingState(props, context);

	    instance.props = lastProps;
	    delete instance.lastProps;
	    //生命周期 shouldComponentUpdate(nextProps, nextState, nextContext)
	    if (!instance._forceUpdate && applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
	        return node; //注意
	    }
	    //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
	    if (instance.componentWillUpdate) {
	        instance.componentWillUpdate(nextProps, nextState, context);
	    }

	    instance.props = nextProps;
	    instance.state = nextState;
	    delete instance._updateBatchNumber;

	    var rendered = renderComponent(instance);
	    context = getChildContext(instance, context);
	    instance._rendered = rendered;
	    rendered._hostParent = hostParent;
	    console.log(lastRendered, rendered, node, context);
	    var newNode = compareTwoVnodes(lastRendered, rendered, node, context);
	    if (instance.componentDidUpdate) {
	        //    updateComponents.push(function () {
	        instance.componentDidUpdate(nextProps, nextState, context);
	        //    })
	    }

	    return newNode;
	}

	function compareTwoVnodes(vnode, newVnode, node, parentContext) {
	    var newNode = node;
	    if (newVnode == null) {
	        // remove
	        destroyVnode(vnode, node);
	        node.parentNode.removeChild(node);
	    } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
	        // replace
	        destroyVnode(vnode, node);
	        newNode = initVnode(newVnode, parentContext);
	        node.parentNode.replaceChild(newNode, node);
	    } else if (vnode !== newVnode) {
	        console.log('updateVnode');
	        // same type and same key -> update
	        newNode = updateVnode(vnode, newVnode, node, parentContext);
	    }
	    return newNode;
	}

	function destroyVnode(vnode, node) {
	    var vtype = vnode.vtype;

	    if (!vtype) {
	        vnode._hostNode = null;
	        vnode._hostParent = null;
	    } else if (vtype === 1) {
	        // destroy element
	        destroyVelem(vnode, node);
	    } else if (vtype === 2) {
	        // destroy state component
	        destroyVcomponent(vnode, node);
	    } else if (vtype === 4) {
	        // destroy stateless component
	        destroyVstateless(vnode, node);
	    }
	}

	function destroyVelem(vnode, node) {
	    var props = vnode.props;

	    var vchildren = props.children;
	    var childNodes = node.childNodes;
	    for (var i = 0, len = vchildren.length; i < len; i++) {
	        destroyVnode(vchildren[i], childNodes[i]);
	    }
	    vnode.__ref && vnode.__ref(null);
	    vnode._hostNode = null;
	    vnode._hostParent = null;
	}

	function destroyVcomponent(vnode, node) {
	    var instance = vnode._instance;
	    if (instance) {
	        instanceMap.delete(instance);
	        if (instance.componentWillUnmount) {
	            instance.componentWillUnmount();
	        }
	        vnode._instance = instance._currentElement = instance.props = null;
	        destroyVnode(instance._rendered, node);
	    }
	}

	function updateVnode(vnode, newVnode, node, parentContext) {
	    var vtype = vnode.vtype;


	    if (vtype === 2) {
	        //类型肯定相同的
	        return updateVcomponent(vnode, newVnode, node, parentContext);
	    }

	    if (vtype === 4) {
	        return updateVstateless(vnode, newVnode, node, parentContext);
	    }

	    // ignore VCOMMENT and other vtypes
	    if (vtype !== 1) {
	        return node;
	    }

	    var oldHtml = vnode.props[HTML_KEY] && vnode.props[HTML_KEY].__html;
	    if (oldHtml != null) {
	        node.innerHTML = '';
	        updateVelem(vnode, newVnode, node, parentContext);
	        initVchildren(newVnode, node, parentContext);
	    } else {
	        console.log('update 元素节点');
	        updateVChildren(vnode, newVnode, node, parentContext);
	        updateVelem(vnode, newVnode, node, parentContext);
	    }
	    return node;
	}
	/**
	 * 
	 * 
	 * @param {any} lastVnode 
	 * @param {any} nextVnode 
	 * @param {any} node 
	 * @returns 
	 */
	function updateVelem(lastVnode, nextVnode, node) {
	    diffProps(nextVnode.props, lastVnode.props, nextVnode, lastVnode);
	    if (lastVnode.__ref) {
	        lastVnode.__ref(null);
	    }
	    if (nextVnode.__ref) {
	        lastVnode.__ref(node);
	    }
	    return node;
	}

	function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
	    var instance = newVcomponent._instance = vcomponent._instance;
	    var nextProps = newVcomponent.props;

	    if (instance.componentWillReceiveProps) {
	        instance.componentWillReceiveProps(nextProps, componentContext);
	    }
	    instance.prevProps = instance.props;
	    instance.props = nextProps;

	    if (vcomponent.__ref !== newVcomponent.__ref) {

	        vcomponent.__ref && vcomponent.__ref(null);
	    }
	    if (inst._updateBatchNumber === globalBatchNumber) {
	        return updateComponent(instance);
	    } else {
	        return node;
	    }
	}

	function updateVChildren(vnode, newVnode, node, parentContext) {
	    var patches = {
	        removes: [],
	        updates: [],
	        creates: []
	    };
	    diffVchildren(patches, vnode, newVnode, node, parentContext);
	    patches.removes.forEach(applyDestroy);
	    patches.updates.forEach(applyUpdate);
	    patches.creates.forEach(applyCreate);
	}

	function diffVchildren(patches, vnode, newVnode, node, parentContext) {

	    var vchildren = vnode.props.children;
	    var childNodes = node.childNodes;
	    var newVchildren = newVnode.props.children;
	    var vchildrenLen = vchildren.length;
	    var newVchildrenLen = newVchildren.length;

	    if (vchildrenLen === 0) {
	        if (newVchildrenLen > 0) {
	            for (var i = 0; i < newVchildrenLen; i++) {
	                patches.creates.push({
	                    vnode: newVchildren[i],
	                    parentNode: node,
	                    parentContext: parentContext,
	                    index: i
	                });
	            }
	        }
	        return;
	    } else if (newVchildrenLen === 0) {
	        for (var _i = 0; _i < vchildrenLen; _i++) {
	            patches.removes.push({
	                vnode: vchildren[_i],
	                node: childNodes[_i]
	            });
	        }
	        return;
	    }

	    var updates = Array(newVchildrenLen);
	    var removes = null;
	    var creates = null;
	    console.log(vchildrenLen, newVchildrenLen);
	    // isEqual
	    for (var _i2 = 0; _i2 < vchildrenLen; _i2++) {
	        var _vnode = vchildren[_i2];
	        for (var j = 0; j < newVchildrenLen; j++) {
	            if (updates[j]) {
	                continue;
	            }
	            var _newVnode = newVchildren[j];
	            if (_vnode === _newVnode) {
	                updates[j] = {
	                    shouldIgnore: true,
	                    vnode: _vnode,
	                    newVnode: _newVnode,
	                    node: childNodes[_i2],
	                    parentContext: parentContext,
	                    index: j
	                };
	                vchildren[_i2] = null;
	                break;
	            }
	        }
	    }

	    // isSimilar
	    for (var _i3 = 0; _i3 < vchildrenLen; _i3++) {
	        var _vnode2 = vchildren[_i3];
	        if (_vnode2 === null) {
	            continue;
	        }
	        var shouldRemove = true;
	        for (var _j = 0; _j < newVchildrenLen; _j++) {
	            if (updates[_j]) {
	                continue;
	            }
	            var _newVnode2 = newVchildren[_j];
	            if (_newVnode2.type === _vnode2.type && _newVnode2.key === _vnode2.key) {
	                updates[_j] = {
	                    vnode: _vnode2,
	                    newVnode: _newVnode2,
	                    node: childNodes[_i3],
	                    parentContext: parentContext,
	                    index: _j
	                };
	                shouldRemove = false;
	                break;
	            }
	        }
	        if (shouldRemove) {
	            if (!removes) {
	                removes = [];
	            }
	            removes.push({
	                vnode: _vnode2,
	                node: childNodes[_i3]
	            });
	        }
	    }

	    for (var _i4 = 0; _i4 < newVchildrenLen; _i4++) {
	        var item = updates[_i4];
	        if (!item) {
	            if (!creates) {
	                creates = [];
	            }
	            creates.push({
	                vnode: newVchildren[_i4],
	                parentNode: node,
	                parentContext: parentContext,
	                index: _i4
	            });
	        } else if (item.vnode.vtype === 1) {
	            diffVchildren(patches, item.vnode, item.newVnode, item.node, item.parentContext);
	        }
	    }
	    console.log(patches);
	    if (removes) {
	        __push.apply(patches.removes, removes);
	    }
	    if (creates) {
	        __push.apply(patches.creates, creates);
	    }
	    __push.apply(patches.updates, updates);
	}
	var __push = Array.prototype.push;

	function applyUpdate(data) {
	    if (!data) {
	        return;
	    }
	    var vnode = data.vnode;
	    var nextVnode = data.newVnode;
	    var dom = data.node;

	    // update
	    if (!data.shouldIgnore) {
	        if (!vnode.vtype) {
	            if (vnode.text !== nextVnode.text) {
	                dom.nodeValue = nextVnode.text;
	            }
	        } else if (vnode.vtype === 1) {
	            updateVelem(vnode, nextVnode, dom, data.parentContext);
	        } else if (vnode.vtype === 4) {
	            dom = updateVstateless(vnode, nextVnode, dom, data.parentContext);
	        } else if (vnode.vtype === 2) {
	            dom = updateVcomponent(vnode, nextVnode, dom, data.parentContext);
	        }
	    }

	    // re-order
	    var currentNode = dom.parentNode.childNodes[data.index];
	    if (currentNode !== dom) {
	        dom.parentNode.insertBefore(dom, currentNode);
	    }
	    return dom;
	}

	function applyDestroy(data) {
	    destroyVnode(data.vnode, data.node);
	    data.node.parentNode.removeChild(data.node);
	}

	function applyCreate(data) {
	    var node = initVnode(data.vnode, data.parentContext, data.parentNode.namespaceURI);
	    data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index]);
	}

	var React = {
	    Children: Children, //为了react-redux
	    render: render,
	    options: options,
	    createElement: createElement,
	    PureComponent: PureComponent,
	    Component: Component
	};
	win.ReactDOM = React;

	return React;

}));