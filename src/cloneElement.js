import { createElement, __ref } from "./createElement";

export function cloneElement(vnode, props) {
    if (Array.isArray(vnode)) {
        vnode = vnode[0];
    }
    if (!vnode.vtype) {
        return Object.assign({}, vnode);
    }
    var configs = {
        key: vnode.key,
        ref: vnode.__refKey || vnode.ref
    };

    Object.assign(configs, vnode.props, props)
    var ret = createElement(
        vnode.type,
        configs,
        arguments.length > 2 ? [].slice.call(arguments, 2) : configs.children
    );
    ret._owner = vnode._owner
    return ret
}
