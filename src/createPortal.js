import { createVnode, createElement } from "./createElement";
import { HostFiber } from "./HostFiber";

function AnuPortal(props){
    return props.children;
}

export function createPortal(children, node) {
    var vnode,
        events = node.__events;
    if (events) {
        vnode = node.__events.vnode;
    } else {
        events = node.__events = {};
        vnode = createVnode(node);
        events.vnode = vnode;
        new HostFiber(vnode);
    }

    var child = createElement(AnuPortal, { children: children });
    events.child = child;
    child.portalReturn = vnode;
    return child;
}
