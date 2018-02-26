import { createVnode, createElement } from "./createElement";
import { HostFiber } from "./HostFiber";

function AnuPortal(props){
    return props.children;
}

export function createPortal(children, node) {
    /*  var fiber,
        events = node.__events;
    if (events) {
        fiber = node.__events.vnode;
    } else {
        events = node.__events = {};
        var vnode = createVnode(node);
        fiber = HostFiber(vnode);
        events.vnode = fiber;
    }*/

    var child = createElement(AnuPortal, { children: children, node });
    child._return = vnode;
    /*var children = {
        ".0": child
    };
    fiber._children = children;
    events.child = child;
    child._return = vnode;*/
    return child;
}
