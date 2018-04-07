import { createElement } from "./createElement";
import { Renderer } from "./createRenderer";

export function AnuPortal(props){
    return props.children;
}

export function createPortal(children, parent) {
    let child = createElement(AnuPortal, { children, parent });
    return child;
}
