function _syncChildrenNaive(nextChildren, lastChildren, hostParent, context) {
    let parentNode = hostParent._hostNode
    let aStart = 0;
    let bStart = 0;
    let aEnd = lastChildren.length - 1;
    let bEnd = nextChildren.length - 1;
    let aNode;
    let bNode;
    let nextPos;
    let next

    // Sync similar nodes at the beginning.
    while (aStart <= aEnd && bStart <= bEnd) {
        aNode = lastChildren[aStart];
        bNode = nextChildren[bStart];

        if (aNode.type !== bNode.type || aNode.key !== bNode.key) {
            break;
        }

        aStart++;
        bStart++;

        diff(aNode, bNode, hostParent, context);
    }

    // Sync similar nodes at the end.
    while (aStart <= aEnd && bStart <= bEnd) {
        aNode = lastChildren[aEnd];
        bNode = nextChildren[bEnd];

        if (aNode.type !== bNode.type || aNode.key !== bNode.key) {
            break;
        }

        aEnd--;
        bEnd--;

        diff(aNode, bNode, hostParent, context);
    }

    if ((aStart <= aEnd || bStart <= bEnd)) {
        console.log("VNode sync children: children shape is changing, you should enable tracking by k" +
            "ey with VNode method trackByKeyChildren(children).\nIf you certain that children" +
            " shape changes won't cause any problems with losing state, you can remove this e" +
            "rror message with VNode method disableChildrenShapeError().");
    }

    // Iterate over the remaining nodes and if they have the same type, then sync,
    // otherwise just remove the old node and insert the new one.
    while (aStart <= aEnd && bStart <= bEnd) {
        aNode = lastChildren[aStart++];
        bNode = nextChildren[bStart++];
        if (aNode.type == bNode.type && aNode._key === bNode._key) {
            diff(aNode, bNode, hostParent, context);
        } else {
            vNodeReplaceChild(hostParent, bNode, aNode, hostParent);
        }
    }

    if (aStart <= aEnd) {
        // All nodes from a are synced, remove the rest.
        do {
            vNodeRemoveChild(hostParent, nextChildren[aStart++]);
        } while (aStart <= aEnd);
    } else if (bStart <= bEnd) {
        // All nodes from b are synced, insert the rest.
        nextPos = bEnd + 1;
        next = nextPos < nextChildren.length ?
            nextChildren[nextPos].ref :
            null;
        do {
            vNodeInsertChild(hostParent, b[bStart++], next, hostParent);
        } while (bStart <= bEnd);
    }
}
//将虚拟DOM转换成对应的真实DOM，但不会插入DOM树
export function initVnode(vnode, parentContext, namespaceURI) {
    let {
        vtype
    } = vnode
    let node = null
    if (!vtype || vtype === 1) { // init text
        node = createDOMNode(vnode, namespaceURI)
    } else if (vtype === 2) { // init stateful instance
        node = initVcomponent(vnode, parentContext, namespaceURI)
    } else if (vtype === 4) { // init stateless component
        node = initVstateless(vnode, parentContext, namespaceURI)
    }
    return node
}

function initVcomponent(vcomponent, parentContext, namespaceURI) {
    let {
        type,
        props,
        uid
    } = vcomponent
    let component = new Component(props, parentContext)

    instance.props = instance.props || props
    instance.context = instance.context || instanceContext
    if (component.componentWillMount) {
        instance.componentWillMount()
    }
    let vnode = renderComponent(component)
    let node = initVnode(vnode, getContext(component, parentContext), namespaceURI)


    _.addItem(pendingComponents, instance)

    if (vcomponent.ref != null) {
        _.addItem(pendingRefs, vcomponent)
        _.addItem(pendingRefs, instance)
    }

    return node
}

function checkNull(vnode, type) {
    if (vnode === null || vnode === false) {
        return {
            type: '#comment',
            text: 'empty'
        }
    } else if (!vnode || !vnode.vtype) {
        throw new Error(`@${type.name}#render:You may have returned undefined, an array or some other invalid object`)
    }
    return vnode
}

function initVstateless(vstateless, parentContext, namespaceURI) {
    let rendered = renderVstateless(vstateless, parentContext)

    vstateless._rendered = rendered
    let node = initVnode(rendered, parentContext, namespaceURI)

    return node
}

function renderVstateless(vstateless, parentContext) {

    let rendered = vstateless.type(props, parentContext)
    rendered = checkNull(rendered)
    return rendered
}

function updateVstateless(vstateless, newVstateless, node, parentContext) {

    let rendered = renderVstateless(newVstateless, parentContext)
    let newNode = compareTwoVnodes(vstateless._rendered, rendered, node, parentContext)

    return newNode
}

function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
    let uid = vcomponent.uid
    let component = node.cache[uid]
    let {
        $updater: updater,
        $cache: cache
    } = component
    let {
        type: Component,
        props: nextProps
    } = newVcomponent
    let componentContext = getContextByTypes(parentContext, Component.contextTypes)
    delete node.cache[uid]
    node.cache[newVcomponent.uid] = component
    cache.parentContext = parentContext
    if (component.componentWillReceiveProps) {
        let needToggleIsPending = !updater.isPending
        if (needToggleIsPending) updater.isPending = true
        component.componentWillReceiveProps(nextProps, componentContext)
        if (needToggleIsPending) updater.isPending = false
    }

    if (vcomponent.ref !== newVcomponent.ref) {
        detachRef(vcomponent.refs, vcomponent.ref, component)
        attachRef(newVcomponent.refs, newVcomponent.ref, component)
    }

    updater.emitUpdate(nextProps, componentContext)

    return cache.node
}

function applyUpdate(data) {
    if (!data) {
        return
    }
    let vnode = data.vnode
    let newNode = data.node

    // update
    if (!data.shouldIgnore) {
        if (!vnode.vtype) {
            newNode.replaceData(0, newNode.length, data.newVnode)
        } else if (vnode.vtype === VELEMENT) {
            updateVelem(vnode, data.newVnode, newNode, data.parentContext)
        } else if (vnode.vtype === VSTATELESS) {
            newNode = updateVstateless(vnode, data.newVnode, newNode, data.parentContext)
        } else if (vnode.vtype === VCOMPONENT) {
            newNode = updateVcomponent(vnode, data.newVnode, newNode, data.parentContext)
        }
    }

    // re-order
    let currentNode = newNode.parentNode.childNodes[data.index]
    if (currentNode !== newNode) {
        newNode.parentNode.insertBefore(newNode, currentNode)
    }
    return newNode
}

// compareTwoVnodes(分类处理，执行removeChild, replaceChild, updateAttribute) --> 
// 

export function compareTwoVnodes(vnode, newVnode, node, parentContext) {
    let newNode = node
    if (newVnode == null) {
        // remove
        destroyVnode(vnode, node) //不做DOM操作
        node.parentNode.removeChild(node)
    } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
        // replace
        destroyVnode(vnode, node) //不做DOM操作
        newNode = initVnode(newVnode, parentContext, node.namespaceURI)
        node.parentNode.replaceChild(newNode, node)
    } else if (vnode !== newVnode) {
        // same type and same key -> update
        newNode = updateVnode(vnode, newVnode, node, parentContext)
    }
    return newNode
}

function updateVnode(vnode, newVnode, node, parentContext) {
    let {
        vtype
    } = vnode

    if (vtype === 2) {
        return updateVcomponent(vnode, newVnode, node, parentContext)
    }

    if (vtype === 4) {
        return updateVstateless(vnode, newVnode, node, parentContext)
    }

    // ignore VCOMMENT and other vtypes
    if (!vtype ) {
        if(vnode.text !== newVnode.text){
            node.nodeValue = newVnode.text
        }
        return node
    }

    let oldHtml = vnode.props[HTML_KEY] && vnode.props[HTML_KEY].__html
    //如果真实DOM的孩子是动态生成出来的
    if (oldHtml != null) {
        node.textContext = ''
       // updateVelem(vnode, newVnode, node, parentContext)
        initVchildren(newVnode, node, parentContext)
    } else {
        updateVChildren(vnode, newVnode, node, parentContext)
        updateVelem(vnode, newVnode, node, parentContext)
    }
    return node
}

function updateVelem(velem, newVelem, node) {
   // let isCustomComponent = velem.type.indexOf('-') >= 0 || velem.props.is != null
    patchProps(node, velem.props, newVelem.props)
    if (velem.ref !== newVelem.ref) {
      //  detachRef(velem.refs, velem.ref, node)
      //  attachRef(newVelem.refs, newVelem.ref, node)
    }
    return node
}