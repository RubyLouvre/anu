import { createVnode, createElement } from "./createElement";
import { DOMUpdater } from "./DOMUpdater";

function AnuPortal(props){
    return props.children;
}

//[Top API] ReactDOM.createPortal
export function createPortal(children, node) {
    var vnode, events = node.__events;
    if(events){
        vnode = node.__events.vnode;
    }else{
        events = (node.__events = {});
        vnode = createVnode(node);
        events.vnode = vnode;
        new DOMUpdater(vnode);
    }
    var child = createElement(AnuPortal,{children});
    events.child = child;
    child.superReturn = vnode;
    return child;
}
