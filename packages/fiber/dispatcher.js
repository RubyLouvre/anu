import { Renderer } from 'react-core/createRenderer';
import { HOOK } from './effectTag';
import { get } from 'react-core/util';
function setter(compute, cursor, value) {
    this.updateQueue[cursor] = compute(cursor, value);
    Renderer.updateComponent(this, true);
}
var hookCursor = 0;
export function resetCursor() {
    hookCursor = 0;
}

export var dispatcher = {
    useContext(contextType) {//这个实现并不正确
        return new contextType.Provider().emitter.get();
    },
    useReducer(reducer, initValue, initAction) {//ok
        let fiber = getCurrentFiber();
        let key = hookCursor + 'Hook';
        let updateQueue = fiber.updateQueue;
        hookCursor++;
        //compute用于放在dispatch中计算新值
        let compute = reducer ? function (cursor, action) {
            return reducer(updateQueue[cursor], action || { type: Math.random() });
        } : function (cursor, value) {
            let novel = updateQueue[cursor];
            return typeof value == 'function' ? value(novel) : value;
        };
        let dispatch = setter.bind(fiber, compute, key);

        if (key in updateQueue) {
            delete updateQueue.isForced;
            return [updateQueue[key], dispatch];
        }

        let value = updateQueue[key] = initAction ? reducer(initValue, initAction) : initValue;
        return [value, dispatch];
    },
    useCallbackOrMeno(callback, inputs, isMeno) {//ok
        let fiber = getCurrentFiber();
        let key = hookCursor + 'Hook';
        let updateQueue = fiber.updateQueue;
        hookCursor++;

        let nextInputs = Array.isArray(inputs) ? inputs : [callback];
        let prevState = updateQueue[key];
        if (prevState) {
            let prevInputs = prevState[1];
            if (areHookInputsEqual(nextInputs, prevInputs)) {
                return prevState[0];
            }
        }

        let value = isMeno ? callback() : callback;
        updateQueue[key] = [value, nextInputs];
        return value;
    },
    useRef(initValue) {//ok
        let fiber = getCurrentFiber();
        let key = hookCursor + 'Hook';
        let updateQueue = fiber.updateQueue;
        hookCursor++;
        if (key in updateQueue) {
            return updateQueue[key];
        }
        return updateQueue[key] = { current: initValue };
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
function getCurrentFiber() {
    return get(Renderer.currentOwner);
}

function areHookInputsEqual(arr1, arr2) {
    for (var i = 0; i < arr1.length; i++) {
        if (Object.is(arr1[i], arr2[i])) {
            continue;
        }
        return false;
    }
    return true;
}