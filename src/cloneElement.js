import { createElement, __ref } from "./createElement";

export function cloneElement(vnode, props) {
    if (Array.isArray(vnode)) {
        vnode = vnode[0];
    }
    if (!vnode.vtype) {
        return Object.assign({}, vnode);
    }
    var configs = {};
    if (vnode.key) {
        configs.key = vnode.key;
    }

    if (vnode.__refKey) {
        configs.ref = vnode.__refKey;
    } else if (vnode.ref) {
        configs.ref = vnode.ref;
    }
    Object.assign(configs, vnode.props, props)
    return createElement(
        vnode.type,
        configs,
        arguments.length > 2 ? [].slice.call(arguments, 2) : configs.children
    );
}
