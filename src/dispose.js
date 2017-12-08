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
            } 
            removeElement(vnode.stateNode);
        }
    }
}
function handleErrorRef(vnode) {
    var refFn = vnode.ref;
    if (refFn && refFn.call) {
        //出错时没有执行过直接干掉, 否则提前传入null
        if (refFn.done) {
            refFn(null);
        }
        delete vnode.ref;
    }
}
function disposeElement(vnode, updateQueue, silent) {
    var { updater } = vnode;
    if (!silent) {
        updater.addJob("dispose");
        updateQueue.push(updater);
    } else {
        handleErrorRef(vnode);
    }

    disposeChildren(updater.children, updateQueue,silent);
    
}

function disposeComponent(vnode, updateQueue, silent) {
    var instance = vnode.stateNode;
    if (!instance) {
        //没有实例化
        return;
    }
    var updater = instance.updater;
    if (!silent) {
        updater.addJob("dispose");
        updateQueue.push(updater);
    } else {
        handleErrorRef(vnode);
        //组件出错时，在医生节点下的那些组件，如果它们已经resolve过，那么还能执行will unmount钩子
        if (updater._hydrating || updater.isMounted()) {
            updater.dispose();
        }
    }

    updater.insertQueue = updater.insertPoint = NaN; //用null/undefined会碰到 xxx[0]抛错的问题
    disposeChildren(updater.children, updateQueue, silent);
}

export function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}
