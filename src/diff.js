import { options, getNodes, innerHTML, toLowerCase, deprecatedWarn, getContextByTypes } from "./util";
import { diffProps } from "./diffProps";
import { disposeVnode } from "./dispose";
import { createDOMElement, emptyElement, removeDOMElement } from "./browser";
import { CurrentOwner, flattenChildren } from "./createElement";
import { processFormElement, postUpdateSelectedOptions } from "./ControlledComponent";
import { instantiateComponent, updateChains } from "./instantiateComponent";
import { pendingRefs, drainQueue } from "./scheduler";

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
    var lastVnode = container.__component;
    if (lastVnode) {
        disposeVnode(lastVnode);
        emptyElement(container);
        container.__component = null;
    }
}
//[Top API] ReactDOM.findDOMNode
export function findDOMNode(ref) {
    if (ref == null) {
        return null;
    }
    if (ref.nodeType === 1) {
        return ref;
    }
    return ref.updater ? ref.updater._hostNode : ref._hostNode || null;
}
// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中
function getVParent(container) {
    return {
        type: container.nodeName,
        namespaceURI: container.namespaceURI
    };
}

// ReactDOM.render的内部实现
function renderByAnu(vnode, container, callback, context = {}) {
    if (!isValidElement(vnode)) {
        throw `ReactDOM.render的第一个参数错误`; // eslint-disable-line
    }
    if (!(container && container.getElementsByTagName)) {
        throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }
    let updateQueue = [],
        rootNode,
        lastVnode = container.__component;
    if (lastVnode) {
        rootNode = alignVnode(lastVnode, vnode, getVParent(container), context, updateQueue);
    } else {
        updateQueue.isMainProcess = true;
        //如果是后端渲染生成，它的孩子中存在一个拥有data-reactroot属性的元素节点
        rootNode = genVnodes(container, vnode, context, updateQueue);
    }

    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container.__component = vnode;
    drainQueue(updateQueue);
    CurrentOwner.cur = null; //防止干扰
    var ret = instance || rootNode;
    if (callback) {
        callback.call(ret); //坑
    }
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return ret;
}

function genVnodes(container, vnode, context, updateQueue) {
    let nodes = getNodes(container);
    let lastNode = null;
    for (var i = 0, el; (el = nodes[i++]); ) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            lastNode = el;
        } else {
            container.removeChild(el);
        }
    }
    return container.appendChild(mountVnode(lastNode, vnode, getVParent(container), context, updateQueue));
}

const patchStrategy = {
    0: mountText,
    1: mountElement,
    2: mountComponent,
    4: mountComponent,
    10: updateText,
    11: updateElement,
    12: updateComponent,
    14: updateComponent
};
//mountVnode只是转换虚拟DOM为真实DOM，不做插入DOM树操作
function mountVnode(lastNode, vnode) {
    return patchStrategy[vnode.vtype].apply(null, arguments);
}
function updateByContext(vnode) {
    if (vnode.type && vnode.type.contextTypes) {
        return true;
    }
    let vchildren = vnode.vchildren;
    if (vchildren) {
        for (let i = 0; i < vchildren.length; i++) {
            let el = vchildren[i];
            if (el.vtype === 1) {
                if (updateByContext(el)) {
                    return true;
                }
            } else if (el.vtype && el.type.contextTypes) {
                return true;
            }
        }
    } else if (vnode._instance) {
        var ret = vnode._instance.updater.rendered;
        if (updateByContext(ret)) {
            return true;
        }
    }
}

function updateVnode(lastVnode, nextVnode) {
    if (lastVnode === nextVnode && !updateByContext(lastVnode)) {
        return lastVnode._hostNode;
    }
    return patchStrategy[lastVnode.vtype + 10].apply(null, arguments);
}

function mountText(lastNode, vnode) {
    if (!lastNode || lastNode.nodeName !== vnode.type) {
        lastNode = createDOMElement(vnode);
    }
    vnode._hostNode = lastNode;
    return lastNode;
}

function updateText(lastVnode, nextVnode) {
    let dom = lastVnode._hostNode;
    nextVnode._hostNode = dom;
    if (lastVnode.text !== nextVnode.text) {
        dom.nodeValue = nextVnode.text;
    }
    return dom;
}

function genMountElement(lastNode, vnode, vparent, type) {
    if (lastNode && toLowerCase(lastNode.nodeName) === type) {
        return lastNode;
    } else {
        let dom = createDOMElement(vnode, vparent);
        if (lastNode) {
            while (lastNode.firstChild) {
                dom.appendChild(lastNode.firstChild);
            }
        }
        return dom;
    }
}

const formElements = {
    select: 1,
    textarea: 1,
    input: 1
};

function mountElement(lastNode, vnode, vparent, context, updateQueue) {
    let { type, props, ref } = vnode;
    let dom = genMountElement(lastNode, vnode, vparent, type);

    vnode._hostNode = dom;
    var children = flattenChildren(vnode);
    let method = lastNode ? alignChildren : mountChildren;
    method(dom, children, vnode, context, updateQueue);

    if (vnode.checkProps) {
        diffProps(props, {}, vnode, {}, dom);
    }
    if (ref) {
        pendingRefs.push(ref.bind(true, dom));
    }
    if (formElements[type]) {
        processFormElement(vnode, dom, props);
    }

    return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(parentNode, children, vparent, context, updateQueue) {
    for (let i = 0, n = children.length; i < n; i++) {
        parentNode.appendChild(mountVnode(null, children[i], vparent, context, updateQueue));
    }
}

function alignChildren(parentNode, children, vparent, context, updateQueue) {
    let childNodes = parentNode.childNodes,
        insertPoint = childNodes[0] || null,
        j = 0,
        n = children.length;
    for (let i = 0; i < n; i++) {
        let vnode = children[i];
        let lastNode = childNodes[j];
        let dom = mountVnode(lastNode, vnode, vparent, context, updateQueue);
        if (dom === lastNode) {
            j++;
        }
        parentNode.insertBefore(dom, insertPoint);
        insertPoint = dom.nextSibling;
    }
    while (childNodes[n]) {
        parentNode.removeChild(childNodes[n]);
    }
}

function mountComponent(lastNode, vnode, vparent, parentContext, updateQueue, parentUpdater) {
    let { type, props } = vnode;

    let context = getContextByTypes(parentContext, type.contextTypes);
    let instance = instantiateComponent(type, vnode, props, context); //互相持有引用
    let updater = instance.updater;
    if (parentUpdater) {
        updater._mountOrder = parentUpdater._mountOrder;
    } else {
        updateChains[updater._mountOrder] = [];
    }
    updateChains[updater._mountOrder].push(updater);
    updater.vparent = vparent;
    updater.parentContext = parentContext;
    if (instance.componentWillMount) {
        instance.componentWillMount(); //这里可能执行了setState
        instance.state = updater.mergeStates();
    }

    updater._hydrating = true;

    let dom = updater.renderComponent(function(nextRendered, vparent, childContext) {
        return mountVnode(
            lastNode,
            nextRendered,
            vparent,
            childContext,
            updateQueue,
            updater //作为parentUpater往下传
        );
    }, updater.rendered);

    updateQueue.push(updater);

    return dom;
}

function updateComponent(lastVnode, nextVnode, vparent, parentContext, updateQueue) {
    let { type, ref, _instance: instance, vtype } = lastVnode;
    let nextContext,
        nextProps = nextVnode.props,
        queue;
    var updater = instance.updater;
    if (type.contextTypes) {
        nextContext = getContextByTypes(parentContext, type.contextTypes);
    } else {
        nextContext = instance.context; //没有定义contextTypes就沿用旧的
    }

    if (instance.componentWillReceiveProps) {
        updater._receiving = true;
        instance.componentWillReceiveProps(nextProps, nextContext);
        updater._receiving = false;
    }
    //用于refreshComponent
    if (ref && vtype === 2) {
        ref(null);
        if (nextVnode.ref) {
            lastVnode.ref = nextVnode.ref;
        }
    }
    //updater上总是保持新的数据
    updater.lastVnode = lastVnode;
    updater.vnode = nextVnode;
    updater.context = nextContext;
    updater.props = nextProps;
    updater.vparent = vparent;
    updater.parentContext = parentContext;
    // nextVnode._instance = instance; //不能放这里

    if (updateQueue.isChildProcess) {
        queue = updateQueue;
    } else {
        queue = [];
        queue.isChildProcess = true;
    }
    refreshComponent(updater, queue);
    //子组件先执行
    updateQueue.push(updater);
    return updater._hostNode;
}

function refreshComponent(updater, updateQueue) {
    let { _instance: instance, _hostNode: dom, context: nextContext, props: nextProps, vnode, lastVnode } = updater;

    vnode._instance = instance; //放这里

    updater._renderInNextCycle = null;

    let nextState = updater.mergeStates();
    let shouldUpdate = true;
    if (!updater._forceUpdate && instance.shouldComponentUpdate && !instance.shouldComponentUpdate(nextProps, nextState, nextContext)) {
        shouldUpdate = false;
    } else if (instance.componentWillUpdate) {
        instance.componentWillUpdate(nextProps, nextState, nextContext);
    }
    let { props: lastProps, context: lastContext, state: lastState } = instance;

    updater._forceUpdate = false;
    instance.props = nextProps;
    instance.context = nextContext;
    instance.state = nextState; //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上

    if (!shouldUpdate) {
        if (lastVnode && lastVnode !== vnode) {
            updater.vnode = lastVnode;
        }
        return dom;
    }

    updater._hydrating = true;
    updater.lastProps = lastProps;
    updater.lastState = lastState;
    updater.lastContext = lastContext;

    let lastRendered = updater.rendered;
    //这里会更新instance的props, context, state
    dom = updater.renderComponent(function(nextRendered, vparent, childContext) {
        return alignVnode(lastRendered, nextRendered, vparent, childContext, updateQueue, updater);
    });
    updater._lifeStage = 2;
    updater._hydrating = false;
    if (updateQueue.isChildProcess) {
        drainQueue(updateQueue);
    }

    return dom;
}
options.refreshComponent = refreshComponent;

export function alignVnode(lastVnode, nextVnode, vparent, context, updateQueue, parentUpdater) {
    let node = lastVnode._hostNode,
        dom;
    if (isSameNode(lastVnode, nextVnode)) {
        dom = updateVnode(lastVnode, nextVnode, vparent, context, updateQueue);
    } else {
        disposeVnode(lastVnode);
        dom = mountVnode(null, nextVnode, vparent, context, updateQueue, parentUpdater);
        let p = node.parentNode;
        if (p) {
            p.replaceChild(dom, node);
            removeDOMElement(node);
        }
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, vparent, context, updateQueue) {
    let dom = lastVnode._hostNode;
    let lastProps = lastVnode.props;
    let nextProps = nextVnode.props;
    let ref = nextVnode.ref;
    nextVnode._hostNode = dom;
    if (nextProps[innerHTML]) {
        var list = lastVnode.vchildren || [];
        list.forEach(function(el) {
            disposeVnode(el);
        });
        list.length = 0;
    } else {
        var vchildren = flattenChildren(nextVnode);
        if (lastProps[innerHTML]) {
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
            mountChildren(dom, vchildren, nextVnode, context, updateQueue);
        } else {
            diffChildren(lastVnode, nextVnode, dom, context, updateQueue);
        }
    }

    if (lastVnode.checkProps || nextVnode.checkProps) {
        diffProps(nextProps, lastProps, nextVnode, lastVnode, dom);
    }
    if (nextVnode.type === "select") {
        postUpdateSelectedOptions(nextVnode);
    }
    if (ref) {
        pendingRefs.push(ref.bind(0, dom));
    }
    return dom;
}

function diffChildren(lastVnode, nextVnode, parentNode, context, updateQueue) {
    let lastChildren = lastVnode.vchildren,
        nextChildren = flattenChildren(nextVnode),
        nextLength = nextChildren.length,
        lastLength = lastChildren.length,
        childNodes = parentNode.childNodes;
    lastChildren.forEach(function(el, i) {
        if (childNodes[i] !== el._hostNode) {
            if (!el._hostNode) {
                console.log(el, "没有hostNode");
            }
            parentNode.replaceChild(el._hostNode, childNodes[i]);
        }
    });
    //如果旧数组长度为零
    if (nextLength && !lastLength) {
        return mountChildren(parentNode, nextChildren, lastVnode, context, updateQueue);
    }
    if (nextLength === lastLength && lastLength === 1) {
        return alignVnode(lastChildren[0], nextChildren[0], lastVnode, context, updateQueue);
    }
    let maxLength = Math.max(nextLength, lastLength),
        insertPoint = parentNode.firstChild,
        removeHits = {},
        fuzzyHits = {},
        actions = [],
        i = 0,
        hit,
        dom,
        oldDom,
        nextChild,
        lastChild;
    //第一次循环，构建移动指令（actions）与移除名单(removeHits)与命中名单（fuzzyHits）
    if (nextLength) {
        actions.length = nextLength;
        while (i < maxLength) {
            nextChild = nextChildren[i];
            lastChild = lastChildren[i];

            if (nextChild && lastChild && isSameNode(lastChild, nextChild)) {
                //  如果能直接找到，命名90％的情况
                actions[i] = {
                    last: lastChild,
                    next: nextChild,
                    directive: "update"
                };
                removeHits[i] = true;
            } else {
                if (nextChild) {
                    hit = nextChild.type + (nextChild.key || "");
                    if (fuzzyHits[hit] && fuzzyHits[hit].length) {
                        var oldChild = fuzzyHits[hit].shift();
                        // 如果命中旧的节点，将旧的节点移动新节点的位置，向后移动
                        actions[i] = {
                            last: oldChild,
                            next: nextChild,
                            directive: "moveAfter"
                        };
                        removeHits[oldChild._i] = true;
                    }
                }
                if (lastChild) {
                    //如果没有命中或多了出来，那么放到命中名单中，留给第二轮循环使用
                    lastChild._i = i;
                    hit = lastChild.type + (lastChild.key || "");
                    let hits = fuzzyHits[hit];
                    if (hits) {
                        hits.push(lastChild);
                    } else {
                        fuzzyHits[hit] = [lastChild];
                    }
                }
            }
            i++;
        }
    }
    for (let j = 0, n = actions.length; j < n; j++) {
        let action = actions[j];
        if (!action) {
            let curChild = nextChildren[j];
            hit = curChild.type + (curChild.key || "");
            if (fuzzyHits[hit] && fuzzyHits[hit].length) {
                oldChild = fuzzyHits[hit].shift();
                oldDom = oldChild._hostNode;
                parentNode.insertBefore(oldDom, insertPoint);
                dom = updateVnode(oldChild, curChild, lastVnode, context, updateQueue);
                removeHits[oldChild._i] = true;
            } else {
                //为了兼容 react stack reconciliation的执行顺序，添加下面三行，
                //在插入节点前，将原位置上节点对应的组件先移除
                var removed = lastChildren[j];
                if (removed && !removed._disposed && !removeHits[j]) {
                    disposeVnode(removed);
                }
                //如果找不到对应的旧节点，创建一个新节点放在这里
                dom = mountVnode(null, curChild, lastVnode, context, updateQueue);
                parentNode.insertBefore(dom, insertPoint);
            }
        } else {
            oldDom = action.last._hostNode;
            if (action.action === "moveAfter") {
                parentNode.insertBefore(oldDom, insertPoint);
            }
            dom = updateVnode(action.last, action.next, lastVnode, context, updateQueue);
        }
        insertPoint = dom.nextSibling;
    }
    //移除
    lastChildren.forEach(function(el, i) {
        if (!removeHits[i]) {
            var node = el._hostNode;
            if (node) {
                removeDOMElement(node);
            }
            disposeVnode(el);
        }
    });
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
