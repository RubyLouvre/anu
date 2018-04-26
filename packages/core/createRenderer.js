import { extend } from './util';
export function createRenderer(methods) {
	return extend(Renderer, methods);
}

export const Renderer = {
	macrotasks: [],
	controlledCbs: [],
	mountOrder: 1,
	//catchError
	//catchBoundary
	//catchTry
	//hasError
	currentOwner: null, //vnode
};
