import { Renderer } from 'react-core/createRenderer';
import { HOOK } from './effectTag';
function setter(cursor, value) {
    var state = {};
    state[cursor] = value;
    Renderer.updateComponent(this, state);
}
var hookCursor = 0;
export function resetCursor() {
    hookCursor = 0;
}

export var dispatcher = {
    useState(initValue) {
        let instance = Renderer.currentOwner;
        let cursor = hookCursor;//决定是处理第几个useState
        let fn = setter.bind(instance, cursor);
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
    useContext(contextType) {
        return new contextType.Provider().emitter.get();
    },
    useCallback(callback) {
        let instance = Renderer.currentOwner;
        let fiber = instance._reactInternalFiber;
        Renderer.updateComponent(instance, null, callback);
        return [callback, fiber.updateQueue.pendingCbs];
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