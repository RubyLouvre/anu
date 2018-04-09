import {
    PLACE,
    CONTENT,
    ATTR,//UPDATE
    NULLREF,
    DETACH,//DELETION
    HOOK,
    REF,
    CALLBACK,
    CAPTURE,
    effectLength,
    effectNames
} from "./effectTag";
import { effects } from "./util";
import { callLifeCycleHook, pushError } from "./unwindWork";
import { returnFalse, returnTrue, emptyObject } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { Refs } from "./Refs";
export function commitEffects(a) {
    var arr = a || effects;
    arr = commitPlaceEffects(arr);
    /*
    console.log(arr.reduce(function (pre, el) {
        pre.push(el.effectTag, el);
        return pre;
    }, []));
*/
    for (var i = 0; i < arr.length; i++) {
        commitOtherEffects(arr[i]);
        if (Renderer.error) {
            arr.length = 0;
            break;
        }
    }
    arr.forEach(commitOtherEffects);
    arr.length = effects.length = 0;
    var error = Renderer.error;
    if (error) {
        delete Renderer.error;
        throw error;
    }
}
/**
 * 提先执行所有RLACE任务
 * @param {Fiber} fibers 
 */
export function commitPlaceEffects(fibers) {
    var ret = [];
    for (let i = 0, n = fibers.length; i < n; i++) {
        let fiber = fibers[i];
        let amount = fiber.effectTag;
        let remainder = amount / PLACE;
        let hasEffect = amount > 1;
        if (hasEffect && remainder == ~~remainder) {
            try {
                fiber.parent.insertPoint = null;
                Renderer.insertElement(fiber);
            } catch (e) {
                throw e;
            }
            fiber.effectTag = remainder;
            hasEffect = remainder > 1;
        }
        if (hasEffect) {
            ret.push(fiber);
        }
    }
    return ret;
}

/**
 * 执行其他任务
 * 
 * @param {Fiber} fiber 
 */
export function commitOtherEffects(fiber) {
    let instance = fiber.stateNode || emptyObject;
    let amount = fiber.effectTag;
    let updater = instance.updater;
    for (let i = 0; i < effectLength; i++) {
        let effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        if (amount % effectNo === 0) {
            amount /=  effectNo;
            //如果能整除，下面的分支操作以后要改成注入方法
            switch (effectNo) {
            case PLACE: //2. 只对原生组件
                Renderer.insertElement(fiber);
                break;
            case CONTENT: //3.
                Renderer.updateContext(fiber);
                break;
            case ATTR: //5. 只对原生组件
                Renderer.updateAttribute(fiber);
                break; 
            case NULLREF://7
                if (!instance.__isStateless) {
                    Refs.fireRef(fiber, null);
                }
                break;
            case DETACH: //11
                if (fiber.tag > 3) {
                    //只对原生组件
                    Renderer.removeElement(fiber);
                } else {
                    updater.enqueueSetState = returnFalse;
                    callLifeCycleHook(instance, "componentWillUnmount", []);
                    updater._isMounted = returnFalse;
                }
                delete fiber.stateNode;
                delete fiber.alternate;
                //业务 & 原生
                break;
            case HOOK: //13 只对业务组件
                if (updater._isMounted()) {
                    callLifeCycleHook(instance, "componentDidUpdate", [updater.lastProps, updater.lastState]);
                } else {
                    updater._isMounted = returnTrue;
                    callLifeCycleHook(instance, "componentDidMount", []);
                }
                delete fiber.pendingFiber;
                delete updater._hydrating;
                break;
            case REF://19 
                if (!instance.__isStateless) {
                    Refs.fireRef(fiber, instance);
                }
                break;
            case CALLBACK:// 23
                //ReactDOM.render/forceUpdate/setState callback
                var queue = fiber.pendingCbs;
                queue.forEach(function (fn) {
                    fn.call(instance);
                });
                delete fiber.pendingCbs;
                break;
            case CAPTURE:// 29
                updater._isDoctor = true;
                instance.componentDidCatch.apply(instance, fiber.errorInfo);
                fiber.errorInfo = null;
                updater._isDoctor = false;
                break;
            }
        }
    }
    fiber.effectTag = 1;
}
