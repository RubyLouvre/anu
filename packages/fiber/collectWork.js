import { PLACE, HOOK, DETACH, NULLREF } from "./effectTag";
import { arrayPush, emptyObject } from "react-core/util";
import { AnuPortal } from "react-core/createPortal";
import { removeFormBoundaries } from "./ErrorBoundary";


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
        let ret = collectDeletion(fiber);
        delete fiber.child;
        fiber.oldChildren = fiber.children = {};
        return ret;
    }
    let effects = fiber.effects;
    if (effects) {
        delete fiber.effects;
    } else {
        effects = [];
    }

    if (fiber.dirty) {
        delete fiber.dirty; 
        //根节点肯定元素节点
    }
    let  c = fiber.children || {};
    for (let i in c) {
       
        let child = c[i];
        let isHost = child.tag > 3;
       
        if (updateFail || child.updateFail) {
            if (isHost) {
                if (!child.disposed) {
                  //  child.effectTag *= PLACE;
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

function markDeletion(el) {
    el.disposed = true;
    el.effectTag = DETACH;
    if (el.ref) {
        el.effectTag *= NULLREF;
    }
}

export function collectDeletion(fiber) {
    let effects = fiber.effects;
    if (effects) {
        effects.forEach(markDeletion);
        delete fiber.effects;
    } else {
        effects = [];
    }
    let c = fiber.oldChildren || emptyObject;
    for (let i in c) {
        let child = c[i];
        if (child.disposed) {
            continue;
        }
        markDeletion(child);
        arrayPush.apply(effects, collectDeletion(child));
        effects.push(child);
    }
    return effects;
}

