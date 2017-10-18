import { noop, options, getNodes, innerHTML, toLowerCase, emptyObject, deprecatedWarn, getContextByTypes } from "./util";
import { diffProps } from "./diffProps";
import { disposeVnode } from "./dispose";
import { createElement, insertElement, removeElement, emptyElement } from "./browser";
import { flattenChildren } from "./createElement";
import { processFormElement } from "./ControlledComponent";
import { instantiateComponent } from "./Updater";
import { drainQueue } from "./scheduler";
import { Refs, pendingRefs } from "./Refs";

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
//[Top API] ReactDOM.createPortal
export function createPortal(children, container) {
    if (!container.vchildren) {
        container.vchildren = [];
    }
    diffChildren(getVParent(container), children, container, {}, []);
    container.vchildren = children;
    return null;
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
        //如果是后端渲染生成，它的孩子中存在一个拥有data-reactroot属性的元素节点
        rootNode = genVnodes(container, vnode, context, updateQueue);
    }

    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container.__component = vnode;
    drainQueue(updateQueue);
    Refs.currentOwner = null; //防止干扰
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

function updateVnode(lastVnode) {
    return patchStrategy[lastVnode.vtype + 10].apply(null, arguments);
}

function mountText(lastNode, vnode) {
    if (!lastNode || lastNode.nodeName !== vnode.type) {
        lastNode = createElement(vnode);
    }
    return (vnode._hostNode = lastNode);
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
        let dom = createElement(vnode, vparent);
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
    input: 1,
    option: 1
};

function mountElement(lastNode, vnode, vparent, context, updateQueue) {
    let { type, props, ref } = vnode;
    let dom = genMountElement(lastNode, vnode, vparent, type);
    vnode._hostNode = dom;
    let children = flattenChildren(vnode);
    let method = lastNode ? alignChildren : mountChildren;
    method(dom, children, vnode, context, updateQueue);
    dom.vchildren = children;
    if (vnode.checkProps) {
        diffProps(dom, emptyObject, props, vnode);
    }
    if (formElements[type]) {
        processFormElement(vnode, dom, props);
    }
    if (ref) {
        pendingRefs.push(ref.bind(true, dom));
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, vparent, context, updateQueue) {
    let { props: lastProps, _hostNode: dom, checkProps, type } = lastVnode;
    let { props: nextProps, checkProps: nextCheckProps } = nextVnode;
    if (!dom) {
        console.error("updateElement没有实例化");
        return false;
    }
    nextVnode._hostNode = dom;
    var oldChildren = dom.vchildren || [];
    if (nextProps[innerHTML]) {
        oldChildren.forEach(function(el) {
            disposeVnode(el);
        });
        oldChildren.length = 0;
    } else {
        if (lastProps[innerHTML]) {
            oldChildren.length = 0;
        }
        var c = flattenChildren(nextVnode);
        diffChildren(lastVnode, c, dom, context, updateQueue);
        dom.vchildren = c;
    }
    if (checkProps || nextCheckProps) {
        diffProps(dom, lastProps, nextProps, nextVnode);
    }
    if (formElements[type]) {
        processFormElement(nextVnode, dom, nextProps);
    }
    Refs.detachRef(lastVnode, nextVnode, dom);
    return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(parentNode, children, vparent, context, updateQueue) {
    for (let i = 0, n = children.length; i < n; i++) {
        var vnode = children[i];
        parentNode.appendChild(mountVnode(null, vnode, vparent, context, updateQueue));
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
    let { type, props, ref } = vnode;
    let context = getContextByTypes(parentContext, type.contextTypes);
    let instance = instantiateComponent(type, vnode, props, context); //互相持有引用
    let updater = instance.updater;
    if (parentUpdater) {
        updater.parentUpdater = parentUpdater;
    }
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
    Refs.createInstanceRef(updater, ref);
    let userHook = instance.componentDidMount;
    updater._didHook = function() {
        userHook && userHook.call(instance);
        updater._didHook = noop;
        options.afterMount(instance);
    };
    updateQueue.push(updater);

    return dom;
}

function updateComponent(lastVnode, nextVnode, vparent, parentContext, updateQueue) {
    let { type, ref, _instance: instance, _hostNode } = lastVnode;
    let nextContext,
        nextProps = nextVnode.props,
        updater = instance.updater;
    if (type.contextTypes) {
        nextContext = getContextByTypes(parentContext, type.contextTypes);
    } else {
        nextContext = instance.context; //没有定义contextTypes就沿用旧的
    }
    var willReceive = lastVnode !== nextVnode || updater.context !== nextContext;
    nextVnode._hostNode = _hostNode;
    nextVnode._instance = instance;
    updater.willReceive = willReceive;
    //如果context与props都没有改变，那么就不会触发组件的receive，render，update等一系列钩子
    //但还会继续向下比较

    if (willReceive && instance.componentWillReceiveProps) {
        updater._receiving = true;
        instance.componentWillReceiveProps(nextProps, nextContext);
        updater._receiving = false;
    }
    if (!instance.__isStateless) {
        ref && Refs.detachRef(lastVnode, nextVnode);
        Refs.createInstanceRef(updater, nextVnode.ref);
    }

    //updater上总是保持新的数据

    updater.context = nextContext;
    updater.props = nextProps;
    updater.vparent = vparent;
    updater.parentContext = parentContext;
    // nextVnode._instance = instance; //不能放这里
    if (!willReceive) {
        return updater.renderComponent(function(nextRendered, vparent, childContext) {
            return alignVnode(updater.rendered, nextRendered, vparent, childContext, updateQueue);
        });
    }
    updater.vnode = nextVnode;
    refreshComponent(updater, updateQueue);
    //子组件先执行
    updateQueue.push(updater);
    return updater._hostNode;
}

function refreshComponent(updater, updateQueue) {
    let { _instance: instance, _hostNode: dom, context: nextContext, props: nextProps, vnode } = updater;

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
    instance.state = nextState; //既然setState了，无论shouldComponentUpdate结果如何，用户传给的state对象都会作用到组件上
    instance.context = nextContext;
    if (!shouldUpdate) {
        updateQueue.push(updater);
        return dom;
    }
    instance.props = nextProps;
    updater._hydrating = true;
    let lastRendered = updater.rendered;

    dom = updater.renderComponent(function(nextRendered, vparent, childContext) {
        return alignVnode(lastRendered, nextRendered, vparent, childContext, updateQueue, updater);
    });

    updater._lifeStage = 2;
    let userHook = instance.componentDidUpdate;

    updater._didHook = function() {
        userHook && userHook.call(instance, lastProps, lastState, lastContext);
        updater._didHook = noop;
        options.afterUpdate(instance);
    };

    updateQueue.push(updater);
    return dom;
}
options.refreshComponent = refreshComponent;

export function alignVnode(lastVnode, nextVnode, vparent, context, updateQueue, parentUpdater) {
    let dom;
    if (isSameNode(lastVnode, nextVnode)) {
        dom = updateVnode(lastVnode, nextVnode, vparent, context, updateQueue);
    } else {
        disposeVnode(lastVnode);
        var node = lastVnode._hostNode,
            parentNode = node.parentNode,
            insertPoint = node.nextSibling;
        removeElement(node);
        dom = mountVnode(null, nextVnode, vparent, context, updateQueue, parentUpdater);
        insertElement(parentNode, dom, insertPoint);
    }
    return dom;
}

function genkey(vnode){
    return vnode.key ? "@"+ vnode.key: (vnode.type.name || vnode.type); 
}

function diffChildren(parentVnode, nextChildren, parentNode, context, updateQueue) {
    let lastChildren =  parentNode.vchildren,
        nextLength = nextChildren.length,
        childNodes = parentNode.childNodes,
        lastLength = lastChildren.length;

    //optimize 1： 如果旧数组长度为零, 只进行添加
    if (!lastLength) {
        emptyElement(parentNode);
        return mountChildren(parentNode, nextChildren, parentVnode, context, updateQueue);
    }
    //optimize 2： 如果新数组长度为零, 只进行删除
    if (!nextLength) {
        return lastChildren.forEach(function(el) {
            removeElement(el._hostNode);
            disposeVnode(el);
        });
    }
    //optimize 3： 如果1vs1, 不用进入下面复杂的循环
    if (nextLength === lastLength && lastLength === 1) {
        if (parentNode.firstChild) {
            lastChildren[0]._hostNode = parentNode.firstChild;
        }
        return alignVnode(lastChildren[0], nextChildren[0], parentVnode, context, updateQueue);
    }
    let mergeChildren = [], //确保新旧数组都按原顺数排列
        fuzzyHits = {},
        i = 0,
        k = 0,
        hit,
        oldDom,
        dom,
        nextChild;

    lastChildren.forEach(function(lastChild){
        hit = genkey(lastChild);
        mergeChildren.push(lastChild);
        let hits = fuzzyHits[hit];
        if (hits) {
            hits.push(lastChild);
        } else {
            fuzzyHits[hit] = [lastChild];
        }
    });


    while (i < nextLength) {
        nextChild = nextChildren[i];
        nextChild._new = true;
        hit = genkey(nextChild);
        if (fuzzyHits[hit] && fuzzyHits[hit].length) {
            var oldChild = fuzzyHits[hit].shift();
            // 如果命中旧节点，置空旧节点，并在新位置放入旧节点（向后移动）
            var lastIndex = mergeChildren.indexOf(oldChild);
            if(lastIndex !== -1){
                mergeChildren.splice(lastIndex, 1);
            }
            nextChild._new = oldChild;
        }
        mergeChildren.splice(i,0, nextChild);
        i++;
    }

    for (var j = 0, n = mergeChildren.length; j < n; j++) {
        let nextChild = mergeChildren[j];
        if (nextChild._new) {
            var lastChild = nextChild._new;
            delete nextChild._new;
            if(lastChild=== true){
                //新节点有两种情况，命中位置更后方的旧节点或就地创建实例化
                dom = mountVnode(null, nextChild, parentVnode, context, updateQueue);
                insertElement(parentNode, dom, childNodes[k]);
            }else{
                oldDom = lastChild._hostNode;
                if (oldDom !== childNodes[k]) {
                    console.log(parentNode, oldDom, childNodes[k]);
                    insertElement(parentNode, oldDom, childNodes[k]);
                }
                alignVnode(lastChild, nextChild, parentVnode, context, updateQueue);
            }
            k++;
        } else {
          
            removeElement(nextChild._hostNode);
            disposeVnode(nextChild);
            
        }
    }
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}
