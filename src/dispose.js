import { options } from "./util";
import { removeElement } from "./browser";
export const topVnodes = [];
export const topNodes = [];

export function disposeVnode(vnode, updateQueue, silent) {
    if (vnode && !vnode._disposed) {
        options.beforeDelete(vnode);
        if (vnode.isTop) {
            var i = topVnodes.indexOf(vnode);
            if (i !== -1) {
                topVnodes.splice(i, 1);
                topNodes.splice(i, 1);
            }
        }
        vnode._disposed = true;
        if (vnode.vtype > 1) {
            disposeComponent(vnode, updateQueue, silent);
        } else {
            if (vnode.vtype === 1) {
                disposeElement(vnode, updateQueue, silent);
            } else {
                removeElement(vnode.stateNode);
                delete vnode.stateNode;
            }
        }
    }
}

function disposeElement(vnode, updateQueue, silent) {
    var { updater } = vnode;
    if (!silent) {
        updater.addJob("dispose");
        updateQueue.push(updater);
    }
    disposeChildren(updater.children, updateQueue, silent);
   
}

function disposeComponent(vnode, updateQueue, silent) {
    var instance = vnode.stateNode;
    if (!instance) {//没有实例化
        return;
    }
    var updater = instance.updater;
    if (!silent) {
        updater.addJob("dispose");
        updateQueue.push(updater);
    }
    disposeChildren(updater.children, updateQueue, silent);
}

export function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        if (children[i]) {
            disposeVnode(children[i], updateQueue, silent);
        } 
    }
}
