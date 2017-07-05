import { diffProps } from "./diffProps";
import { CurrentOwner } from "./createElement";
import { createDOMElement, removeDOMElement, getNs } from "./browser";

import {
  processFormElement,
  postUpdateSelectedOptions
} from "./ControlledComponent";

import {
  getNodes,
  HTML_KEY,
  options,
  checkNull,
  toLowerCase,
  getChildContext,
  getComponentProps,
  __push
} from "./util";

import { instanceMap } from "./instanceMap";

import { scheduler } from "./scheduler";
/**
 * ReactDOM.render 方法
 *
 */
export function render(vnode, container, callback) {
  return updateView(vnode, container, callback, {});
}
/**
 * ReactDOM.unstable_renderSubtreeIntoContainer 方法， React.render的包装
 *
 */
var warnOne = 1;
export function unstable_renderSubtreeIntoContainer(
  parentInstance,
  vnode,
  container,
  callback
) {
  if (warnOne) {
    console.warn("unstable_renderSubtreeIntoContainer未见于文档的内部方法，不建议使用");
    warnOne = 0;
  }
  var parentContext = (parentInstance && parentInstance.context) || {};
  return updateView(vnode, container, callback, parentContext);
}

export function isValidElement(vnode) {
  return vnode && vnode.vtype;
}

function updateView(vnode, container, callback, parentContext) {
  if (!isValidElement(vnode)) {
    throw new Error(
      `${vnode}必须为组件或元素节点, 但现在你的类型却是${Object.prototype.toString.call(vnode)}`
    );
  }
  if (!container || container.nodeType !== 1) {
    console.warn(`${container}必须为元素节点`);
    return
  }
  var prevVnode = container._component,
    rootNode,
    hostParent = {
      _hostNode: container
    };
  if (!prevVnode) {
    rootNode = genVnodes(vnode, container, hostParent, parentContext);
  } else {
    rootNode = alignVnodes(
      prevVnode,
      vnode,
      container.firstChild,
      parentContext
    );
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
  for (var i = 0, el; (el = nodes[i++]); ) {
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

export function mountVnode(vnode, parentContext, prevRendered) {
  let { vtype } = vnode;
  switch (vtype) {
    case 1:
      return mountElement(vnode, parentContext, prevRendered);
    case 2:
      return mountComponent(vnode, parentContext, prevRendered);
    case 4:
      return mountStateless(vnode, parentContext, prevRendered);
    default:
      var node =
        prevRendered && prevRendered.nodeName === vnode.type
          ? prevRendered
          : createDOMElement(vnode);
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
  let { type, props } = vnode;
  let dom = genMountElement(vnode, type, prevRendered);

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
    scheduler.add(function() {
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
  for (let i = 0, n = children.length; i < n; i++) {
    let el = children[i];
    el._hostParent = vnode;
    let curNode = mountVnode(el, parentContext);
    parentNode.appendChild(curNode);
  }
}

function alignChildren(vnode, parentNode, parentContext, childNodes) {
  var children = vnode.props.children,
    insertPoint = childNodes[0] || null,
    j = 0;
  for (let i = 0, n = children.length; i < n; i++) {
    let el = children[i];
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
  let { type } = vnode;

  let props = getComponentProps(vnode);

  let instance = new type(props, parentContext); //互相持有引用

  vnode._instance = instance;
  instance._currentElement = vnode;
  instance.props = instance.props || props;
  instance.context = instance.context || parentContext;

  if (instance.componentWillMount) {
    instance.componentWillMount();
    instance.state = instance._processPendingState();
  }

  // 如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说 instance._currentElement =
  // vnode instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成 空虚拟DOM {type:
  // '#comment', text: 'empty'} 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

  let rendered = safeRenderComponent(instance, type);

  instance._rendered = rendered;
  rendered._hostParent = vnode._hostParent;

  let dom = mountVnode(
    rendered,
    getChildContext(instance, parentContext),
    prevRendered
  );
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
    scheduler.add(function() {
      vnode.ref(instance);
    });
  }
  vnode._hostNode = dom;

  return dom;
}
export function safeRenderComponent(instance, type) {
  CurrentOwner.cur = instance;
  var rendered = instance.render();
  rendered = checkNull(rendered, type);

  CurrentOwner.cur = null;
  return rendered;
}

function mountStateless(vnode, parentContext, prevRendered) {
  var props = getComponentProps(vnode);

  let rendered = vnode.type(props, parentContext);
  rendered = checkNull(rendered, vnode.type);

  let dom = mountVnode(rendered, parentContext, prevRendered);
  vnode._instance = {
    _currentElement: vnode,
    _rendered: rendered
  };
  vnode._hostNode = dom;

  rendered._hostParent = vnode._hostParent;
  return dom;
}

function updateStateless(lastVnode, nextVnode, node, parentContext) {
  let instance = lastVnode._instance;
  let vnode = instance._rendered;

  let newVnode = nextVnode.type(getComponentProps(nextVnode), parentContext);
  newVnode = checkNull(newVnode, nextVnode.type);

  let dom = alignVnodes(vnode, newVnode, node, parentContext);
  nextVnode._instance = instance;
  instance._rendered = newVnode;
  nextVnode._hostNode = dom;
  return dom;
}

function disposeStateless(vnode) {
  vnode._disposed = true;
  disposeVnode(vnode._instance._rendered);
  vnode._instance = null;
}

function refreshComponent(instance) {
  //这里触发视图更新

  reRenderComponent(instance);

  instance._forceUpdate = false;
  instance._pendingCallbacks.forEach(function(fn) {
    fn.call(instance);
  });
  instance._pendingCallbacks.length = 0;
}

//将Component中这个东西移动这里
options.refreshComponent = refreshComponent;

function reRenderComponent(instance) {
  var node = instanceMap.get(instance);

  if (!instance._hasDidMount) {
    scheduler.add(function() {
      setTimeout(function() {
        refreshComponent(instance);
      });
    });
    scheduler.run();
    return node;
  }
  var { props, state, context, lastProps, constructor } = instance;

  var lastRendered = instance._rendered;
  var hostParent = lastRendered._hostParent;
  var nextProps = props;
  lastProps = lastProps || props;
  var nextState = instance._processPendingState(props, context);

  instance.props = lastProps;
  // delete instance.lastProps 生命周期 shouldComponentUpdate(nextProps, nextState,
  // nextContext)
  if (
    !instance._forceUpdate &&
    instance.shouldComponentUpdate &&
    instance.shouldComponentUpdate(nextProps, nextState, context) === false
  ) {
    return node; //注意
  }

  //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
  if (instance.componentWillUpdate) {
    instance.componentWillUpdate(nextProps, nextState, context);
  }

  instance.props = nextProps;
  instance.state = nextState;
  delete instance._updateBatchNumber;
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
  }

  return dom;
}

export function alignVnodes(vnode, newVnode, node, parentContext) {
  let newNode = node;
  //eslint-disable-next-line
  if (newVnode == null) {
    removeDOMElement(node);
    disposeVnode(vnode);
  } else if (
    !(
      vnode.type == newVnode.type &&
      vnode.key === newVnode.key 
    )
  ) {
    //replace
    disposeVnode(vnode);
    newNode = mountVnode(newVnode, parentContext);
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

export function disposeVnode(vnode) {
  if (!vnode) {
    console.warn("in `disposeVnode` method, vnode is undefined", vnode);
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
      vnode._disposed = true;
      vnode._hostNode = null;
      vnode._hostParent = null;
      break;
  }
}
export function findDOMNode(componentOrElement) {
  if (componentOrElement == null) {
    return null;
  }
  if (componentOrElement.nodeType === 1) {
    return componentOrElement;
  }

  return instanceMap.get(componentOrElement) || null;
}

function disposeElement(vnode) {
  var { props } = vnode;
  var children = props.children;
  // var childNodes = node.childNodes;
  for (let i = 0, len = children.length; i < len; i++) {
    disposeVnode(children[i]);
  }
  //eslint-disable-next-line
  if(vnode.ref){
  setTimeout(function(){
     vnode.ref(null);
  })
 }
  vnode._hostNode = null;
  vnode._hostParent = null;
}

function disposeComponent(vnode) {
  if (!vnode._instance) return;
  var instance = vnode._instance;
  vnode._disposed = true;
  var instance = vnode._instance;
  if (instance) {
    if (instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用
    //findDOMNode方法
    instance._disableSetState = true;
    instanceMap["delete"](instance);
    var node = instanceMap.get(instance);
    if (node) {
      node._component = null;
      instanceMap["delete"](instance);
    }
    //不应该将instance.props置为null
    vnode._instance = instance._currentElement = null;
    disposeVnode(instance._rendered);
  }
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
  var instance = (nextVnode._instance = lastVnode._instance);

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
  try {
    return reRenderComponent(instance);
  } catch (e) {
    scheduler.run();
  }
}

function updateChildren(vnode, newVnode, node, parentContext) {
  let patches = {
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
  let children = vnode.props.children;
  let childNodes = node.childNodes;
  let newVchildren = newVnode.props.children;
  let childrenLen = children.length;
  let newVchildrenLen = newVchildren.length;

  if (childrenLen === 0) {
    if (newVchildrenLen > 0) {
      for (let i = 0; i < newVchildrenLen; i++) {
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
    for (let i = 0; i < childrenLen; i++) {
      patches.removes.push({ vnode: children[i], node: childNodes[i] });
    }
    return;
  }
  let cloneChildren = children.slice();
  let updates = Array(newVchildrenLen);
  let removes = [];
  let creates = [];
  // isEqual
  for (let i = 0; i < childrenLen; i++) {
    let vnode = children[i];
    for (let j = 0; j < newVchildrenLen; j++) {
      if (updates[j]) {
        continue;
      }
      let newVnode = newVchildren[j];
      if (vnode === newVnode) {
        updates[j] = {
          shouldIgnore: true,
          vnode: vnode,
          newVnode: newVnode,
          node: childNodes[i],
          parentContext: parentContext,
          index: j
        };
        cloneChildren[i] = null;
        break;
      }
    }
  }

  // isSimilar
  for (let i = 0; i < childrenLen; i++) {
    let vnode = cloneChildren[i];
    if (vnode === null) {
      continue;
    }
    let shouldRemove = true;
    for (let j = 0; j < newVchildrenLen; j++) {
      if (updates[j]) {
        continue;
      }
      let newVnode = newVchildren[j];
      if (
        !vnode._disposed &&
        newVnode.type === vnode.type &&
        newVnode.key === vnode.key
      ) {
        updates[j] = {
          vnode: vnode,
          newVnode: newVnode,
          node: childNodes[i],
          parentContext: parentContext,
          index: j
        };
        shouldRemove = false;
        break;
      }
    }
    if (shouldRemove) {
      removes.push({ vnode: vnode, node: childNodes[i] });
    }
  }

  for (let i = 0; i < newVchildrenLen; i++) {
    let item = updates[i];
    if (!item) {
      creates.push({
        vnode: newVchildren[i],
        parentNode: node,
        parentContext: parentContext,
        index: i
      });
    } else if (item.vnode.vtype === 1) {
      diffChildren(
        patches,
        item.vnode,
        item.newVnode,
        item.node,
        item.parentContext
      );
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
  let vnode = data.vnode;
  let nextVnode = data.newVnode;
  let dom = data.node;

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
  let currentNode = dom.parentNode.childNodes[data.index];
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
  let node = mountVnode(data.vnode, data.parentContext);
  data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index]);
}
