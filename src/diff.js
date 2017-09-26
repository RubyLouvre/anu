import { diffProps } from "./diffProps";
import { CurrentOwner, flattenChildren } from "./createElement";
import { createDOMElement, removeDOMElement } from "./browser";
import {
    processFormElement,
    postUpdateSelectedOptions
} from "./ControlledComponent";

import {
    typeNumber,
    getNodes,
    innerHTML,
    options,
    noop,
    clearArray,
    checkNull,
    toLowerCase,
    getChildContext,
    EMPTY_CHILDREN,
    deprecatedWarn
} from "./util";

import { disposeVnode } from "./dispose";

/**
 * ReactDOM.render 方法
 *
 */
export function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
/**
 * ReactDOM.unstable_renderSubtreeIntoContainer 方法， React.render的包装
 *
 */
export var pendingRefs = [];
export function unstable_renderSubtreeIntoContainer(
    component,
    vnode,
    container,
    callback
) {
    deprecatedWarn("unstable_renderSubtreeIntoContainer");
    var parentContext = (component && component.context) || {};
    return renderByAnu(vnode, container, callback, parentContext);
}
export function unmountComponentAtNode(dom) {
    var prevVnode = dom.__component;
    if (prevVnode) {
        prevVnode._hostNode = dom.firstChild;
        alignVnode(
            prevVnode,
            {
                type: "#comment",
                text: "empty",
                vtype: 0
            },
            {},
            getVParent(dom),
            EMPTY_CHILDREN
        );
    }
}
export function isValidElement(vnode) {
    return vnode && vnode.vtype;
}

function clearRefsAndMounts(queue) {
    options.beforePatch();
    var refs = pendingRefs.slice(0);
    pendingRefs.length = 0;
    refs.forEach(function(fn) {
        fn();
    });

    queue.forEach(function(instance) {
        if (!instance.__DidMount) {
            if (instance.componentDidMount) {
                instance.componentDidMount();
                instance.componentDidMount = null;
            }
            instance.__DidMount = true;

            options.afterMount(instance);
        } else {
            _refreshComponent(instance, []);
        }

        var ref = instance.__current.ref;
        if (ref) {
            ref(instance.__mergeStates ? instance : null);
        }
        instance.__hydrating = false;
        while (instance.__renderInNextCycle) {
            _refreshComponent(instance, []);
        }
        clearArray(instance.__pendingCallbacks).forEach(function(fn) {
            fn.call(instance);
        });
    });
    queue.length = 0;
    options.afterPatch();
}

var dirtyComponents = [];
function mountSorter(c1, c2) {
    return c1.__mountOrder - c2.__mountOrder;
}
options.flushBatchedUpdates = function(queue) {
    if (!queue) {
        dirtyComponents.sort(mountSorter);
        queue = dirtyComponents;
    }
    clearRefsAndMounts(queue);
};
/**
 * 统一所有操作虚拟DOM的方法的参数
 * 第一个参数为旧真实DOM或旧虚拟DOM
 * 第二个参数为新虚拟DOM
 * 第三个参数为父虚拟DOM(可能不存在，那么后面直接跟第四，第五)
 * 第四个参数为上下文对象
 * 第五个参数为任务调度系系统的列队
 */
options.enqueueUpdate = function(instance) {
    if (dirtyComponents.indexOf(instance) == -1) {
        dirtyComponents.push(instance);
    }
};

/**
 * ReactDOM.render
 * 用于驱动视图第一次刷新
 * @param {any} vnode 
 * @param {any} container 
 * @param {any} callback 
 * @param {any} context 
 * @returns 
 */
function renderByAnu(vnode, container, callback, context) {
    if (!isValidElement(vnode)) {
    throw `ReactDOM.render的第一个参数错误`; // eslint-disable-line
    }
    if (!(container && container.getElementsByTagName)) {
    throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }
    let mountQueue = [],
        rootNode,
        lastVnode = container.__component;
   
    context = context || {};
    if (lastVnode) {
        lastVnode._hostNode = container.firstChild;
        rootNode = alignVnode(
            lastVnode,
            vnode,
            getVParent(container),
            context,
            mountQueue
        );
    } else {
        mountQueue.executor = true;
        rootNode = genVnodes(container, vnode, context, mountQueue);
    }

    // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
    // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数
    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container.__component = vnode;
    clearRefsAndMounts(mountQueue);
    var ret = instance || rootNode;

    if (callback) {
        callback.call(ret); //坑
    }

    return ret;
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
}
function getVParent(parentNode) {
    return {
        type: parentNode.nodeName,
        namespaceURI: parentNode.namespaceURI
    };
}

function genVnodes(parentNode, vnode, context, mountQueue) {
    let nodes = getNodes(parentNode);
    let lastNode = null;
    for (var i = 0, el; (el = nodes[i++]); ) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            lastNode = el;
        } else {
            el.parentNode.removeChild(el);
        }
    }
    let rootNode = mountVnode(
        lastNode,
        vnode,
        getVParent(parentNode),
        context,
        mountQueue
    );
    parentNode.appendChild(rootNode);

    return rootNode;
}

let formElements = {
    select: 1,
    textarea: 1,
    input: 1
};

let patchStrategy = {
    0: mountText,
    1: mountElement,
    2: mountComponent,
    4: mountStateless,
    10: updateText,
    11: updateElement,
    12: updateComponent,
    14: updateComponent
};

export function mountVnode(dom, vnode) {
    return patchStrategy[vnode.vtype].apply(null, arguments);
}
function updateVnode(lastVnode) {
    return patchStrategy[lastVnode.vtype + 10].apply(null, arguments);
}

function mountText(dom, vnode) {
    let node = dom && dom.nodeName === vnode.type ? dom : createDOMElement(vnode);
    vnode._hostNode = node;
    return node;
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

function mountElement(lastNode, vnode, vparent, context, mountQueue) {
    let { type, props, ref } = vnode;
    let dom = genMountElement(lastNode, vnode, vparent, type);

    vnode._hostNode = dom;

    let method = lastNode ? alignChildren : mountChildren;
    method(dom, vnode, context, mountQueue);

    if (vnode.checkProps) {
        diffProps(props, {}, vnode, {}, dom);
    }
    if (ref) {
        pendingRefs.push(ref.bind(0, dom));
    }
    if (formElements[type]) {
        processFormElement(vnode, dom, props);
    }

    return dom;
}

//将虚拟DOM转换为真实DOM并插入父元素
function mountChildren(parentNode, vparent, context, mountQueue) {
    var children = flattenChildren(vparent);
    for (let i = 0, n = children.length; i < n; i++) {
        let vnode = children[i];
        let curNode = mountVnode(null, vnode, vparent, context, mountQueue);

        parentNode.appendChild(curNode);
    }
}

function alignChildren(parentNode, vparent, context, mountQueue) {
    let children = flattenChildren(vparent),
        childNodes = parentNode.childNodes,
        insertPoint = childNodes[0] || null,
        j = 0,
        n = children.length;
    for (let i = 0; i < n; i++) {
        let vnode = children[i];
        let lastNode = childNodes[j];
        let dom = mountVnode(lastNode, vnode, vparent, context, mountQueue);
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
//构建实例链
function createInstanceChain(instance, vnode, rendered) {
    instance.__current = vnode;
    if (rendered._instance) {
        rendered._instance.__parentInstance = instance;
    }
}

function updateInstanceChain(instance, dom) {
    instance.__dom = instance.__current._hostNode = dom;
    var parent = instance.__parentInstance;
    if (parent) {
        updateInstanceChain(parent, dom);
    }
}

function mountComponent(lastNode, vnode, vparent, context, mountQueue) {
    let { type, props } = vnode;
    let lastOwn = CurrentOwner.cur;
    let instance = new type(props, context); //互相持有引用
    CurrentOwner.cur = lastOwn;
    vnode._instance = instance;
    //防止用户没有调用super或没有传够参数
    instance.props = instance.props || props;
    instance.context = instance.context || context;

    let state = instance.state;

    if (instance.componentWillMount) {
        instance.componentWillMount();
        state = instance.__mergeStates(props, context);
    }

    let rendered = renderComponent.call(instance, vnode, props, context, state);
    instance.__hydrating = true;

    var childContext = rendered.vtype
        ? getChildContext(instance, context)
        : context;
    instance.__childContext = context; //用于在updateChange中比较

    let dom = mountVnode(lastNode, rendered, vparent, childContext, mountQueue);

    createInstanceChain(instance, vnode, rendered);
    updateInstanceChain(instance, dom);

    mountQueue.push(instance);

    return dom;
}

var renderComponent = function(vnode, props, context, state) {
    // 同时给有状态与无状态组件使用
    this.props = props;
    this.state = state || null;
    this.context = context;

    //调整全局的 CurrentOwner.cur
    var lastOwn = CurrentOwner.cur;
    CurrentOwner.cur = this;
    options.beforeRender(this);

    let rendered = this.render();

    CurrentOwner.cur = lastOwn;
    //组件只能返回组件或null
    rendered = checkNull(rendered, vnode.type);

    vnode._instance = this;
    this.__rendered = rendered;
    return rendered;
};

function Stateless(render) {
    this.refs = {};
    this.render = function() {
        return render(this.props, this.context);
    };
    this.__pendingCallbacks = [];
    this.__current = noop;
}

Stateless.prototype.render = renderComponent;

function mountStateless(lastNode, vnode, vparent, context, mountQueue) {
    let instance = new Stateless(vnode.type);
    let rendered = renderComponent.call(instance, vnode, vnode.props, context);
    let dom = mountVnode(lastNode, rendered, vparent, context, mountQueue);

    createInstanceChain(instance, vnode, rendered);
    updateInstanceChain(instance, dom);
    mountQueue.push(instance);

    return dom;
}

var contextHasChange = false;
var contextStatus = [];
function isEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return 1;
        }
    }
    return 0;
}

function _refreshComponent(instance, mountQueue) {
    let {
        props: lastProps,
        state: lastState,
        context: lastContext,
        __rendered: lastRendered,
        __current: lastVnode,
        __dom: lastDOM
    } = instance;
    instance.__renderInNextCycle = null;
    let nextContext = instance.nextContext || lastContext;
    let nextVnode = instance.nextVnode || lastVnode;
    let nextProps = nextVnode.props;

    delete instance.nextContext;
    delete instance.nextVnode;

    nextVnode._instance = instance; //important

    let nextState = instance.__mergeStates
        ? instance.__mergeStates(nextProps, nextContext)
        : null;

    if (
        !instance.__forceUpdate &&
    instance.shouldComponentUpdate &&
    instance.shouldComponentUpdate(nextProps, nextState, nextContext) === false
    ) {
        instance.__forceUpdate = false;
        return lastDOM;
    }

    instance.__hydrating = true;
    instance.__forceUpdate = false;
    if (instance.componentWillUpdate) {
        instance.componentWillUpdate(nextProps, nextState, nextContext);
    }

    //这里会更新instance的props, context, state
    let nextRendered = renderComponent.call(
        instance,
        nextVnode,
        nextProps,
        nextContext,
        nextState
    );

    var childContext = nextRendered.vtype
        ? getChildContext(instance, nextContext)
        : nextContext;

    contextStatus.push(contextHasChange);

    var prevChildContext = instance.__childContext;
    instance.__childContext = childContext;
    //如果两个context都为空对象，就不比较引用，认为它们没有变
    contextHasChange =
    isEmpty(prevChildContext) + isEmpty(childContext) &&
    prevChildContext !== childContext;
    let dom = alignVnode(
        lastRendered,
        nextRendered,
        getVParent(lastDOM.parentNode),
        childContext,
        mountQueue
    );
    contextHasChange = contextStatus.pop();
    createInstanceChain(instance, nextVnode, nextRendered);
    updateInstanceChain(instance, dom);

    instance.__hydrating = false;
    if (instance.componentDidUpdate) {
        instance.__didUpdate = true;
        instance.componentDidUpdate(lastProps, lastState, lastContext);
        if (!instance.__renderInNextCycle) {
            instance.__didUpdate = false;
        }
    }
    options.afterUpdate(instance);

    return dom;
}

function updateComponent(lastVnode, nextVnode, vparent, context, mountQueue) {
    var instance = lastVnode._instance;
    var ref = lastVnode.ref;
    if (ref) {
        lastVnode.ref(null);
    }
    if (instance.componentWillReceiveProps) {
        instance.__receiving = true;
        instance.componentWillReceiveProps(nextVnode.props, context);
        instance.__receiving = false;
    }
    if (!mountQueue.executor) {
        mountQueue.executor = true;
    }
    // shouldComponentUpdate为false时不能阻止setState/forceUpdate cb的触发
    instance.nextContext = context;
    instance.nextVnode = nextVnode;

    mountQueue.push(instance);
    if (mountQueue.executor) {
        clearRefsAndMounts(mountQueue);
        delete mountQueue.executor;
    }

    return instance.__dom;
}

export function alignVnode(lastVnode, nextVnode, vparent, context, mountQueue) {
    let node = lastVnode._hostNode,
        dom;
    if (isSameNode(lastVnode, nextVnode)) {
        dom = updateVnode(lastVnode, nextVnode, vparent, context, mountQueue);
    } else {

        disposeVnode(lastVnode);
        let innerMountQueue = mountQueue.executor
            ? mountQueue
            : nextVnode.vtype === 2 ? [] : mountQueue;
        dom = mountVnode(null, nextVnode, vparent, context, innerMountQueue);
        let p = node.parentNode;
        if (p) {
            p.replaceChild(dom, node);
            removeDOMElement(node);
        }
        if (innerMountQueue !== mountQueue) {
            clearRefsAndMounts(innerMountQueue);
        }
    }
    return dom;
}

export function findDOMNode(ref) {
    if (ref == null) {
        return null;
    }
    if (ref.nodeType === 1) {
        return ref;
    }
    return ref.__dom || null;
}

function updateText(lastVnode, nextVnode) {
    let dom = lastVnode._hostNode;
    nextVnode._hostNode = dom;
    if (lastVnode.text !== nextVnode.text) {
        dom.nodeValue = nextVnode.text;
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, vparent, context, mountQueue) {
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
        if (lastProps[innerHTML]) {
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
            mountChildren(dom, nextVnode, context, mountQueue);
        } else {
            diffChildren(lastVnode, nextVnode, dom, context, mountQueue);
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

function diffChildren(lastVnode, nextVnode, parentNode, context, mountQueue) {
    let lastChildren = lastVnode.vchildren,
        nextChildren = flattenChildren(nextVnode),
        nextLength = nextChildren.length,
        lastLength = lastChildren.length;
    //如果旧数组长度为零
    if (nextLength && !lastLength) {
        nextChildren.forEach(function(vnode) {
            let curNode = mountVnode(null, vnode, lastVnode, context, mountQueue);
            parentNode.appendChild(curNode);
        });
        return;
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
                        // 将旧的节点移动新节点的位置，向后移动
                        actions[i] = {
                            last: oldChild,
                            next: nextChild,
                            directive: "moveAfter"
                        };
                        removeHits[oldChild._i] = true;
                    }
                }
                if (lastChild) {
                    //如果不相同，储存它们的key
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
                dom = updateVnode(oldChild, curChild, lastVnode, context, mountQueue);
                removeHits[oldChild._i] = true;
            } else {
                //为了兼容 react stack reconciliation的执行顺序，添加下面三行，
                //在插入节点前，将原位置上节点对应的组件先移除
                var removed = lastChildren[j];
                if(removed && !removed._disposed && !removeHits[j] ){
                    disposeVnode(removed);
                }
                //如果找不到对应的旧节点，创建一个新节点放在这里
                dom = mountVnode(null, curChild, lastVnode, context, mountQueue);
                parentNode.insertBefore(dom, insertPoint);
            }
        } else {
            oldDom = action.last._hostNode;
            if (action.action === "moveAfter") {
                parentNode.insertBefore(oldDom, insertPoint);
            }
            dom = updateVnode(
                action.last,
                action.next,
                lastVnode,
                context,
                mountQueue
            );
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
