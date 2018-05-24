import { PLACE, HOOK, DETACH, NULLREF, NOWORK } from "./effectTag";
import { arrayPush, emptyObject, returnFalse } from "react-core/util";
import { guardCallback, removeFormBoundaries } from "./ErrorBoundary";
import { Renderer } from "react-core/createRenderer";
import { Refs } from "./Refs";

/**
 * 此方法主要是用于收集虚拟DOM上的各种任务（sideEffect）,并且为元素虚拟DOM指定插入点
 * 如果Fiber存在updateFail＝true属性，那么只收集它的元素虚拟DOM，并且它只有
 * Place特效
 * 
 * 从上到下收集
 *
 * @param {Fiber} fiber
 * @param {Boolean} updateFail
 * @param {Boolean} isTop
 */


export function collectWork(fiber, updateFail, isTop) {
    if (!fiber) {
        return [];
    }
    if (fiber.hasError) {
        removeFormBoundaries(fiber);
        //这里是子组件render时引发的错误
        disposeFibers(fiber);
        return [];
    }
    let effects = fiber.effects;
    if (effects) {
        fiber.effects.forEach(disposeFiber);
        fiber.effects.length = 0;
        delete fiber.effects;
    } else {
        effects = [];
    }
    let c = fiber.children || {};
    for (let i in c) {
        let child = c[i];
        let isHost = child.tag > 3;
        if (updateFail || child.updateFail) {
            if (isHost) {
                if (!child.disposed) {
                    child.effectTag *= PLACE;
                    effects.push(child);
                }
            } else {
                //只有组件虚拟DOM才有钩子
                delete child.updateFail;
                arrayPush.apply(effects, collectWork(child, true));
            }
        } else {
            arrayPush.apply(effects, collectWork(child));
        }
        if (child.effectTag) {
            //updateFail也会执行REF与CALLBACK
            effects.push(child);
        }
    }
    return effects;
}
/*
function getChildren(parent) {
    return Array.from(parent.childNodes || parent.children);
}
*/

export function disposeFibers(fiber) {
    let effects = fiber.effects;
    if (effects) {
        effects.forEach(disposeFiber);
        delete fiber.effects;
    }
    let c = fiber.oldChildren || emptyObject;
    for (let i in c) {
        let child = c[i];
        if (child.disposed) {
            continue;
        }
        disposeFibers(child);
        disposeFiber(child, true);
    }
    delete fiber.child;
    delete fiber.lastChild;
    delete fiber.oldChildren;
    fiber.children = {};
}

function disposeFiber(fiber, force) {
    let { stateNode, effectTag } = fiber;
    if (!stateNode.__isStateless && fiber.ref) {
        Refs.fireRef(fiber, null);
    }
    if (effectTag % DETACH == 0 || force === true) {
        if (fiber.tag > 3) {
            Renderer.removeElement(fiber);
        } else {
            if (fiber.hasMounted) {
                stateNode.updater.enqueueSetState = returnFalse;
                guardCallback(stateNode, "componentWillUnmount", []);
            }
        }
        delete fiber.alternate;
        delete fiber.hasMounted;
        delete fiber.stateNode;
        fiber.disposed = true;
    }
    fiber.effectTag = NOWORK;
}