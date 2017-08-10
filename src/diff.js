import {diffProps} from "./diffProps";
import {CurrentOwner, dirtyComponents} from "./createElement";
import {createDOMElement, removeDOMElement, getNs} from "./browser";

import {processFormElement, postUpdateSelectedOptions} from "./ControlledComponent";

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

import {disposeVnode} from "./dispose";

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
export function unstable_renderSubtreeIntoContainer(component, vnode, container, callback) {
  if (warnOne) {
    console.warn("unstable_renderSubtreeIntoContainer未见于文档的内部方法，不建议使用"); // eslint-disable-line
    warnOne = 0;
  }
  var parentContext = component && component.context || {}
  return renderByAnu(vnode, container, callback, parentContext);
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
          //console.log(obj.__refKey, value, el)
          obj.ref(value)
        }
        arr.length = 0
        if (el.componentDidMount) {
          el.componentDidMount();
          el.componentDidMount = null
        }
        setTimeout(function () {
          el
            ._pendingCallbacks
            .splice(0)
            .forEach(function (fn) {
              fn.call(el)
            })
        })
      }
      el._hasDidMount = true;
    });
  queue.length = 0

}

function renderByAnu(vnode, container, callback, parentContext) {
  if (!isValidElement(vnode)) {
    throw new Error(`${vnode}必须为组件或元素节点, 但现在你的类型却是${Object.prototype.toString.call(vnode)}`);
  }
  if (!container || container.nodeType !== 1) {
    console.warn(`${container}必须为元素节点`); // eslint-disable-line
    return;
  }
  var mountQueue = [];
  mountQueue.mountAll = true
  var lastVnode = container._component;
  parentContext = parentContext || {}
  var rootNode = lastVnode
    ? alignVnodes(lastVnode, vnode, container.firstChild, parentContext, mountQueue)
    : genVnodes(vnode, container, parentContext, mountQueue);

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

function genVnodes(vnode, container, parentContext, mountQueue) {
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

  var rootNode = mountVnode(vnode, parentContext, prevRendered, mountQueue);
  container.appendChild(rootNode);

  return rootNode;
}

export function mountVnode(vnode, parentContext, prevRendered, mountQueue) {
  let {vtype} = vnode;
  switch (vtype) {
    case 1:
      return mountElement(vnode, parentContext, prevRendered, mountQueue);
    case 2:
      return mountComponent(vnode, parentContext, prevRendered, mountQueue);
    case 4:
      return mountStateless(vnode, parentContext, prevRendered, mountQueue);
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

function mountElement(vnode, parentContext, prevRendered, mountQueue) {
  let {type, props} = vnode;
  let dom = genMountElement(vnode, type, prevRendered);
  vnode._hostNode = dom;
  var method = prevRendered
    ? alignChildren
    : mountChildren
  method.call(0, vnode, dom, parentContext, mountQueue)

  if (vnode.checkProps) {
    diffProps(props, {}, vnode, {}, dom);
  }

  if (vnode.ref && vnode._owner) {
    vnode
      ._owner
      ._collectRefs(vnode, dom)
  }
  if (formElements[type]) {
    processFormElement(vnode, dom, props);
  }

  return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(vnode, parentNode, parentContext, mountQueue) {
  var children = vnode.props.children;
  for (let i = 0, n = children.length; i < n; i++) {
    let el = children[i];
    let curNode = mountVnode(el, parentContext, null, mountQueue);

    parentNode.appendChild(curNode);
  }
}

function alignChildren(vnode, parentNode, parentContext, mountQueue) {
  var children = vnode.props.children,
    childNodes = parentNode.childNodes,
    insertPoint = childNodes[0] || null,
    j = 0;
  for (let i = 0, n = children.length; i < n; i++) {
    let el = children[i];
    el._hostParent = vnode;
    var prevDom = childNodes[j];
    var dom = mountVnode(el, parentContext, prevDom, mountQueue);
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
function mountComponent(vnode, parentContext, prevRendered, mountQueue) {
  let {type} = vnode;

  let props = getComponentProps(vnode);
  let instance = new type(props, parentContext); //互相持有引用

  instance.props = instance.props || props;
  instance.context = instance.context || parentContext;

  if (instance.componentWillMount) {
    instance.componentWillMount();
    instance.state = instance._processPendingState();
  }

  // 如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说 instance._currentElement =
  // vnode instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成 空虚拟DOM {type:
  // '#comment', text: 'empty'} 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

  let rendered = renderComponent(instance, type, vnode, parentContext);
  instance._dirty = false;

  let dom = mountVnode(rendered, instance._childContext, prevRendered, mountQueue);

  vnode._hostNode = dom;

  mountQueue.push(instance)
  if (vnode.ref && vnode._owner) {
    vnode
      ._owner
      ._collectRefs(vnode, instance)
  }
  options.afterMount(instance);
  return dom;
}

export function renderComponent(instance, type, vnode, context) {
  CurrentOwner.cur = instance
  let rendered = instance.render();
  instance._currentElement = vnode;
  CurrentOwner.cur = null
  vnode._instance = instance
  rendered = checkNull(rendered, type);
  vnode._renderedVnode = rendered
 // instance._rendered = rendered;
  instance._childContext = getChildContext(instance, context);
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
  vnode._renderedVnode = rendered
  // this._rendered = rendered;
  return rendered
}
function mountStateless(vnode, parentContext, prevRendered, mountQueue) {
  let instance = new Stateless(vnode.type)
  let rendered = instance.render(vnode, parentContext);
  let dom = mountVnode(rendered, parentContext, prevRendered, mountQueue);

  return vnode._hostNode = dom;
}

function updateStateless(lastTypeVnode, nextTypeVnode, node, context, mountQueue) {
  let instance = lastTypeVnode._instance;
  let lastVnode = lastTypeVnode._renderedVnode
  let nextVnode = instance.render(nextTypeVnode, context);
  let dom = alignVnodes(lastVnode, nextVnode, node, context, mountQueue);
  nextTypeVnode._hostNode = nextVnode._hostNode = dom;
  return dom;
}

//将Component中这个东西移动这里
options.refreshComponent = refreshComponent;

function refreshComponent(instance, mountQueue) {
  //shouldComponentUpdate为false时不能阻止setState/forceUpdate cb的触发
  var dom = _refreshComponent(instance, mountQueue)
  instance._forceUpdate = false;

  instance
    ._pendingCallbacks
    .splice(0)
    .forEach(function (fn) {
      fn.call(instance);
    });
  var f = instance.after
  if (f) {
    f
      .splice(0)
      .forEach(function (el) {
        refreshComponent(el)
      })

  }
  return dom;
}
function _refreshComponent(instance, mountQueue) {
  var dom = instance._currentElement._hostNode
  var {
    state,
    context,
    lastProps,
    _currentElement: vnode,
    props: nextProps,
    constructor: type,
  } = instance;

  lastProps = lastProps || nextProps;
  var nextState = instance._processPendingState(nextProps, context);
  instance.props = lastProps;
  if (!instance._forceUpdate && instance.shouldComponentUpdate && instance.shouldComponentUpdate(nextProps, nextState, context) === false) {
    //  instance._disable = false;
    return dom;
  }

  //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
  if (instance.componentWillUpdate) {
    instance.componentWillUpdate(nextProps, nextState, context);
  }

  instance.props = nextProps;
  instance.state = nextState;
  var lastRendered = vnode._renderedVnode
  instance._dirty = false
  var hostNode = instance._nextElement || vnode
  var rendered = renderComponent(instance, type, hostNode, context);
  instance._nextElement = null
  mountQueue = mountQueue || []
  CurrentOwner.update = instance
  instance._updating = true
  dom = alignVnodes(lastRendered, rendered, dom, instance._childContext, mountQueue);
  instance.context = context
  instance._updating = false
  CurrentOwner.update = null
  hostNode._hostNode = dom;

  if (instance.componentDidUpdate) {
    instance.componentDidUpdate(lastProps, state, context);
  }
  options.afterUpdate(instance);
  return dom
}

export function alignVnodes(lastVnode, nextVnode, node, parentContext, mountQueue) {
  let dom = node;
  //eslint-disable-next-line
  if (nextVnode == null) {
    removeDOMElement(dom);
    disposeVnode(lastVnode);
  } else if (!(lastVnode.type == nextVnode.type && lastVnode.key === nextVnode.key)) {
    //replace
    disposeVnode(lastVnode);
    var clear = !mountQueue.mountAll
    if (clear) {
      var innerMountQueue = []
      dom = mountVnode(nextVnode, parentContext, null, innerMountQueue);
    } else {
      dom = mountVnode(nextVnode, parentContext, null, mountQueue);
    }
    var p = node.parentNode;
    if (p) {
      p.replaceChild(dom, node);
      removeDOMElement(node);
    }
    if (clear) {
      clearRefsAndMounts(innerMountQueue)
    }
  } else if (lastVnode !== nextVnode) {
    // same type and same key -> update
    dom = updateVnode(lastVnode, nextVnode, node, parentContext, mountQueue);
  }

  return dom;
}

export function findDOMNode(ref) {
  if (ref == null) {
    return null;
  }
  if (ref.nodeType === 1) {
    return ref;
  }
  var vnode = ref._currentElement
  return vnode._hostNode || null;
}

function updateVnode(lastVnode, nextVnode, node, parentContext, mountQueue) {
  switch (lastVnode.vtype) {
    case 1:
      var nextProps = nextVnode.props;
      if (lastVnode.props[HTML_KEY]) {
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
        updateElement(lastVnode, nextVnode, node, parentContext);
        mountChildren(nextVnode, node, parentContext, mountQueue);
      } else {
        if (nextProps[HTML_KEY]) {
          node.innerHTML = nextProps[HTML_KEY].__html;
        } else {
          updateChildren(lastVnode, nextVnode, node, parentContext, mountQueue);
        }
        updateElement(lastVnode, nextVnode, node, parentContext);
      }
      return node;
    case 2:
      return updateComponent(lastVnode, nextVnode, node, parentContext, mountQueue);
    case 4:
      return updateStateless(lastVnode, nextVnode, node, parentContext, mountQueue);
    default:
      nextVnode._hostNode = node
      if (lastVnode.text !== nextVnode.text) {
        node.nodeValue = nextVnode.text
      }
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

function updateComponent(lastVnode, nextVnode, node, parentContext, mountQueue) {
  var instance = (nextVnode._instance = lastVnode._instance);
  instance._nextElement = nextVnode

  var nextProps = getComponentProps(nextVnode);
  instance.lastProps = instance.props;

  if (instance.componentWillReceiveProps) {
    instance._dirty = true;
    instance.componentWillReceiveProps(nextProps, parentContext);
    instance._dirty = false;
  }

  instance.props = nextProps;
  instance.context = parentContext;
  if (nextVnode.ref) {
    nextVnode.ref(instance);
  }

  return refreshComponent(instance, mountQueue);
}

function updateChildren(vnode, newVnode, parentNode, parentContext, mountQueue) {
  let children = vnode.props.children;
  let childNodes = parentNode.childNodes;
  let newVchildren = newVnode.props.children
  var map = {};
  children.forEach(function (el) {
    var key = el.type + (el.key || "");
    var list = map[key];
    if (list) {
      list.push(el);
    } else {
      map[key] = [el];
    }
  });
  newVchildren.forEach(function (el) {
    var key = el.type + (el.key || "");
    var list = map[key];
    if (list) {
      var old = list.shift();
      if (old) {
        el.old = old;
      } else {
        delete map[key];
      }
    }
  });
  for (var i in map) {
    var list = map[i];
    if (Array.isArray(list)) {
      list
        .forEach(function (el) {
          var node = el._hostNode;
          if (node) {
            removeDOMElement(node);
          }
          disposeVnode(el);
        });
    }
  }

  newVchildren
    .forEach(function (el, index) {
      var old = el.old,
        ref,
        dom

      if (old) {
        el.old = null;
        dom = updateVnode(old, el, old._hostNode, parentContext, mountQueue)
        ref = childNodes[index]
        if (dom !== ref) {
          insertDOM(parentNode, dom, ref)
        }
      } else {
        var mountAll = mountQueue.mountAll

        if (mountAll) {
          dom = mountVnode(el, parentContext, null, mountQueue)
        } else {
          var innerMountQueue = []
          dom = mountVnode(el, parentContext, null, innerMountQueue)
        }

        ref = childNodes[index]
        insertDOM(parentNode, dom, ref)
        if (!mountAll) {
          clearRefsAndMounts(innerMountQueue)
        }
      }
    });
}
/*
function sameVnode(a, b) {
  return a.type === b.type && a.key === b.key
}
function patchVnode(lastVnode, nextVnode, args) {
  return updateVnode(lastVnode, nextVnode, lastVnode._hostNode, args[0], args[1])
}
function updateChildren(lastVnode, nextVnode, parentNode, parentContext, mountQueue) {
  let newCh = nextVnode.props.children
  let oldCh = lastVnode.props.children
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyMap, idxInOld, dom, ref, elmToMove;

  var args = [parentContext, mountQueue]
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {

    if (sameVnode(oldStartVnode, newStartVnode)) {
      dom = patchVnode(oldStartVnode, newStartVnode, args);
      ref = childNodes[newStartIdx]
      if (dom !== ref) {
        parentNode.replaceChild(dom, ref)
        oldStartVnode._hostNode = dom
      }
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      dom = patchVnode(oldEndVnode, newEndVnode, args);
      ref = childNodes[newEndIdx]
      if (dom !== ref) {
        parentNode.replaceChild(dom, ref)
        oldEndVnode._hostNode = dom
        // insertDOM(parentNode, dom, ref)
      }
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      //如果新的最后一个等于旧的第一个
      dom = patchVnode(oldStartVnode, newEndVnode, args);
      parentNode.insertBefore(dom, oldStartVnode._hostNode.nextSibling)
      //  api.insertBefore(parentNode, oldStartVnode._hostNode as Node,
      // api.nextSibling(oldEndVnode._hostNode as Node));
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      dom = patchVnode(oldEndVnode, newStartVnode, args);
      parentNode.insertBefore(oldEndVnode._hostNode, oldStartVnode._hostNode);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      if (oldKeyMap === undefined) {
        oldKeyMap = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyMap[newStartVnode.key];
      if (isUndef(idxInOld)) { // New element
        dom = mountVnode(newStartVnode, parentContext, null, mountQueue)
        parentNode.insertBefore(dom, oldStartVnode._hostNode);
        newStartVnode = newCh[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];
        if (elmToMove.type !== newStartVnode.type) {
          dom = mountVnode(newStartVnode, parentContext, null, mountQueue)
          parentNode.insertBefore(parentNode, dom, oldStartVnode._hostNode);
        } else {
          patchVnode(elmToMove, newStartVnode, mountQueue);
          oldCh[idxInOld] = undefined;
          parentNode.insertBefore(parentNode, (elmToMove._hostNode), oldStartVnode._hostNode);
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
    let before = newCh[newEndIdx + 1] == null
      ? null
      : newCh[newEndIdx + 1]._hostNode;
    addVnodes(parentNode, before, newCh, newStartIdx, newEndIdx, mountQueue);
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentNode, oldCh, oldStartIdx, oldEndIdx);
  }
}
*/
function insertDOM(parentNode, dom, ref) {
  if (!ref) {
    parentNode.appendChild(dom)
  } else {
    parentNode.insertBefore(dom, ref)
  }
}