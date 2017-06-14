import { createElement, __ref } from "./createElement";

export function cloneElement(vnode, props) {
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

  return createElement(
    vnode.type,
    Object.assign(obj, vnode.props, props),
    arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.props.children
  );
}
