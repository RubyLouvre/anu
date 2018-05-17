import { extend, noop } from "./util";
export function createRenderer(methods) {
    return extend(Renderer, methods);
}

export const Renderer = {
    controlledCbs: [],
    mountOrder: 1,
    macrotasks:[],
    boundaries: [],
    fireDuplex: noop,
    //catchError
    //catchBoundary
    //catchTry
    //hasError
    currentOwner: null, //vnode
};
