(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.DevTools = factory());
}(this, function () {

    var options = React.options || {};

    var roots = {};
    options.roots = roots;

    //===================================
    //      用于根据一个虚拟DOM找到它的组件实例
    var instanceMap = new Map();

    function getKeyForVNode(vNode) {
        if (vNode._instance) {
            return vNode._instance.vnode._hostNode;
        } else {
            return vNode._hostNode;
        }
    }

    function getInstanceFromVNode(vNode) {
        var key = getKeyForVNode(vNode);

        return instanceMap.get(key);
    }

    function createInstanceFromVNode(vNode, instance) {
        var key = getKeyForVNode(vNode);

        instanceMap.set(key, instance);
    }

    function deleteInstanceForVNode(vNode) {
        var key = getKeyForVNode(vNode);

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
        var ComponentTree = {
            getNodeFromInstance: function getNodeFromInstance(instance) {
                return instance.vnode._hostNode;
            },
            getClosestInstanceFromNode: function getClosestInstanceFromNode(dom) {
                var vNode = findVNodeFromDom(null, dom);
                //转换为ReactCompositeComponent或ReactDOMComponent
                return vNode ? updateReactComponent(vNode, null) : null;
            }
        };

        // Map of root ID (the ID is unimportant) to component instance.

        findRoots(document.body, roots);

        var Mount = {
            _instancesByReactRootID: roots,
            // tslint:disable-next-line:no-empty
            _renderNewRootComponent: function _renderNewRootComponent(instance) {}
        };

        var Reconciler = {
            // tslint:disable-next-line:no-empty
            mountComponent: function mountComponent(instance) {},

            // tslint:disable-next-line:no-empty
            performUpdateIfNecessary: function performUpdateIfNecessary(instance) {},

            // tslint:disable-next-line:no-empty
            receiveComponent: function receiveComponent(instance) {},

            // tslint:disable-next-line:no-empty
            unmountComponent: function unmountComponent(instance) {}
        };

        var queuedMountComponents = new Map();
        var queuedReceiveComponents = new Map();
        var queuedUnmountComponents = new Map();

        var queueUpdate = function queueUpdate(updater, map, component) {
            if (!map.has(component)) {
                map.set(component, true);
                requestAnimationFrame(function () {
                    updater(component);
                    map.delete(component);
                });
            }
        };

        var queueMountComponent = function queueMountComponent(component) {
            return queueUpdate(Reconciler.mountComponent, queuedMountComponents, component);
        };
        var queueReceiveComponent = function queueReceiveComponent(component) {
            return queueUpdate(Reconciler.receiveComponent, queuedReceiveComponents, component);
        };
        var queueUnmountComponent = function queueUnmountComponent(component) {
            return queueUpdate(Reconciler.unmountComponent, queuedUnmountComponents, component);
        };

        /** Notify devtools that a new component instance has been mounted into the DOM. */
        var componentAdded = function componentAdded(vNode) {
            var instance = updateReactComponent(vNode, null);
            if (isRootVNode(vNode)) {
                instance._rootID = nextRootKey(roots);
                roots[instance._rootID] = instance;
                Mount._renderNewRootComponent(instance);
            }
            visitNonCompositeChildren(instance, function (childInst) {
                if (childInst) {
                    childInst._inDevTools = true;
                    queueMountComponent(childInst);
                }
            });
            queueMountComponent(instance);
        };

        /** Notify devtools that a component has been updated with new props/state. */
        var componentUpdated = function componentUpdated(vNode) {
            var prevRenderedChildren = [];

            visitNonCompositeChildren(getInstanceFromVNode(vNode), function (childInst) {
                prevRenderedChildren.push(childInst);
            });

            // Notify devtools about updates to this component and any non-composite
            // children
            var instance = updateReactComponent(vNode, null);
            queueReceiveComponent(instance);
            visitNonCompositeChildren(instance, function (childInst) {
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
            prevRenderedChildren.forEach(function (childInst) {
                if (!document.body.contains(childInst.node)) {
                    deleteInstanceForVNode(childInst.vNode);
                    queueUnmountComponent(childInst);
                }
            });
        };

        /** Notify devtools that a component has been unmounted from the DOM. */
        var componentRemoved = function componentRemoved(vNode) {
            var instance = updateReactComponent(vNode, null);

            visitNonCompositeChildren(function (childInst) {
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
            componentAdded: componentAdded,
            componentUpdated: componentUpdated,
            componentRemoved: componentRemoved,

            ComponentTree: ComponentTree,
            Mount: Mount,
            Reconciler: Reconciler
        };
    }
    //是否为根节点的虚拟DOM
    function isRootVNode(vNode) {
        for (var i in roots) {
            if (roots[i] = vNode) {
                return true;
            }
        }
        return false;
    }

    /**
     * Find all root component instances rendered by preact in `node`'s children
     * and add them to the `roots` map.
     *
     * @param {DOMElement} node
     * @param {[key: string] => ReactDOMComponent|ReactCompositeComponent}
     */
    function findRoots(node, roots) {
        console.log('查找所有根组件。。。');
        Array.from(node.childNodes).forEach(function (child) {
            console.log(child);
            if (child._component) {
                roots[nextRootKey(roots)] = updateReactComponent(child._component);
            } else {
                findRoots(child, roots);
            }
        });
    }

    function updateReactComponent(vNode, parentDom) {
        if (!vNode) {
            return null;
        }
        var newInstance = void 0;

        if (vNode._instance) {
            newInstance = createReactCompositeComponent(vNode);
        } else {
            newInstance = createReactDOMComponent(vNode, parentDom);
        }
        var oldInstance = getInstanceFromVNode(vNode);

        if (oldInstance) {
            for (var key in newInstance) {
                oldInstance[key] = newInstance[key];
            }

            return oldInstance;
        }
        createInstanceFromVNode(vNode, newInstance);
        return newInstance;
    }

    function normalizeChildren(children, dom) {
        return children.map(function (child) {
            return updateReactComponent(child, dom);
        });
    }

    function createReactDOMComponent(vNode, parentDom) {
        var type = vNode.type;

        if (type === '#comment') {
            return null;
        }
        var props = vNode.props;
        var dom = vNode.dom;
        var isText = type === '#text';

        return {
            _currentElement: isText ? vnode.text : {
                type: type,
                props: props
            },
            _inDevTools: false,
            _renderedChildren: !isText && normalizeChildren(props.children, dom),
            _stringText: isText ? vnode.text + '' : null,
            node: dom || parentDom,
            vNode: vNode
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
        var type = vNode.type;
        var instance = instance._instance;
        var dom = vNode.dom;

        return {
            getName: function getName() {
                return typeName(type);
            },

            _currentElement: {
                type: type,
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
            vNode: vNode
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
            component._renderedChildren.forEach(function (child) {
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
        var bridge = createDevToolsBridge();
        var nextAfterMount = options.afterMount;

        options.afterMount = function (vNode) {
            bridge.componentAdded(vNode);
            if (nextAfterMount) {
                nextAfterMount(vNode);
            }
        };

        var nextAfterUpdate = options.afterUpdate;

        options.afterUpdate = function (vNode) {
            bridge.componentUpdated(vNode);
            if (nextAfterUpdate) {
                nextAfterUpdate(vNode);
            }
        };
        var nextBeforeUnmount = options.beforeUnmount;

        options.beforeUnmount = function (vNode) {
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
        initDevTools();
    } else {
        window.addEventListener(document, 'DOMContentLoaded', function () {
            initDevTools();
        });
    }

    return initDevTools;

}));