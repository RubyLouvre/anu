
import { dispatcher } from 'react-fiber/dispatcher';

export function useState(initValue) {
    return dispatcher.useReducer(null, initValue);
}
export function useEffect(initValue) {
    return dispatcher.useEffect(initValue);
}
export function useCallback(initValue) {
    return dispatcher.useCallback(initValue);
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