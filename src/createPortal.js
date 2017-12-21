import { createVnode, createElement } from "./createElement";
import { DOMUpdater } from "./DOMUpdater";

function AnuPortal(props){
    return props.children;
}

//[Top API] ReactDOM.createPortal
export function createPortal(children, node) {
    var vnode;
    if(node.__events){
        vnode = node.__events.vnode;
    }else{
        vnode = createVnode(node);
        var v = node.__events = {};
        v.vnode = vnode;
        new DOMUpdater(vnode);
    }
    var ret = createElement(AnuPortal,{children});
    ret.portal = vnode;
    return ret;
}
