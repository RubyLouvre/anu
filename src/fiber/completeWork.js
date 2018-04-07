import { PLACE } from "./effectTag";
import { __push, get } from "../util";
/**
 * 此方法主要是用于收集虚拟DOM上的各种任务（sideEffect）,并且为元素虚拟DOM指定插入点
 * 如果Fiber存在shouldUpdateFalse＝true属性，那么只收集它的元素虚拟DOM，并且它只有
 * Place特效
 * 
 * @param {Fiber} fiber 
 * @param {Object} insertHelper 
 * @param {Boolean} shouldUpdateFalse 
 */
export function collectEffects(fiber, shouldUpdateFalse, isTop) {
    if(!fiber){
        return [];
    }
    let effects = fiber.effects ; //将自己
    if (effects) {
        delete fiber.effects;

    } else {
        effects = [];
    }
    //一开始
    if (isTop && fiber.tag == 5) { //根节点肯定元素节点
        fiber.stateNode.insertPoint = null;
    }


    for (let child = fiber.child; child; child = child.sibling) {
        let isHost = child.tag > 3;
        if (isHost) {
            child.insertPoint = child.parent.insertPoint;
            child.parent.insertPoint = child.stateNode;
        } else {
            child.insertPoint = child.parent.insertPoint;
        }
        if (shouldUpdateFalse || child.shouldUpdateFalse) {
           
            if (isHost) {
                if(!child.disposed){
                    child.effectTag *= PLACE;
                    effects.push(child);
                }
            } else {
                //只有组件虚拟DOM才有钩子
                delete child.shouldUpdateFalse;
                __push.apply(effects, collectEffects(child, true));
            }
        } else {
            //__push.apply(effects, collectEffects(get(child.stateNode) ));
            __push.apply(effects, collectEffects(child));
           
        }
        if (child.effectTag) {//shouldUpdateFalse也会执行REF与CALLBACK
            effects.push(child);
        }
    }


    return effects;
}

export function getContainer(p) {
    if (p.parent) {
        return p.parent;
    }
    while ((p = p.return)) {
        if (p.tag === 5) {
            return p.stateNode;
        }
    }
}
