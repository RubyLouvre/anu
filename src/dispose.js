import { options, noop, innerHTML } from "./util";
import { removeDOMElement } from "./browser";

export function disposeVnode(vnode) {
    if (!vnode || vnode._disposed) {
        return;
    }
    switch (vnode.vtype) {
        case 1:
            disposeElement(vnode);
            break;
        case 2:
            disposeComponent(vnode);
            break;
        case 4:
            disposeStateless(vnode);
            break;
    }
    vnode._disposed = true;
}

function disposeStateless(vnode) {
    var instance = vnode._instance
    if (instance) {
        disposeVnode(instance._renderedVnode);
        vnode._instance = null;
    }
}

function disposeElement(vnode) {
    var { props, vchildren } = vnode;
    //var children = props.children;
    if (props[innerHTML]) {
        removeDOMElement(vnode._hostNode)
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
        if (instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        let dom = instance.__current._hostNode
        if (dom) {
            dom.__component = null;
        }
        vnode.ref && vnode.ref(null);
        instance.setState = instance.forceUpdate = noop
        vnode._instance = instance.__current = instance.__renderInNextCycle = null
        disposeVnode(vnode._renderedVnode);
    }
}
