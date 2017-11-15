import { options, noop, returnFalse, innerHTML } from "./util";
import { removeElement } from "./browser";
import { restoreChildren } from "./createElement";
import { Refs } from "./Refs";
import { captureError, showError } from "./error";

export const topVnodes = [];
export const topNodes = [];

export function disposeVnode(vnode) {
    if (vnode && !vnode._disposed) {
        options.beforeDelete(vnode);
        var instance = vnode.stateNode;
        var updater = instance.updater;
        if (vnode._hasRef) {
            vnode._hasRef = false;
            Refs.fireRef(vnode, null);
        }
        if (vnode.isTop) {
            var i = topVnodes.indexOf(vnode);
            if (i !== -1) {
                topVnodes.splice(i, 1);
                topNodes.splice(i, 1);
            }
        }
        vnode._disposed = true;
        if (updater) {
            disposeComponent(vnode, instance, updater);
        } else if (vnode.vtype === 1) {
            disposeElement(vnode);
        }
    }
}

function disposeElement(vnode) {
    var { props } = vnode;
    if (props[innerHTML]) {
        removeElement(vnode.stateNode);
    } else {
        disposeChildren(restoreChildren(vnode));
        vnode.childNodes.length = 0;
    }
}

function disposeComponent(vnode, instance, updater) {
    options.beforeUnmount(instance);
    instance.setState = instance.forceUpdate = noop;
    captureError(instance, "componentWillUnmount", []);
    disposeChildren(restoreChildren(vnode));
    showError();
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
    updater._disposed = true;
    updater.isMounted = returnFalse;
    updater._renderInNextCycle = null;
}

export function disposeChildren(children) {
    for(var i = 0, n = children.length; i < n; i++){
        var vnode = children[i];
        if(vnode){
            disposeVnode(vnode);
        }
    }
}


