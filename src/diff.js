import { options, innerHTML,noop, inherit, toLowerCase, emptyArray, toArray, deprecatedWarn } from "./util";
import { createElement as createDOMElement, emptyElement, insertElement } from "./browser";
import { disposeVnode, disposeChildren, topVnodes, topNodes } from "./dispose";
import { createVnode, fiberizeChildren, createElement } from "./createElement";
import { CompositeUpdater, getContextByTypes } from "./CompositeUpdater";
import { Component } from "./Component";

import { DOMUpdater } from "./DOMUpdater";
import { drainQueue } from "./scheduler";
import { Refs } from "./Refs";
import { captureError } from "./ErrorBoundary";

//[Top API] React.isValidElement
export function isValidElement(vnode) {
    return vnode && vnode.vtype;
}

//[Top API] ReactDOM.render
export function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
//[Top API] ReactDOM.unstable_renderSubtreeIntoContainer
export function unstable_renderSubtreeIntoContainer(lastVnode, nextVnode, container, callback) {
    deprecatedWarn("unstable_renderSubtreeIntoContainer");
    var parentContext = (lastVnode && lastVnode.context) || {};
    return renderByAnu(nextVnode, container, callback, parentContext);
}
//[Top API] ReactDOM.unmountComponentAtNode
export function unmountComponentAtNode(container) {
    let nodeIndex = topNodes.indexOf(container);
    if (nodeIndex > -1) {
        var lastVnode = topVnodes[nodeIndex];
        var queue = [];
        disposeVnode(lastVnode, queue);
        drainQueue(queue);
        emptyElement(container);
        container.__component = null;
    }
}
//[Top API] ReactDOM.findDOMNode
export function findDOMNode(ref) {
    if (ref == null) {
        //如果是null
        return null;
    }
    if (ref.nodeType) {
        //如果本身是元素节
        return ref;
    }
    //实例必然拥有updater与render
    if (ref.render) {
        //如果是组件实例
        return findDOMNode(ref.updater.vnode);
    }
    var vnode = ref.stateNode; //如果是虚拟DOM或组件实例
    if (vnode.nodeType) {
        return vnode.nodeType === 8 ? null : vnode;
    } else {
        return findDOMNode(ref.child);
    }
}

var AnuWrapper = function() {
    Component.call(this);
};
var fn = inherit(AnuWrapper, Component);

fn.render = function() {
    return this.props.child;
};

// ReactDOM.render的内部实现 Host
function renderByAnu(vnode, container, callback, context = {}) {
    if (!(container && container.appendChild)) {
        throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }
    //__component用来标识这个真实DOM是ReactDOM.render的容器，通过它可以取得上一次的虚拟DOM
    // 但是在IE6－8中，文本/注释节点不能通过添加自定义属性来引用虚拟DOM，这时我们额外引进topVnode,
    //topNode来寻找它们。

    let nodeIndex = topNodes.indexOf(container),
        lastWrapper,
        top,
        wrapper,
        updateQueue = [],
        insertQueue = [];
    //updaterQueue是用来装载updater， insertQueue是用来装载插入DOM树的真实DOM
    if (nodeIndex !== -1) {
        lastWrapper = topVnodes[nodeIndex];
        wrapper = lastWrapper.stateNode.updater;
        if (wrapper._hydrating) {
            //如果是在componentDidMount/Update中使用了ReactDOM.render，那么将延迟到此组件的resolve阶段执行
            wrapper._pendingCallbacks.push(renderByAnu.bind(null, vnode, container, callback, context));
            return lastWrapper.child.stateNode;
        }
    } else {
        topNodes.push(container);
        nodeIndex = topNodes.length - 1;
    }
    Refs.currentOwner = null; //防止干扰
    var nextWrapper = createElement(AnuWrapper, { child: vnode });
    // top(contaner) > nextWrapper > vnode
    nextWrapper.isTop = true;
    topVnodes[nodeIndex] = nextWrapper;
    if (lastWrapper) {
        top = nextWrapper.return = lastWrapper.return;
        top.child = nextWrapper;
        receiveVnode(lastWrapper, nextWrapper, context, updateQueue, insertQueue);
    } else {
        top = nextWrapper.return = createVnode(container);
        var topUpdater = new DOMUpdater(top);
        top.child = nextWrapper;
        topUpdater.children = {
            ".0": nextWrapper
        };
        nextWrapper.child = vnode;

        genVnodes(nextWrapper, context, updateQueue, insertQueue); // 这里会从下到上添加updater
    }
    top.updater.init(updateQueue); // 添加最顶层的updater

    container.__component = nextWrapper; //兼容旧的
    wrapper = nextWrapper.stateNode.updater;

    if (callback) {
        wrapper._pendingCallbacks.push(callback.bind(vnode.stateNode));
    }
    drainQueue(updateQueue);
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return vnode.stateNode;
}

function genVnodes(vnode, context, updateQueue, insertQueue) {
    let parentNode = vnode.return.stateNode;
    let nodes = toArray(parentNode.childNodes || emptyArray);
    let lastVnode = null;
    for (var i = 0, dom; (dom = nodes[i++]); ) {
        if (toLowerCase(dom.nodeName) === vnode.type) {
            lastVnode = createVnode(dom);
        } else {
            parentNode.removeChild(dom);
        }
    }
    if (lastVnode) {
        receiveVnode(lastVnode, vnode, context, updateQueue, insertQueue);
    } else {
        mountVnode(vnode, context, updateQueue, insertQueue);
    }
}

//mountVnode只是转换虚拟DOM为真实DOM，不做插入DOM树操作
function mountVnode(vnode, context, updateQueue, insertQueue) {
    options.beforeInsert(vnode);
    if (vnode.vtype === 0 || vnode.vtype === 1) {
        vnode.stateNode = createDOMElement(vnode, vnode.return);
        insertQueue.unshift(vnode.stateNode);
        if (vnode.vtype === 1) {
            let updater = new DOMUpdater(vnode);
            let children = fiberizeChildren(vnode.props.children, updater);
            mountChildren(vnode, children, context, updateQueue, []);
            updater.init(updateQueue);
        }
        insertElement(vnode, insertQueue);
    } else {
        var updater = new CompositeUpdater(vnode, context);
        updater.init(updateQueue, insertQueue);
    }
}

function mountChildren(vnode, children, context, updateQueue, insertQueue) {
    for (var i in children) {
        var child = children[i];
        mountVnode(child, context, updateQueue, insertQueue);
        if (Refs.catchError) {
            break;
        }
    }
}

function updateVnode(lastVnode, nextVnode, context, updateQueue, insertQueue) {
    var dom = (nextVnode.stateNode = lastVnode.stateNode);
    options.beforeUpdate(nextVnode);
    if (lastVnode.vtype < 2) {
        insertElement(nextVnode, insertQueue);
        insertQueue.unshift(dom);
        if (lastVnode.vtype === 0) {
            if (nextVnode.text !== lastVnode.text) {
                dom.nodeValue = nextVnode.text;
            }
        } else {
            if (lastVnode.namespaceURI) {
                nextVnode.namespaceURI = lastVnode.namespaceURI;
            }
            let updater = (nextVnode.updater = lastVnode.updater);
            updater.vnode = nextVnode;
            updater.oldProps = lastVnode.props;
            let lastChildren = updater.children;
            let { props } = nextVnode;
            if (props[innerHTML]) {
                disposeChildren(lastChildren, updateQueue);
            } else {
                var nextChildren = fiberizeChildren(props.children, updater);
                diffChildren(lastChildren, nextChildren, nextVnode, context, updateQueue, []);
            }
            updater.addJob("resolve");
            updateQueue.push(updater);
        }
    } else {
        receiveComponent(lastVnode, nextVnode, context, updateQueue, insertQueue);
    }
}

function receiveComponent(lastVnode, nextVnode, parentContext, updateQueue, insertQueue) {
    // todo:减少数据的接收次数
    let { type, stateNode } = lastVnode,
        updater = stateNode.updater,
        willReceive = lastVnode !== nextVnode,
        nextContext;
    if (!type.contextTypes) {
        nextContext = stateNode.context;
    } else {
        nextContext = getContextByTypes(parentContext, type.contextTypes);
        willReceive = true;
    }
    updater.props = nextVnode.props;
    updater.insertQueue = insertQueue;
    updater.parentContext = parentContext;
    updater.pendingVnode = nextVnode;
    updater.context = nextContext;
    updater.willReceive = willReceive;
    nextVnode.stateNode = stateNode;
    if (!updater._dirty) {
        updater._receiving = true;
        captureError(stateNode, "componentWillReceiveProps", [nextVnode.props, nextContext]);
        delete updater._receiving;
        if (lastVnode.ref !== nextVnode.ref) {
            Refs.fireRef(lastVnode, null);
        }
        updater.hydrate(updateQueue, true);
    }
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function receiveVnode(lastVnode, nextVnode, context, updateQueue, insertQueue) {
    if (isSameNode(lastVnode, nextVnode)) {
        //组件虚拟DOM已经在diffChildren生成并插入DOM树
        updateVnode(lastVnode, nextVnode, context, updateQueue, insertQueue);
    } else {
        disposeVnode(lastVnode, updateQueue);
        mountVnode(nextVnode, context, updateQueue, insertQueue);
    }
}

function diffChildren(lastChildren, nextChildren, parentVnode, parentContext, updateQueue, insertQueue) {
    //这里都是走新的任务列队
    let lastChild,
        nextChild,
        isEmpty = true,
        child;
    //  parentIsElement = parentVnode.vtype === 1;
    for (var i in lastChildren) {
        isEmpty = false;
        child = lastChildren[i];
        if (parentVnode.vtype === 1) {
            //向下找到其第一个元素节点子孙
            var firstChild = parentVnode.stateNode.firstChild;
            if (firstChild) {
                do {
                    if (child.vtype < 2) {
                        break;
                    }
                } while ((child = child.child));
                if (child) {
                    child.stateNode = firstChild;
                }
            }
        }
        break;
    }

    //优化： 只添加
    if (isEmpty) {
        mountChildren(parentVnode, nextChildren, parentContext, updateQueue, insertQueue);
    } else {
        var matchNodes = {},
            matchRefs = [];
        for (let i in lastChildren) {
            nextChild = nextChildren[i];
            lastChild = lastChildren[i];
            if (nextChild && nextChild.type === lastChild.type) {
                matchNodes[i] = lastChild;
                if (lastChild.vtype < 2 && lastChild.ref !== nextChild.ref) {
                    lastChild.order = nextChild.index;
                    matchRefs.push(lastChild);
                }
                continue;
            }
            disposeVnode(lastChild, updateQueue);
        }
        //step2: 更新或新增节点
        matchRefs
            .sort(function(a, b) {
                return a.order - b.order;
            })
            .forEach(function(el) {
                updateQueue.push({
                    exec: Refs.fireRef.bind(null, el, null),
                    isMounted: noop
                });
            });
        for (let i in nextChildren) {
            nextChild = nextChildren[i];
            lastChild = matchNodes[i];
            if (lastChild) {
                receiveVnode(lastChild, nextChild, parentContext, updateQueue, insertQueue);
            } else {
                mountVnode(nextChild, parentContext, updateQueue, insertQueue);
            }

            if (Refs.catchError) {
                return;
            }
        }
    }
}

options.receiveVnode = receiveVnode;
options.diffChildren = diffChildren;
