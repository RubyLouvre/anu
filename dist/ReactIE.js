/**
 * 兼容IE6-8的版本，有问题请加QQ 453286795 by 司徒正美 Copyright 2017-06-15T03:40:59.086Z
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.React = factory());
}(this, function () {

  var __type = Object.prototype.toString;
  var __push = Array.prototype.push;

  var HTML_KEY = "dangerouslySetInnerHTML";

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

  /**
   *
   *
   * @param {any} obj
   * @returns
   */
  function isFn(obj) {
    return __type.call(obj) === "[object Function]";
  }

  var rword = /[^, ]+/g;

  function oneObject(array, val) {
    if (__type.call(array) === "[object String]") {
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
    updateBatchNumber: 1,
    immune: {} // Object.freeze(midway) ;midway.aaa = 'throw err';midway.immune.aaa = 'safe'
  };

  function checkNull(vnode, type) {
    if (vnode === null || vnode === false) {
      return { type: "#comment", text: "empty" };
    } else if (!vnode || !vnode.vtype) {
      throw new Error("@" + type.name + "#render:You may have returned undefined, an array or some other invalid object");
    }
    return vnode;
  }

  function getComponentProps(vnode) {
    var defaultProps = vnode.type.defaultProps;
    var props = vnode.props;
    if (defaultProps) {
      for (var i in defaultProps) {
        //eslint-disable-next-line
        if (props[i] === void 666) {
          props[i] = defaultProps[i];
        }
      }
    }
    return props;
  }

  var recyclables = {
    "#text": [],
    "#comment": [],
    span: [],
    div: [],
    td: [],
    p: []
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var stack = [];
  var EMPTY_CHILDREN = [];

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

  function createElement(type, configs) {
    var props = {},
        key = null,
        ref = null,
        vtype = 1,
        checkProps = 0;

    for (var i = 2, n = arguments.length; i < n; i++) {
      stack.push(arguments[i]);
    }
    if (configs) {
      // eslint-disable-next-line
      for (var _i in configs) {
        var val = configs[_i];
        switch (_i) {
          case "key":
            key = val;
            break;
          case "ref":
            ref = val;
            break;
          case "children":
            if (!stack.length && val && val.length) {
              __push.apply(stack, val);
            }
            break;
          default:
            checkProps = 1;
            props[_i] = val;
        }
      }
    }

    var children = flattenChildren(stack);

    if (typeof type === "function") {
      vtype = type.prototype && type.prototype.render ? 2 : 4;
      if (children.length) props.children = children;
    } else {
      props.children = children;
    }

    return new Vnode(type, props, key, ref, vtype, checkProps, CurrentOwner.cur);
  }

  function flattenChildren(stack) {
    var lastText,
        child,
        children = EMPTY_CHILDREN;
    while (stack.length) {
      //比较巧妙地判定是否为子数组
      if ((child = stack.pop()) && child.pop !== undefined) {
        for (var i = 0; i < child.length; i++) {
          stack[stack.length] = child[i];
        }
      } else {
        // eslint-disable-next-line
        if (child === null || child === void 666 || child === false || child === true) {
          continue;
        }
        var childType = typeof child === "undefined" ? "undefined" : _typeof(child);
        if (childType !== "object") {
          //不是对象就是字符串或数字
          if (lastText) {
            lastText.text = child + lastText.text;
            continue;
          }
          child = {
            type: "#text",
            text: child + ""
          };
          lastText = child;
        } else {
          lastText = null;
        }
        if (children === EMPTY_CHILDREN) {
          children = [child];
        } else {
          children.unshift(child);
        }
      }
    }
    return children;
  }

  //fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
  function getDOMNode() {
    return this;
  }
  function __ref(dom) {
    var instance = this._owner;
    if (dom) {
      dom.getDOMNode = getDOMNode;
    }
    if (instance) {
      instance.refs[this.__refKey] = dom;
    }
  }
  function Vnode(type, props, key, ref, vtype, checkProps, owner) {
    this.type = type;
    this.props = props;
    this.vtype = vtype;

    if (key) {
      this.key = key;
    }
    if (owner) {
      this._owner = owner;
    }
    if (vtype === 1) {
      this.checkProps = checkProps;
    }
    var refType = typeof ref === "undefined" ? "undefined" : _typeof(ref);
    if (refType === "string") {
      this.__refKey = ref;
      this.ref = __ref;
    } else if (refType === "function") {
      this.ref = ref;
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

    $$typeof: 1
  };

  function cloneElement(vnode, props) {
    if (Array.isArray(vnode)) {
      vnode = vnode[0];
    }
    if (!vnode.vtype) {
      return Object.assign({}, vnode);
    }
    var obj = {};
    if (vnode.key) {
      obj.key = vnode.key;
    }
    if (vnode.__refKey) {
      obj.ref = vnode.__refKey;
    } else if (vnode.ref !== __ref) {
      obj.ref = vnode.ref;
    }

    return createElement(vnode.type, Object.assign(obj, vnode.props, props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.props.children);
  }

  var queue = [];
  var callbacks = [];

  var transaction = {
      isInTransation: false,
      queueCallback: function queueCallback(obj) {
          //它们是保证在ComponentDidUpdate后执行
          callbacks.push(obj);
      },
      queueComponent: function queueComponent(instance) {
          queue.push(instance);
      },
      dequeue: function dequeue(recursion) {

          this.isInTransation = true;
          var globalBatchNumber = options.updateBatchNumber;
          var renderQueue = queue;
          queue = [];
          var processingCallbacks = callbacks;
          callbacks = [];
          var refreshComponent = options.immune.refreshComponent;
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
          }
          /* istanbul ignore next */
          );if (queue.length) {
              this.dequeue //用于递归调用自身)
              ();
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
      if (isFn(cb)) transaction.queueCallback({ //确保回调先进入
          component: instance,
          cb: cb
      });
      if (!instance._updateBatchNumber) {
          instance._updateBatchNumber = options.updateBatchNumber + 1;
      }
      transaction.queueComponent(instance);

      if (!transaction.isInTransation) {
          options.updateBatchNumber++;
          transaction.dequeue();
      }
  }

  var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function shallowEqual(objA, objB) {
      if (Object.is(objA, objB)) {
          return true;
      }

      if ((typeof objA === 'undefined' ? 'undefined' : _typeof$1(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof$1(objB)) !== 'object' || objB === null) {
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
    },
    forEach: function forEach(children, callback, context) {
      children.forEach(callback, context);
    },
    map: function map(children, callback, context) {
      return children.map(callback, context);
    },

    toArray: flattenChildren
  };

  var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  }

  //用于后端的document
  );var fakeDoc = new DOMElement();
  fakeDoc.createElement = fakeDoc.createElementNS = function (type) {
      return new DOMElement(type);
  };
  fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
  fakeDoc.documentElement = new DOMElement('html');
  fakeDoc.nodeName = '#document';
  var inBrowser = (typeof window === 'undefined' ? 'undefined' : _typeof$2(window)) === 'object' && window.alert;

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
  var msie = document.documentMode || versions[_typeof$2(document.all) + (typeof XMLHttpRequest === 'undefined' ? 'undefined' : _typeof$2(XMLHttpRequest))];

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
          //eslint-disable-next-line
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
              //eslint-disable-next-line
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

  var cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom'

  //var testStyle = document.documentElement.style
  );var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'];
  var cssMap = oneObject('float', 'cssFloat'

  /**
   * 转换成当前浏览器可用的样式名
   * 
   * @param {any} name 
   * @returns 
   */
  );function cssName(name, dom) {
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

  var globalEvents = {};
  var eventCamelCache = {}; //根据事件对象的type得到驼峰风格的type， 如 click --> Click, mousemove --> MouseMove
  var eventPropHooks = {}; //用于在事件回调里对事件对象进行
  var eventHooks = {}; //用于在元素上绑定特定的事件
  var eventLowerCache = {
    //根据onXXX得到其全小写的事件名, onClick --> click, onMouseMove --> mousemove
    onClick: "click",
    onChange: "change",
    onWheel: "wheel",
    onFocus: "datasetchanged",
    onBlur: "datasetchanged"
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

  function dispatchEvent(e) {
    var __type__ = e.__type__ || e.type;
    e = new SyntheticEvent(e);
    var target = e.target;
    var paths = [];
    do {
      var events = target.__events;
      if (events) {
        paths.push({ dom: target, events: events });
      }
    } while ((target = target.parentNode) && target.nodeType === 1);
    // target --> parentNode --> body --> html
    var type = eventCamelCache[__type__] || __type__;

    var capitalized = capitalize(type);
    var bubble = "on" + capitalized;
    var captured = "on" + capitalized + "Capture";

    var hook = eventPropHooks[__type__];
    if (hook) {
      hook(e);
    }
    transaction.isInTransation = true;
    triggerEventFlow(paths, captured, e);

    if (!e._stopPropagation) {
      triggerEventFlow(paths.reverse(), bubble, e);
    }
    transaction.isInTransation = false;
    options.updateBatchNumber++;
    transaction.dequeue();
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

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
      el.attachEvent("on" + type, fn);
    }
  }

  var ron = /^on/;
  var rcapture = /Capture$/;
  function getBrowserName(onStr) {
    var lower = eventLowerCache[onStr];
    if (lower) {
      return lower;
    }
    var camel = onStr.replace(ron, "").replace(rcapture, "");
    lower = camel.toLowerCase();
    eventLowerCache[onStr] = lower;
    eventCamelCache[lower] = camel;
    return lower;
  }

  addEvent.fire = function fire(dom, name, opts) {
    var hackEvent = document.createEvent("Events");
    hackEvent.initEvent("datasetchanged", true, true, opts);
    if (opts) {
      Object.assign(hackEvent, opts);
    }
    hackEvent.__type__ = name;
    dom.dispatchEvent(hackEvent);
  };

  var inMobile = "ontouchstart" in document;

  eventLowerCache.onWheel = "datasetchanged";
  /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
              firefox DOMMouseScroll detail 下3 上-3
              firefox wheel detlaY 下3 上-3
              IE9-11 wheel deltaY 下40 上-40
              chrome wheel deltaY 下100 上-100 */
  var fixWheelType = "onmousewheel" in document ? "mousewheel" : document.onwheel !== void 0 ? "wheel" : "DOMMouseScroll";
  var fixWheelDelta = fixWheelType === "mousewheel" ? "wheelDetla" : fixWheelType === "wheel" ? "deltaY" : "detail";
  eventHooks.onWheel = function (dom) {
    addEvent(dom, fixWheelType, function (e) {
      var delta = e[fixWheelDelta] > 0 ? -120 : 120;
      var wheelDelta = ~~dom._ms_wheel_ + delta;
      dom._ms_wheel_ = wheelDelta;
      addEvent.fire(dom, "wheel", {
        detail: wheelDelta,
        wheelDeltaY: wheelDelta,
        wheelDelta: wheelDelta
      });
    });
  };

  eventHooks.onFocus = function (dom) {
    addEvent(dom, "focus", function (e) {
      addEvent.fire(dom, "focus");
    }, true);
  };
  eventHooks.onBlur = function (dom) {
    addEvent(dom, "blur", function (e) {
      addEvent.fire(dom, "blur");
    }, true);
  };

  if (inMobile) {
    eventHooks.onClick = noop;
    eventHooks.onClickCapture = noop;
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
    fixHooks: function fixHooks() {},
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
      return "[object Event]";
    }
  };

  var boolAttributes = oneObject("autofocus,autoplay,async,allowTransparency,checked,controls," + "declare,disabled,defer,defaultChecked,defaultSelected," + "isMap,loop,multiple,noHref,noResize,noShade," + "open,readOnly,selected", true);

  var builtIdProperties = oneObject("accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan," + "dateTime,defaultValue,contentEditable,frameBorder,maxLength,marginWidth," + "marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign," + //驼蜂风格
  "value,id,title,alt,htmlFor,name,type,longDesc,className", 1);

  var booleanTag = oneObject('script,iframe,a,map,video,bgsound,form,select,input,textarea,option,keygen,optgroup,label');
  var xlink = "http://www.w3.org/1999/xlink";

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
    if (vnode.ns === "http://www.w3.org/2000/svg") {
      return diffSVGProps(nextProps, lastProps, vnode, lastVnode, dom);
    }
    //eslint-disable-next-line
    for (var name in nextProps) {
      var val = nextProps[name];
      if (val !== lastProps[name]) {
        var hookName = getHookType(name, val, vnode.type, dom);
        propHooks[hookName](dom, name, val, lastProps);
      }
    }
    //如果旧属性在新属性对象不存在，那么移除DOM eslint-disable-next-line
    for (var _name in lastProps) {
      if (!nextProps.hasOwnProperty(_name)) {
        var hookName2 = getHookType(_name, false, vnode.type, dom);
        propHooks[hookName2](dom, _name, builtIdProperties[_name] ? "" : false, lastProps);
      }
    }
  }

  function diffSVGProps(nextProps, lastProps, vnode, lastVnode, dom) {
    // http://www.w3school.com.cn/xlink/xlink_reference.asp
    // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enh
    // a ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
    // xlinkTitle, xlinkType eslint-disable-next-line
    for (var name in nextProps) {
      var val = nextProps[name];
      if (val !== lastProps[name]) {
        var hookName = getHookTypeSVG(name, val, vnode.type, dom);
        propHooks[hookName](dom, name, val, lastProps);
      }
    }
    //eslint-disable-next-line
    for (var _name2 in lastProps) {
      if (!nextProps.hasOwnProperty(_name2)) {
        var _val = nextProps[_name2];
        var hookName2 = getHookTypeSVG(_name2, _val, vnode.type, dom);
        propHooks[hookName2](dom, _name2, false, lastProps);
      }
    }
  }
  var controlled = {
    value: 1,
    defaultValue: 1
  };

  var specialProps = {
    children: 1,
    style: 1,
    className: 1,
    dangerouslySetInnerHTML: 1
  };

  function getHookType(name, val, type, dom) {
    if (specialProps[name]) return name;
    if (boolAttributes[name] && booleanTag[type]) {
      return "boolean";
    }
    if (isEventName(name)) {
      return "__event__";
    }
    if (!val && val !== "" && val !== 0) {
      return "removeAttribute";
    }
    return name.indexOf("data-") === 0 || typeof dom[name] === "undefined" ? "setAttribute" : "property";
  }

  function getHookTypeSVG(name, val, type, dom) {
    if (name === "className") {
      return "svgClass";
    }

    if (specialProps[name]) return name;

    if (isEventName(name)) {
      return "__event__";
    }
    return "svgAttr";
  }

  var svgprops = {
    xlinkActuate: "xlink:actuate",
    xlinkArcrole: "xlink:arcrole",
    xlinkHref: "xlink:href",
    xlinkRole: "xlink:role",
    xlinkShow: "xlink:show"
  };
  var emptyStyle = {};
  var propHooks = {
    boolean: function boolean(dom, name, val, lastProp) {
      // 布尔属性必须使用el.xxx = true|false方式设值 如果为false, IE全系列下相当于setAttribute(xxx,''),
      // 会影响到样式,需要进一步处理 eslint-disable-next-line
      dom[name] = !!val;
      if (!val) {
        dom.removeAttribute(name);
      }
    },
    removeAttribute: function removeAttribute(dom, name) {
      dom.removeAttribute(name);
    },
    setAttribute: function setAttribute(dom, name, val) {
      try {
        dom.setAttribute(name, val);
      } catch (e) {
        console.log("setAttribute error", name, val);
      }
    },
    svgClass: function svgClass(dom, name, val, lastProp) {
      if (!val) {
        dom.removeAttribute("class");
      } else {
        dom.setAttribute("class", val);
      }
    },
    svgAttr: function svgAttr(dom, name, val) {
      var method = val === false || val === null || val === undefined ? "removeAttribute" : "setAttribute";
      if (svgprops[name]) {
        dom[method + "NS"](xlink, svgprops[name], val || "");
      } else {
        dom[method](toLowerCase(name), val || "");
      }
    },
    property: function property(dom, name, val) {
      if (name !== "value" || dom[name] !== val) {
        dom[name] = val;
        if (controlled[name]) {
          dom._lastValue = val;
        }
      }
    },
    children: noop,
    className: function className(dom, _, val, lastProps) {
      dom.className = val;
    },
    style: function style(dom, _, val, lastProps) {
      patchStyle(dom, lastProps.style || emptyStyle, val || emptyStyle);
    },
    __event__: function __event__(dom, name, val, lastProps) {
      var events = dom.__events || (dom.__events = {});
      if (val === false) {
        delete events[name];
      } else {
        if (!lastProps[name]) {
          //添加全局监听事件
          addGlobalEventListener(getBrowserName(name));
          var hook = eventHooks[name];
          if (hook) {
            hook(dom, name);
          }
        }

        events[name] = val;
      }
    },

    dangerouslySetInnerHTML: function dangerouslySetInnerHTML(dom, name, val, lastProps) {
      var oldhtml = lastProps[name] && lastProps[name].__html;
      if (val && val.__html !== oldhtml) {
        dom.innerHTML = val.__html;
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
              console.warn('\u4F60\u4E3A' + vnode.type + '[type=' + domType + ']\u5143\u7D20\u6307\u5B9A\u4E86' + duplexProp + '\u5C5E\u6027\uFF0C\u4F46\u662F\u6CA1\u6709\u63D0\u4F9B\u53E6\u5916\u7684' + Object.keys(keys) + '\n           \u7B49\u7528\u4E8E\u63A7\u5236' + duplexProp + '\u53D8\u5316\u7684\u5C5E\u6027\uFF0C\u90A3\u4E48\u5B83\u662F\u4E00\u4E2A\u975E\u53D7\u63A7\u7EC4\u4EF6\uFF0C\u7528\u6237\u65E0\u6CD5\u901A\u8FC7\u8F93\u5165\u6539\u53D8\u5143\u7D20\u7684' + duplexProp + '\u503C');
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

  function preventUserInput(e) {
      var target = e.target;
      var name = e.type === 'textarea' ? 'innerHTML' : 'value';
      target[name] = target._lastValue;
  }

  function preventUserClick(e) {
      e.preventDefault();
  }

  function preventUserChange(e) {
      var target = e.target;
      var value = target._lastValue;
      var options = target.options;
      if (target.multiple) {
          updateOptionsMore(options, options.length, value);
      } else {
          updateOptionsOne(options, options.length, value);
      }
  }

  var duplexData = {
      1: ['value', {
          onChange: 1,
          onInput: 1,
          readOnly: 1,
          disabled: 1
      }, 'oninput', preventUserInput],
      2: ['checked', {
          onChange: 1,
          onClick: 1,
          readOnly: 1,
          disabled: 1
      }, 'onclick', preventUserClick],
      3: ['value', {
          onChange: 1,
          disabled: 1
      }, 'onchange', preventUserChange]
  };

  function postUpdateSelectedOptions(vnode) {
      var props = vnode.props,
          multiple = !!props.multiple,
          value = isDefined(props.value) ? props.value : isDefined(props.defaultValue) ? props.defaultValue : multiple ? [] : '',
          options = [];
      collectOptions(vnode, props, options);
      if (multiple) {
          updateOptionsMore(options, options.length, value);
      } else {
          updateOptionsOne(options, options.length, value);
      }
  }

  function isDefined(a) {
      return !(a === null || a === undefined);
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
          if (el.type === 'option') {
              ret.push(el);
          } else if (el.type === 'optgroup') {
              collectOptions(el, el.props, ret);
          }
      }
  }

  function updateOptionsOne(options, n, propValue) {
      var selectedValue = '' + propValue;
      for (var i = 0; i < n; i++) {
          var option = options[i];
          var value = getOptionValue(option, option.props);
          if (value === selectedValue) {
              getOptionSelected(option, true);
              return;
          }
      }
      if (n) {
          getOptionSelected(options[0], true);
      }
  }

  function updateOptionsMore(options, n, propValue) {
      var selectedValue = {};
      try {
          for (var i = 0; i < propValue.length; i++) {
              selectedValue['&' + propValue[i]] = true;
          }
      } catch (e) {
          /* istanbul ignore next */
          console.warn('<select multiple="true"> 的value应该对应一个字符串数组');
      }
      for (var _i = 0; _i < n; _i++) {
          var option = options[_i];
          var value = getOptionValue(option, option.props);
          var selected = selectedValue.hasOwnProperty('&' + value);
          getOptionSelected(option, selected);
      }
  }

  function getOptionValue(option, props) {
      if (!props) {
          return getDOMOptionValue(option);
      }
      return props.value === undefined ? props.children[0].text : props.value;
  }

  function getDOMOptionValue(node) {
      if (node.hasAttribute && node.hasAttribute('value')) {
          return node.getAttribute('value');
      }
      var attr = node.getAttributeNode('value');
      if (attr && attr.specified) {
          return attr.value;
      }
      return node.innerHTML.trim();
  }

  function getOptionSelected(option, selected) {
      var dom = option._hostNode || option;
      dom.selected = selected;
  }

  var innerMap = win.Map;
  try {
    var a = document.createComment("");
    var map = new innerMap();
    map.set(a, noop);
    if (map.get(a) !== noop) {
      throw "使用自定义Map";
    }
  } catch (e) {
    var getID = function getID(a) {
      if (a.uniqueID) {
        return "Node" + a.uniqueID;
      }
      if (!a.uniqueID) {
        a.uniqueID = "_" + idN++;
        return "Node" + a.uniqueID;
      }
    };

    var idN = 1;
    innerMap = function innerMap() {
      this.map = {};
    };

    innerMap.prototype = {
      get: function get(a) {
        var id = getID(a);
        return this.map[id];
      },
      set: function set(a, v) {
        var id = getID(a);
        this.map[id] = v;
      },
      delete: function _delete() {
        var id = getID(a);
        delete this.map[id];
      }
    };
  }

  var instanceMap = new innerMap();
  var _removeNodes = [];

  function render(vnode, container, callback) {
    return updateView(vnode, container, callback, {});
  }
  function unstable_renderSubtreeIntoContainer(parentInstance, vnode, container, callback) {
    console.warn("未见于文档的内部方法，不建议使用");
    var parentContext = parentInstance && parentInstance.context || {};
    return updateView(vnode, container, callback, parentContext);
  }
  function isValidElement(vnode) {
    return vnode && vnode.vtype;
  }
  function updateView(vnode, container, callback, parentContext) {
    if (!isValidElement(vnode)) {
      throw new Error(vnode + "\u5FC5\u987B\u4E3A\u7EC4\u4EF6\u6216\u5143\u7D20\u8282\u70B9, \u4F46\u73B0\u5728\u4F60\u7684\u7C7B\u578B\u5374\u662F" + Object.prototype.toString.call(vnode));
    }
    if (!container || container.nodeType !== 1) {
      throw new Error(container + "\u5FC5\u987B\u4E3A\u5143\u7D20\u8282\u70B9");
    }
    var prevVnode = container._component,
        rootNode,
        hostParent = {
      _hostNode: container
    };
    if (!prevVnode) {
      rootNode = genVnodes(vnode, container, hostParent, parentContext);
    } else {
      rootNode = alignVnodes(prevVnode, vnode, container.firstChild, parentContext);
    }
    // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
    // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数

    if (rootNode.setAttribute) {
      rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container._component = vnode;
    // delete vnode._prevRendered
    if (callback) {
      callback();
    }
    return instance || rootNode;
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
  }

  function genVnodes(vnode, container, hostParent, parentContext) {
    var nodes = getNodes(container);
    var prevRendered = null;
    //eslint-disable-next-line
    for (var i = 0, el; el = nodes[i++];) {
      if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
        //   hostNode = el
        prevRendered = el;
      } else {
        el.parentNode.removeChild(el);
      }
    }
    vnode._hostParent = hostParent;

    var rootNode = mountVnode(vnode, parentContext, prevRendered);
    container.appendChild(rootNode);

    if (readyCallbacks.length) {
      fireMount();
    }
    return rootNode;
  }

  function mountVnode(vnode, parentContext, prevRendered) {
    var vtype = vnode.vtype;

    var node = null;
    if (!vtype) {
      // init 文本与注释节点
      node = prevRendered && prevRendered.nodeName === vnode.type ? prevRendered : createDOMElement(vnode);
      vnode._hostNode = node;
      return node;
    }

    if (vtype === 1) {
      // 处理元素节点
      node = mountElement(vnode, parentContext, prevRendered);
    } else if (vtype === 2) {
      // 处理有状态组件
      node = mountComponent(vnode, parentContext, prevRendered);
    } else if (vtype === 4) {
      // 处理无状态组件
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

    if (prevRendered && toLowerCase(prevRendered.nodeName) === type) {
      dom = prevRendered;
    } else {
      var ns = getNs(type);
      vnode.ns = ns;
      dom = createDOMElement(vnode);
    }
    vnode._hostNode = dom;
    if (prevRendered) {
      alignChildren(vnode, dom, parentContext, prevRendered.childNodes);
    } else {
      mountChildren(vnode, dom, parentContext);
    }
    if (vnode.checkProps) {
      diffProps(props, {}, vnode, {}, dom);
    }

    if (vnode.ref) {
      readyCallbacks.push(function () {
        vnode.ref(dom);
      });
    }
    if (formElements[type]) {
      processFormElement(vnode, dom, props);
    }

    return dom;
  }
  var readyCallbacks = [];

  //将虚拟DOM转换为真实DOM并插入父元素
  function mountChildren(vnode, parentNode, parentContext) {
    var children = vnode.props.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var el = children[i];
      el._hostParent = vnode;
      parentNode.appendChild(mountVnode(el, parentContext));
    }
  }

  function alignChildren(vnode, parentNode, parentContext, childNodes) {
    var children = vnode.props.children,
        insertPoint = childNodes[0] || null,
        j = 0;
    for (var i = 0, n = children.length; i < n; i++) {
      var el = children[i];
      el._hostParent = vnode;
      var prevDom = childNodes[j];
      var dom = mountVnode(el, parentContext, prevDom);
      if (dom === prevDom) {
        j++;
      }
      parentNode.insertBefore(dom, insertPoint);
      insertPoint = dom.nextSibling;
    }
  }

  function fireMount() {
    var queue = readyCallbacks;
    readyCallbacks = [];
    //eslint-disable-next-line
    for (var i = 0, cb; cb = queue[i++];) {
      //eslint-disable-next-line
      cb();
    }
  }

  function mountComponent(vnode, parentContext, prevRendered) {
    var type = vnode.type;


    var props = getComponentProps(vnode);

    var instance = new type(props, parentContext); //互相持有引用

    vnode._instance = instance;
    instance._currentElement = vnode;
    instance.props = instance.props || props;
    instance.context = instance.context || parentContext;

    if (instance.componentWillMount) {
      var prevInTransaction = transaction.isInTransation;
      transaction.isInTransation = true;
      instance.componentWillMount();
      transaction.isInTransation = prevInTransaction;
      instance.state = instance._processPendingState();
    }

    // 如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说 instance._currentElement =
    // vnode instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成 空虚拟DOM {type:
    // '#comment', text: 'empty'} 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

    var rendered = safeRenderComponent(instance, type);
    instance._rendered = rendered;
    rendered._hostParent = vnode._hostParent;

    if (vnode.ref) {
      readyCallbacks.push(function () {
        vnode.ref(instance);
      });
    }
    var dom = mountVnode(rendered, getChildContext(instance, parentContext), prevRendered);
    instanceMap.set(instance, dom);
    if (instance.componentDidMount) {
      readyCallbacks.push(function () {
        instance.componentDidMount();
      });
    }
    vnode._hostNode = dom;

    return dom;
  }
  function safeRenderComponent(instance, type) {
    CurrentOwner.cur = instance;
    var rendered = instance.render();
    rendered = checkNull(rendered, type);

    CurrentOwner.cur = null;
    return rendered;
  }

  function mountStateless(vnode, parentContext, prevRendered) {
    var props = getComponentProps(vnode);

    var rendered = vnode.type(props, parentContext);
    rendered = checkNull(rendered, vnode.type);

    var dom = mountVnode(rendered, parentContext, prevRendered);
    vnode._instance = {
      _currentElement: vnode,
      _rendered: rendered
    };
    vnode._hostNode = dom;

    rendered._hostParent = vnode._hostParent;
    return dom;
  }

  function updateStateless(lastVnode, nextVnode, node, parentContext) {
    var instance = lastVnode._instance;
    var vnode = instance._rendered;

    var newVnode = nextVnode.type(getComponentProps(nextVnode), parentContext);
    newVnode = checkNull(newVnode, nextVnode.type);

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
    if (readyCallbacks.length) {
      fireMount();
    }
  };

  function reRenderComponent(instance) {
    // instance._currentElement

    var props = instance.props,
        state = instance.state,
        context = instance.context,
        lastProps = instance.lastProps,
        type = instance.type;

    var lastRendered = instance._rendered;
    var node = instanceMap.get(instance);

    var hostParent = lastRendered._hostParent;
    var nextProps = props;
    lastProps = lastProps || props;
    var nextState = instance._processPendingState(props, context);

    instance.props = lastProps;
    // delete instance.lastProps 生命周期 shouldComponentUpdate(nextProps, nextState,
    // nextContext)
    if (!instance._forceUpdate && instance.shouldComponentUpdate && instance.shouldComponentUpdate(nextProps, nextState, context) === false) {
      return node; //注意
    }
    //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
    if (instance.componentWillUpdate) {
      instance.componentWillUpdate(nextProps, nextState, context);
    }

    instance.props = nextProps;
    instance.state = nextState;
    delete instance._updateBatchNumber;

    var rendered = safeRenderComponent(instance, type);
    var childContext = getChildContext(instance, context);
    instance._rendered = rendered;
    rendered._hostParent = hostParent;

    var dom = alignVnodes(lastRendered, rendered, node, childContext);
    instanceMap.set(instance, dom);
    instance._currentElement._hostNode = dom;
    if (instance.componentDidUpdate) {
      instance.componentDidUpdate(lastProps, state, context);
    }

    return dom;
  }

  function alignVnodes(vnode, newVnode, node, parentContext) {
    var newNode = node;
    //eslint-disable-next-line
    if (newVnode == null) {
      disposeVnode(vnode, node);
      node.parentNode.removeChild(node);
    } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
      //replace
      newNode = mountVnode(newVnode, parentContext);
      var p = node.parentNode;
      if (p) {
        p.replaceChild(newNode, node);
      }
      removeVnode(vnode, node, newNode);
    } else if (vnode !== newVnode) {
      // same type and same key -> update
      newNode = updateVnode(vnode, newVnode, node, parentContext);
    }

    return newNode;
  }

  function removeVnode(vnode, node, newNode) {
    _removeNodes = [];
    disposeVnode(vnode, node);
    for (var i = 0, n = _removeNodes.length; i < n; i++) {
      var _node = _removeNodes[i],
          _nodeParent = _node.parentNode;
      if (!(_node && _nodeParent)) {
        continue;
      }
      if (newNode && i === n - 1) {
        _nodeParent.replaceChild(newNode, _node);
      } else {
        _nodeParent.removeChild(_node);
      }
    }
  }

  function disposeVnode(vnode, node) {
    if (node) {
      _removeNodes.unshift(node);
    }
    if (!vnode) {
      return;
    }
    var vtype = vnode.vtype;

    if (!vtype) {
      vnode._hostNode = null;
      vnode._hostParent = null;
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
  function findDOMNode(componentOrElement) {
    if (componentOrElement == null) {
      return null;
    }
    if (componentOrElement.nodeType === 1) {
      return componentOrElement;
    }

    return instanceMap.get(componentOrElement) || null;
  }

  function disposeElement(vnode, node) {
    var props = vnode.props;

    var children = props.children;
    var childNodes = node.childNodes;
    for (var i = 0, len = children.length; i < len; i++) {
      disposeVnode(children[i], childNodes[i]);
    }
    //eslint-disable-next-line
    vnode.ref && vnode.ref(null);
    vnode._hostNode = null;
    vnode._hostParent = null;
  }

  function disposeComponent(vnode, node) {
    var instance = vnode._instance;
    if (instance) {
      instanceMap["delete"](instance);
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
      return updateComponent(lastVnode, nextVnode, node, parentContext);
    }

    if (vtype === 4) {
      return updateStateless(lastVnode, nextVnode, node, parentContext);
    }

    // ignore VCOMMENT and other vtypes
    if (vtype !== 1) {
      return node;
    }

    var nextProps = nextVnode.props;
    if (props[HTML_KEY]) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      updateElement(lastVnode, nextVnode, node, parentContext);
      mountChildren(nextVnode, node, parentContext);
    } else {
      if (nextProps[HTML_KEY]) {
        node.innerHTML = nextProps[HTML_KEY].__html;
      } else {
        updateChildren(lastVnode, nextVnode, node, parentContext);
      }
      updateElement(lastVnode, nextVnode, node, parentContext);
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
  function updateElement(lastVnode, nextVnode, dom) {
    nextVnode._hostNode = dom;
    if (lastVnode.checkProps || nextVnode.checkProps) {
      diffProps(nextVnode.props, lastVnode.props, nextVnode, lastVnode, dom);
    }
    if (nextVnode.type === "select") {
      postUpdateSelectedOptions(nextVnode);
    }
    if (nextVnode.ref) {
      readyCallbacks.push(function () {
        nextVnode.ref(nextVnode._hostNode);
      });
    }
    return dom;
  }

  function updateComponent(lastVnode, nextVnode, node, parentContext) {
    var instance = nextVnode._instance = lastVnode._instance;
    var nextProps = getComponentProps(nextVnode);
    instance.lastProps = instance.props;
    if (instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(nextProps, parentContext);
    }

    instance.props = nextProps;
    instance.context = parentContext;
    if (nextVnode.ref) {
      readyCallbacks.push(function () {
        nextVnode.ref(instance);
      });
    }

    return reRenderComponent(instance);
  }

  function updateChildren(vnode, newVnode, node, parentContext) {
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
      for (var _i = 0; _i < childrenLen; _i++) {
        patches.removes.push({ vnode: children[_i], node: childNodes[_i] });
      }
      return;
    }
    var cloneChildren = children.slice();
    var updates = Array(newVchildrenLen);
    var removes = [];
    var creates = [];
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
          cloneChildren[_i2] = null;
          break;
        }
      }
    }

    // isSimilar
    for (var _i3 = 0; _i3 < childrenLen; _i3++) {
      var _vnode2 = cloneChildren[_i3];
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
        removes.push({ vnode: _vnode2, node: childNodes[_i3] });
      }
    }

    for (var _i4 = 0; _i4 < newVchildrenLen; _i4++) {
      var item = updates[_i4];
      if (!item) {
        creates.push({
          vnode: newVchildren[_i4],
          parentNode: node,
          parentContext: parentContext,
          index: _i4
        });
      } else if (item.vnode.vtype === 1) {
        diffChildren(patches, item.vnode, item.newVnode, item.node, item.parentContext);
      }
    }
    if (removes.length) {
      __push.apply(patches.removes, removes);
    }
    if (creates.length) {
      __push.apply(patches.creates, creates);
    }
    __push.apply(patches.updates, updates);
  }

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
        updateElement(vnode, nextVnode, dom, data.parentContext);
      } else if (vnode.vtype === 4) {
        dom = updateStateless(vnode, nextVnode, dom, data.parentContext);
      } else if (vnode.vtype === 2) {
        dom = updateComponent(vnode, nextVnode, dom, data.parentContext);
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
    removeVnode(data.vnode, data.node);
    var node = data.node;
    var nodeName = node.__n || (node.__n = toLowerCase(node.nodeName));
    if (recyclables[nodeName] && recyclables[nodeName].length < 72) {
      recyclables[nodeName].push(node);
    } else {
      recyclables[nodeName] = [node];
    }
  }

  function applyCreate(data) {
    var node = mountVnode(data.vnode, data.parentContext);
    data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index]);
  }

  //Ie6-8 oninput使用propertychange进行冒充，触发一个ondatasetchanged事件
  function fixIEInputHandle(e) {
    if (e.propertyName === "value") {
      addEvent.fire(e.srcElement, "input");
    }
  }
  function fixIEInput(dom, name) {
    addEvent(dom, "propertychange", fixIEInputHandle);
  }

  function fixIEChangeHandle(e) {
    var dom = e.srcElement;
    if (dom.type === "select-one") {
      var idx = dom.selectedIndex,
          option,
          attr;
      if (idx > -1) {
        //IE 下select.value不会改变
        option = dom.options[idx];
        attr = option.attributes.value;
        dom.value = attr && attr.specified ? option.value : option.text;
      }
    }
    addEvent.fire(dom, "change");
  }
  function fixIEChange(dom, name) {
    //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发
    var eventType = dom.type === "radio" || dom.type === "checkbox" ? "click" : "change";
    addEvent(dom, eventType, fixIEChangeHandle);
  }

  function fixIESubmit(dom, name) {
    if (dom.nodeName === "FORM") {
      addEvent(dom, "submit", dispatchEvent);
    }
  }

  if (msie < 9) {
    eventHooks.onFocus = function (dom) {
      addEvent(dom, "focusin", function (e) {
        addEvent.fire(dom, "focus");
      });
    };
    eventHooks.onBlur = function (dom) {
      addEvent(dom, "blurout", function (e) {
        addEvent.fire(dom, "blur");
      });
    };

    Object.assign(eventPropHooks, oneObject("mousemove, mouseout, mouseout, mousewheel, mousewheel, wheel, click", function (event) {
      if (!("pageX" in event)) {
        var doc = event.target.ownerDocument || document;
        var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement;
        event.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
        event.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
      }
    }));

    Object.assign(eventPropHooks, oneObject("keyup, keydown, keypress", function (event) {
      if (event.which == null && event.type.indexOf("key") === 0) {
        event.which = event.charCode != null ? event.charCode : event.keyCode;
      }
    }));

    addEvent.fire = function dispatchIEEvent(dom, type, obj) {
      try {
        var hackEvent = document.createEventObject();
        if (obj) {
          Object.assign(hackEvent, obj);
        }
        hackEvent.__type__ = type;
        //IE6-8触发事件必须保证在DOM树中,否则报"SCRIPT16389: 未指明的错误"
        dom.fireEvent("ondatasetchanged", hackEvent);
      } catch (e) {}
    };
    //IE8中select.value不会在onchange事件中随用户的选中而改变其value值，也不让用户直接修改value 只能通过这个hack改变
    try {
      Object.defineProperty(HTMLSelectElement.prototype, "value", {
        set: function set(v) {
          this._fixIEValue = v;
        },
        get: function get() {
          return this._fixIEValue;
        }
      });
    } catch (e) {}
    eventLowerCache.onInput = "datasetchanged";
    eventLowerCache.onChange = "datasetchanged";
    eventLowerCache.onInputCapture = "datasetchanged";
    eventLowerCache.onChangeCapture = "datasetchanged";
    eventHooks.onInput = fixIEInput;
    eventHooks.onInputCapture = fixIEInput;
    eventHooks.onChange = fixIEChange;
    eventHooks.onChangeCapture = fixIEChange;
    eventHooks.onSubmit = fixIESubmit;
    eventHooks.mousewheelFix = eventHooks.mousewheel;
  }

  var check = function check() {
      return check;
  };
  check.isRequired = check;
  var PropTypes = {
      "array": check,
      "bool": check,
      "func": check,
      "number": check,
      "object": check,
      "string": check,
      "any": check,
      "arrayOf": check,
      "element": check,
      "instanceOf": check,
      "node": check,
      "objectOf": check,
      "oneOf": check,
      "oneOfType": check,
      "shape": check
  };
  var React = {
      PropTypes: PropTypes,
      Children: Children, //为了react-redux
      render: render,
      findDOMNode: findDOMNode,
      options: options,
      unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
      isValidElement: isValidElement,
      version: "1.0.2",
      createElement: createElement,
      cloneElement: cloneElement,
      PureComponent: PureComponent,
      Component: Component
  };

  win.ReactDOM = React;

  return React;

}));