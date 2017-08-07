import { diffProps } from "./diffProps";
import { CurrentOwner } from "./createElement";
import { createDOMElement, removeDOMElement, getNs } from "./browser";

import { processFormElement, postUpdateSelectedOptions } from "./ControlledComponent";

import {
  getNodes,
  HTML_KEY,
  options,
  checkNull,
  toLowerCase,
  getChildContext,
  noop,
  getComponentProps,
  __push
} from "./util";

import { instanceMap } from "./instanceMap";
import { disposeVnode } from "./dispose";

//import {scheduler} from "./scheduler";
/**
 * ReactDOM.render 方法
 *
 */
export function render(vnode, container, callback) {
  return renderByAnu(vnode, container, callback);
}
/**
 * ReactDOM.unstable_renderSubtreeIntoContainer 方法， React.render的包装
 *
 */
var warnOne = 1;
export function unstable_renderSubtreeIntoContainer(parentInstance, vnode, container, callback) {
  if (warnOne) {
    console.warn("unstable_renderSubtreeIntoContainer未见于文档的内部方法，不建议使用"); // eslint-disable-line
    warnOne = 0;
  }
  var parent = parentInstance && parentInstance.context
    ? parentInstance
    : getFakeInstance();
  return renderByAnu(vnode, container, callback, parent);
}
export function unmountComponentAtNode(dom) {
  var prevVnode = dom._component;
  if (prevVnode) {
    var component = prevVnode._instance;
    alignVnodes(prevVnode, {
      type: "#text",
      text: "empty"
    }, dom.firstChild, component, []);
  }
}
export function isValidElement(vnode) {
  return vnode && vnode.vtype;
}
function clearRefsAndMounts(queue) {
  queue
    .forEach(function (el) {
      var arr = el._pendingRefs
      if (arr) {
        for (var i = 0, n = arr.length; i < n; i += 2) {
          let obj = arr[i]
          let value = arr[i + 1]
          obj.ref(value, el)
        }
        arr.length = 0
        el._pendingCallbacks.splice(0).forEach(function (fn) {
          fn.call(el)
        })
        if (el.componentDidMount) {
          el.componentDidMount();
          el.componentDidMount = null
        }

      }
      el._hasDidMount = true;
    });
  queue.length = 0

}
function getFakeInstance() {
  return { refs: {}, context: {}, _collectRefs: noop }
}
function renderByAnu(vnode, container, callback, parentInstance) {
  if (!isValidElement(vnode)) {
    throw new Error(`${vnode}必须为组件或元素节点, 但现在你的类型却是${Object.prototype.toString.call(vnode)}`);
  }
  if (!container || container.nodeType !== 1) {
    console.warn(`${container}必须为元素节点`); // eslint-disable-line
    return;
  }
  var mountQueue = [];
  var prevVnode = container._component;
  var parent = parentInstance && parentInstance.context
    ? parentInstance
    : getFakeInstance()
  var rootNode = prevVnode
    ? alignVnodes(prevVnode, vnode, container.firstChild, parent, mountQueue)
    : genVnodes(vnode, container, {
      _hostNode: container
    }, parent, mountQueue);

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
  clearRefsAndMounts(mountQueue)
  return instance || rootNode;
  //组件返回组件实例，而普通虚拟DOM 返回元素节点
}

function genVnodes(vnode, container, hostParent, parentInstance, mountQueue) {
  var nodes = getNodes(container);
  var prevRendered = null;
  //eslint-disable-next-line
  for (var i = 0, el; (el = nodes[i++]);) {
    if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
      prevRendered = el;
    } else {
      el
        .parentNode
        .removeChild(el);
    }
  }
  vnode._hostParent = hostParent;

  var rootNode = mountVnode(vnode, parentInstance, prevRendered, mountQueue);
  container.appendChild(rootNode);

  return rootNode;
}

export function mountVnode(vnode, parentInstance, prevRendered, mountQueue) {
  let { vtype } = vnode;
  switch (vtype) {
    case 1:
      return mountElement(vnode, parentInstance, prevRendered, mountQueue);
    case 2:
      return mountComponent(vnode, parentInstance, prevRendered, mountQueue);
    case 4:
      return mountStateless(vnode, parentInstance, prevRendered, mountQueue);
    default:
      var node = prevRendered && prevRendered.nodeName === vnode.type
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
    if (prevRendered)
      while (prevRendered.firstChild) {
        dom.appendChild(prevRendered.firstChild);
      }

    return dom;
  }
}

function mountElement(vnode, parentInstance, prevRendered, mountQueue) {
  let { type, props } = vnode;
  let dom = genMountElement(vnode, type, prevRendered);
  vnode._hostNode = dom;
  var method = prevRendered
    ? alignChildren
    : mountChildren
  method.call(0, vnode, dom, parentInstance, mountQueue)

  if (vnode.checkProps) {
    diffProps(props, {}, vnode, {}, dom);
  }

  if (vnode.ref) {
    parentInstance._collectRefs(vnode, dom)
  }
  if (formElements[type]) {
    processFormElement(vnode, dom, props);
  }

  return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(vnode, parentNode, parentInstance, mountQueue) {
  var children = vnode.props.children;
  for (let i = 0, n = children.length; i < n; i++) {
    let el = children[i];
    el._hostParent = vnode;
    let curNode = mountVnode(el, parentInstance, null, mountQueue);

    parentNode.appendChild(curNode);
  }
}

function alignChildren(vnode, parentNode, parentInstance, mountQueue) {
  var children = vnode.props.children,
    childNodes = parentNode.childNodes,
    insertPoint = childNodes[0] || null,
    j = 0;
  for (let i = 0, n = children.length; i < n; i++) {
    let el = children[i];
    el._hostParent = vnode;
    var prevDom = childNodes[j];
    var dom = mountVnode(el, parentInstance, prevDom, mountQueue);
    if (dom === prevDom) {
      j++;
    }
    parentNode.insertBefore(dom, insertPoint);
    insertPoint = dom.nextSibling;
  }
  while (childNodes[n]) {
    parentNode.removeChild(childNodes[n])
  }
}
function mountComponent(vnode, parentInstance, prevRendered, mountQueue) {
  let { type } = vnode;

  let props = getComponentProps(vnode);
  let parentContext = parentInstance.context
  let instance = new type(props, parentContext); //互相持有引用

  vnode._instance = instance;
  instance._currentElement = vnode;
  instance.props = instance.props || props;
  instance.context = instance.context || parentContext;
  let currContext = instance.context

  if (instance.componentWillMount) {
    instance.componentWillMount();
    instance.state = instance._processPendingState();
  }

  instance.parentInstance = parentInstance

  // 如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说 instance._currentElement =
  // vnode instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成 空虚拟DOM {type:
  // '#comment', text: 'empty'} 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

  let rendered = safeRenderComponent(instance, type, vnode, parentContext);
  instance._dirty = false;

  let dom = mountVnode(rendered, instance, prevRendered, mountQueue);

  instance.context = currContext;
  instanceMap.set(instance, dom);
  vnode._hostNode = dom;

  mountQueue.push(instance)

  if (vnode.ref) {
    parentInstance._collectRefs(vnode, instance)
  }

  options.afterMount(instance);
  vnode._hostNode = dom;
  return dom;
}

export function safeRenderComponent(instance, type, vnode, context) {
  let rendered = instance.render();
  rendered = checkNull(rendered, type);
  rendered._hostParent = vnode._hostParent;
  instance._rendered = rendered;
  instance.context = getChildContext(instance, context);
  return rendered;
}

function Stateless(render) {
  this._render = render
  this.refs = {}
  this._collectRefs = noop
}

Stateless.prototype.render = function (vnode, context) {
  let props = getComponentProps(vnode);
  let rendered = this._render(props, context);
  rendered = checkNull(rendered, this._render);
  vnode._instance = this;
  this.context = context
  this.props = props
  this._currentElement = vnode;
  this._rendered = rendered;
  rendered._hostParent = vnode._hostParent;
  return rendered
}
function mountStateless(vnode, parentInstance, prevRendered, mountQueue) {
  let context = parentInstance.context
  let instance = new Stateless(vnode.type)
  let rendered = instance.render(vnode, context);
  let dom = mountVnode(rendered, instance, prevRendered, mountQueue);

  return vnode._hostNode = dom;
}

function updateStateless(lastVnode, nextVnode, node, parentInstance, mountQueue) {
  let context = parentInstance.context
  let instance = lastVnode._instance;
  let prevVnode = instance._rendered;
  nextVnode = instance.render(nextVnode, context);

  let dom = alignVnodes(prevVnode, nextVnode, node, instance, mountQueue);

  return nextVnode._hostNode = dom;
}


//将Component中这个东西移动这里
options.refreshComponent = refreshComponent;

function refreshComponent(instance, mountQueue) {
  var node = instanceMap.get(instance);
  if (instance._disable) {
    console.log('instance._disable')
    return node
  }
  instance._disable = true;
  /* if (!instance._hasDidMount) {
    scheduler
      .addAndRun(function () {
        instance._forceUpdate = false;
        instance
          ._pendingCallbacks
          .splice(0)
          .forEach(function (fn) {
            fn.call(instance);
          });
      });

    return node;
  }*/
  var { props, state, context, lastProps, constructor: type } = instance;

  var lastRendered = instance._rendered;
  var nextProps = props;
  lastProps = lastProps || props;
  var nextState = instance._processPendingState(props, context);

  instance.props = lastProps;

  if (!instance._forceUpdate && instance.shouldComponentUpdate && instance.shouldComponentUpdate(nextProps, nextState, context) === false) {
    instance._disable = false;
    return node;
  }

  //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
  if (instance.componentWillUpdate) {
    instance.componentWillUpdate(nextProps, nextState, context);
  }

  instance.props = nextProps;
  instance.state = nextState;

  instance._dirty = false
  var rendered = safeRenderComponent(instance, type, lastRendered, context);
  var hasQueue = !mountQueue
  mountQueue = mountQueue || []
  CurrentOwner.cur = instance
  instance._updating = true
  var dom = alignVnodes(lastRendered, rendered, node, instance, mountQueue);
  instance.context = context
  instance._updating = false
  CurrentOwner.cur = null

  instanceMap.set(instance, dom);
  instance._currentElement._hostNode = dom;
  if (!hasQueue) {
    clearRefsAndMounts(mountQueue)
  }
  if (instance.componentDidUpdate) {
    instance.componentDidUpdate(lastProps, state, context);
  }
  options.afterUpdate(instance);
  instance._disable = false;
  instance._forceUpdate = false;
  instance
    ._pendingCallbacks
    .splice(0)
    .forEach(function (fn) {
      fn.call(instance);
    });
  var f = instance.after
  if (f) {
    instance.after = null
    refreshComponent(f)
  }
  return dom;
}

export function alignVnodes(vnode, newVnode, node, parentInstance, mountQueue) {
  let newNode = node;
  //eslint-disable-next-line
  if (newVnode == null) {
    removeDOMElement(node);
    disposeVnode(vnode, parentInstance);
  } else if (!(vnode.type == newVnode.type && vnode.key === newVnode.key)) {
    //replace
    disposeVnode(vnode, parentInstance);
    newNode = mountVnode(newVnode, parentInstance, null, mountQueue);
    //  if (newVnode._instance && scheduler.count) {      scheduler.run();  }
    var p = node.parentNode;
    if (p) {
      p.replaceChild(newNode, node);
      removeDOMElement(node);
    }
  } else if (vnode !== newVnode) {
    // same type and same key -> update
    newNode = updateVnode(vnode, newVnode, node, parentInstance, mountQueue);
  }

  return newNode;
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

function updateVnode(lastVnode, nextVnode, node, parentInstance, mountQueue) {
  switch (lastVnode.vtype) {
    case 1:
      var nextProps = nextVnode.props;
      if (lastVnode.props[HTML_KEY]) {
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
        updateElement(lastVnode, nextVnode, node, parentInstance);
        mountChildren(nextVnode, node, parentInstance, mountQueue);
      } else {
        if (nextProps[HTML_KEY]) {
          node.innerHTML = nextProps[HTML_KEY].__html;
        } else {
          updateChildren(lastVnode, nextVnode, node, parentInstance, mountQueue);
        }
        updateElement(lastVnode, nextVnode, node, parentInstance);
      }
      return node;
    case 2:
      return updateComponent(lastVnode, nextVnode, node, parentInstance, mountQueue);
    case 4:
      return updateStateless(lastVnode, nextVnode, node, parentInstance, mountQueue);
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
function updateElement(lastVnode, nextVnode, dom, parentInstance) {
  nextVnode._hostNode = dom;
  if (lastVnode.checkProps || nextVnode.checkProps) {
    diffProps(nextVnode.props, lastVnode.props, nextVnode, lastVnode, dom);
  }
  if (nextVnode.type === "select") {
    postUpdateSelectedOptions(nextVnode);
  }
  if (nextVnode.ref) {
    nextVnode.ref(nextVnode._hostNode, parentInstance);
  }
  return dom;
}

function updateComponent(lastVnode, nextVnode, node, parentInstance, mountQueue) {
  var parentContext = parentInstance.context
  var instance = (nextVnode._instance = lastVnode._instance);
  if (!instance) {
    console.log('updateComponent...')
    lastVnode._return = lastVnode._disposed = true;
    var dom = mountComponent(nextVnode, parentInstance, null, mountQueue);
    node.parentNode && node
      .parentNode
      .replaceChild(dom, node);

    return dom;
  }

  var nextProps = getComponentProps(nextVnode);
  instance.lastProps = instance.props;

  if (instance.componentWillReceiveProps) {
    instance._disable = true;
    instance.componentWillReceiveProps(nextProps, parentContext);
    instance._disable = false;
  }

  instance.props = nextProps;
  instance.context = parentContext;
  if (nextVnode.ref) {
    nextVnode.ref(instance, parentInstance);
  }
  return refreshComponent(instance, mountQueue);
}

function updateChildren(vnode, newVnode, node, parentInstance, mountQueue) {
  let patches = {
    removes: [],
    updates: [],
    creates: []
  };
  diffChildren(patches, vnode, newVnode, node, parentInstance, mountQueue);
  patches
    .removes
    .forEach(applyDestroy, mountQueue);
  patches
    .updates
    .forEach(applyUpdate, mountQueue);
  patches
    .creates
    .forEach(applyCreate, mountQueue);
  //scheduler.run();
}

function diffChildren(patches, vnode, newVnode, node, parentInstance, mountQueue) {
  let children = vnode.props.children;
  let childNodes = node.childNodes;
  let newVchildren = newVnode.props.children;
  let childrenLen = children.length;
  let newVchildrenLen = newVchildren.length;

  if (childrenLen === 0) {
    if (newVchildrenLen > 0) {
      for (let i = 0; i < newVchildrenLen; i++) {
        patches
          .creates
          .push({ vnode: newVchildren[i], parentNode: node, parentInstance, index: i });
      }
    }
    return;
  } else if (newVchildrenLen === 0) {
    for (let i = 0; i < childrenLen; i++) {
      patches
        .removes
        .push({ vnode: children[i], node: childNodes[i], parentInstance });
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
          parentInstance,
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
      if (newVnode.type === vnode.type && newVnode.key === vnode.key) {
        if (vnode._disposed) {
          console.log(vnode._disposed, '被销毁')
        }
        updates[j] = {
          vnode: vnode,
          newVnode: newVnode,
          node: childNodes[i],
          parentInstance,
          index: j
        };
        shouldRemove = false;
        break;
      }
    }
    if (shouldRemove) {
      removes.push({ vnode: vnode, node: childNodes[i], parentInstance });
    }
  }

  for (let i = 0; i < newVchildrenLen; i++) {
    let item = updates[i];
    if (!item) {
      creates.push({ vnode: newVchildren[i], parentNode: node, parentInstance, index: i });
    } else if (item.vnode.vtype === 1) {
      diffChildren(patches, item.vnode, item.newVnode, item.node, item.parentInstance, mountQueue);
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
  let parentInstance = data.parentInstance
  let mountQueue = this
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
      updateElement(vnode, nextVnode, dom, parentInstance);
    } else if (vnode.vtype === 4) {
      dom = updateStateless(vnode, nextVnode, dom, parentInstance, mountQueue);
    } else if (vnode.vtype === 2) {
      dom = updateComponent(vnode, nextVnode, dom, parentInstance, mountQueue);
      if (vnode._return) {
        console.log('这里出问题')
        //如果vnode, nextVnode都没有实例
        return dom;
      }
    }
  }
  if (dom.parentNode === null) {
    return dom;
  }
  // re-order
  let currentNode = dom.parentNode.childNodes[data.index];
  if (currentNode !== dom) {
    dom
      .parentNode
      .insertBefore(dom, currentNode);
  }
  return dom;
}

function applyDestroy(data) {
  var node = data.node;
  if (node) {
    removeDOMElement(node);
  }
  disposeVnode(data.vnode, data.parentInstance);
}

function applyCreate(data) {
  let node = mountVnode(data.vnode, data.parentInstance, null, this);
  data
    .parentNode
    .insertBefore(node, data.parentNode.childNodes[data.index]);
}
