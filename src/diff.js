import { diffProps } from "./diffProps";
import { CurrentOwner, flattenChildren } from "./createElement";
import { createDOMElement, removeDOMElement, getNs } from "./browser";

import { processFormElement, postUpdateSelectedOptions } from "./ControlledComponent";

import {
    noop,
    __push,
    getNodes,
    innerHTML,
    options,
    clearArray,
    checkNull,
    toLowerCase,
    getChildContext,
    EMPTY_CHILDREN,
    limitWarn
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

export function unstable_renderSubtreeIntoContainer(component, vnode, container, callback) {
    if (limitWarn.renderSubtree-- > 0) {
        console.warn("请限制使用unstable_renderSubtreeIntoContainer,它末见于文档,会导致升级问题"); // eslint-disable-line
    }
    var parentContext = component && component.context || {};
    return renderByAnu(vnode, container, callback, parentContext);
}
export function unmountComponentAtNode(dom) {
    var prevVnode = dom.__component;
    if (prevVnode) {
        alignVnode(prevVnode, {
            type: "#text",
            text: "empty",
            vtype: 0
        }, dom.firstChild, {}, EMPTY_CHILDREN);
    }
}
export function isValidElement(vnode) {
    return vnode && vnode.vtype;
}

function clearRefsAndMounts(queue) {
    queue
        .forEach(function (instance) {
            let refFns = instance.__pendingRefs;
            for (var i = 0, refFn; refFn = refFns[i++];) {
                refFn();
            }
            refFns.length = 0;

            if (instance.componentDidMount) {
                instance.componentDidMount();
                instance.componentDidMount = null;
            }
            instance.__collectRefs = noop
            instance.__hydrating = false

            while (instance.__renderInNextCycle) {
                _refreshComponent(instance, instance.__current._hostNode, [])
            }
            clearArray(instance.__pendingCallbacks)
                .forEach(function (fn) {
                    fn.call(instance);
                });

        });
    queue.length = 0;
}

var dirtyComponents = []
options.flushBatchedUpdates = function (queue) {
    clearRefsAndMounts(queue || dirtyComponents)
}
options.enqueueUpdate = function (instance) {
    dirtyComponents.push(instance)
}

function refreshComponent(instance, mountQueue) {
    // shouldComponentUpdate为false时不能阻止setState/forceUpdate cb的触发
    let dom = instance.__current._hostNode;
    dom = _refreshComponent(instance, dom, mountQueue);
    while (instance.__renderInNextCycle) {
        dom = _refreshComponent(instance, dom, mountQueue);
    }
    clearArray(instance.__pendingCallbacks)
        .forEach(function (fn) {
            fn.call(instance);
        });

    return dom
}
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
        throw new Error(`${vnode}必须为组件或元素节点, 但现在你的类型却是${Object.prototype.toString.call(vnode)}`);
    }
    if (!container || container.nodeType !== 1) {
        console.warn(`${container}必须为元素节点`); // eslint-disable-line
        return;
    }
    let mountQueue = [];
    let lastVnode = container.__component;
    mountQueue.mountAll = true;

    parentContext = parentContext || {};
    let rootNode = lastVnode
        ? alignVnode(lastVnode, vnode, container.firstChild, parentContext, mountQueue)
        : genVnodes(vnode, container, parentContext, mountQueue);

    // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
    // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数

    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

    var instance = vnode._instance;
    container.__component = vnode;
    clearRefsAndMounts(mountQueue);
    var ret = instance || rootNode
    if (callback) {
        callback.call(ret);//坑
    }

    return ret;
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
}

function genVnodes(vnode, container, context, mountQueue) {
    let nodes = getNodes(container);
    let prevRendered = null;
    //eslint-disable-next-line
    for (var i = 0, el; (el = nodes[i++]);) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            prevRendered = el;
        } else {
            el
                .parentNode
                .removeChild(el);
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

let patchAdapter = {
    0: mountText,
    1: mountElement,
    2: mountComponent,
    4: mountStateless,
    10: updateText,
    11: updateElement,
    12: updateComponent,
    14: updateStateless
};



export function mountVnode(vnode, context, prevRendered, mountQueue) {
    return patchAdapter[vnode.vtype](vnode, context, prevRendered, mountQueue);
}

function mountText(vnode, context, prevRendered) {
    let node = prevRendered && prevRendered.nodeName === vnode.type
        ? prevRendered
        : createDOMElement(vnode);
    vnode._hostNode = node;
    return node;
}

function genMountElement(vnode, type, prevRendered) {
    if (prevRendered && toLowerCase(prevRendered.nodeName) === type) {
        return prevRendered;
    } else {
        vnode.ns = getNs(type);
        let dom = createDOMElement(vnode);
        if (prevRendered)
            while (prevRendered.firstChild) {
                dom.appendChild(prevRendered.firstChild);
            }

        return dom;
    }
}

function mountElement(vnode, context, prevRendered, mountQueue) {
    let { type, props, _owner, ref } = vnode;
    let dom = genMountElement(vnode, type, prevRendered);

    vnode._hostNode = dom;

    let method = prevRendered
        ? alignChildren
        : mountChildren;
    method(vnode, dom, context, mountQueue);

    if (vnode.checkProps) {
        diffProps(props, {}, vnode, {}, dom);
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

function mountComponent(vnode, context, prevRendered, mountQueue) {
    let { type, ref, props } = vnode;

    let instance = new type(props, context); //互相持有引用
    CurrentOwner.cur = null
    vnode._instance = instance;
    //防止用户没有调用super或没有传够参数
    instance.props = instance.props || props;
    instance.context = instance.context || context;

    if (instance.componentWillMount) {
        instance.componentWillMount();
        instance.state = instance.__mergeStates(props, context);
    }

    let rendered = renderComponent.call(instance, vnode, props, context);
    instance.__hydrating = true
    var childContext = rendered.vtype
        ? getChildContext(instance, context)
        : context;
    instance.__childContext = context //用于在updateChange中比较
    let dom = mountVnode(rendered, childContext, prevRendered, mountQueue);
    vnode._hostNode = dom;
    rendered_hostNode = dom
    mountQueue.push(instance);

    options.afterMount(instance);
    return dom;
}

function Stateless(render) {
    this.refs = {};
    this.__render = render;
    this.__current = {}
    this.__collectRefs = noop;
}

var renderComponent = function (vnode, props, context) {
    CurrentOwner.cur = this;
    let rendered = this.__render
        ? this.__render(props, context)
        : this.render()
    CurrentOwner.cur = null
    rendered = checkNull(rendered, vnode.type);
    this.context = context;
    this.props = props;
    vnode._instance = this;
    var dom = this.__current._hostNode
    this.__current = vnode;
    vnode._hostNode = dom
    vnode._renderedVnode = rendered;
    return rendered;
};

Stateless.prototype.render = renderComponent
function mountStateless(vnode, context, prevRendered, mountQueue) {
    let { type, props } = vnode
    let instance = new Stateless(type);
    let rendered = instance.render(vnode, props, context);
    let dom = mountVnode(rendered, context, prevRendered, mountQueue);
    return vnode._hostNode = dom;
}

function updateStateless(lastTypeVnode, nextTypeVnode, context, mountQueue) {
    let instance = lastTypeVnode._instance;
    let lastVnode = lastTypeVnode._renderedVnode;
    let nextVnode = instance.render(nextTypeVnode, nextTypeVnode.props, context);
    let dom = alignVnode(lastVnode, nextVnode, lastVnode._hostNode, context, mountQueue);
    nextTypeVnode._hostNode = dom;
    return dom;
}
var contextHasChange = false
var contextStatus = []
function isEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            return 1
    }
    return 0
}
function _refreshComponent(instance, dom, mountQueue) {
    let {
        lastProps,
        lastContext,
        state: lastState,
        context: nextContext,
        __current: vnode,
        props: nextProps,
        constructor: type
    } = instance;

    lastProps = lastProps || nextProps;
    let nextState = instance.__mergeStates(nextProps, nextContext);
    instance.props = lastProps;

    instance.__renderInNextCycle = null
    if (!instance.__forceUpdate && instance.shouldComponentUpdate && instance.shouldComponentUpdate(nextProps, nextState, nextContext) === false) {
        instance.__forceUpdate = false;
        return dom;
    }
    instance.__hydrating = true
    instance.__forceUpdate = false
    if (instance.componentWillUpdate) {
        instance.componentWillUpdate(nextProps, nextState, nextContext);
    }
    instance.props = nextProps;
    instance.state = nextState;

    let lastRendered = vnode._renderedVnode;
    let nextElement = instance.__next || vnode;
    if (!lastRendered._hostNode) {
        lastRendered._hostNode = dom;
    }
    let rendered = renderComponent.call(instance, nextElement, nextProps, nextContext);
    delete instance.__next;
    var childContext = rendered.vtype
        ? getChildContext(instance, nextContext)
        : nextContext;


    contextStatus.push(contextHasChange)

    var prevChildContext = instance.__childContext
    instance.__childContext = childContext
    //如果两个context都为空对象，就不比较引用，认为它们没有变
    contextHasChange = (isEmpty(prevChildContext) + isEmpty(childContext)) && prevChildContext !== childContext

    dom = alignVnode(lastRendered, rendered, dom, childContext, mountQueue);

    contextHasChange = contextStatus.pop()

    nextElement._hostNode = dom;

    if (instance.componentDidUpdate) {
        instance.componentDidUpdate(lastProps, lastState, lastContext);
    }


    instance.__hydrating = false;

    options.afterUpdate(instance);
    if (instance.__renderInNextCycle && mountQueue.mountAll) {
        mountQueue.push(instance)
    }
    return dom;
}

function updateComponent(lastVnode, nextVnode, context, mountQueue) {
    let instance = nextVnode._instance = lastVnode._instance;
    instance.__next = nextVnode;
    let nextProps = nextVnode.props
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
        nextVnode.ref(instance);
    }
    return refreshComponent(instance, mountQueue);
}

export function alignVnode(lastVnode, nextVnode, node, context, mountQueue) {

    let dom = node;
    //eslint-disable-next-line

    if (lastVnode.type !== nextVnode.type || lastVnode.key !== nextVnode.key) {

        disposeVnode(lastVnode);
        let innerMountQueue = mountQueue.mountAll
            ? mountQueue
            : nextVnode.vtype === 2
                ? []
                : mountQueue;
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
    let vnode = ref.__current;
    return vnode._hostNode || null;
}

function updateText(lastVnode, nextVnode) {
    let dom = lastVnode._hostNode
    nextVnode._hostNode = dom;
    if (lastVnode.text !== nextVnode.text) {
        dom.nodeValue = nextVnode.text;
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, context, mountQueue) {
    let dom = lastVnode._hostNode
    let lastProps = lastVnode.props;
    let nextProps = nextVnode.props;
    nextVnode._hostNode = dom;
    if (nextProps[innerHTML]) {
        var list = lastVnode
            .vchildren || []
        list.forEach(function (el) {
            disposeVnode(el);
        });
    } else {
        if (lastProps[innerHTML]) {
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
            mountChildren(nextVnode, dom, context, mountQueue);
        } else {
            updateChildren(lastVnode, nextVnode, nextVnode._hostNode, context, mountQueue);
        }
    }

    if (lastVnode.checkProps || nextVnode.checkProps) {
        diffProps(nextProps, lastProps, nextVnode, lastVnode, dom);
    }
    if (nextVnode.type === "select") {
        postUpdateSelectedOptions(nextVnode);
    }
    if (nextVnode.ref) {
        nextVnode.ref(dom);
    }
    return dom;
}

function updateVnode(lastVnode, nextVnode, context, mountQueue) {
    return patchAdapter[lastVnode.vtype + 10](lastVnode, nextVnode, context, mountQueue);
}

function updateChildren(lastVnode, nextVnode, parentNode, context, mountQueue) {
    let lastChildren = lastVnode.vchildren;
    let nextChildren = flattenChildren(nextVnode);//nextVnode.props.children;
    let childNodes = parentNode.childNodes;
    let mountAll = mountQueue.mountAll;
    if (nextChildren.length == 0) {
        lastChildren
            .forEach(function (el) {
                var node = el._hostNode;
                if (node) {
                    removeDOMElement(node);
                }
                disposeVnode(el);
            });
        return;
    }

    var hashcode = {};
    lastChildren.forEach(function (el) {
        let key = el.type + (el.key || "");
        let list = hashcode[key];
        if (list) {
            list.push(el);
        } else {
            hashcode[key] = [el];
        }
    });
    nextChildren.forEach(function (el) {
        let key = el.type + (el.key || "");
        let list = hashcode[key];
        if (list) {
            let old = list.shift();
            if (old) {
                el.old = old;
            } else {
                delete hashcode[key];
            }
        }
    });
    for (let i in hashcode) {
        let list = hashcode[i];
        if (Array.isArray(list)) {
            list
                .forEach(function (el) {
                    let node = el._hostNode;
                    if (node) {
                        removeDOMElement(node);
                    }
                    disposeVnode(el);
                });
        }
    }
    nextChildren
        .forEach(function (el, index) {
            let old = el.old,
                ref,
                dom,
                queue = mountAll
                    ? mountQueue
                    : [];
            if (old) {
                delete el.old;

                if (el === old && old._hostNode && !contextHasChange) {
                    //cloneElement
                    dom = old._hostNode;
                } else {
                    dom = updateVnode(old, el, context, queue);
                }
            } else {
                dom = mountVnode(el, context, null, queue);
            }
            ref = childNodes[index];
            if (dom !== ref)
                insertDOM(parentNode, dom, ref);
            if (!mountAll && queue.length) {
                clearRefsAndMounts(queue);
            }
        });
}
function insertDOM(parentNode, dom, ref) {
    if (!dom) {
        return console.warn('元素末初始化')
    }
    if (!ref) {
        parentNode.appendChild(dom);
    } else {
        parentNode.insertBefore(dom, ref);
    }
}


