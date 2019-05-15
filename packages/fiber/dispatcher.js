import { Renderer } from 'react-core/createRenderer';
import { get, isFn } from 'react-core/util';
function setter(compute, cursor, value) {
    this.updateQueue[cursor] = compute(cursor, value);
    Renderer.updateComponent(this, true);
}
var hookCursor = 0;
export function resetCursor() {
    hookCursor = 0;
}
function getCurrentKey(){
    let key = hookCursor + 'Hook';
    hookCursor++;
    return key;
}

export function useContext(getContext) {//这个实现并不正确
        if (isFn(getContext)){
            let fiber = getCurrentFiber();
            let context = getContext(fiber);
            let list = getContext.subscribers;
            if (list.indexOf(fiber) === -1){
                list.push(fiber);
            }
            return context;
        }
        return null;
    }
export function useReducerImpl(reducer, initValue, initAction) {//ok
        let fiber = getCurrentFiber();
        let key = getCurrentKey();
        let updateQueue = fiber.updateQueue;
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
    }
    //useCallbackOrMemo
export function useCallbackImpl(create, deps, isMemo) {//ok
        let fiber = getCurrentFiber();
        let key = getCurrentKey();
        let updateQueue = fiber.updateQueue;

        let nextInputs = Array.isArray(deps) ? deps : [create];
        let prevState = updateQueue[key];
        if (prevState) {
            let prevInputs = prevState[1];
            if (areHookInputsEqual(nextInputs, prevInputs)) {
                return prevState[0];
            }
        }

        let value = isMemo ? create() : create;
        updateQueue[key] = [value, nextInputs];
        return value;
    }
export function useRef(initValue) {//ok
        let fiber = getCurrentFiber();
        let key = getCurrentKey();
        let updateQueue = fiber.updateQueue;
        if (key in updateQueue) {
            return updateQueue[key];
        }
        return updateQueue[key] = { current: initValue };
    }
export function useEffectImpl(create, deps, EffectTag, createList, destroyList) {//ok
        let fiber = getCurrentFiber();
        let cb = useCallbackImpl(create, deps);
        if (fiber.effectTag % EffectTag) {
            fiber.effectTag *= EffectTag;
        }
        let updateQueue = fiber.updateQueue;
        let list = updateQueue[createList] ||  (updateQueue[createList] = []);
        updateQueue[destroyList] ||  (updateQueue[destroyList] = []);
        list.push(cb);
    }
export function useImperativeHandle(ref, create, deps) {
        const nextInputs = Array.isArray(deps) ? deps.concat([ref])
            : [ref, create];
        useEffectImpl(() => {
            if (typeof ref === 'function') {
                const refCallback = ref;
                const inst = create();
                refCallback(inst);
                return () => refCallback(null);
            } else if (ref !== null && ref !== undefined) {
                const refObject = ref;
                const inst = create();
                refObject.current = inst;
                return () => {
                    refObject.current = null;
                };
            }
        }, nextInputs);
    }

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