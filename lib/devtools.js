(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? (module.exports = factory())
        : typeof define === "function" && define.amd
            ? define(factory)
            : (global.DevTools = factory());
})(this, function() {
    var options = React.options || {};
    var roots = {};
    options.roots = roots;
    function findVNodeFromDOM(vnode, dom) {
        if (!vnode) {
            for (var i in roots) {
                var root = roots[i];
                var result = findVNodeFromDOM(root, dom);
                if (result) {
                    return result;
                }
            }
        } else {
            if (vnode.node === dom) {
                //如果是原子虚拟DOM，直接比较 _hostNode === dom
                return vnode;
            }

            var children = vnode._renderedChildren;

            if (children) {
                for (var _i = 0; _i < children.length; _i++) {
                    var child = children[_i];

                    if (child) {
                        var _result = findVNodeFromDOM(child, dom);
                        if (_result) {
                            return _result;
                        }
                    }
                }
            }
        }
    }

    function normalizeChildren(vnode, dom) {
        var ret = [];
        for (var a = vnode.child; a; a = a.sibling) {
            ret.push(updateReactComponent(a, dom));
        }
        return ret;
    }

    //===================================      用于根据一个虚拟DOM找到它的组件实例
    var instanceMap = new Map();

    function getKeyForVNode(vnode) {
        return vnode.stateNode 
    }

    function getInstanceFromVNode(vnode) {
        var key = getKeyForVNode(vnode);

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
        var ComponentTree = {
            getNodeFromInstance: function getNodeFromInstance(instance) {
                //createReactDOMComponent生成的实例有vnode对象
                return instance.node;
            },
            getClosestInstanceFromNode: function getClosestInstanceFromNode(dom) {
                var vnode = findVNodeFromDOM(null, dom);
                //转换为ReactCompositeComponent或ReactDOMComponent
                return vnode ? updateReactComponent(vnode, null) : null;
            }
        };
        
        // Map of root ID (the ID is unimportant) to component instance.
        //会根据vnode创建实例，并保存在instanceMap与roots中
        if(document.readyState === "complete"){
            findRoots(document.body, roots);
        }else{
            var id = setInterval(function(){
                if(document.readyState === "complete"){
                    clearInterval(id);
                    findRoots(document.body, roots);
                }
            }, 100);
        }
        

        var Mount = {
            _instancesByReactRootID: roots,
            // tslint:disable-next-line:no-empty
            _renderNewRootComponent: function _renderNewRootComponent() {}
        };

        var Reconciler = {
            // tslint:disable-next-line:no-empty
            mountComponent: function mountComponent() {},

            // tslint:disable-next-line:no-empty
            performUpdateIfNecessary: function performUpdateIfNecessary() {},

            // tslint:disable-next-line:no-empty
            receiveComponent: function receiveComponent() {},

            // tslint:disable-next-line:no-empty
            unmountComponent: function unmountComponent() {}
        };

        //============

        var queuedMountComponents = new Map();
        var queuedReceiveComponents = new Map();
        var queuedUnmountComponents = new Map();

        var queueUpdate = function queueUpdate(updater, map, component) {
            if (!map.has(component)) {
                map.set(component, true);
                requestAnimationFrame(function() {
                    updater(component);
                    map.delete(component);
                });
            }
        };

        var queueMountComponent = function queueMountComponent(component) {
            return queueUpdate(
                Reconciler.mountComponent,
                queuedMountComponents,
                component
            );
        };
        var queueReceiveComponent = function queueReceiveComponent(component) {
            return queueUpdate(
                Reconciler.receiveComponent,
                queuedReceiveComponents,
                component
            );
        };
        var queueUnmountComponent = function queueUnmountComponent(component) {
            return queueUpdate(
                Reconciler.unmountComponent,
                queuedUnmountComponents,
                component
            );
        };

        // 创建 componentAdded， componentUpdated，componentRemoved三个重要钩子
        var componentAdded = function componentAdded(vnode) {
            var instance = updateReactComponent(vnode);
            //将_currentElement代替为ReactCompositeComponent实例
            if (isRootVNode(vnode)) {
                instance._rootID = nextRootKey(roots);
                roots[instance._rootID] = instance;
                Mount._renderNewRootComponent(instance);
            }
            //遍历非实组件的孩子
            visitNonCompositeChildren(instance, function(childInst) {
                if (childInst) {
                    childInst._inDevTools = true;
                    queueMountComponent(childInst);
                }
            });
            queueMountComponent(instance);
        };

        var componentUpdated = function componentUpdated(vnode) {
            var prevRenderedChildren = [];

            //通过anujs instance得到 ReactCompositeComponent实例
            visitNonCompositeChildren(instanceMap.get(vnode), function(
                childInst
            ) {
                prevRenderedChildren.push(childInst);
            });

            var instance = updateReactComponent(vnode);
            queueReceiveComponent(instance);
            visitNonCompositeChildren(instance, function(childInst) {
                if (!childInst._inDevTools) {
                    // New DOM child component
                    childInst._inDevTools = true;
                    queueMountComponent(childInst);
                } else {
                    // Updated DOM child component
                    queueReceiveComponent(childInst);
                }
            });

            prevRenderedChildren.forEach(function(childInst) {
                if (!document.body.contains(childInst.node)) {
                    instanceMap.delete(childInst.node);
                    queueUnmountComponent(childInst);
                }
            });
        };

        var componentRemoved = function componentRemoved(vnode) {
            var instance = updateReactComponent(vnode);

            visitNonCompositeChildren(instance, function(childInst) {
                instanceMap.delete(childInst.node);
                queueUnmountComponent(childInst);
            });
            queueUnmountComponent(instance);
            instanceMap.delete(vnode);
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
    function isRootVNode(vnode) {
        if(vnode.isTop){
            return vnode;
        }
        // TODO 判断是否为根节点的方法和 preact 流程不一样，这里有可能有问题
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
        Array.from(node.childNodes || []).forEach(function(child) {
            var vnode = child.__component || child._reactInternalFiber;
            if (vnode) {
                roots[nextRootKey(roots)] = updateReactComponent(vnode);
            } else {
                findRoots(child, roots);
            }
        });
    }

    function updateReactComponent(vnode, parentDom) {
        if (!vnode) {
            return null;
        }
        var newInstance;

        if (vnode.tag < 3) {
            newInstance = createReactCompositeComponent(vnode);
        } else {
            newInstance = createReactDOMComponent(vnode, parentDom);
        }

        var oldInstance = getInstanceFromVNode(vnode);

        if (oldInstance) {
            Object.assign(oldInstance, newInstance);
            return oldInstance;
        }
        var key = getKeyForVNode(vnode);
        if (key) {
            instanceMap.set(key, newInstance);
        }
        //将它存入instanceMap中
        return newInstance;
    }

    function createReactDOMComponent(vnode, parentDom) {
        var type = vnode.type;

        if (
            type === "#comment" ||
      vnode === null ||
      vnode == undefined ||
      vnode === true ||
      vnode === false
        ) {
            return null;
        }
        var props = vnode.props;
        var dom = vnode.stateNode;

        var isText = typeof vnode !== "object" || type === "#text";

        return {
            _currentElement: isText
                ? vnode.text + ""
                : {
                    type: type,
                    props: props
                },
            _inDevTools: false,
            _renderedChildren: !isText && normalizeChildren(vnode, dom),
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
        var instance = vnode.stateNode 
        var dom = React.findDOMNode(instance);
        return {
            getName: function getName() {
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
            // _renderedComponent: updateReactComponent(instance.updater.rendered, dom),
            _renderedComponent: updateReactComponent(vnode.child, dom),
            forceUpdate: instance.forceUpdate && instance.forceUpdate.bind(instance),
            setState: instance.setState && instance.setState.bind(instance)
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

    /**
 * Visit all child instances of a ReactCompositeComponent-like object that are
 * not composite components (ie. they represent DOM elements or text)
 */
    function visitNonCompositeChildren(instance, callback) {
        if(!instance) {
            return;
        }
        if (instance._renderedComponent) {
            callback(instance._renderedComponent);
            visitNonCompositeChildren(instance._renderedComponent, callback);
        } else if (instance._renderedChildren) {
            instance._renderedChildren.forEach(function(child) {
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
        var bridge = createDevToolsBridge();
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
                    var updater = instance.updater;//1.2.8
                    var vnode = updater._reactInternalFiber;
                    bridge[alias](vnode);
                    if (oldMethod) {
                        oldMethod(vnode);
                    }
                };
            })(name, Methods[name]);
        }

        window["__REACT_DEVTOOLS_GLOBAL_HOOK__"].inject(bridge);
    }


    initDevTools();
});
