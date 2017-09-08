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
    var lastOwn = CurrentOwner.cur[0]
    //vnode._owner可能不存在
    CurrentOwner.set(lastOwn)
    //console.log(vnode._owner,"cloneElement中途插入",lastOwn)
    var ret = createElement(
        vnode.type,
        configs,
        arguments.length > 2 ? [].slice.call(arguments, 2) : configs.children
    );
    CurrentOwner.reset()
    if(CurrentOwner.cur[0] !== lastOwn){
        console.log('不一样')
    }

    //console.log(CurrentOwner.cur,"cloneElement中途退出")
    return ret
}
