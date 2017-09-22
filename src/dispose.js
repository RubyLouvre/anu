import { options, noop, innerHTML } from "./util";
import { removeDOMElement } from "./browser";

export function disposeVnode(vnode) {
    if (!vnode || vnode._disposed) {
        return;
    }
    disposeStrategy[vnode.vtype](vnode);
    vnode._disposed = true;
}
var disposeStrategy = {
    0: noop,
    1: disposeElement,
    2: disposeComponent,
    4: disposeStateless
};
function disposeStateless(vnode) {
    var instance = vnode._instance;
    if (instance) {
        disposeVnode(instance.__rendered);
        vnode._instance = null;
    }
}

function disposeElement(vnode) {
    var { props, vchildren } = vnode;
    if (props[innerHTML]) {
        removeDOMElement(vnode._hostNode);
    } else {
        for (let i = 0, n = vchildren.length; i < n; i++) {
            disposeVnode(vchildren[i]);
        }
    }
    //eslint-disable-next-line
    vnode.ref && vnode.ref(null);
}

function disposeComponent(vnode) {
    let instance = vnode._instance;
    if (instance) {
        options.beforeUnmount(instance);
        instance.__current = instance.setState = instance.forceUpdate = noop;
        if (instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        let dom = instance.__current._hostNode;
        if (dom) {
            dom.__component = null;
        }
        vnode.ref && vnode.ref(null);
        vnode._instance = instance.__renderInNextCycle = null;
        disposeVnode(instance.__rendered);
    }
}
