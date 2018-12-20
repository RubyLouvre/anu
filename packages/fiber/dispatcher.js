import { Renderer } from 'react-core/createRenderer';
function setter(count, value) {
    var state = {};
    state[count] = value;
    Renderer.updateComponent(this, state);
}
var dispatcherCount = 0;
export function resetCount() {
    dispatcherCount = 0;
}

export var dispatcher = {
    useState (initValue) {
        let instance = Renderer.currentOwner;
        let count = dispatcherCount;//决定是处理第几个useState
        let fn = setter.bind(instance, count);
        let fiber = instance._reactInternalFiber;
        let pendings = fiber.updateQueue.pendingStates;
        dispatcherCount++;
        if (fiber.hasMounted) {
            var newState = {};
            pendings.forEach(function (state) {
                Object.assign(newState, state);
            });
            pendings[0] = newState;
            pendings.length = 1;
            return [newState[count], fn];
        }
        let state = {};
        state[count] = initValue;
        pendings.push(state);
        return [initValue, fn];
    },
    useContext(contextType){
        return new contextType.Provider().emitter.get();
    },
    useCallback(callback){
        let instance = Renderer.currentOwner;
        let fiber = instance._reactInternalFiber;
        Renderer.updateComponent(instance, null, callback);
        return [callback, fiber.updateQueue.pendingCbs ];
    }
};