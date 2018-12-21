
import { dispatcher } from 'react-fiber/dispatcher';

export function useState(initValue) {
    return dispatcher.useReducer(null, initValue);
}
export function useEffect(initValue) {
    return dispatcher.useEffect(initValue);
}
export function useCallback(callback, inputs) {
    return dispatcher.useCallbackOrMemo(callback, inputs);
}
export function useMemo(create, inputs) {
    return dispatcher.useCallbackOrMemo(create, inputs, true);
}
export function useRef(initValue) {
    return dispatcher.useRef(initValue);
}
export function useContext(initValue) {
    return dispatcher.useContext(initValue);
}
export function useReducer(reducer, initValue, initAction) {
    return dispatcher.useReducer(reducer, initValue, initAction);
}