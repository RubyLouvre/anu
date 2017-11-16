import { options, noop, returnFalse, innerHTML } from "./util";
import { removeElement } from "./browser";
import { restoreChildren } from "./createElement";
import { Refs } from "./Refs";
import { captureError, showError } from "./error";

export const topVnodes = [];
export const topNodes = [];

export function disposeVnode(vnode, silent) {
    if (vnode && !vnode._disposed) {
        options.beforeDelete(vnode);
        var instance = vnode.stateNode;
        var updater = instance.updater;
        if (vnode._hasRef && !silent) {
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
            disposeComponent(vnode, instance, updater, silent);
        } else if (vnode.vtype === 1) {
            disposeElement(vnode);
            delete vnode.stateNode;
        }else {
            delete vnode.stateNode;
        }
    }
}

function disposeElement(vnode, silent) {
    var { props } = vnode;
    if (props[innerHTML]) {
        removeElement(vnode.stateNode);
    } else {
        disposeChildren(restoreChildren(vnode), silent);
        vnode.childNodes.length = 0;
    }
}

function disposeComponent(vnode, instance, updater, silent) {
    options.beforeUnmount(instance);
    instance.setState = instance.forceUpdate = noop;
    if(!silent){
        captureError(instance, "componentWillUnmount", []);
    }
    disposeChildren(restoreChildren(vnode));
    showError();
    //在执行componentWillUnmount后才将关联的元素节点解绑，防止用户在钩子里调用 findDOMNode方法
    updater._disposed = true;
    updater.isMounted = returnFalse;
    updater._renderInNextCycle = null;
}

export function disposeChildren(children, silent) {
    for(var i = 0, n = children.length; i < n; i++){
        var vnode = children[i];
        if(vnode){
            disposeVnode(vnode, silent);
        }
    }
}


