import { createElement } from "./createElement";

export function AnuPortal(props) {
    return props.children;
}

export function createPortal(children, parent) {
    let child = createElement(AnuPortal, { children, parent });
    child.isPortal = true;
    return child;
}
