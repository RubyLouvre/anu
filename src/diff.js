import { options, innerHTML, emptyObject, toLowerCase, emptyArray, toArray, deprecatedWarn } from "./util";
import { createElement as createDOMElement, emptyElement } from "./browser";
import { disposeVnode, disposeChildren, topVnodes, topNodes } from "./dispose";
import { instantiateComponent } from "./instantiateComponent";
import { processFormElement } from "./ControlledComponent";
import { createVnode, fiberizeChildren, createElement } from "./createElement";
import { CompositeUpdater, getContextByTypes } from "./CompositeUpdater";
import { DOMUpdater } from "./DOMUpdater";
import { drainQueue } from "./scheduler";
import { captureError, pushError } from "./error";
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

var AnuWrapper = function() {};
AnuWrapper.prototype.render = function() {
    return this.props.child;
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

        vnode.child = child;
        parent.child = vnode;
        genVnodes(vnode, context, updateQueue);
    }

    container.__component = vnode; //兼容旧的
    drainQueue(updateQueue);
    var rootNode = vnode.child && vnode.child.stateNode;
    if (callback) {
        callback.call(rootNode); //坑
    }
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return rootNode;
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
        //vnode.return.batchMount("genVnodes");
    }
}

//mountVnode只是转换虚拟DOM为真实DOM，不做插入DOM树操作
function mountVnode(vnode, context, updateQueue) {
    options.beforeInsert(vnode);
    if (vnode.vtype === 0 || vnode.vtype === 1) {
        var dom = createDOMElement(vnode, vnode.return);
        vnode.stateNode = dom;
        if (vnode.vtype === 1) {
            let { _hasProps, type, props } = vnode;
            let updater = new DOMUpdater(vnode);
            let children = fiberizeChildren(props.children, updater);
            vnode.selfMount = true;
            mountChildren(vnode, children, context, updateQueue);
            vnode.selfMount = false;
            vnode.batchMount("元素"); //批量插入 dom节点
            if (_hasProps) {
                diffProps(dom, emptyObject, props, vnode);
            }
            if (formElements[type]) {
                processFormElement(vnode, dom, props);
            }
            updateQueue.push(updater);
            //  if (_hasRef) {
            //      pendingRefs.push(vnode, dom);
            //  }
        }
    } else {
        mountComponent(vnode, context, updateQueue);
    }
    return dom;
}

//通过组件虚拟DOM产生组件实例与内部操作实例updater
function mountComponent(vnode, parentContext, updateQueue, parentUpdater) {
    let { type, props } = vnode,
        instance;
    try {
        instance = instantiateComponent(type, vnode, props, parentContext); //互相持有引用
    } catch (e) {
        instance = {
            updateQueue
        };
        new CompositeUpdater(instance, vnode);
        pushError(instance, "constructor", e);
    }
    let updater = instance.updater;
    if (parentUpdater) {
        updater.parentUpdater = parentUpdater;
    }
    updater.parentContext = parentContext;

    if (instance.componentWillMount) {
        instance.updateQueue = updateQueue;
        captureError(instance, "componentWillMount", []);
        instance.state = updater.mergeStates();
    }
    updater._hydrating = true;
    updater.render(updateQueue);
    updateQueue.push(updater);
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

const formElements = {
    select: 1,
    textarea: 1,
    input: 1,
    option: 1
};

function updateVnode(lastVnode, nextVnode, context, updateQueue) {
    var dom = (nextVnode.stateNode = lastVnode.stateNode);
    options.beforeUpdate(nextVnode);

    if (lastVnode.vtype === 0) {
        if (nextVnode.text !== lastVnode.text) {
            dom.nodeValue = nextVnode.text;
        }
    } else if (lastVnode.vtype === 1) {
        let updater = (nextVnode.updater = lastVnode.updater);
        nextVnode.updater.update(nextVnode);
        let lastChildren = updater.children;
        let { props: lastProps, stateNode: dom, _hasProps, type } = lastVnode;
        let { props: nextProps, _hasProps: nextCheckProps } = nextVnode;

        if (nextProps[innerHTML]) {
            disposeChildren(lastChildren, updateQueue);
        } else {
            diffChildren(lastChildren, fiberizeChildren(nextProps.children, updater), nextVnode, context, updateQueue);
        }
        if (_hasProps || nextCheckProps) {
            diffProps(dom, lastProps, nextProps, nextVnode);
        }
        if (formElements[type]) {
            processFormElement(nextVnode, dom, nextProps);
        }
        updateQueue.push(updater);
        //  disposeVnode(lastVnode, updateQueue);
        //  Refs.detachRef(lastVnode, nextVnode, dom);
    } else {
        dom = receiveComponent(lastVnode, nextVnode, context, updateQueue);
    }
    return dom;
}

function receiveComponent(lastVnode, nextVnode, parentContext, updateQueue) {
    // todo:减少数据的接收次数
    let { type, stateNode } = lastVnode,
        updater = stateNode.updater,
        //如果正在更新过程中接受新属性，那么去掉update,加上receive
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
    let parentVElement = parentVnode,
        priorityQueue = [],
        lastChild,
        nextChild;
    var isEmpty = true,
        child;
    for (var i in lastChildren) {
        isEmpty = false;
        child = lastChildren[i];
        break;
    }
    if (parentVnode.vtype === 1) {
        //向下找到其第一个元素节点子孙
        var firstChild = parentVnode.stateNode.firstChild;

        if (firstChild && child) {
            do {
                if (child.vtype < 2) {
                    break;
                }
            } while ((child = child.child));
            if (child) {
                child.stateNode = firstChild;
            }
        }
    } else {
        //向上找到其第一个元素节点祖先
        do {
            if (parentVElement.vtype === 1) {
                break;
            }
        } while ((parentVElement = parentVElement.return));
    }

    //优化： 只添加
    if (isEmpty) {
        mountChildren(parentVnode, nextChildren, parentContext, updateQueue);
        if (!parentVElement.selfMount) {
            parentVElement.batchMount("只添加");
        }
        return;
    }
    if (!parentVElement.updateMeta) {
        var lastChilds = mergeNodes(lastChildren);
        parentVElement.childNodes.length = 0; //清空数组，以方便收集节点
        parentVElement.updateMeta = {
            parentVnode,
            parentVElement,
            lastChilds
        };
    }
   
    //step1: 匹配节点，移除节点
    var matchNodes = {};

    for (let i in lastChildren) {
        nextChild = nextChildren[i];
        lastChild = lastChildren[i];
        if (nextChild && nextChild.type === lastChild.type) {
            matchNodes[i] = lastChild;
            continue;
        }
        disposeVnode(lastChild, priorityQueue);
    }
    //step2: 更新或新增节点
    for (let i in nextChildren) {
        nextChild = nextChildren[i];

        if (!matchNodes[i]) {
            mountVnode(nextChild, parentContext, priorityQueue);
        }else{

            alignVnode(matchNodes[i], nextChild, parentContext, priorityQueue);
        }
        if (Refs.catchError) {
            parentVElement.updateMeta = null;
            return;
        }
    }
    drainQueue(priorityQueue);
    //step3: 更新真实DOM
    if (parentVElement.updateMeta && parentVElement.updateMeta.parentVnode == parentVnode) {
        parentVnode.batchUpdate(parentVElement.updateMeta, mergeNodes(nextChildren));
    }
}

function mergeNodes(children) {
    var nodes = [];
    for (var i in children) {
        var el = children[i];
        if (!el._disposed) {
            if (el.stateNode && el.stateNode.nodeType) {
                nodes.push(el.stateNode);
            } else {
                nodes.push.apply(nodes, el.collectNodes());
            }
        }
    }
    return nodes;
}

options.alignVnode = alignVnode;
options.diffChildren = diffChildren;
