import {
    PLACE,
    ATTR,
    DETACH,
    HOOK,
    CONTENT,
    REF,
    CHANGEREF,
    NULLREF,
    CALLBACK,
    CAPTURE,
    effectLength,
    effectNames
} from "./effectTag";
import { effects, Flutter } from "./util";
import { callLifeCycleHook, pushError } from "./unwindWork";
import { returnFalse, returnTrue, noop } from "../util";
import { Refs } from "../Refs";
var clearUpElements = []
export function commitEffects(a) {
    var arr = a || effects;
    arr = commitPlaceEffects(arr);
    /*
    console.log( arr.reduce(function(pre,el){
        pre.push( el.effectTag, el );
        return pre;
    },[]) );
    */
    for(var i = 0; i < arr.length; i++){
        commitOtherEffects(arr[i])
        if(Flutter.error){
            arr.length = 0;
            break
        }
    }
    arr.forEach(commitOtherEffects);
    clearUpElements.forEach(removeStateNode)
    clearUpElements.length = arr.length = effects.length = 0;
    var error = Flutter.error
    if(error){
        delete Flutter.error
        throw error
    }
}
function removeStateNode(el){
    delete el.alternate;
    delete el.stateNode;
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
                Flutter.insertElement(fiber);
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
    let instance = fiber.stateNode;
    let amount = fiber.effectTag;
    let updater = instance.updater;
    outer:
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
                Flutter.updateAttribute(fiber);
                break;
            case DETACH:
                if (fiber.tag > 3) {
                    //只对原生组件
                    Flutter.removeElement(fiber);
                }
                clearUpElements.push(fiber)
                //业务 & 原生
                break;
            case HOOK: //只对业务组件
                if (fiber.disposed) {
                    updater.enqueueSetState = returnFalse;
                    if(updater._isMounted()){
                       callLifeCycleHook(instance, "componentWillUnmount", []);
                    }
                    updater._isMounted = returnFalse;
                } else {
                    if (updater._isMounted()) {
                        callLifeCycleHook(instance, "componentDidUpdate", [updater.lastProps, updater.lastState]);
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
                if (!instance.__isStateless) {
                    Refs.fireRef(fiber, instance);
                }
                break;
            case CHANGEREF:
            case NULLREF:
                if (!instance.__isStateless) {
                    Refs.fireRef(fiber, null);
                }
                break;
            case CALLBACK:
                //ReactDOM.render/forceUpdate/setState callback
                var queue = fiber.pendingCbs;
                queue.forEach(function (fn) {
                    fn.call(instance);
                });
                delete fiber.pendingCbs;
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
    fiber.effectTag = 1;
}
