import { options } from "./util";
import { removeElement } from "./browser";

export const topFibers = [];
export const topNodes = [];

export function disposeVnode(vnode, updateQueue, silent) {
    if (vnode && !vnode._disposed) {
        options.beforeDelete(vnode);
        if (vnode.isTop) {
            var i = topFibers.indexOf(vnode);
            if (i !== -1) {
                topFibers.splice(i, 1);
                topNodes.splice(i, 1);
            }
        }
      
        if(vnode.portalReturn){
            var dom = vnode.portalReturn.stateNode;
            delete dom.__events;
        }
        if (vnode.tag < 4) {
            disposeComponent(vnode, updateQueue, silent);
        } else {
            if (vnode.tag === 5) {
                disposeElement(vnode, updateQueue, silent);
            }
            updateQueue.push({
                node: vnode.stateNode,
                vnode: vnode,
                transition:remove
            });
        }
    }
}
function remove(){
    this.vnode._disposed = true;
    delete this.vnode.stateNode;
    removeElement(this.node);
}
function disposeElement(vnode, updateQueue, silent) {
    var { updater } = vnode;
    if (!silent) {
        updater.addState("dispose");
        updateQueue.push(updater);
    } else {
        if (updater.isMounted()) {
            updater._states = ["dispose"];
            updateQueue.push(updater);
        }
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
    if (instance.isPortal) {
        updater.updateQueue = updateQueue;
    }
    if (!silent) {
        updater.addState("dispose");
        updateQueue.push(updater);
    } else if (updater.isMounted()) {
        if (silent === 1) {
            updater._states.length = 0;
        }
        updater.addState("dispose");
        updateQueue.push(updater);
    }

    updater.insertQueue = updater.insertPoint = NaN; //用null/undefined会碰到 xxx[0]抛错的问题
    disposeChildren(updater.children, updateQueue, silent);
}

export function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}
