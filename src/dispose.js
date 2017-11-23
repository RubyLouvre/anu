import { options } from "./util";
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
                delete vnode.stateNode;
            }
        }
    }
}

function disposeElement(vnode, updateQueue, silent) {
    var { updater } = vnode;
    updater._silent = silent;
    updateQueue.push(updater);
}

function disposeComponent(vnode, updateQueue, silent) {
    var instance = vnode.stateNode;
    var updater = instance.updater;
    updater._silent = silent;
    updater.addJob("dispose");
    updateQueue.push(updater);
    disposeChildren(updater.children, updateQueue, silent);
    
}

export function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}
