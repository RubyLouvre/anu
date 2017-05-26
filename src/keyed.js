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

    if ((aStart <= aEnd || bStart <= bEnd) ) {
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
        next = nextPos < nextChildren.length
            ? nextChildren[nextPos].ref
            : null;
        do {
            vNodeInsertChild(hostParent, b[bStart++], next, hostParent);
        } while (bStart <= bEnd);
    }
}

export function initVnode(vnode, parentContext, namespaceURI) {
    let { vtype } = vnode
    let node = null
    if (!vtype || vtype === 1) { // init text
        node = createDOMNode(vnode, namespaceURI)
    } else if (vtype === 2) { // init stateful component
        node = initVcomponent(vnode, parentContext, namespaceURI)
    } else if (vtype === 4) { // init stateless component
        node = initVstateless(vnode, parentContext, namespaceURI)
    } 
    return node
}