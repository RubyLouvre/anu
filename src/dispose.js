import { options } from "./util";

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
        vnode._instance = NaN;
    }
}

function disposeElement(vnode) {
    var { props } = vnode;
    var children = props.children;
    for (let i = 0, n = children.length; i < n; i++) {
        disposeVnode(children[i]);
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
        let dom = instance._currentElement._hostNode
        if (dom) {
            dom._component = null;
        }
        vnode.ref && vnode.ref(null);
        vnode._instance = instance._currentElement = NaN;
        disposeVnode(vnode._renderedVnode);
    }
}
