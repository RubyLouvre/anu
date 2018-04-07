import { createElement } from "./createElement";
import { Renderer } from "./createRenderer";

function AnuPortal(props){
    return props.children;
}

export function createPortal(children, node) {
    let child = createElement(AnuPortal, { children: children });
    Renderer.render(vnode, child)
    child.parent = node
    return child;
}
