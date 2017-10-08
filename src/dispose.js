import { options, noop, innerHTML } from "./util";
import { removeDOMElement } from "./browser";
import {  updateChains } from "./Updater";

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
        disposeVnode(instance.updater.rendered);
        vnode._instance = null;
    }
}

function disposeElement(vnode) {
    var { props, vchildren } = vnode;
    if (vnode.ref) {
        vnode.ref(null);
        delete vnode.ref;
    }
    if (props[innerHTML]) {
        removeDOMElement(vnode._hostNode);
    } else {
        for (let i = 0, n = vchildren.length; i < n; i++) {
            disposeVnode(vchildren[i]);
        }
    }
}

function disposeComponent(vnode) {
    let instance = vnode._instance;
    if (instance) {
        options.beforeUnmount(instance);
        instance.setState = instance.forceUpdate = noop;
        if (vnode.ref) {
            vnode.ref(null);
        }
        if (instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
        let updater = instance.updater,
            order = updater._mountOrder,
            updaters = updateChains[order];
        updaters.splice(updaters.indexOf(updater), 1);
        if(!updaters.length){
            delete updateChains[order];
        }
        //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
        disposeVnode(updater.rendered);
        updater._renderInNextCycle = vnode._instance = instance.updater = null;
    }
}
