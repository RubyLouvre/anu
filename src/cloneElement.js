import {
    createElement
} from './createElement'

export function cloneElement(vnode, props) {
  if (!vnode.vtype) {
    return Object.assign({}, vnode);
  }
  if (vnode.key) {
    vnode.props.key = vode.key;
  }
  if (vnode._refKey) {
    vnode.props.ref = vnode._refKey;
  } else if (vnode.ref && vnode.ref !== vnode.constructor.prototype.ref) {
    vnode.props.ref = vnode.ref;
  }

  return createElement(
    vnode.type,
    Object.assign({}, vnode.props, props),
    arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.props.children
  )
}
