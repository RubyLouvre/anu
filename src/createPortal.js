import { createVnode, createElement } from "./createElement";
import { ComponentFiber } from "./ComponentFiber";
function AnuPortal(props){
    return props.children;
}

export function createPortal(children, node) {
    let fiber,
        events = node.__events;
    if (events) {
        fiber = node.__events.vnode;
    } else {
        events = node.__events = {};
        let vnode = createVnode(node);
        fiber = new ComponentFiber(vnode);
        events.vnode = fiber;
    }
    fiber._isPortal = true;
    let child = createElement(AnuPortal, { children: children });
    child._return = fiber;
    return child;
}
