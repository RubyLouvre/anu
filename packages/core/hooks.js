import { dispatcher } from 'react-fiber/dispatcher';
import { PASSIVE, HOOK } from 'react-fiber/effectTag';
export function useState(initValue) {
    return dispatcher.useReducer(null, initValue);
}
export function useReducer(reducer, initValue, initAction) {
    return dispatcher.useReducer(reducer, initValue, initAction);
}
export function useEffect(create, inputs) {
    return dispatcher.useEffect(create, inputs, PASSIVE, 'passive', 'unpassive');
}
export function useLayoutEffect(create, inputs) {
    return dispatcher.useEffect(create, inputs, HOOK, 'layout', 'unlayout');
}

export function useCallback(create, inputs) {
    return dispatcher.useCallbackOrMeno(create, inputs);
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
export function useImperativeMethods(ref, create, inputs) {
    return dispatcher.useImperativeMethods(ref, create, inputs);
}