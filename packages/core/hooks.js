import { dispatcher } from 'react-fiber/dispatcher';
import { PASSIVE, HOOK } from 'react-fiber/effectTag';
export function useState(initValue) {
    return dispatcher.useReducer(null, initValue);
}
export function useReducer(reducer, initValue, initAction) {
    return dispatcher.useReducer(reducer, initValue, initAction);
}
export function useEffect(create, deps) {
    return dispatcher.useEffect(create, deps, PASSIVE, 'passive', 'unpassive');
}
export function useLayoutEffect(create, deps) {
    return dispatcher.useEffect(create, deps, HOOK, 'layout', 'unlayout');
}

export function useCallback(create, deps) {
    return dispatcher.useCallbackOrMeno(create, deps);
}
export function useMemo(create, deps) {
    return dispatcher.useCallbackOrMemo(create, deps, true);
}
export function useRef(initValue) {
    return dispatcher.useRef(initValue);
}
export function useContext(initValue) {//这个不对
    return dispatcher.useContext(initValue);
}
export function useImperativeHandle(ref, create, deps) {
    return dispatcher.useImperativeHandle(ref, create, deps);
}