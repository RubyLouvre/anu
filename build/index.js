var options = React.options || {};

var roots = {};
options.roots = roots;
  

function findVNodeFromDOM(vnode, dom) {
  if (!vnode) {
    for (var i in roots) {
      const root = roots[i];
      const result = findVNodeFromDOM(root, dom);
      if (result) {
        return result;
      }
    }
  } else {
    if (vnode.node === dom) {
      //如果是原子虚拟DOM，直接比较 _hostNode === dom
      return vnode;
    }

    var children = vnode._renderedChildren

    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child) {
          const result = findVNodeFromDOM(child, dom);

          if (result) {
            return result;
          }
        }
      }
    }
  }
}
//===================================      用于根据一个虚拟DOM找到它的组件实例
const instanceMap = new Map();

function getKeyForVNode(vnode) {
  return vnode._instance || vnode._hostNode;
}

function getInstanceFromVNode(vnode) {
  const key = getKeyForVNode(vnode);

  return instanceMap.get(key);
}

/**
 * Create a bridge for exposing Inferno's component tree to React DevTools.
 *
 * It creates implementations of the interfaces that ReactDOM passes to
 * devtools to enable it to query the component tree and hook into component
 * updates.
 *
 * See https://github.com/facebook/react/blob/59ff7749eda0cd858d5ee568315bcba1be75a1ca/src/renderers/dom/ReactDOM.js
 * for how ReactDOM exports its internals for use by the devtools and
 * the `attachRenderer()` function in
 * https://github.com/facebook/react-devtools/blob/e31ec5825342eda570acfc9bcb43a44258fceb28/backend/attachRenderer.js
 * for how the devtools consumes the resulting objects.
 */
function createDevToolsBridge() {
  console.log("createDevToolsBridge.....");
  const ComponentTree = {
    getNodeFromInstance(instance) {
      //createReactDOMComponent生成的实例有vnode对象
      return instance.node;
    },
    getClosestInstanceFromNode(dom) {
      const vnode = findVNodeFromDOM(null, dom);
      //转换为ReactCompositeComponent或ReactDOMComponent
      return vnode ? updateReactComponent(vnode, null) : null;
    }
  };

  // Map of root ID (the ID is unimportant) to component instance.
  //会根据vnode创建实例，并保存在instanceMap与roots中
  findRoots(document.body, roots);
  if (!Object.keys(roots).length) {
    setTimeout(function() {
      findRoots(document.body, roots);
    }, 100);
  }

  const Mount = {
    _instancesByReactRootID: roots,
    // tslint:disable-next-line:no-empty
    _renderNewRootComponent(instance) {}
  };

  const Reconciler = {
    // tslint:disable-next-line:no-empty
    mountComponent(instance) {},
    // tslint:disable-next-line:no-empty
    performUpdateIfNecessary(instance) {},
    // tslint:disable-next-line:no-empty
    receiveComponent(instance) {},
    // tslint:disable-next-line:no-empty
    unmountComponent(instance) {}
  };

//============

  const queuedMountComponents = new Map();
  const queuedReceiveComponents = new Map();
  const queuedUnmountComponents = new Map();

  const queueUpdate = (updater, map, component) => {
    if (!map.has(component)) {
      map.set(component, true);
      requestAnimationFrame(function() {
        updater(component);
        map.delete(component);
      });
    }
  };

  const queueMountComponent = component =>
    queueUpdate(Reconciler.mountComponent, queuedMountComponents, component);
  const queueReceiveComponent = component =>
    queueUpdate(
      Reconciler.receiveComponent,
      queuedReceiveComponents,
      component
    );
  const queueUnmountComponent = component =>
    queueUpdate(
      Reconciler.unmountComponent,
      queuedUnmountComponents,
      component
    );


  // 创建 componentAdded， componentUpdated，componentRemoved三个重要钩子
  const componentAdded = component => {
    const instance = updateReactComponent(component._currentElement);
    //将_currentElement代替为ReactCompositeComponent实例
    if (isRootVNode(component._currentElement)) {
      instance._rootID = nextRootKey(roots);
      roots[instance._rootID] = instance;
      Mount._renderNewRootComponent(instance);
    }
    //遍历非实组件的孩子
    visitNonCompositeChildren(instance, childInst => {
      if (childInst) {
        childInst._inDevTools = true;
        queueMountComponent(childInst);
      }
    });
    queueMountComponent(instance);
  };

  const componentUpdated = component => {
    const prevRenderedChildren = [];

    //通过anujs instance得到 ReactCompositeComponent实例
    visitNonCompositeChildren(instanceMap.get(component), childInst => {
      prevRenderedChildren.push(childInst);
    });

    const instance = updateReactComponent(component._currentElement);
    queueReceiveComponent(instance);
    visitNonCompositeChildren(instance, childInst => {
      if (!childInst._inDevTools) {
        // New DOM child component
        childInst._inDevTools = true;
        queueMountComponent(childInst);
      } else {
        // Updated DOM child component
        queueReceiveComponent(childInst);
      }
    });

    prevRenderedChildren.forEach(childInst => {
      if (!document.body.contains(childInst.node)) {
        instanceMap.delete(childInst.node);
        queueUnmountComponent(childInst);
      }
    });
  };

  const componentRemoved = component => {
    const instance = updateReactComponent(component._currentElement);

    visitNonCompositeChildren(instance, childInst => {
      instanceMap.delete(childInst.node);
      queueUnmountComponent(childInst);
    });
    queueUnmountComponent(instance);
    instanceMap.delete(component);
    if (instance._rootID) {
      delete roots[instance._rootID];
    }
  };

  return {
    componentAdded,
    componentUpdated,
    componentRemoved,

    ComponentTree,
    Mount,
    Reconciler
  };
}
//是否为根节点的虚拟DOM
function isRootVNode(vnode) {
  for (var i in roots) {
    if (roots[i] === vnode) {
      return true;
    }
  }
  return false;
}

/**
 *roots里面都是经过
 *
 * @param {DOMElement} node
 * @param {[key: string] => ReactDOMComponent|ReactCompositeComponent}
 */
function findRoots(node, roots) {
  Array.from(node.childNodes).forEach(child => {
    if (child._component) {
      roots[nextRootKey(roots)] = updateReactComponent(child._component);
    } else {
      findRoots(child, roots);
    }
  });
}

function nextRootKey(roots) {
  return "." + Object.keys(roots).length;
}

function updateReactComponent(vnode, parentDom) {
  if (!vnode) {
    return null;
  }
  var newInstance;

  if (vnode._instance) {
    newInstance = createReactCompositeComponent(vnode);
  } else {
    newInstance = createReactDOMComponent(vnode, parentDom);
  }

  var oldInstance = getInstanceFromVNode(vnode);

  if (oldInstance) {
    Object.assign(oldInstance, newInstance);
    return oldInstance;
  }
  instanceMap.set(getKeyForVNode(vnode), newInstance);
  //将它存入instanceMap中
  return newInstance;
}

function normalizeChildren(children, dom) {
  return children.map(child => updateReactComponent(child, dom));
}

function createReactDOMComponent(vnode, parentDom) {
  const type = vnode.type;

  if (type === "#comment") {
    return null;
  }
  const props = vnode.props;
  const dom = vnode._hostNode;
  const isText = type === "#text";
  return {
    _currentElement: isText
      ? vnode.text + ""
      : {
          type,
          props
        },
    _inDevTools: false,
    _renderedChildren: !isText && normalizeChildren(props.children, dom),
    _stringText: isText ? vnode.text + "" : null,
    node: dom || parentDom
  };
}

/**
 * Return a ReactCompositeComponent-compatible object for a given Inferno
 * component instance.
 *
 * This implements the subset of the ReactCompositeComponent interface that
 * the DevTools requires in order to walk the component tree and inspect the
 * component's properties.
 *
 * See https://github.com/facebook/react-devtools/blob/e31ec5825342eda570acfc9bcb43a44258fceb28/backend/getData.js
 */
function createReactCompositeComponent(vnode) {
  var type = vnode.type;
  var typeName = type.displayName || type.name;
  var instance = vnode._instance;
  var dom = vnode._hostNode;
  return {
    getName() {
      return typeName;
    },
    type: type,
    _instance: instance,
    state: instance.state,
    node: dom,
    props: instance.props,
    _currentElement: {
      type: type,
      key: normalizeKey(vnode.key),
      props: vnode.props,
      ref: null
    },
    _renderedComponent: updateReactComponent(instance._rendered, dom),
    forceUpdate: instance.forceUpdate.bind(instance),
    setState: instance.setState.bind(instance)
  };
}

function nextRootKey(roots) {
  return "." + Object.keys(roots).length;
}

function normalizeKey(key) {
  if (key && key[0] === ".") {
    return null;
  }
}

function typeName(type) {
  if (typeof type === "function") {
    return type.displayName || type.name;
  }
  return type;
}
/**
 * Visit all child instances of a ReactCompositeComponent-like object that are
 * not composite components (ie. they represent DOM elements or text)
 */
function visitNonCompositeChildren(instance, callback) {
  if (instance._renderedComponent) {
    callback(instance._renderedComponent);
    visitNonCompositeChildren(instance._renderedComponent, callback);
  } else if (instance._renderedChildren) {
    instance._renderedChildren.forEach(child => {
      if (child) {
        callback(child);
        visitNonCompositeChildren(child, callback);
      }
    });
  }
}

function initDevTools() {
  /* tslint:disable */
  console.log("初始chrome react 调试工具");
  const bridge = createDevToolsBridge();
  var Methods = {
    afterMount: "componentAdded",
    afterUpdate: "componentUpdated",
    beforeUnmount: "componentRemoved"
  };
  for (var name in Methods) {
    (function(key, alias) {
      var oldMethod = options[key];
      //重写anujs原有的方法
      options[key] = function(instance) {
        bridge[alias](instance);
        if (oldMethod) {
          oldMethod(instance);
        }
      };
    })(name, Methods[name]);
  }

  window["__REACT_DEVTOOLS_GLOBAL_HOOK__"].inject(bridge);
}
if (document.readyState === "complete") {
  initDevTools();
} else {
  window.addEventListener("load", initDevTools);
}

export default initDevTools;
