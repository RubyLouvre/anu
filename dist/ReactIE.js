/**
 * 兼容IE6-8的版本，有问题请加QQ 370262116 by 司徒正美 Copyright 2017-08-02
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.React = factory());
}(this, (function () {

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
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0];
  }
  if (vnode === null || vnode === false) {
    return { type: "#comment", text: "empty" };
  } else if (!vnode || !vnode.vtype) {
    throw new Error("@" + type.name + "#render:You may have returned undefined, an array or some other invalid object");
  }
  return vnode;
}
var numberMap = {
  "[object Null]": 1,
  "[object Boolean]": 2,
  "[object Number]": 3,
  "[object String]": 4,
  "[object Function]": 5,
  "[object Symbol]": 6,
  "[object Array]": 7
};
// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, array: 6, object:7
function typeNumber(data) {
  if (data === void 666) {
    return 0;
  }
  var a = numberMap[__type.call(data)];
  return a || 8;
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
  "#comment": []
};

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
          //只要不是通过JSX产生的createElement调用，props内部就千奇百度，
          //children可能是一个数组，也可能是一个字符串，数字，布尔，
          //也可能是一个虚拟DOM
          if (!stack.length && val) {
            if (Array.isArray(val)) {
              __push.apply(stack, val);
            } else {
              stack.push(val);
            }
          }
          break;
        default:
          checkProps = 1;
          props[_i] = val;
      }
    }
  }

  var children = flattenChildren(stack);

  if (typeNumber(type) === 5) {
    //fn
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
      children = [];

  while (stack.length) {
    //比较巧妙地判定是否为子数组
    if ((child = stack.pop()) && child.pop) {
      if (child.toJS) {
        //兼容Immutable.js
        child = child.toJS();
      }
      for (var i = 0; i < child.length; i++) {
        stack[stack.length] = child[i];
      }
    } else {
      // eslint-disable-next-line
      var childType = typeNumber(child);
      if (childType < 3 // 0, 1,2
      ) {
          continue;
        }

      if (childType < 6) {
        //!== 'object'
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

      children.unshift(child);
    }
  }
  if (!children.length) {
    children = EMPTY_CHILDREN;
  }
  return children;
}

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
  return this;
}
function __ref(dom) {
  var instance = this._owner;
  if (dom && instance) {
    dom.getDOMNode = getDOMNode;
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
  var refType = typeNumber(ref);
  if (refType === 4) {
    //string
    this.__refKey = ref;
    this.ref = __ref;
  } else if (refType === 5) {
    //function
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

if (0 === [1, 2].splice(0).length) {
  console.warn("请引入polyfill进行修复"); // eslint-disable-line
}

var scheduler = {
  list: [],
  add: function add(el) {
    this.count = this.list.push(el);
  },
  addAndRun: function addAndRun(fn) {
    this.add(fn);
    setTimeout(function () {
      scheduler.run();
    }, 0);
  },
  run: function run() {
    if (this.count === 0) return;
    this.count = 0;
    this.list.splice(0).forEach(function (instance) {
      if (typeNumber(instance) === 5) {
        instance(); //处理ref方法
        return;
      }
      if (instance._pendingCallbacks.length) {
        //处理componentWillMount产生的回调
        instance._pendingCallbacks.splice(0).forEach(function (fn) {
          fn.call(instance);
        });
      }
      if (instance.componentDidMount) {
        instance._updating = true;
        instance.componentDidMount();
        instance.componentDidMount = instance._updating = false;
        instance._hasDidMount = true;
        //处理componentDidMount里调用 setState产生重绘
        if (instance._pendingStates.length && !instance._disableSetState) {
          options.refreshComponent(instance);
        }
      }
    });
  }
};

/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */

function Component(props, context) {
  this.context = context;
  this.props = props;
  this.refs = {};
  this._disableSetState = true;
  /**
   * this._disableSetState = true 用于阻止组件在componentWillMount/componentWillReceiveProps
   * 被setState，从而提前发生render;
   * this._updating = true 用于将componentDidMount发生setState/forceUpdate 延迟到整个render后再触发
   * this._disposed = true 阻止组件在销毁后还进行diff
   * this._forceUpdate = true 用于强制组件更新，忽略shouldComponentUpdate的结果
   * this._hasDidMount = true 表示这个组件已经触发componentDidMount回调，
   * 如果用户没有指定，那么它在插入DOM树时，自动标识为true
   * 此flag是确保 component在update前就要执行componentDidMount
   */
  this._pendingCallbacks = [];
  this._pendingStates = [];
  this.state = {};
}

Component.prototype = {
  replaceState: function replaceState() {
    console.warn("此方法末实现"); // eslint-disable-line
  },
  setState: function setState(state, cb) {
    this._pendingStates.push(state);
    setStateProxy(this, cb);
  },
  forceUpdate: function forceUpdate(cb) {
    this._forceUpdate = true;
    setStateProxy(this, cb);
  },

  _processPendingState: function _processPendingState(props, context) {
    var n = this._pendingStates.length;
    if (n === 0) {
      return this.state;
    }
    var states = this._pendingStates.splice(0);
    var nextState = extend({}, this.state);
    for (var i = 0; i < n; i++) {
      var partial = states[i];
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
  if (isFn(cb)) {
    instance._pendingCallbacks.push(cb);
  }
  if (instance._updating) {
    //防止在父组件更新过程中，子组件执行父组件的setState
    scheduler.add(function () {
      options.refreshComponent(instance);
    });
  } else if (instance._disableSetState === true) {
    //只存储回调，但不会触发组件的更新
    this._forceUpdate = false;
  } else {
    options.refreshComponent(instance);
  }
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

var fn = inherit(PureComponent, Component);

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
  toArray: function toArray(children) {
    return children.slice(0);
  }
};

//用于后端的元素节点
function DOMElement(type) {
  this.nodeName = type;
  this.style = {};
  this.children = [];
}
var fn$1 = DOMElement.prototype = {
  contains: Boolean
};
String("replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute" + ",getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent" + ",detachEvent").replace(/\w+/g, function (name) {
  fn$1[name] = function () {
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
// http://demo.yanue.net/HTML5element/
var mhtml = {
  meter: 1,
  menu: 1,
  map: 1,
  meta: 1,
  mark: 1
};
var svgTags = oneObject("" +
// structure
"svg,g,defs,desc,metadata,symbol,use," +
// image & shape
"image,path,rect,circle,line,ellipse,polyline,polygon," +
// text
"text,tspan,tref,textpath," +
// other
"marker,pattern,clippath,mask,filter,cursor,view,animate," +
// font
"font,font-face,glyph,missing-glyph", svgNs);

var rmathTags = /^m/;
var mathNs = "http://www.w3.org/1998/Math/MathML";
var svgNs = "http://www.w3.org/2000/svg";
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

/**
 * 为了兼容0.13之前的版本
 */
var MANY = "DEFINE_MANY";
var MANY_MERGED = "MANY_MERGED";
var ReactClassInterface = {
  mixins: MANY,
  statics: MANY,
  propTypes: MANY,
  contextTypes: MANY,
  childContextTypes: MANY,
  getDefaultProps: MANY_MERGED,
  getInitialState: MANY_MERGED,
  getChildContext: MANY_MERGED,
  render: "ONCE",
  componentWillMount: MANY,
  componentDidMount: MANY,
  componentWillReceiveProps: MANY,
  shouldComponentUpdate: "DEFINE_ONCE",
  componentWillUpdate: MANY,
  componentDidUpdate: MANY,
  componentWillUnmount: MANY
};

var specHandle = {
  displayName: function displayName(Ctor, value, name) {
    Ctor[name] = value;
  },
  mixins: function mixins(Ctor, value) {
    if (value) {
      for (var i = 0; i < value.length; i++) {
        mixSpecIntoComponent(Ctor, value[i]);
      }
    }
  },

  propTypes: mergeObject,
  childContextTypes: mergeObject,
  contextTypes: mergeObject,

  getDefaultProps: function getDefaultProps(Ctor, value, name) {
    if (Ctor[name]) {
      Ctor[name] = createMergedResultFunction(Ctor[name], value);
    } else {
      Ctor[name] = value;
    }
  },
  statics: function statics(Ctor, value) {
    extend(Ctor, Object(value));
  },

  autobind: noop
};

function mergeObject(fn, value, name) {
  fn[name] = Object.assign({}, fn[name], value);
}

//防止覆盖Component内部一些重要的方法或属性
var protectedProps = {
  mixin: 1,
  setState: 1,
  forceUpdate: 1,
  _processPendingState: 1,
  _pendingCallbacks: 1,
  _pendingStates: 1
};

function mixSpecIntoComponent(Ctor, spec) {
  if (!spec) {
    return;
  }
  if (isFn(spec)) {
    console.warn("createClass(spec)中的spec不能为函数，只能是纯对象"); // eslint-disable-line
  }

  var proto = Ctor.prototype;
  var autoBindPairs = proto.__reactAutoBindPairs;

  if (spec.hasOwnProperty("mixin")) {
    specHandle.mixins(Ctor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }
    if (protectedProps[name] === 1) {
      continue;
    }

    var property = spec[name];
    var isAlreadyDefined = proto.hasOwnProperty(name);

    if (specHandle.hasOwnProperty(name)) {
      specHandle[name](Ctor, property, name);
    } else {
      var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
      var shouldAutoBind = isFn(property) && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

      if (shouldAutoBind) {
        autoBindPairs.push(name, property);
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactClassInterface[name];
          //合并多个同名函数
          if (specPolicy === MANY_MERGED) {
            //这个是有返回值
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === MANY) {
            //这个没有返回值
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
        }
      }
    }
  }
}

function mergeOwnProperties(one, two) {
  for (var key in two) {
    if (two.hasOwnProperty(key)) {
      one[key] = two[key];
    }
  }
  return one;
}

function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    var c = {};
    mergeOwnProperties(c, a);
    mergeOwnProperties(c, b);
    return c;
  };
}

function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);
  return boundMethod;
}

function bindAutoBindMethods(component) {
  var pairs = component.__reactAutoBindPairs;
  for (var i = 0; i < pairs.length; i += 2) {
    var autoBindKey = pairs[i];
    var method = pairs[i + 1];
    component[autoBindKey] = bindAutoBindMethod(component, method);
  }
}

//创建一个构造器
function newCtor(className) {
  var curry = Function("ReactComponent", "bindAutoBindMethods", "return function " + className + "(props, context) {\n    ReactComponent.call(this, props, context);\n    this.state = this.getInitialState ? this.getInitialState() : {};\n    if (this.__reactAutoBindPairs.length) {\n      bindAutoBindMethods(this);\n    }\n  };");
  return curry(Component, bindAutoBindMethods);
}
var warnOnce = 1;
function createClass(spec) {
  if (warnOnce) {
    warnOnce = 0;
    console.warn("createClass已经过时，强烈建议使用es6方式定义类"); // eslint-disable-line
  }
  var Constructor = newCtor(spec.displayName || "Component");
  var proto = inherit(Constructor, Component);
  proto.__reactAutoBindPairs = [];
  delete proto.render;

  mixSpecIntoComponent(Constructor, spec);
  if (isFn(Constructor.getDefaultProps)) {
    Constructor.defaultProps = Constructor.getDefaultProps();
  }

  //性能优化，为了防止在原型链进行无用的查找，直接将用户没有定义的生命周期钩子置为null
  for (var methodName in ReactClassInterface) {
    if (!proto[methodName]) {
      proto[methodName] = null;
    }
  }

  return Constructor;
}

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

function dispatchEvent(e) {
  //__type__ 在injectTapEventPlugin里用到
  var bubble = e.__type__ || e.type;

  e = new SyntheticEvent(e);

  var hook = eventPropHooks[bubble];
  if (hook && false === hook(e)) {
    return;
  }

  var paths = collectPaths(e);

  var captured = bubble + "capture";

  //scheduler.run();
  triggerEventFlow(paths, captured, e);

  if (!e._stopPropagation) {
    triggerEventFlow(paths.reverse(), bubble, e);
  }
}

function collectPaths(e) {
  var target = e.target;
  var paths = [];
  do {
    var events = target.__events;
    if (events) {
      paths.push({ dom: target, events: events });
    }
  } while ((target = target.parentNode) && target.nodeType === 1);
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
} catch (e) {}
// no catch


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
    var deltaY = ~~dom._ms_wheel_ + delta;
    dom._ms_wheel_ = deltaY;
    e = new SyntheticEvent(e);
    e.type = "wheel";
    e.deltaY = deltaY;
    dispatchEvent(e);
  });
};

"blur,focus,mouseenter,mouseleave".replace(/\w+/g, function (type) {
  eventHooks[type] = function (dom) {
    addEvent(dom, type, function (e) {
      dispatchEvent(e);
    }, true);
  };
});

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
  stopImmediatePropagation: function stopImmediatePropagation() {
    this.stopPropagation();
    this.stopImmediate = true;
  },
  toString: function toString() {
    return "[object Event]";
  }
};
/* istanbul ignore next  */


var boolAttributes = oneObject("autofocus,autoplay,async,allowTransparency,checked,controls,declare,disabled,def" + "er,defaultChecked,defaultSelected,isMap,loop,multiple,noHref,noResize,noShade,op" + "en,readOnly,selected", true);

var builtIdProperties = oneObject("accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan,dateTime,def" + "aultValue,contentEditable,frameBorder,maxLength,marginWidth,marginHeight,rowSpan" + ",tabIndex,useMap,vSpace,valueType,vAlign," + //驼蜂风格
"value,id,title,alt,htmlFor,name,type,longDesc,className", 1);

var booleanTag = oneObject("script,iframe,a,map,video,bgsound,form,select,input,textarea,option,keygen,optgr" + "oup,label");
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
  for (var _name2 in lastProps) {
    if (!nextProps.hasOwnProperty(_name2)) {
      var hookName2 = getHookType(_name2, false, vnode.type, dom);
      propHooks[hookName2](dom, _name2, builtIdProperties[_name2] ? "" : false, lastProps);
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
  for (var _name3 in lastProps) {
    if (!nextProps.hasOwnProperty(_name3)) {
      var _val = nextProps[_name3];
      var hookName2 = getHookTypeSVG(_name3, _val, vnode.type, dom);
      propHooks[hookName2](dom, _name3, false, lastProps);
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
  if (typeNumber(val) < 3 && !val) {
    return "removeAttribute";
  }
  return name.indexOf("data-") === 0 || dom[name] === void 666 ? "setAttribute" : "property";
}

function getHookTypeSVG(name) {
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
  boolean: function boolean(dom, name, val) {
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
      console.log("setAttribute error", name, val); // eslint-disable-line
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
  className: function className(dom, _, val) {
    dom.className = val;
  },
  style: function style(dom, _, val, lastProps) {
    patchStyle(dom, lastProps.style || emptyStyle, val || emptyStyle);
  },
  __event__: function __event__(dom, name, val, lastProps) {
    var events = dom.__events || (dom.__events = {});

    if (val === false) {
      delete events[toLowerCase(name.slice(2))];
    } else {
      if (!lastProps[name]) {
        //添加全局监听事件
        var _name = getBrowserName(name);
        addGlobalEvent(_name);
        var hook = eventHooks[_name];
        if (hook) {
          hook(dom, name);
        }
      }
      //onClick --> click, onClickCapture --> clickcapture
      events[toLowerCase(name.slice(2))] = val;
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
      // eslint-disable-next-line
      console.warn("\u4F60\u4E3A" + vnode.type + "[type=" + domType + "]\u5143\u7D20\u6307\u5B9A\u4E86" + duplexProp + "\u5C5E\u6027\uFF0C\u4F46\u662F\u6CA1\u6709\u63D0\u4F9B\u53E6\u5916\u7684" + Object.keys(keys) + "\u7B49\u7528\u4E8E\u63A7\u5236" + duplexProp + "\n\n      \u53D8\u5316\u7684\u5C5E\u6027\uFF0C\u90A3\u4E48\u5B83\u662F\u4E00\u4E2A\u975E\u53D7\u63A7\u7EC4\u4EF6\uFF0C\u7528\u6237\u65E0\u6CD5\u901A\u8FC7\u8F93\u5165\u6539\u53D8\u5143\u7D20\u7684" + duplexProp + "\u503C");
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
  return props.value === undefined ? props.children[0].text : props.value;
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

//innerMap_start
var innerMap = win.Map;

function getID(a) {
  if (a.uniqueID) {
    return "Node" + a.uniqueID;
  } else {
    a.uniqueID = "_" + uniqueID++;
    return "Node" + a.uniqueID;
  }
}

try {
  var testNode = document.createComment("");
  var map = new innerMap(),
      value = "anujs";
  map.set(testNode, value);
  if (map.get(testNode) !== value) {
    throw "使用自定义Map";
  }
} catch (e) {
  var uniqueID = 1;
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
    delete: function _delete(a) {
      var id = getID(a);
      delete this.map[id];
    }
  };
}
//innerMap_end
var instanceMap = new innerMap();

function disposeVnode(vnode) {
  if (!vnode || vnode._disposed) {
    return;
  }
  switch (vnode.vtype) {
    case 1:
      disposeElement(vnode);
      break;
    case 2:
      disposeComponent(vnode);
      break;
    case 4:
      disposeStateless(vnode);
      break;
    default:
      vnode._hostNode = vnode._hostParent = null;
      break;
  }
  vnode._disposed = true;
}

function disposeStateless(vnode) {
  if (vnode._instance) {
    disposeVnode(vnode._instance._rendered);
    vnode._instance = null;
  }
}

function disposeElement(vnode) {
  var props = vnode.props;

  var children = props.children;
  for (var i = 0, n = children.length; i < n; i++) {
    disposeVnode(children[i]);
  }
  //eslint-disable-next-line
  vnode.ref && vnode.ref(null);
  vnode._hostNode = vnode._hostParent = null;
}

function disposeComponent(vnode) {
  var instance = vnode._instance;
  if (instance) {
    instance._disableSetState = true;
    options.beforeUnmount(instance);
    if (instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
    var node = instanceMap.get(instance);
    if (node) {
      node._component = null;
      instanceMap["delete"](instance);
    }
    vnode._instance = instance._currentElement = null;
    disposeVnode(instance._rendered);
  }
}

/**
 * ReactDOM.render 方法
 *
 */
function render(vnode, container, callback) {
  return renderByAnu(vnode, container, callback, {});
}
/**
 * ReactDOM.unstable_renderSubtreeIntoContainer 方法， React.render的包装
 *
 */
var warnOne = 1;
function unstable_renderSubtreeIntoContainer(parentInstance, vnode, container, callback) {
  if (warnOne) {
    console.warn("unstable_renderSubtreeIntoContainer未见于文档的内部方法，不建议使用"); // eslint-disable-line
    warnOne = 0;
  }
  var parentContext = parentInstance && parentInstance.context || {};
  return renderByAnu(vnode, container, callback, parentContext);
}
function unmountComponentAtNode(dom) {
  var prevVnode = dom._component;
  if (prevVnode) {
    var parentContext = prevVnode._instance ? prevVnode._instance.context : {};
    alignVnodes(prevVnode, { type: "#text", text: "empty" }, dom.firstChild, parentContext);
  }
}
function isValidElement(vnode) {
  return vnode && vnode.vtype;
}

function renderByAnu(vnode, container, callback, parentContext) {
  if (!isValidElement(vnode)) {
    throw new Error(vnode + "\u5FC5\u987B\u4E3A\u7EC4\u4EF6\u6216\u5143\u7D20\u8282\u70B9, \u4F46\u73B0\u5728\u4F60\u7684\u7C7B\u578B\u5374\u662F" + Object.prototype.toString.call(vnode));
  }
  if (!container || container.nodeType !== 1) {
    console.warn(container + "\u5FC5\u987B\u4E3A\u5143\u7D20\u8282\u70B9"); // eslint-disable-line
    return;
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
  if (callback) {
    callback();
  }

  scheduler.run();

  return instance || rootNode;
  //组件返回组件实例，而普通虚拟DOM 返回元素节点
}

function genVnodes(vnode, container, hostParent, parentContext) {
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
  vnode._hostParent = hostParent;

  var rootNode = mountVnode(vnode, parentContext, prevRendered);
  container.appendChild(rootNode);

  return rootNode;
}

function mountVnode(vnode, parentContext, prevRendered) {
  var vtype = vnode.vtype;

  switch (vtype) {
    case 1:
      return mountElement(vnode, parentContext, prevRendered);
    case 2:
      return mountComponent(vnode, parentContext, prevRendered);
    case 4:
      return mountStateless(vnode, parentContext, prevRendered);
    default:
      var node = prevRendered && prevRendered.nodeName === vnode.type ? prevRendered : createDOMElement(vnode);
      vnode._hostNode = node;
      return node;
  }
}

var formElements = {
  select: 1,
  textarea: 1,
  input: 1
};

function genMountElement(vnode, type, prevRendered) {
  if (prevRendered && toLowerCase(prevRendered.nodeName) === type) {
    return prevRendered;
  } else {
    var ns = getNs(type);
    vnode.ns = ns;
    var dom = createDOMElement(vnode);
    if (prevRendered && dom !== prevRendered) {
      while (prevRendered.firstChild) {
        dom.appendChild(prevRendered.firstChild);
      }
    }
    return dom;
  }
}

function mountElement(vnode, parentContext, prevRendered) {
  var type = vnode.type,
      props = vnode.props;

  var dom = genMountElement(vnode, type, prevRendered);

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
    scheduler.add(function () {
      vnode.ref(dom);
    });
  }
  if (formElements[type]) {
    processFormElement(vnode, dom, props);
  }

  return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(vnode, parentNode, parentContext) {
  var children = vnode.props.children;
  for (var i = 0, n = children.length; i < n; i++) {
    var el = children[i];
    el._hostParent = vnode;
    var curNode = mountVnode(el, parentContext);

    parentNode.appendChild(curNode);
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
function mountComponent(vnode, parentContext, prevRendered) {
  var type = vnode.type;


  var props = getComponentProps(vnode);

  var instance = new type(props, parentContext); //互相持有引用

  vnode._instance = instance;
  instance._currentElement = vnode;
  instance.props = instance.props || props;
  instance.context = instance.context || parentContext;

  if (instance.componentWillMount) {
    instance._disableSetState = true;
    instance.componentWillMount();
    instance.state = instance._processPendingState();
    instance._disableSetState = false;
  } else {
    instance.componentWillMount = null;
  }

  // 如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说 instance._currentElement =
  // vnode instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成 空虚拟DOM {type:
  // '#comment', text: 'empty'} 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

  var rendered = safeRenderComponent(instance, type);

  instance._rendered = rendered;
  rendered._hostParent = vnode._hostParent;

  var dom = mountVnode(rendered, getChildContext(instance, parentContext), prevRendered);
  instanceMap.set(instance, dom);
  vnode._hostNode = dom;
  instance._disableSetState = false;
  if (instance.componentDidMount) {
    scheduler.add(instance);
  } else {
    instance._hasDidMount = true;
    //componentWillMount钩子会产生一些回调
    if (instance._pendingCallbacks.length) {
      scheduler.add(instance);
    }
  }

  if (vnode.ref) {
    scheduler.add(function () {
      vnode.ref(instance);
    });
  }
  options.afterMount(instance);
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

function refreshComponent(instance) {
  //这里触发视图更新

  reRenderComponent(instance);

  instance._forceUpdate = false;
  instance._pendingCallbacks.splice(0).forEach(function (fn) {
    fn.call(instance);
  });
}

//将Component中这个东西移动这里
options.refreshComponent = refreshComponent;

function reRenderComponent(instance) {
  var node = instanceMap.get(instance);

  if (!instance._hasDidMount) {
    scheduler.addAndRun(function () {
      instance._forceUpdate = false;
      instance._pendingCallbacks.splice(0).forEach(function (fn) {
        fn.call(instance);
      });
    });

    return node;
  }
  var props = instance.props,
      state = instance.state,
      context = instance.context,
      lastProps = instance.lastProps,
      constructor = instance.constructor;


  var lastRendered = instance._rendered;
  var hostParent = lastRendered._hostParent;
  var nextProps = props;
  lastProps = lastProps || props;
  var nextState = instance._processPendingState(props, context);

  instance.props = lastProps;
  //防止用户在shouldComponentUpdate中调用setState
  instance._disableSetState = true;

  if (!instance._forceUpdate && instance.shouldComponentUpdate && instance.shouldComponentUpdate(nextProps, nextState, context) === false) {
    instance._disableSetState = false;
    return node;
  }

  //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
  if (instance.componentWillUpdate) {
    instance.componentWillUpdate(nextProps, nextState, context);
  } else {
    instance.componentWillUpdate = null;
  }

  instance.props = nextProps;
  instance.state = nextState;
  instance._updating = true;
  var rendered = safeRenderComponent(instance, constructor);

  var childContext = getChildContext(instance, context);
  instance._rendered = rendered;
  rendered._hostParent = hostParent;

  var dom = alignVnodes(lastRendered, rendered, node, childContext);
  instanceMap.set(instance, dom);
  instance._currentElement._hostNode = dom;
  instance._updating = false;

  if (instance.componentDidUpdate) {
    instance.componentDidUpdate(lastProps, state, context);
  } else {
    instance.componentDidUpdate = null;
  }
  options.afterUpdate(instance);
  instance._disableSetState = false;
  return dom;
}
function alignVnodes(vnode, newVnode, node, parentContext) {
  var newNode = node;
  //eslint-disable-next-line
  if (newVnode == null) {
    removeDOMElement(node);
    disposeVnode(vnode);
  } else if (!(vnode.type == newVnode.type && vnode.key === newVnode.key)) {
    //replace
    disposeVnode(vnode);
    newNode = mountVnode(newVnode, parentContext);
    if (newVnode._instance && scheduler.count) {
      //  schedulerID = setTimeout(function(){
      scheduler.run();
      //  schedulerID = null
      //  })
    }
    var p = node.parentNode;
    if (p) {
      p.replaceChild(newNode, node);
      removeDOMElement(node);
    }
  } else if (vnode !== newVnode) {
    // same type and same key -> update
    newNode = updateVnode(vnode, newVnode, node, parentContext);
  }

  return newNode;
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

function updateVnode(lastVnode, nextVnode, node, parentContext) {
  switch (lastVnode.vtype) {
    case 1:
      var nextProps = nextVnode.props;
      if (lastVnode.props[HTML_KEY]) {
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
    case 2:
      return updateComponent(lastVnode, nextVnode, node, parentContext);
    case 4:
      return updateStateless(lastVnode, nextVnode, node, parentContext);
    default:
      return node;
  }
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
    nextVnode.ref(nextVnode._hostNode);
  }
  return dom;
}

function updateComponent(lastVnode, nextVnode, node, parentContext) {
  var instance = nextVnode._instance = lastVnode._instance;
  if (!instance) {
    lastVnode._return = lastVnode._disposed = true;
    var dom = mountComponent(nextVnode, parentContext);
    node.parentNode && node.parentNode.replaceChild(dom, node);

    return dom;
  }

  var nextProps = getComponentProps(nextVnode);
  instance.lastProps = instance.props;

  if (instance.componentWillReceiveProps) {
    instance._disableSetState = true;
    instance.componentWillReceiveProps(nextProps, parentContext);
    instance._disableSetState = false;
  }

  instance.props = nextProps;
  instance.context = parentContext;
  if (nextVnode.ref) {
    nextVnode.ref(instance);
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
  scheduler.run();
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
      if (!_vnode2._disposed && _newVnode2.type === _vnode2.type && _newVnode2.key === _vnode2.key) {
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
      if (!nextVnode._hostNode) {
        nextVnode._hostNode = dom;
        nextVnode._hostParent = vnode._hostParent;
      }
    } else if (vnode.vtype === 1) {
      updateElement(vnode, nextVnode, dom, data.parentContext);
    } else if (vnode.vtype === 4) {
      dom = updateStateless(vnode, nextVnode, dom, data.parentContext);
    } else if (vnode.vtype === 2) {
      dom = updateComponent(vnode, nextVnode, dom, data.parentContext);
      if (vnode._return) {
        //如果vnode, nextVnode都没有实例
        return dom;
      }
    }
  }
  if (dom.parentNode === null) {
    return dom;
  }
  // re-order
  var currentNode = dom.parentNode.childNodes[data.index];
  if (currentNode !== dom) {
    dom.parentNode.insertBefore(dom, currentNode);
  }
  return dom;
}

function applyDestroy(data) {
  var node = data.node;
  if (node) {
    removeDOMElement(node);
  }
  disposeVnode(data.vnode);
}

function applyCreate(data) {
  var node = mountVnode(data.vnode, data.parentContext);
  data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index]);
}

function fireEvent(e, type) {
  e = new SyntheticEvent(e);
  e.type = type;
  dispatchEvent(e);
}

//Ie6-8 oninput使用propertychange进行冒充，触发一个ondatasetchanged事件
function fixIEInputHandle(e) {
  if (e.propertyName === "value") {
    fireEvent(e, "input");
  }
}
function fixIEInput(dom) {
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

  fireEvent(e, "change");
}
function fixIEChange(dom) {
  //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发
  var eventType = dom.type === "radio" || dom.type === "checkbox" ? "click" : "change";
  addEvent(dom, eventType, fixIEChangeHandle);
}

function fixIESubmit(dom) {
  if (dom.nodeName === "FORM") {
    addEvent(dom, "submit", dispatchEvent);
  }
}

if (msie < 9) {
  String("focus,blur").replace(/\w+/g, function (type) {
    eventHooks[type] = function (dom) {
      var eventType = type === "focus" ? "focusin" : "focusout";
      addEvent(dom, eventType, function (e) {
        fireEvent(e, type);
      });
    };
  });

  String("mouseenter,mouseleave").replace(/\w+/g, function (type) {
    eventHooks[type] = function (dom) {
      var eventType = type === "mouseenter" ? "mouseover" : "mouseout";
      addEvent(dom, eventType, function (e) {
        var t = e.relatedTarget;
        if (!t || t !== dom && dom.contains(t)) {
          fireEvent(e, type);
        }
      });
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
  } catch (e) {
    // no catch
  }
  eventHooks.input = fixIEInput;
  eventHooks.inputcapture = fixIEInput;
  eventHooks.change = fixIEChange;
  eventHooks.changecapture = fixIEChange;
  eventHooks.submit = fixIESubmit;
}

var React = {
  version: "1.0.7",
  PropTypes: PropTypes,
  Children: Children, //为了react-redux
  render: render,
  findDOMNode: findDOMNode,
  options: options,
  unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode: unmountComponentAtNode,
  isValidElement: isValidElement,
  createClass: createClass,
  createElement: createElement,
  cloneElement: cloneElement,
  PureComponent: PureComponent,
  Component: Component,
  createFactory: function createFactory(type) {
    console.warn("createFactory将被废弃"); // eslint-disable-line
    var factory = createElement.bind(null, type);
    factory.type = type;
    return factory;
  }
};

win.ReactDOM = React;

return React;

})));
