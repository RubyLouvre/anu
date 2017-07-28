var __type = Object.prototype.toString;
export var __push = Array.prototype.push;

export var HTML_KEY = "dangerouslySetInnerHTML";

/**
 * 复制一个对象的属性到另一个对象
 *
 * @param {any} obj
 * @param {any} props
 * @returns
 */
export function extend(obj, props) {
  if (props) {
    for (let i in props) {
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
export function noop() {}

/**
 * 类继承
 *
 * @export
 * @param {any} SubClass
 * @param {any} SupClass
 */
export function inherit(SubClass, SupClass) {
  function Bridge() {}
  Bridge.prototype = SupClass.prototype;

  var fn = (SubClass.prototype = new Bridge());

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
export function getNodes(dom) {
  var ret = [],
    c = dom.childNodes || [];
  // eslint-disable-next-line
  for (var i = 0, el; (el = c[i++]); ) {
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
export function toLowerCase(s) {
  return lowerCache[s] || (lowerCache[s] = s.toLowerCase());
}

/**
 *
 *
 * @param {any} obj
 * @returns
 */
export function isFn(obj) {
  return typeNumber(obj) === 5;
}

var rword = /[^, ]+/g;

export function oneObject(array, val) {
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

export function getChildContext(instance, context) {
  if (instance.getChildContext) {
    return Object.assign({}, context, instance.getChildContext());
  }
  return context;
}
var rcamelize = /[-_][^-_]/g;

export function camelize(target) {
  //提前判断，提高getStyle等的效率
  if (!target || (target.indexOf("-") < 0 && target.indexOf("_") < 0)) {
    return target;
  }
  //转换为驼峰风格
  return target.replace(rcamelize, function(match) {
    return match.charAt(1).toUpperCase();
  });
}

export var options = {
  beforeUnmount: noop,
  afterMount: noop,
  afterUpdate: noop
};

export function checkNull(vnode, type) {
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0];
  }
  if (vnode === null || vnode === false) {
    return { type: "#comment", text: "empty" };
  } else if (!vnode || !vnode.vtype) {
    throw new Error(
      `@${type.name}#render:You may have returned undefined, an array or some other invalid object`
    );
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
export function typeNumber(data) {
  if (data === void 666) {
    return 0;
  }
  var a = numberMap[__type.call(data)];
  return a || 8;
}

export function getComponentProps(vnode) {
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

export var recyclables = {
  "#text": [],
  "#comment": []
};
