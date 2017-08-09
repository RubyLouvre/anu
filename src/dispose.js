import { options } from "./util";
export function disposeVnode(vnode, parentInstance) {
  if (!vnode || vnode._disposed) {
    return;
  }
  switch (vnode.vtype) {
    case 1:
      disposeElement(vnode, parentInstance);
      break;
    case 2:
      disposeComponent(vnode, parentInstance);
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
  var instance = vnode._instance
  if (instance) {
    disposeVnode(instance._rendered, instance);
    vnode._instance = null;
  }
}

function disposeElement(vnode, parentInstance) {
  var { props } = vnode;
  var children = props.children;
  for (let i = 0, n = children.length; i < n; i++) {
    disposeVnode(children[i], parentInstance);
  }
  //eslint-disable-next-line
  vnode.ref && vnode.ref(null, parentInstance);
  vnode._hostNode = vnode._hostParent = null;
}

function disposeComponent(vnode, parentInstance) {
  var instance = vnode._instance;
  if (instance) {
    instance._disableSetState = true;
    options.beforeUnmount(instance);
    if (instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
    var node = instance._currentElement._hostNode
    if (node) {
      node._component = null;
    }
    vnode._instance = instance._currentElement = null;
    disposeVnode(instance._rendered, instance);
  }
}
