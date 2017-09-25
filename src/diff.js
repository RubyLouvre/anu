import { diffProps } from "./diffProps";
import { CurrentOwner, flattenChildren } from "./createElement";
import { createDOMElement, removeDOMElement, getNs } from "./browser";
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
        alignVnode(
            prevVnode,
            {
                type: "#comment",
                text: "empty",
                vtype: 0
            },
            dom.firstChild,
            {},
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
        if (instance.componentDidMount) {
            instance.componentDidMount();
            instance.componentDidMount = null;
        }
        instance.__hydrating = false;
        while (instance.__renderInNextCycle) {
            _refreshComponent(instance, instance.__dom, []);
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
options.enqueueUpdate = function(instance) {
    dirtyComponents.push(instance);
};

/**
 * ReactDOM.render
 * 用于驱动视图第一次刷新
 * @param {any} vnode 
 * @param {any} container 
 * @param {any} callback 
 * @param {any} parentContext 
 * @returns 
 */
function renderByAnu(vnode, container, callback, parentContext) {
    if (!isValidElement(vnode)) {
        throw  `ReactDOM.render的第一个参数错误`; // eslint-disable-line
    }
    if (!(container && container.getElementsByTagName)) {
        throw  `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }
    let mountQueue = [];
    let lastVnode = container.__component;
    mountQueue.mountAll = true;

    parentContext = parentContext || {};

    let rootNode = lastVnode
        ? alignVnode(
            lastVnode,
            vnode,
            container.firstChild,
            parentContext,
            mountQueue
        )
        : genVnodes(vnode, container, parentContext, mountQueue);

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

function genVnodes(vnode, container, context, mountQueue) {
    let nodes = getNodes(container);
    let prevRendered = null;
    //eslint-disable-next-line
    for (var i = 0, el; (el = nodes[i++]); ) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            prevRendered = el;
        } else {
            el.parentNode.removeChild(el);
        }
    }

    let rootNode = mountVnode(vnode, context, prevRendered, mountQueue);
    container.appendChild(rootNode);

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
    14: updateStateless
};

export function mountVnode(vnode, context, prevRendered, mountQueue, ns) {
    return patchStrategy[vnode.vtype](vnode, context, prevRendered, mountQueue, ns);
}

function mountText(vnode, context, prevRendered) {
    let node =
    prevRendered && prevRendered.nodeName === vnode.type
        ? prevRendered
        : createDOMElement(vnode);
    vnode._hostNode = node;
    return node;
}

function addNS(vnode) {
    const type = typeNumber(vnode.props.children);

    if (type < 7) {
        return;
    } else if (type === 7) {
        vnode.props.children.forEach(function(child) {
            child.ns = vnode.ns;
        });
    } else if (type === 8) {
        vnode.props.children.ns = vnode.ns;
    }
}

function genMountElement(vnode, type, prevRendered, ns) {
    if (prevRendered && toLowerCase(prevRendered.nodeName) === type) {
        return prevRendered;
    } else {
        vnode.ns = vnode.ns || ns || getNs(type) || null;
        if (vnode.ns) {
            addNS(vnode);
        }
        let dom = createDOMElement(vnode);
        if (prevRendered) {
            while (prevRendered.firstChild) {
                dom.appendChild(prevRendered.firstChild);
            }
        }

        return dom;
    }
}

function mountElement(vnode, context, prevRendered, mountQueue, ns) {
    let { type, props, ref } = vnode;
    let dom = genMountElement(vnode, type, prevRendered, ns);

    vnode._hostNode = dom;

    let method = prevRendered ? alignChildren : mountChildren;
    method(vnode, dom, context, mountQueue);

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
function mountChildren(vnode, parentNode, context, mountQueue) {
    var children = flattenChildren(vnode);
    for (let i = 0, n = children.length; i < n; i++) {
        let el = children[i];
        let curNode = mountVnode(el, context, null, mountQueue);

        parentNode.appendChild(curNode);
    }
}

function alignChildren(vnode, parentNode, context, mountQueue) {
    let children = flattenChildren(vnode),
        childNodes = parentNode.childNodes,
        insertPoint = childNodes[0] || null,
        j = 0,
        n = children.length;
    for (let i = 0; i < n; i++) {
        let el = children[i];
        let lastDom = childNodes[j];
        let dom = mountVnode(el, context, lastDom, mountQueue);
        if (dom === lastDom) {
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
function buildInstanceChain(rendered, instance) {
    if (rendered._instance) {
        rendered._instance.__parentInstance = instance;
    }
}

function updateInstanceDOM(instance, dom) {
    instance.__dom = instance.__current._hostNode = dom;
    var parent = instance.__parentInstance;
    if (parent) {
        updateInstanceDOM(parent, dom);
    }
}

function mountComponent(vnode, context, prevRendered, mountQueue) {
    let { type, ref, props } = vnode;
    let lastOwn = CurrentOwner.cur;
    let instance = new type(props, context); //互相持有引用
    CurrentOwner.cur = lastOwn;
    vnode._instance = instance;
    //防止用户没有调用super或没有传够参数
    instance.props = instance.props || props;
    instance.context = instance.context || context;

    if (instance.componentWillMount) {
        instance.componentWillMount();
        instance.state = instance.__mergeStates(props, context);
    }

    let rendered = renderComponent.call(instance, vnode, props, context);
    instance.__hydrating = true;
    var childContext = rendered.vtype
        ? getChildContext(instance, context)
        : context;
    instance.__childContext = context; //用于在updateChange中比较
    let dom = mountVnode(rendered, childContext, prevRendered, mountQueue);

    instance.__current = vnode;
    buildInstanceChain(rendered, instance);
    updateInstanceDOM(instance, dom);

    if (ref) {
        pendingRefs.push(ref.bind(0, instance));
    }

    options.afterMount(instance);
    mountQueue.push(instance);
    return dom;
}

function Stateless(render) {
    this.refs = {};
    this.__render = render;
    this.__current = noop;
}

var renderComponent = function(vnode, props, context) {
    //调整全局的 CurrentOwner.cur
    var lastOwn = CurrentOwner.cur;
    CurrentOwner.cur = this;
    options.beforeRender(this);
    let rendered = this.__render ? this.__render(props, context) : this.render();

    CurrentOwner.cur = lastOwn;
    //组件只能返回组件或null
    rendered = checkNull(rendered, vnode.type);

    this.context = context;
    this.props = props;

    vnode._instance = this;
    this.__rendered = rendered;
    return rendered;
};

Stateless.prototype.render = renderComponent;
function mountStateless(vnode, context, prevRendered, mountQueue) {
    let { type, props, ref } = vnode;
    let instance = new Stateless(type),
        rendered = instance.render(vnode, props, context),
        dom = mountVnode(rendered, context, prevRendered, mountQueue);

    instance.__current = vnode;
    buildInstanceChain(rendered, instance);
    updateInstanceDOM(instance, dom);

    if (ref) {
        pendingRefs.push(ref.bind(0, null));
    }

    return dom;
}

function updateStateless(lastTypeVnode, nextTypeVnode, context, mountQueue) {
    let instance = lastTypeVnode._instance,
        lastRendered = instance.__rendered,
        dom = instance.__dom,
        rendered = instance.render(nextTypeVnode, nextTypeVnode.props, context);

    dom = alignVnode(lastRendered, rendered, dom, context, mountQueue);

    instance.__current = nextTypeVnode;
    buildInstanceChain(rendered, instance);
    updateInstanceDOM(instance, dom);

    if (nextTypeVnode.ref) {
        pendingRefs.push(nextTypeVnode.ref.bind(0, null));
    }
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

function refreshComponent(instance, mountQueue) {
    // shouldComponentUpdate为false时不能阻止setState/forceUpdate cb的触发
    let dom = instance.__dom;
    dom = _refreshComponent(instance, dom, mountQueue);
    while (instance.__renderInNextCycle) {
        dom = _refreshComponent(instance, dom, mountQueue);
    }
    clearArray(instance.__pendingCallbacks).forEach(function(fn) {
        fn.call(instance);
    });

    return dom;
}
function _refreshComponent(instance, dom, mountQueue) {
    let {
        lastProps,
        lastContext,
        state: lastState,
        context: nextContext,
        __rendered: lastRendered,
        __current: lastTypeVnode,
        props: nextProps
    } = instance;

    lastProps = lastProps || nextProps;
    let nextState = instance.__mergeStates(nextProps, nextContext);
    instance.props = lastProps;

    instance.__renderInNextCycle = null;
    if (
        !instance.__forceUpdate &&
    instance.shouldComponentUpdate &&
    instance.shouldComponentUpdate(nextProps, nextState, nextContext) === false
    ) {
        instance.__forceUpdate = false;
        return dom;
    }
    instance.__hydrating = true;
    instance.__forceUpdate = false;
    if (instance.componentWillUpdate) {
        instance.componentWillUpdate(nextProps, nextState, nextContext);
    }
    instance.props = nextProps;
    instance.state = nextState;

    let nextTypeVnode = instance.__next || lastTypeVnode;
    let rendered = renderComponent.call(
        instance,
        nextTypeVnode,
        nextProps,
        nextContext
    );
    delete instance.__next;
    var childContext = rendered.vtype
        ? getChildContext(instance, nextContext)
        : nextContext;

    contextStatus.push(contextHasChange);

    var prevChildContext = instance.__childContext;
    instance.__childContext = childContext;
    //如果两个context都为空对象，就不比较引用，认为它们没有变
    contextHasChange =
    isEmpty(prevChildContext) + isEmpty(childContext) &&
    prevChildContext !== childContext;
    dom = alignVnode(lastRendered, rendered, dom, childContext, mountQueue);
    contextHasChange = contextStatus.pop();

    instance.__current = nextTypeVnode;
    buildInstanceChain(rendered, instance);
    updateInstanceDOM(instance, dom);

    if (instance.componentDidUpdate) {
        instance.__didUpdate = true;
        instance.componentDidUpdate(lastProps, lastState, lastContext);
        if (!instance.__renderInNextCycle) {
            instance.__didUpdate = false;
        }
    }

    instance.__hydrating = false;

    options.afterUpdate(instance);
    if (instance.__renderInNextCycle && mountQueue.mountAll) {
        mountQueue.push(instance);
    }
    return dom;
}

function updateComponent(lastVnode, nextVnode, context, mountQueue) {
    let instance = (nextVnode._instance = lastVnode._instance);
    if (!lastVnode._hostNode) {
        if (instance) {
            lastVnode._hostNode = instance.__dom;
            instance.__current = lastVnode;
        } else {
            return;
        }
    }
    instance.__next = nextVnode;
    let nextProps = nextVnode.props;
    instance.lastProps = instance.props;
    instance.lastContext = instance.context;

    if (instance.componentWillReceiveProps) {
        instance.__receiving = true;
        instance.componentWillReceiveProps(nextProps, context);
        instance.__receiving = false;
    }

    instance.props = nextProps;
    instance.context = context;
    if (nextVnode.ref) {
        pendingRefs.push(nextVnode.ref.bind(0, instance));
    }
    return refreshComponent(instance, mountQueue);
}

export function alignVnode(lastVnode, nextVnode, node, context, mountQueue) {
    let dom = node;
    if (lastVnode.type !== nextVnode.type || lastVnode.key !== nextVnode.key) {
        disposeVnode(lastVnode);
        let innerMountQueue = mountQueue.mountAll
            ? mountQueue
            : nextVnode.vtype === 2 ? [] : mountQueue;
        dom = mountVnode(nextVnode, context, null, innerMountQueue);
        let p = node.parentNode;
        if (p) {
            p.replaceChild(dom, node);
            removeDOMElement(node);
        }
        if (innerMountQueue !== mountQueue) {
            clearRefsAndMounts(innerMountQueue);
        }
    } else if (lastVnode !== nextVnode || contextHasChange) {
        dom = updateVnode(lastVnode, nextVnode, context, mountQueue);
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

function updateElement(lastVnode, nextVnode, context, mountQueue) {
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
            mountChildren(nextVnode, dom, context, mountQueue);
        } else {
            updateChildren(
                lastVnode,
                nextVnode,
                nextVnode._hostNode,
                context,
                mountQueue
            );
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

function updateVnode(lastVnode, nextVnode, context, mountQueue) {
    return patchStrategy[lastVnode.vtype + 10](
        lastVnode,
        nextVnode,
        context,
        mountQueue
    );
}

function updateChildren(lastVnode, nextVnode, parentNode, context, mountQueue) {
    let lastChildren = lastVnode.vchildren,
        nextChildren = flattenChildren(nextVnode), //nextVnode.props.children;
        childNodes = parentNode.childNodes,
        hashcode = {},
        mountAll = mountQueue.mountAll;
    if (nextChildren.length == 0) {
        lastChildren.forEach(function(el) {
            var node = el._hostNode;
            if (node) {
                removeDOMElement(node);
            }
            disposeVnode(el);
        });
        return;
    }

    lastChildren.forEach(function(el, i) {
        let key = el.type + (el.key || "");
        if (el._disposed) {
            return;
        }
        let list = hashcode[key];
        el._index = i;
        if (list) {
            list.push(el);
        } else {
            hashcode[key] = [el];
        }
    });
    nextChildren.forEach(function(el) {
        let key = el.type + (el.key || "");
        let list = hashcode[key];
        if (list) {
            let old = list.shift();
            if (old) {
                el.old = old;
                if (!list.length) {
                    delete hashcode[key];
                }
            }
        }
    });
    var removed = [];
    for (let i in hashcode) {
        let list = hashcode[i];
        if (Array.isArray(list)) {
            removed.push.apply(removed, list);
        }
    }
    removed.sort(function(a, b) {
        return a._index - b._index;
    });
    nextChildren.forEach(function(el, index) {
        let old = el.old,
            ref,
            dom,
            queue = mountAll ? mountQueue : [];

        removeNodes(removed, true);

        if (old) {
            delete el.old;

            if (el === old && old._hostNode && !contextHasChange) {
                //cloneElement
                dom = old._hostNode;
                if (dom !== childNodes[index]) {
                    parentNode.replaceChild(dom, childNodes[index]);
                    return;
                }
            } else {
                dom = updateVnode(old, el, context, queue);
                if (!dom) {
                    dom = createDOMElement({ vtype: "#comment", text: "placeholder" });
                    replaceChildDeday([old, el, context, queue], dom, parentNode);
                }
            }
        } else {
            let ns;

            if (lastVnode._hostNode) {
                let node = lastVnode._hostNode;

                ns = node.namespaceURI;

                while(!ns && (node = node.parentNode)) {
                    ns = node.namespaceURI;

                    if (ns) {
                        break;
                    }
                }
            }
            dom = mountVnode(el, context, null, queue, ns);
        }

        ref = childNodes[index];
        if (dom !== ref) {
            insertDOM(parentNode, dom, ref);
        }
        if (!mountAll && queue.length) {
            clearRefsAndMounts(queue);
        }
    });
    removeNodes(removed);
}
function removeNodes(removed, one) {
    while (removed.length) {
        let removedEl = removed.shift();
        let node = removedEl._hostNode;
        if (node) {
            removeDOMElement(node);
        }
        disposeVnode(removedEl);
        if (one) {
            break;
        }
    }
}
function replaceChildDeday(args, dom1, parentNode) {
    setTimeout(function() {
        var dom2 = updateVnode.apply(0, args);
        parentNode.replaceChild(dom2, dom1);
    });
}
function insertDOM(parentNode, dom, ref) {
    if (!dom) {
    return console.warn("元素末初始化"); // eslint-disable-line
    }

    if (!ref) {
        parentNode.appendChild(dom);
    } else {
        parentNode.insertBefore(dom, ref);
    }
}
