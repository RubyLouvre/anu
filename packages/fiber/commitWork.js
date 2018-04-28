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
import { guardCallback, detachFiber } from "./ErrorBoundary";
import { fakeObject } from "react-core/Component";

import { returnFalse,effects, arrayPush, returnTrue, emptyObject } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { Refs } from "./Refs";

export function commitEffects() {
    commitPlaceEffects(effects);
    /*
	  console.log(effects.reduce(function (pre, el) {
        pre.push(el.effectTag, el.name);
        return pre;
    }, []));
 */

    Renderer.batchedUpdates(function () {
        var tasks = effects,
            task;
        while ((task = tasks.shift())) {
            commitOtherEffects(task, tasks);
            if (Renderer.catchError) {
                tasks.length = 0;
                break;
            }
        }
    });

    var error = Renderer.catchError;

    if (error) {
        delete Renderer.catchError;
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
    tasks.length = 0;
    arrayPush.apply(tasks, ret);
    return ret;
}

/**
 * 执行其他任务
 *
 * @param {Fiber} fiber
 */
export function commitOtherEffects(fiber, tasks) {
    let instance = fiber.stateNode || emptyObject;
    let amount = fiber.effectTag;
    let updater = instance.updater || fakeObject;
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
                    if (updater.isMounted()) {
                        updater.enqueueSetState = returnFalse;
                        guardCallback(instance, "componentWillUnmount", []);
                        updater.isMounted = returnFalse;
                    }
                }
                delete fiber.stateNode;
                delete fiber.alternate;
                break;
            case HOOK:
                if (updater.isMounted()) {
                    guardCallback(instance, "componentDidUpdate", [
                        updater.lastProps,
                        updater.lastState,
                        updater.snapshot,
                    ]);
                } else {
                    //一个hack
                    instance.parentNode = instance.parentNode || true;
                    updater.isMounted = returnTrue;
                    guardCallback(instance, "componentDidMount", []);
                }

                delete fiber._hydrating;

                if (fiber.capturedCount == 1 && fiber.child) {
                    // fiber.capturedCount++;
                    delete fiber.capturedCount;
                    //console.log("清空节点");
                    //清空它的下方节点
                    var r = [];
                    var n = Object.assign({}, fiber);
                    detachFiber(n, r);
                    fiber.clearChildren = true;
                    r.shift();
                    delete fiber.child;
                    delete fiber._children;
                    tasks.push.apply(tasks, r);
                    fiber.effectTag = 1;
                    n.effectTag = amount;
                    tasks.push(n);
                    return;
                    // tasks.push(n);
                }

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
                queue.forEach(function (fn) {
                    fn.call(instance);
                });
                fiber._hydrating = false;
                delete fiber.pendingCbs;
                break;
            case CAPTURE: // 23
                var root = fiber;
                while (root.return) {
                    root = root.return;
                }
                var values = root.capturedValues;
                fiber.effectTag = amount;
                instance.componentDidCatch(values.shift(), values.shift());

                if (!values.length) {
                    delete root.catchBoundary;
                }
                break;
            }
        }
    }
    fiber.effectTag = 1;
}
