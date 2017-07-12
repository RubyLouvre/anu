import { instanceMap } from "./instanceMap";

export function disposeVnode(vnode) {
  if (!vnode) {
    console.warn("in `disposeVnode` method, vnode is undefined", vnode);
    return;
  }
  if (vnode._disposed) {
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
      vnode._hostNode = null;
      vnode._hostParent = null;
      break;
  }
  vnode._disposed = true;
}
function disposeStateless(vnode) {
  // vnode._disposed = true;
  if (vnode._instance)
     disposeVnode(vnode._instance._rendered);
  vnode._instance = null;
}

function disposeElement(vnode) {
  var { props } = vnode;
  var children = props.children;
  // var childNodes = node.childNodes;
  for (let i = 0, len = children.length; i < len; i++) {
    disposeVnode(children[i]);
  }
  //eslint-disable-next-line
  vnode.ref && vnode.ref(null);
  vnode._hostNode = null;
  vnode._hostParent = null;
}

function disposeComponent(vnode) {
  var instance = vnode._instance;
  if (instance) {
   // vnode._disposed = true;
    instance._disableSetState = true;
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
