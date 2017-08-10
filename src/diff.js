import { diffProps } from "./diffProps";
import { CurrentOwner, dirtyComponents } from "./createElement";
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
  mountQueue.mountAll = true
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

  instance.props = instance.props || props;
  instance.context = instance.context || parentContext;
  let currContext = instance.context

  if (instance.componentWillMount) {
    instance.componentWillMount();
    instance.state = instance._processPendingState();
  }

  // 如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说 instance._currentElement =
  // vnode instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成 空虚拟DOM {type:
  // '#comment', text: 'empty'} 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

  let rendered = safeRenderComponent(instance, type, vnode, parentContext);
  instance._dirty = false;

  let dom = mountVnode(rendered, instance, prevRendered, mountQueue);

  instance.context = currContext;
  vnode._hostNode = dom;

  mountQueue.push(instance)
  if (vnode.ref) {
    parentInstance._collectRefs(vnode, instance)
  }
  options.afterMount(instance);
  return dom;
}

export function safeRenderComponent(instance, type, vnode, context) {
  let rendered = instance.render();
  instance._currentElement = vnode;
  vnode._instance = instance
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

function updateStateless(lastTypeVnode, nextTypeVnode, node, parentInstance, mountQueue) {
  let context = parentInstance.context
  let instance = lastTypeVnode._instance;
  let lastVnode = instance._rendered;
  let nextVnode = instance.render(nextTypeVnode, context);
  let dom = alignVnodes(lastVnode, nextVnode, node, instance, mountQueue);
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
    props: nextProps,
    constructor: type,
    _rendered: lastRendered
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

  instance._dirty = false
  var hostNode = instance._nextElement || instance._currentElement
  var rendered = safeRenderComponent(instance, type, hostNode, context);
  instance._nextElement = null
  var hasQueue = !mountQueue
  mountQueue = mountQueue || []
  CurrentOwner.cur = instance
  instance._updating = true
  dom = alignVnodes(lastRendered, rendered, dom, instance, mountQueue);
  instance.context = context
  instance._updating = false
  CurrentOwner.cur = null

  hostNode._hostNode = dom;
  if (!hasQueue) {
    //  clearRefsAndMounts(mountQueue)
  }
  if (instance.componentDidUpdate) {
    instance.componentDidUpdate(lastProps, state, context);
  }
  options.afterUpdate(instance);
  return dom
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
    var clear = !mountQueue.mountAll
    if (clear) {
      var innerMountQueue = []
      newNode = mountVnode(newVnode, parentInstance, null, innerMountQueue);
    } else {
      newNode = mountVnode(newVnode, parentInstance, null, mountQueue);
    }
    //  if (newVnode._instance && scheduler.count) {      scheduler.run();  }
    var p = node.parentNode;
    if (p) {
      p.replaceChild(newNode, node);
      removeDOMElement(node);
    }
    if (clear) {
      clearRefsAndMounts(innerMountQueue)
    }
  } else if (vnode !== newVnode) {
    // same type and same key -> update
    newNode = updateVnode(vnode, newVnode, node, parentInstance, mountQueue);
  }

  return newNode;
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
    nextVnode.ref(instance, parentInstance);
  }

  return refreshComponent(instance, mountQueue);
}

function updateChildren(vnode, newVnode, parentNode, parentInstance, mountQueue) {
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
          disposeVnode(el, parentInstance);
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
        dom = updateVnode(old, el, old._hostNode, parentInstance, mountQueue)
        ref = childNodes[index]
        if (dom !== ref) {
          insertDOM(parentNode, dom, ref)
        }
      } else {
        var mountAll = mountQueue.mountAll

        if (mountAll) {
          dom = mountVnode(el, parentInstance, null, mountQueue)
        } else {
          var innerMountQueue = []
          dom = mountVnode(el, parentInstance, null, innerMountQueue)
        }

        ref = childNodes[index]
        insertDOM(parentNode, dom, ref)
        if (!mountAll) {
          clearRefsAndMounts(innerMountQueue)
        }
      }
    });
}

function insertDOM(parentNode, dom, ref) {
  if (!ref) {
    parentNode.appendChild(dom)
  } else {
    parentNode.insertBefore(dom, ref)
  }
}