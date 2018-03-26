import {
    PLACE,
    ATTR,
    DETACH,
    HOOK,
    CONTENT,
    REF,
    NULLREF,
    CALLBACK,
    CAPTURE,
    effectLength,
    effectNames
} from "../effectTag";
import { callLifeCycleHook, pushError } from "./unwindWork";
import { returnFalse, returnTrue, shader } from "../util";
import { Refs } from "../Refs";

/**
 * 基于素数的任务系统
 * @param {Refs} fiber 
 */
export function commitWork(fiber) {
    let instance = fiber.stateNode;
    let amount = fiber.effectTag;
    let updater = instance.updater;
    for (let i = 0; i < effectLength; i++) {
        let effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        let remainder = amount / effectNo;

        if (remainder == ~~remainder) {
            //如果能整除，下面的分支操作以后要改成注入方法
            amount = remainder;
            switch (effectNo) {
            case PLACE: //只对原生组件
                shader.insertElement(fiber);
                break;
            case ATTR: //只对原生组件
                delete fiber.before;
                shader.updateAttribute(fiber);
                break;
            case DETACH:
                if (fiber.tag > 3) {
                    //只对原生组件
                    shader.removeElement(fiber);
                }
                //业务 & 原生
                //	delete fiber.stateNode;
                break;
            case HOOK: //只对业务组件
                delete fiber.before;
             
                if (fiber.disposed) {
                    updater._isMounted = updater.enqueueSetState = returnFalse;
                    callLifeCycleHook(instance, "componentWillUnmount", []);
                } else {
                    if (updater._isMounted()) {
                        callLifeCycleHook(instance, "componentDidUpdate", []);
                    } else {
                        updater._isMounted = returnTrue;
                        callLifeCycleHook(instance, "componentDidMount", []);
                    }
                }
                delete fiber.pendingState;
                delete updater._hydrating;
                break;
            case CONTENT:
                shader.updateContext(fiber);
                break;
            case REF:
                Refs.fireRef(fiber, instance);
                break;
            case NULLREF:
                Refs.fireRef(fiber, null);
                break;
            case CALLBACK:
                //ReactDOM.render/forceUpdate/setState callback
                var queue = Array.isArray(fiber.callback) ? fiber.callback : [fiber.callback];
                queue.forEach(function (fn) {
                    fn.call(instance);
                });
                break;
            case CAPTURE:
                updater._isDoctor = true;
                instance.componentDidCatch.apply(instance, fiber.errorInfo);
                fiber.errorInfo = null;
                updater._isDoctor = false;
                break;
            }
        }
    }
    fiber.effectTag = fiber.effects = null;
    
}