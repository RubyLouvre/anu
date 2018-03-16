import { options } from "./util";
import { removeElement } from "./browser";

export const topFibers = [];
export const topNodes = [];

export function disposeVnode(fiber, updateQueue, silent) {
    if (fiber && !fiber._disposed) {
        options.beforeDelete(fiber._reactInnerFiber);
        if (fiber.name === "AnuInternalFiber") {
            let i = topFibers.indexOf(fiber);
            if (i !== -1) {
                topFibers.splice(i, 1);
                topNodes.splice(i, 1);
            }
        }
      
        if(fiber._return){
            let dom = fiber._return.stateNode;
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
        // fiber.addState("dispose");
        fiber._states = ["dispose"];
        updateQueue.push(fiber);
    } else {
        if (fiber._isMounted()) {
            fiber._states = ["dispose"];
            updateQueue.push(fiber);
        }
    }
    disposeChildren(fiber._children, updateQueue, silent);
}

function disposeComponent(fiber, updateQueue, silent) {
    let instance = fiber.stateNode;
    if (!instance) {
        //没有实例化
        return;
    }
    if (!silent) {
        //  fiber.addState("dispose");
        fiber._states = ["dispose"];
        updateQueue.push(fiber);
    } else if (fiber._isMounted()) {
        fiber._states = ["dispose"];
        updateQueue.push(fiber);
    }

    fiber._mountCarrier = fiber._mountPoint = NaN; //用null/undefined会碰到 xxx[0]抛错的问题
    disposeChildren(fiber._children, updateQueue, silent);
}

export function disposeChildren(children, updateQueue, silent) {
    for (let i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}
