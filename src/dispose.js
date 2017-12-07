import { options } from "./util";
import { removeElement } from "./browser";
import { Refs } from "./Refs";

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
            // delete vnode.stateNode;
        }
    }
}

function disposeElement(vnode, updateQueue, silent) {
    var { updater } = vnode;
    if (!silent) {
        updater.addJob("dispose");
        updateQueue.push(updater);
    } else {
        console.log(vnode.ref+" xxx "+vnode._hasRef);
        if (vnode._hasRef) {
            Refs.fireRef(vnode, null);
        }
        delete vnode.ref;
    }

    disposeChildren(updater.children, updateQueue, silent);
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
        //组件出错时，在医生节点下的那些组件，如果它们已经resolve过，那么还能执行will unmount钩子
        if (updater.isMounted()) {
            updater.dispose();
        }
        delete vnode.ref;
    }

    updater.insertQueue = updater.insertPoint = NaN; //用null/undefined会碰到 xxx[0]抛错的问题
    disposeChildren(updater.children, updateQueue, silent);
}

export function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}
