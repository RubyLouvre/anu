import {__push} from "./util";
const stack = [];
const EMPTY_CHILDREN = [];

export var CurrentOwner = {
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

export function createElement(type, configs) {
  var props = {},
    key = null,
    ref = null,
    vtype = 1,
    checkProps = 0;

  for (let i = 2, n = arguments.length; i < n; i++) {
    stack.push(arguments[i]);
  }
  if (configs) {
    // eslint-disable-next-line
    for (let i in configs) {
      var val = configs[i];
      switch (i) {
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
          props[i] = val;
      }
    }
  }

  var children = flattenChildren(stack);

  if (typeof type === "function") {
    vtype = type.prototype && type.prototype.render
      ? 2
      : 4;
    if (children.length) 
      props.children = children;
    }
  else {
    props.children = children;
  }

  return new Vnode(type, props, key, ref, vtype, checkProps, CurrentOwner.cur);
}

function flattenChildren(stack) {
  var lastText,
    child,
    deep,
    children = EMPTY_CHILDREN;

  while (stack.length) {
    //比较巧妙地判定是否为子数组
    if ((child = stack.pop()) && child.pop !== undefined) {
      //   deep = child._deep ? child._deep + 1 : 1;
      for (let i = 0; i < child.length; i++) {
        var el = (stack[stack.length] = child[i]);
        //  if (el) {    el._deep = deep;  }
      }
    } else {
      // eslint-disable-next-line
      if (child === null || child === void 666 || child === false || child === true) {
        continue;
      }
      var childType = typeof child;
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
export function __ref(dom) {
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
  var refType = typeof ref;
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
  getDOMNode: function () {
    return this._hostNode || null;
  },

  $$typeof: 1
};
