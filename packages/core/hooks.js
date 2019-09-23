import {
    useReducerImpl,
    useEffectImpl,
    useCallbackImpl,
    useRef,
    useContext,
    useImperativeHandle
} from "react-fiber/dispatcher";
import { PASSIVE, HOOK } from "react-fiber/effectTag";

function useState(initValue) {
    return useReducerImpl(null, initValue);
}
function useReducer(reducer, initValue, initAction) {
    return useReducerImpl(reducer, initValue, initAction);
}
function useEffect(create, deps) {
    return useEffectImpl(create, deps, PASSIVE, "passive", "unpassive");
}
function useLayoutEffect(create, deps) {
    return useEffectImpl(create, deps, HOOK, "layout", "unlayout");
}

function useMemo(create, deps) {
    return useCallbackImpl(create, deps, true);
}

function useCallback(create, deps) {
    return useCallbackImpl(create, deps);
}

export {
    useState,
    useReducer,
    useEffect,
    useMemo,
    useLayoutEffect,
    useCallback,
    useRef,
    useContext, //这个不对
    useImperativeHandle
};
