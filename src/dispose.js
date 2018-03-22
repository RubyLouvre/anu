import { options } from "./util";
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
    }
}

export function disposeChildren(children, updateQueue, silent) {
    for (let i in children) {
        disposeVnode(children[i], updateQueue, silent);
    }
}
