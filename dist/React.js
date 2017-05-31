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

	function checkNull(vnode, type) {
	    if (vnode === null || vnode === false) {
	        return { type: '#comment', text: 'empty' };
	    } else if (!vnode || !vnode.vtype) {
	        throw new Error('@' + type.name + '#render:You may have returned undefined, an array or some other invalid object');
	    }
	    return vnode;
	}
	function getComponentProps(type, props) {
	    var defaultProps = type.defaultProps;
	    props = extend({}, props); //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
	    for (var i in defaultProps) {
	        if (props[i] === void 666) {
	            props[i] = defaultProps[i];
	        }
	    }
	    return props;
	}
	var recyclables = {
	    '#text': [],
	    '#comment': [],
	    'span': [],
	    'div': [],
	    'td': [],
	    'p': []
	};

	var CurrentOwner = {
	    cur: null
	};

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

	var shallowEqualHack = Object.freeze([]); //用于绕过shallowEqual
	/**
	 * 创建虚拟DOM
	 *
	 * @param {string} type
	 * @param {object} props
	 * @param {array} ...children
	 * @returns
	 */
	function createElement(type, configs) {
	    var props = {};
	    var key = null,
	        ref = null,
	        pChildren = null,
	        //位于props中的children
	    props = {},
	        vtype = 1,
	        typeType = typeof type === 'undefined' ? 'undefined' : _typeof(type),
	        isEmptyProps = true;
	    if (configs) {
	        for (var i in configs) {
	            var val = configs[i];
	            if (i === 'key') {
	                key = val;
	            } else if (i === 'ref') {
	                ref = val;
	            } else if (i === 'children') {
	                pChildren = val;
	            } else {
	                isEmptyProps = false;
	                props[i] = val;
	            }
	        }
	    }
	    if (typeType === 'function') {
	        vtype = type.prototype && type.prototype.render ? 2 : 4;
	    }
	    var c = [];
	    for (var i = 2, n = arguments.length; i < n; i++) {
	        c.push(arguments[i]);
	    }

	    if (!c.length && pChildren && pChildren) {
	        c = pChildren;
	    }

	    if (c.length) {
	        c = flatChildren(c);
	        delete c.merge; //注意这里的顺序
	        //  Object.freeze(c) //超紴影响性能
	        props.children = c;
	    } else if (vtype === 1) {
	        props.children = shallowEqualHack;
	    }

	    //  Object.freeze(props) //超紴影响性能
	    return new Vnode(type, props, key, ref, vtype, CurrentOwner.cur, !isEmptyProps);
	}
	//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
	function getDOMNode() {
	    return this;
	}

	function Vnode(type, props, key, ref, vtype, owner, checkProps) {
	    this.type = type;
	    this.props = props;
	    this.vtype = vtype;
	    this.checkProps = checkProps;
	    if (key) {
	        this.key = key;
	    }
	    if (owner) {
	        this._owner = owner;
	    }
	    //   if (vtype === 1) {

	    //   }
	    var refType = typeof ref === 'undefined' ? 'undefined' : _typeof(ref);
	    if (refType === 'string') {
	        this._refKey = ref;
	    } else if (refType === 'function') {
	        this.__ref = ref;
	    } else {
	        this.__ref = null;
	    }

	    /*
	    this._hostNode = null
	    this._instance = null
	    this._hostParent = null
	    */
	}

	Vnode.prototype = {
	    getDOMNode: function getDOMNode() {
	        return this._hostNode || null;
	    },
	    __ref: function __ref(dom) {
	        var instance = this._owner;
	        if (dom) {
	            dom.getDOMNode = getDOMNode;
	        }
	        if (instance) {
	            instance.refs[this._refKey] = dom;
	        }
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

	var transaction = {
	    isInTransation: false,
	    enqueueCallback: function enqueueCallback(obj) {
	        //它们是保证在ComponentDidUpdate后执行
	        callbacks.push(obj);
	    },

	    enqueue: function enqueue(instance) {
	        if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) === 'object') {
	            queue.push(instance);
	        }
	        if (!this.isInTransation) {
	            this.isInTransation = true;

	            if (instance) options.updateBatchNumber++;
	            var globalBatchNumber = options.updateBatchNumber;

	            var renderQueue = queue;
	            queue = [];
	            var processingCallbacks = callbacks;
	            callbacks = [];
	            var refreshComponent = options.immune.refreshComponent;
	            //  queue.length = callbacks.length = 0
	            for (var i = 0, n = renderQueue.length; i < n; i++) {
	                var inst = renderQueue[i];
	                try {
	                    if (inst._updateBatchNumber === globalBatchNumber) {
	                        refreshComponent(inst);
	                    }
	                } catch (e) {
	                    /* istanbul ignore next */
	                    console.warn(e);
	                }
	            }
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

	    /*  getBaseVnode() {
	          var p = this
	          do {
	              var pp = p.parentInstance
	              if (!pp) {
	                  return p._currentElement
	              }
	          } while (p = pp);
	      },*/
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

	var fn = PureComponent.prototype;

	fn.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
	    var a = shallowEqual(this.props, nextProps);
	    var b = shallowEqual(this.state, nextState);
	    return !a || !b;
	};
	fn.isPureComponent = true;

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

	//用于后端的元素节点
	function DOMElement(type) {
	    this.nodeName = type;
	    this.style = {};
	    this.children = [];
	}
	var fn$1 = DOMElement.prototype = {
	    contains: Boolean
	};
	String('replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute' + ',getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent' + ',detachEvent').replace(/\w+/g, function (name) {
	    fn$1[name] = function () {
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
	function diffProps(nextProps, lastProps, vnode, lastVnode, dom) {
	    /* istanbul ignore if */
	    if (nextProps === lastProps) {
	        return;
	    }

	    var instance = vnode._owner;
	    if (lastVnode._wrapperState) {
	        vnode._wrapperState = lastVnode._wrapperState;
	    }

	    var isSVG = vnode.ns === 'http://www.w3.org/2000/svg';
	    var isHTML = !isSVG;
	    for (var name in nextProps) {
	        var val = nextProps[name];
	        switch (name) {
	            case 'children':
	                //  case 'key':  case 'ref':
	                break;
	            case 'className':
	                if (isHTML) {
	                    dom.className = val;
	                } else {
	                    dom.setAttribute('class', val);
	                }
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
	    // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enh
	    // a ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
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
	    var nodeName = vnode.type;

	    // input, select, textarea, datalist这几个元素都会包装成受控组件或非受控组件 **受控组件**
	    // 是指定指定了value或checked 并绑定了事件的元素 **非受控组件** 是指定指定了value或checked，
	    // 但没有绑定事件，也没有使用readOnly, disabled来限制状态变化的元素
	    // 这时框架会弹出为它绑定事件，以重置用户的输入，确保它的value或checked值不被改变 但如果用户使用了defaultValue,
	    // defaultChecked，那么它不做任何转换

	    switch (nodeName) {
	        case "select":
	            vnode._wrapperState = {
	                postUpdate: postUpdateSelectedOptions
	            };
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
	    }
	}

	function getOptionValue(props) {
	    //typeof props.value === 'undefined'
	    return props.value != void 666 ? props.value : props.children[0].text;
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
	function setOptionState(vnode) {
	    return {
	        value: getOptionValue(vnode.props)
	    };
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
	            var state = setOptionState(option);
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
	            var state = setOptionState(option);
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

	function render(vnode, container, callback) {
	    return renderTreeIntoContainer(vnode, container, callback, {});
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
	        var prevRendered = null;
	        for (var i = 0, el; el = nodes[i++];) {
	            if (el.getAttribute && el.getAttribute('data-reactroot') !== null) {
	                hostNode = el;
	                prevRendered = el;
	            } else {
	                el.parentNode.removeChild(el);
	            }
	        }
	        vnode._hostParent = hostParent;

	        rootNode = initVnode(vnode, parentContext, prevRendered);
	        container.appendChild(rootNode);

	        if (readyComponents.length) {
	            fireMount();
	        }
	    } else {
	        rootNode = alignVnodes(prevVnode, vnode, container.firstChild, parentContext);
	    }
	    // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
	    // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数

	    if (rootNode.setAttribute) {
	        rootNode.setAttribute('data-reactroot', '');
	    }

	    var instance = vnode._instance;
	    container._component = vnode;
	    delete vnode._prevRendered;
	    if (callback) {
	        callback();
	    }
	    if (instance) {
	        //组件返回组件实例，而普通虚拟DOM 返回元素节点
	        //   instance._currentElement._hostParent = hostParent
	        return instance;
	    } else {
	        return rootNode;
	    }
	}

	function initVnode(vnode, parentContext, prevRendered) {
	    var vtype = vnode.vtype;

	    var node = null;
	    if (!vtype) {
	        // init text comment
	        node = prevRendered && prevRendered.nodeName === vnode.type ? prevRendered : createDOMElement(vnode);
	        vnode._hostNode = node;
	        return node;
	    }

	    if (vtype === 1) {
	        // init element

	        node = mountElement(vnode, parentContext, prevRendered);
	    } else if (vtype === 2) {
	        // init stateful component
	        node = mountComponent(vnode, parentContext, prevRendered);
	    } else if (vtype === 4) {
	        // init stateless component
	        node = mountStateless(vnode, parentContext, prevRendered);
	    }

	    return node;
	}
	var formElements = {
	    select: 1,
	    textarea: 1,
	    input: 1
	};
	function mountElement(vnode, parentContext, prevRendered) {
	    var type = vnode.type,
	        props = vnode.props,
	        dom = void 0;

	    if (prevRendered && prevRendered.nodeName.toLowerCase() === type) {
	        dom = prevRendered;
	    } else {
	        var ns = getNs(type);
	        if (ns) {
	            vnode.ns = ns;
	        }
	        dom = createDOMElement(vnode);
	    }
	    vnode._hostNode = dom;
	    if (prevRendered) {
	        aglinChildren(vnode, dom, parentContext, prevRendered.childNodes);
	    } else {
	        mountChildren(vnode, dom, parentContext);
	    }
	    vnode.checkProps && diffProps(props, {}, vnode, {}, dom);

	    if (vnode.__ref) {
	        readyComponents.push(function () {
	            vnode.__ref(dom);
	        });
	    }
	    if (formElements[type]) {
	        setControlledComponent(vnode);
	        if (type === 'select') {
	            vnode._wrapperState.postUpdate(vnode);
	        }
	    }

	    return dom;
	}
	var readyComponents = [];
	//将虚拟DOM转换为真实DOM并插入父元素
	function mountChildren(vnode, parentNode, parentContext) {
	    var children = vnode.props.children;

	    for (var i = 0, n = children.length; i < n; i++) {
	        var el = children[i];
	        el._hostParent = vnode;

	        parentNode.appendChild(initVnode(el, parentContext));
	    }
	}

	function aglinChildren(vnode, parentNode, parentContext, childNodes) {
	    var children = vnode.props.children,
	        insertPoint = childNodes[0] || null,
	        j = 0;
	    for (var i = 0, n = children.length; i < n; i++) {
	        var el = children[i];
	        el._hostParent = vnode;
	        var prevDom = childNodes[j];
	        var dom = initVnode(el, parentContext, prevDom);
	        if (dom === prevDom) {
	            j++;
	        }
	        parentNode.insertBefore(dom, insertPoint);
	        insertPoint = dom.nextSibling;
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

	function mountComponent(vnode, parentContext, prevRendered) {
	    var type = vnode.type,
	        props = vnode.props;


	    props = getComponentProps(type, props);

	    var instance = new type(props, parentContext); //互相持有引用

	    vnode._instance = instance;
	    instance._currentElement = vnode;
	    instance.props = instance.props || props;
	    instance.context = instance.context || parentContext;

	    if (instance.componentWillMount) {
	        instance.componentWillMount();
	    }
	    // 如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说 instance._currentElement =
	    // vnode instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成 空虚拟DOM {type:
	    // '#comment', text: 'empty'} 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

	    var rendered = safeRenderComponent(instance);
	    instance._rendered = rendered;
	    rendered._hostParent = vnode._hostParent;
	    if (instance.componentDidMount) {
	        readyComponents.push(function () {
	            instance.componentDidMount();
	        });
	    }
	    if (vnode.__ref) {
	        readyComponents.push(function () {
	            vnode.__ref(instance);
	        });
	    }
	    var dom = initVnode(rendered, getChildContext(instance, parentContext), prevRendered);
	    instanceMap.set(instance, dom);
	    vnode._hostNode = dom;
	    //vnode._instance._rendered._hostNode === node

	    return dom;
	}
	function safeRenderComponent(instance) {

	    //  instance.setState = instance.forceUpdate = noop   try {
	    CurrentOwner.cur = instance;
	    var rendered = instance.render();
	    rendered = checkNull(rendered);
	    //  } finally {
	    CurrentOwner.cur = null;
	    //      delete instance.setState      delete instance.forceUpdate  }
	    return rendered;
	}

	function mountStateless(vnode, parentContext, prevRendered) {
	    var type = vnode.type,
	        props = vnode.props;

	    props = getComponentProps(type, props);

	    var rendered = type(props, parentContext);
	    rendered = checkNull(rendered);

	    var dom = initVnode(rendered, parentContext, prevRendered);
	    vnode._instance = {
	        _currentElement: vnode, // ???
	        _rendered: rendered
	    };
	    vnode._hostNode = dom;

	    rendered._hostParent = vnode._hostParent;
	    return dom;
	}

	function updateStateless(lastVnode, nextVnode, node, parentContext) {
	    var instance = lastVnode._instance;
	    var vnode = instance._rendered;

	    var newVnode = nextVnode.type(nextVnode.props, parentContext);
	    newVnode = checkNull(newVnode);

	    var dom = alignVnodes(vnode, newVnode, node, parentContext);
	    nextVnode._instance = instance;
	    instance._rendered = newVnode;
	    nextVnode._hostNode = dom;
	    return dom;
	}

	function disposeStateless(vnode, node) {
	    disposeVnode(vnode._instance._rendered, node);
	}

	//将Component中这个东西移动这里
	options.immune.refreshComponent = function refreshComponent(instance) {
	    //这里触发视图更新

	    reRenderComponent(instance);
	    instance._forceUpdate = false;
	    if (readyComponents.length) {
	        fireMount();
	    }
	};

	function reRenderComponent(instance) {
	    // instance._currentElement

	    var props = instance.props,
	        state = instance.state,
	        context = instance.context,
	        lastProps = instance.lastProps;

	    var lastRendered = instance._rendered;
	    var node = instanceMap.get(instance);

	    var hostParent = lastRendered._hostParent;
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

	    var rendered = safeRenderComponent(instance);
	    var childContext = getChildContext(instance, context);
	    instance._rendered = rendered;
	    rendered._hostParent = hostParent;

	    var dom = alignVnodes(lastRendered, rendered, node, childContext);
	    instanceMap.set(instance, dom);
	    instance._currentElement._hostNode = dom;
	    if (instance.componentDidUpdate) {
	        instance.componentDidUpdate(nextProps, nextState, context);
	    }

	    return dom;
	}

	function alignVnodes(vnode, newVnode, node, parentContext) {
	    var newNode = node;
	    if (newVnode == null) {
	        // remove
	        disposeVnode(vnode, node);
	        node.parentNode.removeChild(node);
	    } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {

	        // replace
	        disposeVnode(vnode, node);
	        newNode = initVnode(newVnode, parentContext);
	        node.parentNode.replaceChild(newNode, node);
	    } else if (vnode !== newVnode) {
	        // same type and same key -> update
	        newNode = updateVnode(vnode, newVnode, node, parentContext);
	    }
	    // else if (vnode._prevRendered) {
	    //    newNode = updateVnode(vnode, newVnode, node, parentContext)
	    // }
	    return newNode;
	}

	function disposeVnode(vnode, node) {
	    var vtype = vnode.vtype;

	    if (!vtype) {
	        //   vnode._hostNode = null   vnode._hostParent = null
	    } else if (vtype === 1) {
	        // destroy element
	        disposeElement(vnode, node);
	    } else if (vtype === 2) {
	        // destroy state component
	        disposeComponent(vnode, node);
	    } else if (vtype === 4) {
	        // destroy stateless component
	        disposeStateless(vnode, node);
	    }
	}

	function disposeElement(vnode, node) {
	    var props = vnode.props;

	    var children = props.children;
	    var childNodes = node.childNodes;
	    for (var i = 0, len = children.length; i < len; i++) {
	        disposeVnode(children[i], childNodes[i]);
	    }

	    vnode.__ref && vnode.__ref(null);
	    vnode._hostNode = null;
	    vnode._hostParent = null;
	}

	function disposeComponent(vnode, node) {
	    var instance = vnode._instance;
	    if (instance) {
	        instanceMap.delete(instance);
	        if (instance.componentWillUnmount) {
	            instance.componentWillUnmount();
	        }
	        vnode._instance = instance._currentElement = instance.props = null;
	        disposeVnode(instance._rendered, node);
	    }
	}

	function updateVnode(lastVnode, nextVnode, node, parentContext) {
	    var vtype = lastVnode.vtype,
	        props = lastVnode.props;


	    if (vtype === 2) {
	        //类型肯定相同的
	        return updateVcomponent(lastVnode, nextVnode, node, parentContext);
	    }

	    if (vtype === 4) {
	        return updateStateless(lastVnode, nextVnode, node, parentContext);
	    }

	    // ignore VCOMMENT and other vtypes
	    if (vtype !== 1) {

	        return node;
	    }
	    var onlyAdd = false;
	    var nextProps = nextVnode.props;
	    if (props[HTML_KEY]) {
	        while (node.firstChild) {
	            node.removeChild(node.firstChild);
	        }
	        updateVelem(lastVnode, nextVnode, node, parentContext);
	        mountChildren(nextVnode, node, parentContext);
	    } else {
	        if (nextProps[HTML_KEY]) {
	            node.innerHTML = nextProps[HTML_KEY].__html;
	        } else {
	            updateChildren(lastVnode, nextVnode, node, parentContext);
	        }
	        updateVelem(lastVnode, nextVnode, node, parentContext);
	    }
	    return node;
	}
	/**
	  *
	  *
	  * @param {any} lastVnode
	  * @param {any} nextVnode
	  * @param {any} dom
	  * @returns
	  */
	function updateVelem(lastVnode, nextVnode, dom) {
	    nextVnode._hostNode = dom;
	    if (lastVnode.checkProps || nextVnode.checkProps) {
	        diffProps(nextVnode.props, lastVnode.props, nextVnode, lastVnode, dom);
	    }
	    if (nextVnode._wrapperState) {
	        nextVnode._wrapperState.postUpdate(nextVnode);
	    }
	    if (nextVnode.__ref) {
	        readyComponents.push(function () {
	            nextVnode.__ref(nextVnode._hostNode);
	        });
	    }
	    return dom;
	}

	function updateVcomponent(lastVnode, nextVnode, node, parentContext) {
	    var instance = nextVnode._instance = lastVnode._instance;
	    var nextProps = nextVnode.props;

	    if (instance.componentWillReceiveProps) {
	        instance.componentWillReceiveProps(nextProps, parentContext);
	    }
	    instance.lastProps = instance.props;
	    instance.props = nextProps;
	    instance.context = parentContext;
	    if (nextVnode.__ref) {

	        nextVnode.push(function () {
	            nextVnode.__ref(instance);
	        });
	    }

	    return reRenderComponent(instance);
	}

	function updateChildren(vnode, newVnode, node, parentContext) {
	    if (vnode._prevRendered) {

	        return;
	    }
	    var patches = {
	        removes: [],
	        updates: [],
	        creates: []
	    };
	    diffChildren(patches, vnode, newVnode, node, parentContext);
	    patches.removes.forEach(applyDestroy);
	    patches.updates.forEach(applyUpdate);
	    patches.creates.forEach(applyCreate);
	}

	function diffChildren(patches, vnode, newVnode, node, parentContext) {
	    var children = vnode.props.children;
	    var childNodes = node.childNodes;
	    var newVchildren = newVnode.props.children;
	    var childrenLen = children.length;
	    var newVchildrenLen = newVchildren.length;

	    if (childrenLen === 0) {
	        if (newVchildrenLen > 0) {
	            for (var i = 0; i < newVchildrenLen; i++) {
	                patches.creates.push({ vnode: newVchildren[i], parentNode: node, parentContext: parentContext, index: i });
	            }
	        }
	        return;
	    } else if (newVchildrenLen === 0) {
	        for (var _i = 0; _i < childrenLen; _i++) {
	            patches.removes.push({ vnode: children[_i], node: childNodes[_i] });
	        }
	        return;
	    }

	    var updates = Array(newVchildrenLen);
	    var removes = null;
	    var creates = null;
	    // isEqual
	    for (var _i2 = 0; _i2 < childrenLen; _i2++) {
	        var _vnode = children[_i2];
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
	                children[_i2] = null;
	                break;
	            }
	        }
	    }

	    // isSimilar
	    for (var _i3 = 0; _i3 < childrenLen; _i3++) {
	        var _vnode2 = children[_i3];
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
	            removes.push({ vnode: _vnode2, node: childNodes[_i3] });
	        }
	    }

	    for (var _i4 = 0; _i4 < newVchildrenLen; _i4++) {
	        var item = updates[_i4];
	        if (!item) {
	            if (!creates) {
	                creates = [];
	            }
	            creates.push({ vnode: newVchildren[_i4], parentNode: node, parentContext: parentContext, index: _i4 });
	        } else if (item.vnode.vtype === 1) {
	            diffChildren(patches, item.vnode, item.newVnode, item.node, item.parentContext);
	        }
	    }
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
	            dom = updateStateless(vnode, nextVnode, dom, data.parentContext);
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
	    disposeVnode(data.vnode, data.node);
	    data.node.parentNode.removeChild(data.node);
	    var node = data.node;
	    var nodeName = node.__n || (node.__n = node.nodeName.toLowerCase());
	    if (recyclables[nodeName] && recyclables[nodeName].length < 72) {
	        recyclables[nodeName].push(node);
	    } else {
	        recyclables[nodeName] = [node];
	    }
	}

	function applyCreate(data) {
	    var node = initVnode(data.vnode, data.parentContext);
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