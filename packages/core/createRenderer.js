import { extend } from "./util";
export function createRenderer(methods) {
    extend(Renderer, methods);
}

export const Renderer = {
    interactQueue: null,//[]
    mainThread: [],
    controlledCbs: [],
    mountOrder: 1,
    currentOwner: null//vnode
};