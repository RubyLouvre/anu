import { extend, noop } from "./util";
export function createRenderer(methods) {
    return extend(Renderer, methods);
}
export let middlewares = [];
export const Renderer = {
    controlledCbs: [],
    mountOrder: 1,
    macrotasks: [],
    boundaries: [],
    onBeforeRender: noop,
    onAfterRender: noop,
    onDispose: noop,
    middleware(obj) {
        if (obj.begin && obj.end) {
            middlewares.push(obj);
        }
    },
    updateControlled(){},
    fireMiddlewares(begin) {
        let index = begin ? middlewares.length - 1 : 0,
            delta = begin ? -1 : 1,
            method = begin ? "begin" : "end", obj;
        while ((obj = middlewares[index])) {
            obj[method]();
            index += delta;
        }
    },
    currentOwner: null, //vnode
};
