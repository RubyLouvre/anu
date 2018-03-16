import { createElement } from "./createElement";
import { Refs } from "./Refs";
import { extend } from "./util";

export function cloneElement(vnode, props) {
    if (!vnode.tag === 6) {
        let clone = extend({}, vnode);
        delete clone._disposed;
        return clone;
    }
    let owner = vnode._owner,
        lastOwn = Refs.currentOwner,
        old = vnode.props,
        configs = {};
    if (props) {
        extend(extend(configs, old), props);
        configs.key = props.key !== void 666 ? props.key : vnode.key;
        if (props.ref !== void 666) {
            configs.ref = props.ref;
            owner = lastOwn;
        } else if (vnode._hasRef) {
            configs.ref = vnode.ref;
        }

    } else {
        configs = old;
    }
    Refs.currentOwner = owner;

    let args = [].slice.call(arguments, 0),
        argsLength = args.length;
    args[0] = vnode.type;
    args[1] = configs;
    if (argsLength === 2 && configs.children) {
        delete configs.children._disposed;
        args.push(configs.children);
    }
    let ret = createElement.apply(null, args);
    Refs.currentOwner = lastOwn;
    return ret;
}
