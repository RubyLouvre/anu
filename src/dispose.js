import { options } from "./util";
import { removeElement } from "./browser";

export const topFibers = [];
export const topNodes = [];

export function disposeVnode(fiber, updateQueue, silent) {
    if (fiber && !fiber._disposed) {
        options.beforeDelete(fiber._reactInnerFiber);
        if (fiber.isTop) {
            var i = topFibers.indexOf(fiber);
            if (i !== -1) {
                topFibers.splice(i, 1);
                topNodes.splice(i, 1);
            }
        }
      
        if(fiber.portalReturn){
            var dom = fiber.portalReturn.stateNode;
            delete dom.__events;
        }
        if (fiber.tag < 4) {
            disposeComponent(fiber, updateQueue, silent);
        } else {
            if (fiber.tag === 5) {
                disposeElement(fiber, updateQueue, silent);
            }
            updateQueue.push({
                node: fiber.stateNode,
                vnode: fiber,
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
function disposeElement(fiber, updateQueue, silent) {
 
    if (!silent) {
        fiber.addState("dispose");
        updateQueue.push(fiber);
    } else {
        if (fiber.isMounted()) {
            fiber._states = ["dispose"];
            updateQueue.push(fiber);
        }
    }
    disposeChildren(fiber.children, updateQueue, silent);
}

function disposeComponent(fiber, updateQueue, silent) {
    var instance = fiber.stateNode;
    if (!instance) {
        //没有实例化
        return;
    }
  
    if (instance.isPortal) {
        fiber.updateQueue = updateQueue;
    }
    if (!silent) {
        fiber.addState("dispose");
        updateQueue.push(fiber);
    } else if (fiber.isMounted()) {
        if (silent === 1) {
            fiber._states.length = 0;
        }
        fiber.addState("dispose");
        updateQueue.push(fiber);
    }

    fiber.insertQueue = fiber.insertPoint = NaN; //用null/undefined会碰到 xxx[0]抛错的问题
    disposeChildren(fiber.children, updateQueue, silent);
}

export function disposeChildren(children, updateQueue, silent) {
    for (var i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}
