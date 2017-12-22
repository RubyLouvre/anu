import { options,noop } from "./util";
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
        if(vnode.superReturn){
            var dom = vnode.superReturn.stateNode;
            delete dom.__events;
        }
        
        if (vnode.vtype > 1) {
            disposeComponent(vnode, updateQueue, silent);
        } else {
            if (vnode.vtype === 1) {
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
    if (!silent) {
       
        updater.hydrate = noop;//可能它的update还在drainQueue，被执行hydrate，render, diffChildren，引发无谓的性能消耗
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
