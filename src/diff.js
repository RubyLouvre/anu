import { options, innerHTML, noop, inherit, extend, deprecatedWarn } from "./util";
import { emptyElement, insertElement } from "./browser";
import { disposeVnode, disposeChildren, topFibers, topNodes } from "./dispose";
import { createVnode, fiberizeChildren, createElement } from "./createElement";
import { ComponentFiber, getContextProvider, getDerivedStateFromProps, getMaskedContext } from "./ComponentFiber";
import { Component } from "./Component";
import { HostFiber } from "./HostFiber";
import { drainQueue } from "./scheduler";
import { Refs } from "./Refs";
import { captureError, pushError } from "./ErrorBoundary";

//[Top API] React.isValidElement
export function isValidElement(vnode) {
    return vnode && vnode.tag > 0 && vnode.tag !== 6;
}

//[Top API] ReactDOM.render
export function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
//[Top API] ReactDOM.unstable_renderSubtreeIntoContainer
export function unstable_renderSubtreeIntoContainer(instance, vnode, container, callback) {
    deprecatedWarn("unstable_renderSubtreeIntoContainer");
    let updater = instance && instance.updater;
    let parentContext = updater ? updater._unmaskedContext : {};
    return renderByAnu(vnode, container, callback, parentContext);
}
//[Top API] ReactDOM.unmountComponentAtNode
export function unmountComponentAtNode(container) {
    let rootIndex = topNodes.indexOf(container);
    if (rootIndex > -1) {
        let lastFiber = topFibers[rootIndex];
        let queue = [];
        disposeVnode(lastFiber, queue);
        drainQueue(queue);
        emptyElement(container);
        container.__component = null;
        return true;
    }
    return false;
}
//[Top API] ReactDOM.findDOMNode
export function findDOMNode(instanceOrElement) {
    if (instanceOrElement == null) {
        //如果是null
        return null;
    }
    if (instanceOrElement.nodeType) {
        //如果本身是元素节点
        return instanceOrElement;
    }
    //实例必然拥有updater与render
    if (instanceOrElement.render) {
        let fiber = instanceOrElement.updater;
        let c = fiber.child;
        if (c) {
            return findDOMNode(c.stateNode);
        } else {
            return null;
        }
    }
}

let AnuInternalFiber = function () {
    Component.call(this);
};
AnuInternalFiber.displayName = "AnuInternalFiber"; //fix IE6-8函数没有name属性
let fn = inherit(AnuInternalFiber, Component);

fn.render = function () {
    return this.props.child;
};
// ReactDOM.render的内部实现 Host
function renderByAnu(vnode, root, callback, context = {}) {
    if (!(root && root.appendChild)) {
        throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }
    //__component用来标识这个真实DOM是ReactDOM.render的容器，通过它可以取得上一次的虚拟DOM
    // 但是在IE6－8中，文本/注释节点不能通过添加自定义属性来引用虚拟DOM，这时我们额外引进topFibers,
    //topNodes来寻找它们。
    Refs.currentOwner = null; //防止干扰
    let rootIndex = topNodes.indexOf(root),
        wrapperFiber,
        updateQueue = [],
        mountCarrier = {},
        wrapperVnode = createElement(AnuInternalFiber, { child: vnode });

    if (rootIndex !== -1) {
        wrapperFiber = topFibers[rootIndex];
        if (wrapperFiber._hydrating) {
            //如果是在componentDidMount/Update中使用了ReactDOM.render，那么将延迟到此组件的resolve阶段执行
            wrapperFiber._pendingCallbacks.push(renderByAnu.bind(null, vnode, root, callback, context));
            return wrapperFiber.child.stateNode; //这里要改
        }
        //updaterQueue是用来装载fiber， mountCarrier是用来确保节点插入正确的位置
        wrapperFiber = receiveVnode(wrapperFiber, wrapperVnode, updateQueue, mountCarrier);
    } else {
        emptyElement(root);
        topNodes.push(root);
        rootIndex = topNodes.length - 1;
        let rootFiber = new HostFiber(createVnode(root));
        rootFiber.stateNode = root;
        rootFiber._unmaskedContext = context;
        let children = (rootFiber._children = {
            ".0": wrapperVnode
        });
        mountChildren(children, rootFiber, updateQueue, mountCarrier);
        wrapperFiber = rootFiber.child;
    }
    topFibers[rootIndex] = wrapperFiber;
    root.__component = wrapperFiber; //compat!
    if (callback) {
        wrapperFiber._pendingCallbacks.push(callback.bind(wrapperFiber.child.stateNode));
    }

    drainQueue(updateQueue);
    //组件虚拟DOM返回组件实例，而元素虚拟DOM返回元素节点
    return wrapperFiber.child ? wrapperFiber.child.stateNode : null;
}

/**
 * 
 * @param {Vnode} vnode 
 * @param {Fiber} parentFiber 
 * @param {Array} updateQueue 
 * @param {Object} mountCarrier 
 */
function mountVnode(vnode, parentFiber, updateQueue, mountCarrier) {
    options.beforeInsert(vnode);
    let useHostFiber = vnode.tag > 4;
    let fiberCtor = useHostFiber ? HostFiber : ComponentFiber;
    let fiber = new fiberCtor(vnode, parentFiber);
    if (vnode._return) {
        let p = (fiber._return = vnode._return);
        p.child = fiber;
    }
    fiber.init(
        updateQueue,
        mountCarrier,

        function (f) {
            let children = fiberizeChildren(f.props.children, f);
            mountChildren(children, f, updateQueue, {});
        }

    );
    return fiber;
}
/**
 * 重写children对象中的vnode为fiber，并用child, sibling, return关联各个fiber
 * @param {Object} children 
 * @param {Fiber} parentFiber 
 * @param {Array} updateQueue 
 * @param {Object} mountCarrier 
 */
function mountChildren(children, parentFiber, updateQueue, mountCarrier) {
    let prevFiber;
    for (let i in children) {
        let fiber = (children[i] = mountVnode(children[i], parentFiber, updateQueue, mountCarrier));
        if (prevFiber) {
            prevFiber.sibling = fiber;
        } else {
            parentFiber.child = fiber;
        }
        prevFiber = fiber;
        if (Refs.errorHook) {
            break;
        }
    }

}

function updateVnode(fiber, vnode, updateQueue, mountCarrier) {
    let dom = fiber.stateNode;
    options.beforeUpdate(vnode);
    if (fiber.tag > 4) {
        //文本，元素
        insertElement(fiber, mountCarrier.dom);
        mountCarrier.dom = dom;

        if (fiber.tag === 6) {
            //文本
            if (vnode.text !== fiber.text) {
                dom.nodeValue = fiber.text = vnode.text;
            }
        } else {
            //元素
            fiber._reactInternalFiber = vnode;
            fiber.lastProps = fiber.props;
            let props = (fiber.props = vnode.props);
            let fibers = fiber._children;
            if (props[innerHTML]) {
                disposeChildren(fibers, updateQueue);
            } else {
                let children = fiberizeChildren(props.children, fiber);
                diffChildren(fibers, children, fiber, updateQueue, {});
            }
            fiber.attr();
            fiber.addState("resolve");
            updateQueue.push(fiber);
        }
    } else {
        receiveComponent(fiber, vnode, updateQueue, mountCarrier);
    }
}

function receiveComponent(fiber, nextVnode, updateQueue, mountCarrier) {
    // todo:减少数据的接收次数
    let { type, stateNode } = fiber,
        nextProps = nextVnode.props,
        nextContext,
        willReceive = fiber._reactInternalFiber !== nextVnode;
    if (type.contextTypes) {
        nextContext = fiber.context = getMaskedContext(getContextProvider(fiber.return), type.contextTypes);
        willReceive = true;
    } else {
        nextContext = stateNode.context;
    }
    fiber._willReceive = willReceive;
    fiber._mountPoint = fiber._return ? null : mountCarrier.dom;
    fiber._mountCarrier = fiber._return ? {} : mountCarrier;
    //  fiber._mountCarrier.dom = fiber._mountPoint;
    let lastVnode = fiber._reactInternalFiber;
    fiber._reactInternalFiber = nextVnode;
    fiber.props = nextProps;

    if (!fiber._dirty) {
        fiber._receiving = true;
        if (willReceive) {
            captureError(stateNode, "componentWillReceiveProps", [nextProps, nextContext]);
        }
        if (lastVnode.props !== nextProps) {
            try {
                getDerivedStateFromProps(fiber, type, nextProps, stateNode.state);
            } catch (e) {
                pushError(stateNode, "getDerivedStateFromProps", e);
            }
        }
        delete fiber._receiving;
        if (fiber._hasError) {
            return;
        }

        if (lastVnode.ref !== nextVnode.ref) {
            Refs.fireRef(fiber, null, lastVnode);
        } else {
            delete nextVnode.ref;
        }

        fiber.hydrate(updateQueue, true);
    }
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function receiveVnode(fiber, vnode, updateQueue, mountCarrier) {
    if (isSameNode(fiber, vnode)) {
        updateVnode(fiber, vnode, updateQueue, mountCarrier);
    } else {
        disposeVnode(fiber, updateQueue);
        fiber = mountVnode(vnode, fiber.return, updateQueue, mountCarrier);
    }
    return fiber;
}
// https://github.com/onmyway133/DeepDiff
function diffChildren(fibers, children, parentFiber, updateQueue, mountCarrier) {
    //这里都是走新的任务列队
    let fiber,
        vnode,
        child,
        firstChild,
        isEmpty = true;
    if (parentFiber.tag === 5) {
        firstChild = parentFiber.stateNode.firstChild;
    }
    for (let i in fibers) {
        isEmpty = false;
        child = fibers[i];
        //向下找到其第一个元素节点子孙
        if (firstChild) {
            do {
                if (child._return) {
                    break;
                }
                if (child.tag > 4) {
                    child.stateNode = firstChild;
                    break;
                }
            } while ((child = child.child));
        }
        break;
    }
    //优化： 只添加
    if (isEmpty) {
        mountChildren(children, parentFiber, updateQueue, mountCarrier);
    } else {
        let matchFibers = {},
            matchFibersWithRef = [];
        for (let i in fibers) {
            vnode = children[i];
            fiber = fibers[i];
            if (vnode && vnode.type === fiber.type) {
                matchFibers[i] = fiber;
                if (vnode.key != null) {
                    fiber.key = vnode.key;
                }
                if (fiber.tag === 5 && fiber.ref !== vnode.ref) {
                    matchFibersWithRef.push({
                        index: vnode.index,
                        transition: Refs.fireRef.bind(null, fiber, null, fiber._reactInternalFiber),
                        _isMounted: noop
                    });
                }
                continue;
            }
            disposeVnode(fiber, updateQueue);
        }
        //step2: 更新或新增节点
        matchFibersWithRef
            .sort(function (a, b) {
                return a.index - b.index; //原来叫order
            })
            .forEach(function (fiber) {
                updateQueue.push(fiber);
            });
        let prevFiber,
            index = 0;

        for (let i in children) {
            vnode = children[i];
            fiber = children[i] = matchFibers[i]
                ? receiveVnode(matchFibers[i], vnode, updateQueue, mountCarrier)
                : mountVnode(vnode, parentFiber, updateQueue, mountCarrier);
            fiber.index = index++;
            if (prevFiber) {
                prevFiber.sibling = fiber;
            } else {
                parentFiber.child = fiber;
            }
            prevFiber = fiber;
            if (Refs.errorHook) {
                return;
            }
        }
        if (prevFiber) {
            delete prevFiber.sibling;
        }
    }

}
Refs.diffChildren = diffChildren;
