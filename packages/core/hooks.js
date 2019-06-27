import { 
    useReducerImpl,
    useEffectImpl, 
    useCallbackImpl, 
    useRef, 
    useContext,
    useImperativeHandle } from 'react-fiber/dispatcher';
import { PASSIVE, HOOK } from 'react-fiber/effectTag';
export function useState(initValue) {
    return useReducerImpl(null, initValue);
}
export function useReducer(reducer, initValue, initAction) {
    return useReducerImpl(reducer, initValue, initAction);
}
export function useEffect(create, deps) {
    return useEffectImpl(create, deps, PASSIVE, 'passive', 'unpassive');
}
export function useLayoutEffect(create, deps) {
    return useEffectImpl(create, deps, HOOK, 'layout', 'unlayout');
}

export function useCallback(create, deps) {
    return useCallbackImpl(create, deps);
}
export function useMemo(create, deps) {
    return useCallbackImpl(create, deps, true);
}

export {
    useRef, 
    useContext,//这个不对
    useImperativeHandle
}
