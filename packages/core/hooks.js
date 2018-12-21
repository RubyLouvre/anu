
import { dispatcher } from 'react-fiber/dispatcher';

export function useState(initValue) {
    return dispatcher.useReducer(null, initValue);
}
export function useEffect(initValue) {
    return dispatcher.useEffect(initValue);
}
export function useCallback(callback, inputs) {
    return dispatcher.useCallbackOrMeno(callback, inputs);
}
export function useMeno(create, inputs) {
    return dispatcher.useCallbackOrMeno(create, inputs, true);
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