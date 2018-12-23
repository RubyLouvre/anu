
import { dispatcher } from 'react-fiber/dispatcher';
import { PASSIVE, HOOK } from 'react-fiber/effectTag';
export function useState(initValue) {
    return dispatcher.useReducer(null, initValue);
}
export function useEffect(initValue, inputs) {
    return dispatcher.useEffect(initValue, inputs, PASSIVE, 'passive', 'unpassive');
}
export function useLayoutEffect(initValue, inputs) {
    return dispatcher.useEffect(initValue, inputs, HOOK, 'layout', 'unlayout');
}
export function useCallback(callback, inputs) {
    return dispatcher.useCallbackOrMeno(callback, inputs);
}
export function useMemo(create, inputs) {
    return dispatcher.useCallbackOrMemo(create, inputs, true);
}
export function useRef(initValue) {
    return dispatcher.useRef(initValue);
}
export function useContext(initValue) {//这个不对
    return dispatcher.useContext(initValue);
}
export function useReducer(reducer, initValue, initAction) {
    return dispatcher.useReducer(reducer, initValue, initAction);
}
export function useImperativeMethods(ref, create, inputs) {
    return dispatcher.useImperativeMethods(ref, create, inputs);
}