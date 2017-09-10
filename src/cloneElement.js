import { createElement, CurrentOwner } from "./createElement";

export function cloneElement(vnode, props) {
    if (Array.isArray(vnode)) {
        vnode = vnode[0];
    }
    if (!vnode.vtype) {
        return Object.assign({}, vnode);
    }
    let owner = vnode._owner,
        lastOwn = CurrentOwner.cur,
        configs = {
            key: vnode.key,
            ref: vnode.ref
        }
    if (props && props.ref) {
        owner = lastOwn;
    }
    Object.assign(configs, vnode.props, props);
    CurrentOwner.cur = owner;
    let ret = createElement(
        vnode.type,
        configs,
        arguments.length > 2 ? [].slice.call(arguments, 2) : configs.children
    );
    CurrentOwner.cur = lastOwn;
    return ret;
};
