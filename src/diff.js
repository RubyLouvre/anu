import { options, innerHTML, toLowerCase, emptyObject, emptyArray, deprecatedWarn } from "./util";
import { createElement, insertElement, removeElement, emptyElement,createVnode } from "./browser";
import { flattenChildren } from "./createElement";
import { processFormElement } from "./ControlledComponent";
import { instantiateComponent } from "./instantiateComponent";
import { drainQueue, enqueueQueue, switchUpdaters, flushUpdaters, captureError,showError} from "./scheduler";
import { Refs, pendingRefs } from "./Refs";
import { diffProps } from "./diffProps";
import { disposeVnode } from "./dispose";
import { getContextByTypes } from "./updater";

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
    let dom = (ref.updater || ref)._hostNode;
    return dom.nodeType === 8 ? null : dom;
}
//[Top API] ReactDOM.createPortal
export function createPortal(vchildren, container) {
    var parentVnode = createVnode(container);
    parentVnode.vchildren = container.vchildren || emptyArray;
    diffChildren(parentVnode, vchildren, container, {});
    parentVnode.vchildren = vchildren;
    return null;
}


// ReactDOM.render的内部实现
function renderByAnu(vnode, container, callback, context = {}) {
    if (!isValidElement(vnode)) {
        throw `ReactDOM.render的第一个参数错误`; // eslint-disable-line
    }
    if (!(container && container.getElementsByTagName)) {
        throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }
    let rootNode,
        lastVnode = container.__component;

    if (lastVnode) {
        rootNode = alignVnode(lastVnode, vnode, createVnode(container), context);
    } else {
        //如果是后端渲染生成，它的孩子中存在一个拥有data-reactroot属性的元素节点
        rootNode = genVnodes(container, vnode, context);
    }

    if (rootNode.setAttribute) {
        rootNode.setAttribute("data-reactroot", "");
    }

   
    var instance = vnode._instance;
    container.__component = vnode;
    drainQueue();
    instance = vnode._instance;
    container.__component = vnode;
    Refs.currentOwner = null; //防止干扰
    var ret = instance || rootNode;
    if (callback) {
        callback.call(ret); //坑
    }
    //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return ret;
}
export var toArray =
    Array.from ||
    function(a) {
        var ret = [];
        for (var i = 0, n = a.length; i < n; i++) {
            ret[i] = a[i];
        }
        return ret;
    };
function genVnodes(container, vnode, context) {
    let nodes = toArray(container.childNodes || emptyArray);
    let lastNode = null;
    for (var i = 0, el; (el = nodes[i++]); ) {
        if (el.getAttribute && el.getAttribute("data-reactroot") !== null) {
            lastNode = el;
        } else {
            container.removeChild(el);
        }
    }
    return container.appendChild(mountVnode(lastNode, vnode, createVnode(container), context));
}

const patchStrategy = {
    0: mountText,
    1: mountElement,
    2: mountComponent,
    4: mountComponent,
    10: updateText,
    11: updateElement,
    12: receiveComponent,
    14: receiveComponent
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

function genMountElement(lastNode, vnode, parentVnode, type) {
    if (lastNode && toLowerCase(lastNode.nodeName) === type) {
        return lastNode;
    } else {
        let dom = createElement(vnode, parentVnode);
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

function mountElement(lastNode, vnode, parentVnode, context) {
    let { type, props, _hasRef } = vnode;
    let dom = genMountElement(lastNode, vnode, parentVnode, type);
    vnode._hostNode = dom;
    let children = flattenChildren(vnode);
    let method = lastNode ? alignChildren : mountChildren;
    method(dom, children, vnode, context);
    // dom.vchildren = children;/** fatal 不再访问真实DOM */
    if (vnode.checkProps) {
        diffProps(dom, emptyObject, props, vnode);
    }
    if (formElements[type]) {
        processFormElement(vnode, dom, props);
    }
    if (_hasRef) {
        pendingRefs.push(vnode, dom);
    }
    return dom;
}

function updateElement(lastVnode, nextVnode, parentVnode, context) {
    let { props: lastProps, _hostNode: dom, checkProps, type } = lastVnode;
    let { props: nextProps, checkProps: nextCheckProps } = nextVnode;
    nextVnode._hostNode = dom;
    let vchildren = lastVnode.vchildren || emptyArray,
        newChildren;
  
    nextVnode.old = lastVnode;
    if (nextProps[innerHTML]) {
        vchildren.forEach(function(el) {
            disposeVnode(el);
        });
        vchildren.length = 0;
    } else {
        if (nextVnode === lastVnode) {
            //如果新旧节点一样，为了防止旧vchildren被重写，需要restore一下
            newChildren = vchildren.concat();
        } else {
            newChildren = flattenChildren(nextVnode);           
        }
        if (lastProps[innerHTML]) {
            vchildren.length = 0;
        }

        diffChildren(nextVnode, newChildren, dom, context);
      
        nextVnode.vchildren = newChildren;
       
       
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
function mountChildren(parentNode, children, parentVnode, context) {
    for (let i = 0, n = children.length; i < n; i++) {
        var vnode = children[i];
        parentNode.appendChild(mountVnode(null, vnode, parentVnode, context));
    }
}

function alignChildren(parentNode, children, parentVnode, context) {
    let childNodes = parentNode.childNodes,
        insertPoint = childNodes[0] || null,
        j = 0,
        n = children.length;
    for (let i = 0; i < n; i++) {
        let vnode = children[i];
        let lastNode = childNodes[j];
        let dom = mountVnode(lastNode, vnode, parentVnode, context);
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

function mountComponent(lastNode, vnode, parentVnode, parentContext, parentUpdater) {
    let { type, props } = vnode;
    let instance = instantiateComponent(type, vnode, props, parentContext); //互相持有引用
    let updater = instance.updater;
    if (parentUpdater) {
        updater.parentUpdater = parentUpdater;
    }
    updater.parentVnode = parentVnode;
    updater.parentContext = parentContext;
    if (instance.componentWillMount) {
        captureError(instance, "componentWillMount",[]);
        showError();
        instance.state = updater.mergeStates();
    }

    updater._hydrating = true;
    let dom = updater.renderComponent(function(nextRendered, parentVnode, childContext) {
        return mountVnode(lastNode, nextRendered, parentVnode, childContext, updater);
    });
    updater.oldDatas = emptyArray;
    enqueueQueue({
        host: updater,
        exec: updater.onEnd
    });

    return dom;
}

function receiveComponent(lastVnode, nextVnode, parentVnode, parentContext) {
    let { type, _instance } = lastVnode;
    let updater = _instance.updater,
        nextContext;

    //如果正在更新过程中接受新属性，那么去掉update,加上receive
    var willReceive = lastVnode !== nextVnode;
    if (!type.contextTypes) {
        nextContext = _instance.context;
    } else {
        nextContext = getContextByTypes(parentContext, type.contextTypes);
        willReceive = true;
    }
    updater.context = nextContext;
    //parentContext在官方中被称之不nextUnmaskedContext， parentVnode称之为nextParentElement
    updater.props = nextVnode.props;
    updater.parentContext = parentContext;
    updater.nextVnode = nextVnode;
    updater.parentVnode = parentVnode;
    updater.willReceive = willReceive;

   
    if (!updater._dirty) {//如果在事件中使用了setState
        updater.inReceiveStage = [lastVnode, nextVnode, nextContext];
        enqueueQueue({
            host: updater,
            exec: updater.onUpdate
        });
    }
    return updater._hostNode;
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function alignVnode(lastVnode, nextVnode, parentVnode, context, parentUpdater) {
    let dom;
    if (isSameNode(lastVnode, nextVnode)) {
        dom = updateVnode(lastVnode, nextVnode, parentVnode, context);
    } else {
        disposeVnode(lastVnode);
        var node = lastVnode._hostNode,
            parentNode = node.parentNode;
        dom = mountVnode(null, nextVnode, parentVnode, context, parentUpdater);
        parentNode.replaceChild(dom, node);
    }
    return dom;
}
options.alignVnode = alignVnode;

function genkey(vnode) {
    return vnode.key ? "@" + vnode.key : vnode.type.name || vnode.type;
}

function getNearestNode(vnodes, ii, newVnode) {
    var distance = Infinity,
        hit = null,
        vnode,
        i = 0;
    while ((vnode = vnodes[i])) {
        var delta = vnode._i - ii;
        if (delta === 0) {
            newVnode._new = vnode;
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
    newVnode._new = hit;
    return hit;
}
function diffChildren(a, nextChildren, parentNode, context) {
    var parentVnode = a.old;
    let lastChildren = parentVnode.vchildren || emptyArray, //parentNode.vchildren,
        nextLength = nextChildren.length,
        insertPoint = parentNode.firstChild,
        lastLength = lastChildren.length;
    //optimize 1： 如果旧数组长度为零, 只进行添加
    if (!lastLength) {
        emptyElement(parentNode);
        return mountChildren(parentNode, nextChildren, parentVnode, context);
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
        if (insertPoint) {
            lastChildren[0]._hostNode = insertPoint;
        }
        return alignVnode(lastChildren[0], nextChildren[0], parentVnode, context);
    }
    //从这里开始非常复杂的节点排序算法
    //step1: 构建模糊匹配对象fuzzyHits，以虚拟DOM的key/type为键名，并记录它的旧位置
    let fuzzyHits = {},
        hit,
        i = 0,
        nextChild;

    lastChildren.forEach(function(lastChild, i) {
        hit = genkey(lastChild);
        lastChild._i = i;
        let hits = fuzzyHits[hit];
        if (hits) {
            hits.push(lastChild);
        } else {
            fuzzyHits[hit] = [lastChild];
        }
    });
    //step2: 碰撞检测，并筛选离新节点最新的节点，执行nul ref与updateComponent
    var hitIt = false;
    while (i < nextLength) {
        nextChild = nextChildren[i];
        hit = genkey(nextChild);
        let fLength = fuzzyHits[hit] && fuzzyHits[hit].length,
            hitVnode = null;
        if (fLength) {
            let fnodes = fuzzyHits[hit];
            hitIt = true;
            if (fLength > 1) {
                hitVnode = getNearestNode(fnodes, i, nextChild);
            } else {
                hitVnode = nextChild._new = fnodes[0];
                delete fuzzyHits[hit];
            }
            if (hitVnode) {
                hitVnode._hit = true;
                if (hitVnode.vtype > 1) {
                    alignVnode(hitVnode, nextChild, parentVnode, context);
                } else {
                    Refs.detachRef(hitVnode, nextChild);
                }
            }
        }
        i++;
    }
    drainQueue(); 
    //step3: 移除没有命中的虚拟DOM，执行它们的钩子与ref
    switchUpdaters();
    if (hitIt) {
        for (let i = 0; i < lastLength; i++) {
            let lastChild = lastChildren[i];
            if (!lastChild._hit) {
                disposeVnode(lastChild);
                parentNode.removeChild(lastChild._hostNode);
            }
        }
    }
    //step4: 更新元素，调整位置或插入新元素
    insertPoint = parentNode.firstChild;

    for (let i = 0, dom, oldDom; i < nextLength; i++) {
        nextChild = nextChildren[i];
        if (dom) {
            insertPoint = dom.nextSibling;
        }
        if (nextChild._new && nextChild.vtype < 2) {
            //需要防止旧的组件虚拟DOM的真实DOM又加回去
            var lastChild = nextChild._new;
            delete nextChild._new;
            oldDom = lastChild._hostNode;
            if (oldDom !== insertPoint) {
                insertElement(parentNode, oldDom, insertPoint);
            }
            dom = alignVnode(lastChild, nextChild, parentVnode, context);
        } else if ((dom = nextChild._hostNode)) {
            delete nextChild._new;
            //调整updateComponent的真实DOM位置
            if (dom !== insertPoint) {
                insertElement(parentNode, dom, insertPoint);
            }
        } else if (!nextChild._new) {
            dom = mountVnode(null, nextChild, parentVnode, context);
            insertElement(parentNode, dom, insertPoint);
        }
    }
    //React的怪异行为，如果没有组件发生更新，那么先执行添加，再执行移除
    if (!hitIt) {
        for (let i = 0; i < lastLength; i++) {
            let lastChild = lastChildren[i];
            if (!lastChild._hit) {
                disposeVnode(lastChild);
                parentNode.removeChild(lastChild._hostNode);
            }
        }
    }
    //执行新组件的componentDidMount
    flushUpdaters();
}
