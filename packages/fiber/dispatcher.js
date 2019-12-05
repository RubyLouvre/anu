import { Renderer } from 'react-core/createRenderer';
import { get, isFn } from 'react-core/util';
import { HOOK } from './effectTag'
function setter(compute, cursor, value) {
    Renderer.batchedUpdates(() => { //解决钩子useXXX放在setTimeout不更新的问题
        this.updateQueue[cursor] = compute(cursor, value);
        Renderer.updateComponent(this, true);
    })
}
var hookCursor = 0;
export function resetCursor() {
    hookCursor = 0;
}
function getCurrentKey() {
    let key = hookCursor + 'Hook';
    hookCursor++;
    return key;
}

export function useContext(getContext) {//这个实现并不正确
    if (isFn(getContext)) {
        let fiber = getCurrentFiber();
        let context = getContext(fiber);
        let list = getContext.subscribers;
        if (list.indexOf(fiber) === -1) {
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
        let other = updateQueue[cursor];
        return isFn(value) ? value(other) : value;
    };
    let dispatch = setter.bind(fiber, compute, key);

    if (key in updateQueue) {
        delete updateQueue.isForced;
        return [updateQueue[key], dispatch];
    }

    let value = updateQueue[key] = initAction ? reducer(initValue, initAction) : initValue;
    return [value, dispatch];
}

//useMemo用来记录create的返回值 
//useMemo的deps，如果不写总是执行， 如果为空数组则只执行一次，如果数组有值，变化才执行新的
export function useMemo(create, deps) {//ok
    let fiber = getCurrentFiber();
    let key = getCurrentKey();
    let isArray = Array.isArray(deps);
    if (!isArray) {
        return create();
    }
    let updateQueue = fiber.updateQueue;
    let prevState = updateQueue[key];
    if (prevState) {
        if (!deps.length) {
            return prevState[0];
        }
        if (areHookInputsEqual(deps, prevState[1])) {
            return prevState[0];
        }
    }
    var resolve = create()
    updateQueue[key] = [resolve, deps]
    return resolve;
}
//useCallback的deps，如果不写总是返回新的，如果为空数组则总是原来的， 如果数组有值，变化才返回新的
export function useCallback(create, deps) {//ok
    return useMemo(() => create, deps);
}
//useEffect的deps，如果不写总是执行， 如果为空数组则只执行一次，如果数组有值，变化才执行新的
export function useEffectImpl(create, deps, EffectTag, createList, destroyList) {
    let fiber = getCurrentFiber();
    let updateQueue = fiber.updateQueue;
    useMemo(function () {
        var list = updateQueue[createList] || (updateQueue[createList] = []);
        updateQueue[destroyList] || (updateQueue[destroyList] = []);
        if (fiber.effectTag % EffectTag) {
            fiber.effectTag *= EffectTag;
        }
        list.push(create)
    }, deps)
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

export function useImperativeHandle(ref, create, deps) {
    useEffectImpl(() => {
        if (isFn(ref)) {
            const refCallback = ref;
            const inst = create();
            refCallback(inst);
            return () => refCallback(null);
        } else if (Object(ref) === ref) {
            const refObject = ref;
            const inst = create();
            refObject.current = inst;
            return () => {
                refObject.current = null;
            };
        }
    }, deps, HOOK, 'layout', 'unlayout');
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