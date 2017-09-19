import { createElement, CurrentOwner } from "./createElement";

export function cloneElement(vnode, props) {
    if (!vnode.vtype) {
        return Object.assign({}, vnode);
    }
    let owner = vnode._owner,
        lastOwn = CurrentOwner.cur,
        configs = {
            key: vnode.key,
            ref: vnode.ref
        };
    if (props && props.ref) {
        owner = lastOwn;
    }
    Object.assign(configs, vnode.props, props);
    CurrentOwner.cur = owner;

    let args = [].slice.call(arguments, 0),
        argsLength = args.length;
    args[0] = vnode.type;
    args[1] = configs;
    if (argsLength === 2 && configs.children) {
        args.push(configs.children);
    }
    let ret = createElement.apply(null, args);
    CurrentOwner.cur = lastOwn;
    return ret;
}
