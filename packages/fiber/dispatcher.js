import { Renderer } from 'react-core/createRenderer';
function setter(count, value) {
    var state = {};
    console.log(count, value, 'count')
    state[count] = value;
    Renderer.updateComponent(this, state);
}
var dispatcherCount = 0;
export function resetCount() {
    dispatcherCount = 0;
}

export var dispatcher = {
    useState: function (initValue) {
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
    }
};