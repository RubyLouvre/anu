import { createElement, __ref, CurrentOwner } from "./createElement";

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
    CurrentOwner.cur = vnode._owner
    var ret = createElement(
        vnode.type,
        configs,
        arguments.length > 2 ? [].slice.call(arguments, 2) : configs.children
    );
    CurrentOwner.cur = null
    return ret
}
