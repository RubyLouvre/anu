import { Renderer } from 'react-core/createRenderer';
import { HOOK } from './effectTag';
function setter(cursor, getter, value) {
    var state = {};
    if (getter){
        value = getter(cursor, value);
    }
    state[cursor] = value;
    Renderer.updateComponent(this, state);
}
var hookCursor = 0;
export function resetCursor() {
    hookCursor = 0;
}
function useReducer(reducer, initValue, initAction){
    let instance = Renderer.currentOwner;
    let cursor = hookCursor;//决定是处理第几个useState
    let fiber = instance._reactInternalFiber;
    let pendings = fiber.updateQueue.pendingStates;
    let getter = reducer ? function (index, action){
        //reducer需要传入两个值
        return reducer(pendings[0][index], action || {type: Math.random} );
    }: null;
    let dispatch = setter.bind(instance, cursor, getter);
    hookCursor++;
    if (fiber.hasMounted) {
        var newState = {};
        pendings.unshift(newState);
        Object.assign.apply(null, pendings);
        pendings.length = 1;
        return [newState[cursor], dispatch];
    }
    let state = {};
    state[cursor] = initAction ? reducer(initValue, initAction): initValue;
    pendings.push(state);
    return [ state[cursor], dispatch];
}
export var dispatcher = {
    /* useState(initValue) {
        let instance = Renderer.currentOwner;
        let cursor = hookCursor;//决定是处理第几个useState
        let fn = setter.bind(instance, cursor, null, null);
        let fiber = instance._reactInternalFiber;
        let pendings = fiber.updateQueue.pendingStates;
        hookCursor++;
        if (fiber.hasMounted) {
            var newState = {};
            pendings.unshift(newState);
            Object.assign.apply(null, pendings);
            pendings.length = 1;
            return [newState[cursor], fn];
        }
        let state = {};
        state[cursor] = initValue;
        pendings.push(state);
        return [initValue, fn];
    },
    */
    useContext(contextType) {
        return new contextType.Provider().emitter.get();
    },
    useReducer: useReducer,
    useCallback(callback, args) {
        let instance = Renderer.currentOwner;
        let fiber = instance._reactInternalFiber;
        let key = hookCursor +'Cb', fn;
        let updateQueue = fiber.updateQueue;
        hookCursor++;
        if (fiber.hasMounted) {
            fn = updateQueue[key];
        } else {
            if (Array.isArray(args) && args.length){
                fn = callback.bind(null, args);
            } else {
                fn = callback;
            }
            updateQueue[key] = fn;
        }
        Renderer.updateComponent(instance, null, fn);
        return [fn, fiber.updateQueue.pendingCbs];
    },
    useRef(initValue){
        let instance = Renderer.currentOwner;
        let key = hookCursor +'Ref';
        let fiber = instance._reactInternalFiber;
        let updateQueue = fiber.updateQueue;
        hookCursor++;
        if (fiber.hasMounted) {
            return updateQueue[key];
        }
        var ref = updateQueue[key] = {current: initValue};
        return ref;
    },
    useEffect(callback) {
        let instance = Renderer.currentOwner;
        let fiber = instance._reactInternalFiber;
        if (fiber.effectTag % HOOK) {
            fiber.effectTag *= HOOK;
        }
        fiber.updateQueue.effects.push(callback);
    }
};
//https://reactjs.org/docs/hooks-reference.html