import { options, noop, innerHTML } from "./util";
import { removeElement } from "./browser";

export function disposeVnode(vnode) {
    if (!vnode || vnode._disposed) {
        return;
    }
    var instance = vnode._instance;
    if (instance) {
        disposeComponent(vnode, instance);
    } else if (vnode.vtype === 1) {
        disposeElement(vnode);
    }
    vnode._disposed = true;
}

function disposeElement(vnode) {
    var { props, vchildren } = vnode;
    if (vnode.ref) {
        vnode.ref(null);
        delete vnode.ref;
    }
    if (props[innerHTML]) {
        removeElement(vnode._hostNode);
    } else {
        for (let i = 0, n = vchildren.length; i < n; i++) {
            disposeVnode(vchildren[i]);
        }
        vchildren.length = 0;
    }
}

function disposeComponent(vnode, instance) {
    options.beforeUnmount(instance);
    instance.setState = instance.forceUpdate = noop;
    if (vnode.ref) {
        vnode.ref(null);
    }
    if (instance.componentWillUnmount) {
        instance.componentWillUnmount();
    }
    let updater = instance.updater;
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
    disposeVnode(updater.rendered);
    updater._renderInNextCycle = vnode._instance = instance.updater = null;
}
