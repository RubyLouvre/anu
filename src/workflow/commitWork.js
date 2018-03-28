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
import { returnFalse, returnTrue, Flutter } from "../util";
import { Refs } from "../Refs";

//ref中的元素必须已经插入到DOM树，由于anu是从下往上添加，因此需要提先执行所有PALCE效果
export function commitAppendEffect(fibers) {
    var ret = [];
    for (let i = 0, n = fibers.length; i < n; i++) {
        let fiber = fibers[i];
        let amount = fiber.effectTag;
        let remainder = amount / PLACE;
        let hasEffect = remainder > 1;
        if (hasEffect && remainder == ~~remainder) {
            Flutter.insertElement(fiber);
            fiber.effectTag = remainder;
        }
        if (hasEffect) {
            ret.push(fiber);
        }
    }
    return ret;
}

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
                Flutter.insertElement(fiber);
                break;
            case ATTR: //只对原生组件
                delete fiber.beforeNode;
                Flutter.updateAttribute(fiber);
                break;
            case DETACH:
                if (fiber.tag > 3) {
                    //只对原生组件
                    Flutter.removeElement(fiber);
                }
                //业务 & 原生
                //	delete fiber.stateNode;
                break;
            case HOOK: //只对业务组件
                delete fiber.beforeNode;
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
                delete fiber.pendingFiber;
                delete updater._hydrating;
                break;
            case CONTENT:
                Flutter.updateContext(fiber);
                break;
            case REF:
                if (!instance._isStateless) {
                    Refs.fireRef(fiber, instance);
                }
                break;
            case NULLREF:
                if (!instance._isStateless) {
                    Refs.fireRef(fiber, null);
                }
                break;
            case CALLBACK:
                //ReactDOM.render/forceUpdate/setState callback
                var queue = Array.isArray(fiber.callback) ? fiber.callback : [ fiber.callback ];
                queue.forEach(function(fn) {
                    fn.call(instance);
                });
                delete fiber.callback;
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
