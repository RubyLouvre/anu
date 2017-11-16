import { options, innerHTML, emptyObject, toLowerCase, emptyArray, toArray, deprecatedWarn } from "./util";
import { createElement as createDOMElement, emptyElement, removeElement } from "./browser";
import { disposeVnode, disposeChildren, topVnodes, topNodes } from "./dispose";
import { instantiateComponent } from "./instantiateComponent";
import { processFormElement } from "./ControlledComponent";
import { createVnode, restoreChildren, fiberizeChildren, createElement } from "./createElement";
import { getContextByTypes } from "./updater";
import { drainQueue } from "./scheduler";
import { captureError } from "./error";
import { Refs, pendingRefs } from "./Refs";
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
        disposeVnode(lastVnode);
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
    if (ref.updater) {
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
    if (!(container && container.getElementsByTagName)) {
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
    vnode = createElement(AnuWrapper, {
        child: child
    });
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
 
    var rootNode = vnode.child.stateNode;
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
        vnode.return.batchMount("genVnodes");
    }
}

//mountVnode只是转换虚拟DOM为真实DOM，不做插入DOM树操作
function mountVnode(vnode, context, updateQueue) {
    options.beforeInsert(vnode);
    if (vnode.vtype === 0 || vnode.vtype === 1) {
        var dom = createDOMElement(vnode, vnode.return);
        vnode.stateNode = dom;
        if (vnode.vtype === 1) {
            let { _hasRef, _hasProps, type, props } = vnode;
            let children = fiberizeChildren(vnode);
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
            if (_hasRef) {
                pendingRefs.push(vnode, dom);
            }
        }
    } else {
        mountComponent(vnode, context, updateQueue);
    }
    return dom;
}

//通过组件虚拟DOM产生组件实例与内部操作实例updater
function mountComponent(vnode, parentContext, updateQueue, parentUpdater) {
    let { type, props } = vnode;
    let instance = instantiateComponent(type, vnode, props, parentContext); //互相持有引用
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
    var child = children[0];
    if (child) {
        vnode.child = child; 
        children.forEach(function(c){
            mountVnode(c, context, updateQueue);
        });
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
        nextVnode.childNodes = lastVnode.childNodes;
        let { props: lastProps, stateNode: dom, _hasProps, type } = lastVnode;
        let { props: nextProps, _hasProps: nextCheckProps } = nextVnode;
        let lastChildren = restoreChildren(lastVnode);
        if (nextProps[innerHTML]) {
            disposeChildren(lastChildren);
        } else {
            diffChildren(lastChildren, fiberizeChildren(nextVnode), nextVnode, context, updateQueue);
        }
        if (_hasProps || nextCheckProps) {
            diffProps(dom, lastProps, nextProps, nextVnode);
        }
        if (formElements[type]) {
            processFormElement(nextVnode, dom, nextProps);
        }
        Refs.detachRef(lastVnode, nextVnode, dom);
    } else {
        dom = receiveComponent(lastVnode, nextVnode, context, updateQueue);
    }
    return dom;
}

function receiveComponent(lastVnode, nextVnode, parentContext, updateQueue) {
    let { type, stateNode } = lastVnode;
    let updater = stateNode.updater,
        nextContext;

    //如果正在更新过程中接受新属性，那么去掉update,加上receive
    var willReceive = lastVnode !== nextVnode;
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
    nextVnode.child =  nextVnode.child || lastVnode.child;
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

function genkey(vnode) {
    return vnode.key ? "@" + vnode.key : vnode.type.name || vnode.type;
}

function alignVnode(lastVnode, nextVnode, context, updateQueue, single) {
  
    if (isSameNode(lastVnode, nextVnode)) {
        //组件虚拟DOM已经在diffChildren生成并插入DOM树
        updateVnode(lastVnode, nextVnode, context, updateQueue);
    } else {
        disposeVnode(lastVnode);
        mountVnode(nextVnode, context, updateQueue, single);

    }

    return nextVnode.stateNode;
}

options.alignVnode = alignVnode;
function getNearestNode(vnodes, ii) {
    var distance = Infinity,
        hit = null,
        vnode,
        i = 0;
    while ((vnode = vnodes[i])) {
        var delta = vnode.index - ii;
        if (delta === 0) {
            vnodes.splice(i, 1);
            return vnode;
        } else {
            var d = Math.abs(delta);
            if (d < distance) {
                distance = d;
                hit = vnode;
            }
        }
        i++;
    }
    return hit;
}



function diffChildren(lastChildren, nextChildren, parentVnode, parentContext, updateQueue, xxx) {
    var parentVElement = parentVnode,
        priorityQueue = [],
        lastLength = lastChildren.length,
        nextLength = nextChildren.length,
        fuzzyHits = {},
        hit,
        lastChild,
        nextChild,
        i = 0;
    
    if(parentVnode.vtype === 1 ){
        var firstChild = parentVnode.stateNode.firstChild;
        var child = lastChildren[0];
        if(firstChild && child){
            while(child.vtype > 1){
                child = child.child;
            }
            child.stateNode = firstChild;
        }
    }
    do {
        if (parentVElement.vtype === 1) {
            break;
        }
    } while ((parentVElement = parentVElement.return));
    if(nextChildren){
        parentVnode.child = nextChildren[0];
    }
    if (!lastLength && nextLength) {
        mountChildren(parentVnode, nextChildren, parentContext, updateQueue);
        if(!parentVElement.selfMount) {
            parentVElement.batchMount("只添加"+xxx);
        }
        return; 
    }
  
    var React15 = false;
    if (!parentVElement.updateMeta) {
        var lastChilds = mergeNodes(lastChildren);
        parentVElement.childNodes.length = 0; //清空数组，以方便收集节点
        parentVElement.updateMeta = {
            parentVnode,
            parentVElement,
            lastChilds
        };
    }
    lastChildren.forEach(function(lastChild) {
        hit = genkey(lastChild);
        let hits = fuzzyHits[hit];
        if (hits) {
            hits.push(lastChild);
        } else {
            fuzzyHits[hit] = [lastChild];
        }
    });
    //step2: 碰撞检测，并筛选离新节点最新的节点，执行null ref与updateComponent
    var mainQueue = [];
    while (i < nextLength) {
        nextChild = nextChildren[i];
        hit = genkey(nextChild);
        let fLength = fuzzyHits[hit] && fuzzyHits[hit].length,
            hitVnode = null;
        if (fLength) {
            let fnodes = fuzzyHits[hit];
            React15 = true;
            if (fLength > 1) {
                hitVnode = getNearestNode(fnodes, i);
            } else {
                hitVnode = fnodes[0];
                delete fuzzyHits[hit];
            }
            if (hitVnode) {
                lastChildren[hitVnode.index] = NaN;
                if (hitVnode.vtype > 1) {
                    if (hitVnode.type === nextChild.type) {
                        receiveComponent(hitVnode, nextChild, parentContext, priorityQueue); 
                    } else {
                        alignVnode(hitVnode, nextChild, parentContext, priorityQueue, true);
                    }
                } else {
                    mainQueue.push(hitVnode, nextChild);
                    Refs.detachRef(hitVnode, nextChild);
                }
            }
        } else {
            mainQueue.push(null, nextChild);
        }
        i++;
    }
    //step3: 移除没有命中的虚拟DOM，执行它们的钩子与ref
    if (React15) {
        disposeChildren(lastChildren);
    }
   

    drainQueue(priorityQueue); //原来updateQueue为priorityQueue
    //step4: 更新元素，调整位置或插入新元素
    for (let i = 0, n = mainQueue.length; i < n; i += 2) {
        lastChild = mainQueue[i];
        nextChild = mainQueue[i + 1];
        if (lastChild) {
            alignVnode(lastChild, nextChild, parentContext, updateQueue, true);
        } else {
            mountVnode(nextChild, parentContext, updateQueue, true);
        }
    }
    //React的怪异行为，如果没有组件发生更新，那么先执行添加，再执行移除
    disposeChildren(lastChildren);
   
    if (parentVElement.updateMeta && parentVElement.updateMeta.parentVnode == parentVnode) {
        parentVnode.batchUpdate(parentVElement.updateMeta, mergeNodes(nextChildren), nextChildren);
    }
}

options.diffChildren = diffChildren;
function mergeNodes(children) {
    var nodes = [];
    for (var i = 0, el; (el = children[i++]); ) {
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