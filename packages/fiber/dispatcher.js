import { Renderer } from 'react-core/createRenderer';
import { HOOK } from './effectTag';
function setter(cursor, getter, value) {
    var state = {};
    state[cursor] = getter(cursor, value);
    Renderer.updateComponent(this.stateNode, state);
}
var hookCursor = 0;
export function resetCursor() {
    hookCursor = 0;
}

export var dispatcher = {
    useContext(contextType) {//这个实现并不正确
        return new contextType.Provider().emitter.get();
    },
    useReducer(reducer, initValue, initAction){//ok
        let cursor = hookCursor;//决定是处理第几个useState
        let fiber = getCurrentFiber();
        let pendings = fiber.updateQueue.pendingStates;
        let getter = reducer ? function (index, action){
            //reducer需要传入两个值
            return reducer(pendings[0][index], action || {type: Math.random} );
        }:  function (index, value){
            var oldValue = pendings[0][index];
            return typeof value == 'function' ? value(oldValue) : value;
        };
        let dispatch = setter.bind(fiber, cursor, getter);
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
    },
    useCallbackOrMeno(callback, inputs, isMeno) {//ok
        var nextInputs = Array.isArray(inputs) ? inputs : [callback];
        let fiber = getCurrentFiber();
        let key = hookCursor +'CM';
        let updateQueue = fiber.updateQueue;
        hookCursor++;
        let prevState = updateQueue[key];
        if (prevState) {
            var prevInputs = prevState[1];
            if (areHookInputsEqual(nextInputs, prevInputs)){
                return prevState[0];
            }
        }
        var value = isMeno ? callback(): callback;
        updateQueue[key] = [value, nextInputs];
        return value;
    },
    useRef(initValue){//ok
        let key = hookCursor +'Ref';
        let fiber = getCurrentFiber();
        let updateQueue = fiber.updateQueue;
        hookCursor++;
        if (fiber.hasMounted) {
            return updateQueue[key];
        }
        var ref = updateQueue[key] = {current: initValue};
        return ref;
    },
    useEffect(callback) {//ok
        let fiber = getCurrentFiber();
        if (fiber.effectTag % HOOK) {
            fiber.effectTag *= HOOK;
        }
        fiber.updateQueue.effects.push(callback);
    }
};
//https://reactjs.org/docs/hooks-reference.html
function getCurrentFiber(){
    let instance = Renderer.currentOwner;
    return instance._reactInternalFiber;
}

function areHookInputsEqual(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        if (Object.is(arr1[i], arr2[i]) ) {
            continue;
        }
        return false;
    }
    return true;
}