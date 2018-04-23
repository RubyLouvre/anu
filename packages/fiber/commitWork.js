import {
    PLACE,
    CONTENT,
    ATTR, //UPDATE
    NULLREF,
    DETACH, //DELETION
    HOOK,
    REF,
    CALLBACK,
    CAPTURE,
    effectLength,
    effectNames,
} from "./effectTag";
import { effects } from "./util";
import { guardCallback } from "./ErrorBoundary";
import { returnFalse, returnTrue, emptyObject } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { Refs } from "./Refs";

export function commitEffects(a) {
    let tasks = a || effects;
    tasks = commitPlaceEffects(tasks);
    Renderer.isRendering = true;
    /*
    console.log(tasks.reduce(function (pre, el) {
        pre.push(el.effectTag, el);
        return pre;
    }, []));
    */
    for (let i = 0, n = tasks.length; i < n; i++) {
        commitOtherEffects(tasks[i]);
        if (Renderer.error) {
            tasks.length = 0;
            break;
        }
    }
    effects.length = 0;
    var error = Renderer.error;
    Renderer.isRendering = false;
    if (error) {
        delete Renderer.error;
        throw error;
    }
}
/**
 * 提先执行所有RLACE任务
 * @param {Fiber} tasks
 */
export function commitPlaceEffects(tasks) {
    var ret = [];
    for (let i = 0, n = tasks.length; i < n; i++) {
        let fiber = tasks[i];
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
    let updater = instance.updater || {};
    for (let i = 0; i < effectLength; i++) {
        let effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        if (amount % effectNo === 0) {
            amount /= effectNo;
            //如果能整除
            switch (effectNo) {
            case PLACE:
                if (fiber.tag > 3) {
                    Renderer.insertElement(fiber);
                }
                break;
            case CONTENT:
                Renderer.updateContext(fiber);
                break;
            case ATTR:
                Renderer.updateAttribute(fiber);
                break;
            case NULLREF:
                if (!instance.__isStateless) {
                    Refs.fireRef(fiber, null);
                }
                break;
            case DETACH:
                if (fiber.tag > 3) {
                    Renderer.removeElement(fiber);
                } else {
                    updater.enqueueSetState = returnFalse;
                    guardCallback(instance, "componentWillUnmount", []);
                    updater.isMounted = returnFalse;
                }
                delete fiber.stateNode;
                delete fiber.alternate;
                break;
            case HOOK:
                Renderer._hydratingParent = fiber;
                if (updater.isMounted()) {
                    guardCallback(instance, "componentDidUpdate", [updater.lastProps, updater.lastState, updater.snapshot]);
                } else {
                    updater.isMounted = returnTrue;
                    guardCallback(instance, "componentDidMount", []);
                }
                Renderer._hydratingParent = null;
                delete fiber._hydrating;
                break;
            case REF:
                if (!instance.__isStateless) {
                    Refs.fireRef(fiber, instance);
                }
                break;
            case CALLBACK:
                //ReactDOM.render/forceUpdate/setState callback
                var queue = fiber.pendingCbs || [];
                fiber._hydrating = true; //setState回调里再执行setState
                queue.forEach(function(fn) {
                    fn.call(instance);
                });
                fiber._hydrating = false;
                delete fiber.pendingCbs;
                break;
            case CAPTURE: // 29
                fiber._isDoctor = true;
                fiber.effectTag = 1; //清空其它
                delete fiber._hydrating;
                instance.componentDidCatch.apply(instance, fiber.errorInfo);
                delete fiber.errorInfo;
                delete fiber._isDoctor;
                break;
            }
        }
    }
    fiber.effectTag = 1;
}
