import { extend } from "./util";
export function createRenderer(methods) {
    return  extend(Renderer, methods);
}

export const Renderer = {
    macrotasks: [],
    errors: [],
    controlledCbs: [],
    mountOrder: 1,
    currentOwner: null//vnode
};