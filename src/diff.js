import { options, innerHTML, collectNodes, toLowerCase, emptyArray, toArray, deprecatedWarn } from "./util";
import { createElement as createDOMElement, emptyElement } from "./browser";
import { disposeVnode, disposeChildren, topVnodes, topNodes } from "./dispose";
import { processFormElement, formElements } from "./ControlledComponent";
import { createVnode, fiberizeChildren, createElement } from "./createElement";
import { CompositeUpdater, getContextByTypes } from "./CompositeUpdater";
import { DOMUpdater } from "./DOMUpdater";
import { drainQueue } from "./scheduler";
import { Refs } from "./Refs";
import { diffProps } from "./diffProps";

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
var AnuWrapper = function() {},
    fn = AnuWrapper.prototype, 
    AnuInstance,AnuCb;
fn.render = function() {
    return this.props.child;
};
fn.componentDidMount = function() {
    if (AnuCb) {
        AnuCb.call(AnuInstance);
    }
};

// ReactDOM.render的内部实现
function renderByAnu(vnode, container, callback, context = {}) {
    if (!isValidElement(vnode)) {
        throw `ReactDOM.render的第一个参数错误`; // eslint-disable-line
    }
    if (!(container && container.appendChild)) {
        throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }

    //__component用来标识这个真实DOM是ReactDOM.render的容器，通过它可以取得上一次的虚拟DOM
    // 但是在IE6－8中，文本/注释节点不能通过添加自定义属性来引用虚拟DOM，这时我们额外引进topVnode,
    //topNode来寻找它们。

    let nodeIndex = topNodes.indexOf(container),
        lastVnode,
        updateQueue = [];
    if (nodeIndex !== -1) {
        lastVnode = topVnodes[nodeIndex];
    } else {
        topNodes.push(container);
        nodeIndex = topNodes.length - 1;
    }
    Refs.currentOwner = null; //防止干扰
    var child = vnode;
    vnode = createElement(AnuWrapper, { child });

    vnode.isTop = true;
    topVnodes[nodeIndex] = vnode;

    if (lastVnode) {
        vnode.return = lastVnode.return;
        alignVnode(lastVnode, vnode, context, updateQueue);
    } else {
        var parent = (vnode.return = createVnode(container));
        var updater = new DOMUpdater(parent);
        vnode.child = child;
        parent.child = vnode;
        genVnodes(vnode, context, updateQueue);
        updateQueue.push(updater);
    }

    container.__component = vnode; //兼容旧的
    AnuCb = callback;
    drainQueue(updateQueue);
    AnuInstance = vnode.child.stateNode;
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return AnuInstance;
}

function genVnodes(vnode, context, updateQueue) {
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
        alignVnode(lastVnode, vnode, context, updateQueue);
    } else {
        mountVnode(vnode, context, updateQueue);
    }
}

//mountVnode只是转换虚拟DOM为真实DOM，不做插入DOM树操作
function mountVnode(vnode, context, updateQueue) {
    options.beforeInsert(vnode);
    if (vnode.vtype === 0 || vnode.vtype === 1) {
        var dom = createDOMElement(vnode, vnode.return);
        vnode.stateNode = dom;
        if (vnode.vtype === 1) {
            let updater = new DOMUpdater(vnode);
            let children = fiberizeChildren(vnode.props.children, updater);
            updater.mouting = true;
            mountChildren(vnode, children, context, updateQueue);
            updater.init(updateQueue);
        }
    } else {
        var updater = new CompositeUpdater(vnode, context);
        updater.init(updateQueue);
    }

    return dom;
}

function mountChildren(vnode, children, context, updateQueue) {
    for (var i in children) {
        var child = children[i];
        mountVnode(child, context, updateQueue);
        if (Refs.catchError) {
            break;
        }
    }
}

function updateVnode(lastVnode, nextVnode, context, updateQueue) {
    var dom = (nextVnode.stateNode = lastVnode.stateNode);
    options.beforeUpdate(nextVnode);

    if (lastVnode.vtype === 0) {
        if (nextVnode.text !== lastVnode.text) {
            dom.nodeValue = nextVnode.text;
        }
    } else if (lastVnode.vtype === 1) {
        let updater = (nextVnode.updater = lastVnode.updater);
        updater.vnode = nextVnode;
        if (lastVnode.namespaceURI) {
            nextVnode.namespaceURI = lastVnode.namespaceURI;
        }
        let lastChildren = updater.children;
        let { props } = nextVnode;
        if (props[innerHTML]) {
            disposeChildren(lastChildren, updateQueue);
        } else {
            var nextChildren = fiberizeChildren(props.children, updater);
            diffChildren(lastChildren, nextChildren, nextVnode, context, updateQueue);
        }
        updater.oldProps = lastVnode.props;
        if (lastVnode.ref !== nextVnode.ref) {
            Refs.detachRef(lastVnode);
        }
        updater.addJob("resolve");
        updateQueue.push(updater);
    } else {
        dom = receiveComponent(lastVnode, nextVnode, context, updateQueue);
    }
    return dom;
}

function receiveComponent(lastVnode, nextVnode, parentContext, updateQueue) {
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
    updater.context = nextContext;
    //parentContext在官方中被称之不nextUnmaskedContext， parentVnode称之为nextParentElement
    updater.props = nextVnode.props;
    updater.parentContext = parentContext;
    updater.pendingVnode = nextVnode;
    updater.willReceive = willReceive;
    nextVnode.child = nextVnode.child || lastVnode.child;
    if (!updater._dirty) {
        //如果在事件中使用了setState
        updater._receiving = [lastVnode, nextVnode, nextContext];
        updater.addJob("hydrate");
        updateQueue.push(updater);
    }
    return updater.stateNode;
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function alignVnode(lastVnode, nextVnode, context, updateQueue) {
    if (isSameNode(lastVnode, nextVnode)) {
        //组件虚拟DOM已经在diffChildren生成并插入DOM树
        updateVnode(lastVnode, nextVnode, context, updateQueue);
    } else {
        disposeVnode(lastVnode, updateQueue);
        mountVnode(nextVnode, context, updateQueue);
    }

    return nextVnode.stateNode;
}

function diffChildren(lastChildren, nextChildren, parentVnode, parentContext, updateQueue) {
    //这里都是走新的任务列队
    let lastChild,
        nextChild,
        isEmpty = true,
        child;
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
    var p = parentVnode;
    do {
        if (p.vtype === 1) {
            break;
        }
    } while ((p = p.return));
    var lastNodes = collectNodes(lastChildren);
    //优化： 只添加
    if (isEmpty) {
        mountChildren(parentVnode, nextChildren, parentContext, updateQueue);
    } else {
        var matchNodes = {};
        for (let i in lastChildren) {
            nextChild = nextChildren[i];
            lastChild = lastChildren[i];
            if (nextChild && nextChild.type === lastChild.type) {
                matchNodes[i] = lastChild;
                continue;
            }
            disposeVnode(lastChild, updateQueue);
        }
        //step2: 更新或新增节点
        for (let i in nextChildren) {
            nextChild = nextChildren[i];
            lastChild = matchNodes[i];
            if (lastChild) {
                alignVnode(lastChild, nextChild, parentContext, updateQueue);
            } else {
                mountVnode(nextChild, parentContext, updateQueue);
            }
            if (Refs.catchError) {
                return;
            }
        }
    }

    var nextNodes = collectNodes(nextChildren);
    p.updater.batchUpdate(lastNodes, nextNodes);
}

options.alignVnode = alignVnode;
options.diffChildren = diffChildren;
