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

function getKeyForVNode(vNode) {
    if (vNode._instance) {
        return vNode._instance.vnode._hostNode
    } else {
        return vNode._hostNode;
    }
}

function getInstanceFromVNode(vNode) {
    const key = getKeyForVNode(vNode);

    return instanceMap.get(key);
}

function createInstanceFromVNode(vNode, instance) {
    const key = getKeyForVNode(vNode);

    instanceMap.set(key, instance);
}

function deleteInstanceForVNode(vNode) {
    const key = getKeyForVNode(vNode);

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
    const ComponentTree = {
        getNodeFromInstance(instance) {
            return instance.vnode._hostNode;
        },
        getClosestInstanceFromNode(dom) {
            const vNode = findVNodeFromDom(null, dom);
            //转换为ReactCompositeComponent或ReactDOMComponent
            return vNode ? updateReactComponent(vNode, null) : null;
        }
    }

    // Map of root ID (the ID is unimportant) to component instance.

    findRoots(document.body, roots);

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


    /** Notify devtools that a new component instance has been mounted into the DOM. */
    const componentAdded = (vNode) => {
        const instance = updateReactComponent(vNode, null);
        if (isRootVNode(vNode)) {
            instance._rootID = nextRootKey(roots);
            roots[instance._rootID] = instance;
            Mount._renderNewRootComponent(instance);
        }
        visitNonCompositeChildren(instance, (childInst) => {
            if (childInst) {
                childInst._inDevTools = true;
                queueMountComponent(childInst);
            }
        });
        queueMountComponent(instance);
    };

    /** Notify devtools that a component has been updated with new props/state. */
    const componentUpdated = (vNode) => {
        const prevRenderedChildren = [];

        visitNonCompositeChildren(getInstanceFromVNode(vNode), (childInst) => {
            prevRenderedChildren.push(childInst);
        });

        // Notify devtools about updates to this component and any non-composite
        // children
        const instance = updateReactComponent(vNode, null);
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
                deleteInstanceForVNode(childInst.vNode);
                queueUnmountComponent(childInst);
            }
        });
    };

    /** Notify devtools that a component has been unmounted from the DOM. */
    const componentRemoved = (vNode) => {
        const instance = updateReactComponent(vNode, null);

        visitNonCompositeChildren((childInst) => {
            deleteInstanceForVNode(childInst.vNode);
            queueUnmountComponent(childInst);
        });
        queueUnmountComponent(instance);
        deleteInstanceForVNode(vNode);
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
function isRootVNode(vNode) {
    for (var i in roots) {
        if (roots[i] = vNode) {
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
    console.log('查找所有根组件。。。')
    Array.from(node.childNodes).forEach(child => {
        console.log(child)
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

function updateReactComponent(vNode, parentDom) {
    if (!vNode) {
        return null;
    }
    let newInstance;

    if (vNode._instance) {
        newInstance = createReactCompositeComponent(vNode);
    } else {
        newInstance = createReactDOMComponent(vNode, parentDom);
    }
    const oldInstance = getInstanceFromVNode(vNode);

    if (oldInstance) {
        for (const key in newInstance) {
            oldInstance[key] = newInstance[key];
        }

        return oldInstance;
    }
    createInstanceFromVNode(vNode, newInstance);
    return newInstance;

}

function normalizeChildren(children, dom) {
    return children.map((child) =>
        updateReactComponent(child, dom)
    )
}

function createReactDOMComponent(vNode, parentDom) {
    const type = vNode.type;

    if (type === '#comment') {
        return null;
    }
    const props = vNode.props;
    const dom = vNode.dom;
    const isText = type === '#text'

    return {
        _currentElement: isText ? vnode.text : {
            type,
            props
        },
        _inDevTools: false,
        _renderedChildren: !isText && normalizeChildren(props.children, dom),
        _stringText: isText ? (vnode.text + '') : null,
        node: dom || parentDom,
        vNode
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
function createReactCompositeComponent(vNode) {
    const type = vNode.type;
    const instance = instance._instance;
    const dom = vNode.dom;

    return {
        getName() {
            return typeName(type);
        },
        _currentElement: {
            type,
            key: normalizeKey(vNode.key),
            props: vNode.props,
            ref: null
        },
        _instance: instance,
        _renderedComponent: updateReactComponent(instance, dom),
        forceUpdate: instance.forceUpdate.bind(instance),
        node: dom,
        props: instance.props,
        setState: instance.setState.bind(instance),
        state: instance.state,
        vNode
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
        if (!component._renderedComponent._component) {
            callback(component._renderedComponent);
            visitNonCompositeChildren(component._renderedComponent, callback);
        }
    } else if (component._renderedChildren) {
        component._renderedChildren.forEach((child) => {
            if (child) {
                callback(child);
                if (!child._component) {
                    visitNonCompositeChildren(child, callback);
                }
            }
        });
    }
}

function initDevTools() {
    /* tslint:disable */
    if (typeof window['__REACT_DEVTOOLS_GLOBAL_HOOK__'] === 'undefined') {
        /* tslint:enable */
        // React DevTools are not installed
        return;
    }
    //  重写afterMount, afterUpdate, beforeUnmount
    // Notify devtools when preact components are mounted, updated or unmounted
    const bridge = createDevToolsBridge();
    const nextAfterMount = options.afterMount;

    options.afterMount = (vNode) => {
        bridge.componentAdded(vNode);
        if (nextAfterMount) {
            nextAfterMount(vNode);
        }
    };

    const nextAfterUpdate = options.afterUpdate;

    options.afterUpdate = (vNode) => {
        bridge.componentUpdated(vNode);
        if (nextAfterUpdate) {
            nextAfterUpdate(vNode);
        }
    };
    const nextBeforeUnmount = options.beforeUnmount;

    options.beforeUnmount = (vNode) => {
        bridge.componentRemoved(vNode);
        if (nextBeforeUnmount) {
            nextBeforeUnmount(vNode);
        }
    };
    // Notify devtools about this instance of "React"
    /* tslint:disable */
    window['__REACT_DEVTOOLS_GLOBAL_HOOK__'].inject(bridge);

}
if (document.readyState === "complete") {
    initDevTools()
} else {
    window.addEventListener(document, 'DOMContentLoaded', function () {
        initDevTools()
    })
}


export default initDevTools