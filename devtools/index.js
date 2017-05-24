var options = React.options || {}

var roots = {}
options.roots = roots

function findvnodeFromDom(vnode, dom) {
    if (!vnode) {
        for (var i in roots) {
            const root = roots[i];
            const result = findVNodeFromDom(root.input, dom);

            if (result) {
                return result;
            }
        }
    } else {
        if (vnode._hostNode === dom) { //如果是原子虚拟DOM，直接比较 _hostNode === dom
            return vnode;
        }
        var findNode
        var component = vnode._instance
        if (component) {
            var baseVnode = component.vnode //如果是组件
            if (baseVnode && baseVnode._hostNode) {
                return baseVnode
            }
            findNode = baseVnode || {}
        } else {
            findNode = vnode

        }

        var children = findNode.props && findNode.props.children

        if (children) {

            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                if (child) {
                    const result = findvnodeFromDom(child, dom)

                    if (result) {
                        return result;
                    }
                }
            }
        }
    }

}
//===================================
//      用于根据一个虚拟DOM找到它的组件实例
const instanceMap = new Map();

function getKeyForVNode(vnode) {
    return vnode._instance || vnode._hostNode;
}

function getInstanceFromVNode(vnode) {
    const key = getKeyForVNode(vnode);

    return instanceMap.get(key);
}

function createInstanceFromVNode(vnode, instance) {
    const key = getKeyForVNode(vnode);
    instanceMap.set(key, instance);
}

function deleteInstanceForVNode(vnode) {
    const key = getKeyForVNode(vnode);

    instanceMap.delete(key);
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
    console.log('createDevToolsBridge.....')
    const ComponentTree = {
        getNodeFromInstance(instance) {
            return instance.vnode._hostNode;
        },
        getClosestInstanceFromNode(dom) {
            const vnode = findVNodeFromDom(null, dom);
            //转换为ReactCompositeComponent或ReactDOMComponent
            return vnode ? updateReactComponent(vnode, null) : null;
        }
    }

    // Map of root ID (the ID is unimportant) to component instance.

    findRoots(document.body, roots);
    if (!Object.keys(roots).length) {
        setTimeout(function () {
            findRoots(document.body, roots);
        }, 100)
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


    const queuedMountComponents = new Map();
    const queuedReceiveComponents = new Map();
    const queuedUnmountComponents = new Map();

    const queueUpdate = (updater, map, component) => {
        if (!map.has(component)) {
            map.set(component, true);
            requestAnimationFrame(function () {
                updater(component);
                map.delete(component);
            });
        }
    };


    const queueMountComponent = (component) => queueUpdate(Reconciler.mountComponent, queuedMountComponents, component);
    const queueReceiveComponent = (component) => queueUpdate(Reconciler.receiveComponent, queuedReceiveComponents, component);
    const queueUnmountComponent = (component) => queueUpdate(Reconciler.unmountComponent, queuedUnmountComponents, component);


    // 创建 componentAdded， componentUpdated，componentRemoved三个重要钩子
    const componentAdded = (vnode) => {
        // 添加虚拟DOM到调试面板
        // console.log('添加虚拟DOM到调试面板',vnode)

        const instance = updateReactComponent(vnode, null);
       // console.log('[',instance,']')
        
        if (isRootVNode(vnode)) {
            instance._rootID = nextRootKey(roots);
            roots[instance._rootID] = instance;
            Mount._renderNewRootComponent(instance);
        }
        //遍历非实组件的孩子
        visitNonCompositeChildren(instance, (childInst) => {
            if (childInst) {
                childInst._inDevTools = true;
                queueMountComponent(childInst);
            }
        });
        queueMountComponent(instance);
    };


    const componentUpdated = (vnode) => {

      
        var key = getKeyForVNode(vnode)
        const prevRenderedChildren = [];

        //通过anu的虚拟DOM的_instance或_hostNode得到之前被封装过newInstance
        visitNonCompositeChildren(getInstanceFromVNode(vnode), (childInst) => {
            prevRenderedChildren.push(childInst);
        });
        // Notify devtools about updates to this component and any non-composite
        // children
        const instance = updateReactComponent(vnode, null);
        queueReceiveComponent(instance);
        visitNonCompositeChildren(instance, (childInst) => {
            if (!childInst._inDevTools) {
                // New DOM child component
                childInst._inDevTools = true;
                queueMountComponent(childInst);
            } else {
                // Updated DOM child component
                queueReceiveComponent(childInst);
            }
        });

        // For any non-composite children that were removed by the latest render,
        // remove the corresponding ReactDOMComponent-like instances and notify
        // the devtools
        prevRenderedChildren.forEach((childInst) => {
            if (!document.body.contains(childInst.node)) {
                deleteInstanceForVNode(childInst.vnode);
                queueUnmountComponent(childInst);
            }
        });
    };

    /** Notify devtools that a component has been unmounted from the DOM. */
    const componentRemoved = (vnode) => {
        const instance =  getInstanceFromVNode(vnode)  // updateReactComponent(vnode)
        
        visitNonCompositeChildren(instance, (childInst) => {
            deleteInstanceForVNode(childInst.vnode);
            queueUnmountComponent(childInst);
        });
        queueUnmountComponent(instance);
        deleteInstanceForVNode(vnode);
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
        if (roots[i] = vnode) {
            return true
        }
    }
    return false
}


/**
 * Find all root component instances rendered by preact in `node`'s children
 * and add them to the `roots` map.
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
    return '.' + Object.keys(roots).length;
}

function updateReactComponent(vnode, parentDom) {
    if (!vnode) {
        return null;
    }
    let newInstance;

    if (vnode._instance) {
        newInstance = createReactCompositeComponent(vnode);
    } else {
        newInstance = createReactDOMComponent(vnode, parentDom)
    }

    const oldInstance = getInstanceFromVNode(vnode);

    if (oldInstance) {
        for (const key in newInstance) {

            oldInstance[key] = newInstance[key];
        }

        return oldInstance;
    }

    createInstanceFromVNode(vnode, newInstance)
    //将它存入instanceMap中
    return newInstance;

}

function normalizeChildren(children, dom) {
    return children.map((child) =>
        updateReactComponent(child, dom)
    )
}

function createReactDOMComponent(vnode, parentDom) {
    const type = vnode.type;

    if (type === '#comment') {
        return null;
    }
    const props = vnode.props;
    const dom = vnode._hostNode;
    const isText = type === '#text'

    return {
        _currentElement: isText ? vnode.text + '' : {
            type,
            props
        },
        _inDevTools: false,
        _renderedChildren: !isText && normalizeChildren(props.children, dom),
        _stringText: isText ? (vnode.text + '') : null,
        node: dom || parentDom,
        vnode
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
    var typeName = type.displayName || type.name
    var instance = vnode._instance;
    var dom = vnode._hostNode;
    return {
        getName() {
            return typeName
        },
        type: type,
        _currentElement: {
            type: type,
            key: normalizeKey(vnode.key),
            props: vnode.props,
            ref: null
        },
        _instance: instance,
        _renderedComponent: updateReactComponent(instance._rendered, dom),
        forceUpdate: instance.forceUpdate.bind(instance),
        node: dom,
        props: instance.props,
        setState: instance.setState.bind(instance),
        state: instance.state,
        vnode
    };

}

function nextRootKey(roots) {
    return '.' + Object.keys(roots).length;
}


function normalizeKey(key) {
    if (key && key[0] === '.') {
        return null;
    }
}

function typeName(type) {
    if (typeof type === 'function') {
        return type.displayName || type.name;
    }
    return type;
}
/**
 * Visit all child instances of a ReactCompositeComponent-like object that are
 * not composite components (ie. they represent DOM elements or text)
 */
function visitNonCompositeChildren(component, callback) {
    if (component._renderedComponent) {

        callback(component._renderedComponent);
        visitNonCompositeChildren(component._renderedComponent, callback);

    } else if (component._renderedChildren) {
        component._renderedChildren.forEach((child) => {
            if (child) {
                callback(child);
                visitNonCompositeChildren(child, callback);
            }
        });
    }
}

function initDevTools() {
    /* tslint:disable */
    console.log('initDevTools.....')
    //  重写afterMount, afterUpdate, beforeUnmount
    // Notify devtools when preact components are mounted, updated or unmounted
    const bridge = createDevToolsBridge();
    const nextAfterMount = options.afterMount;

    options.afterMount = (vnode) => {
        bridge.componentAdded(vnode);
        if (nextAfterMount) {
            nextAfterMount(vnode);
        }
    };

    const nextAfterUpdate = options.afterUpdate;

    options.afterUpdate = (vnode, props) => {
        bridge.componentUpdated(vnode, props);
        if (nextAfterUpdate) {
            nextAfterUpdate(vnode);
        }
    };
    const nextBeforeUnmount = options.beforeUnmount;

    options.beforeUnmount = (vnode) => {
        bridge.componentRemoved(vnode);
        if (nextBeforeUnmount) {
            nextBeforeUnmount(vnode);
        }
    };
    // Notify devtools about this instance of "React"
    /* tslint:disable */
    window['__REACT_DEVTOOLS_GLOBAL_HOOK__'].inject(bridge);

}
if (document.readyState === "complete") {
    initDevTools()
} else {
    window.addEventListener('load', initDevTools)
   // document.addEventListener('DOMContentLoaded', initDevTools)
}


export default initDevTools