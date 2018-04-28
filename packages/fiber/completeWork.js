import { PLACE } from "./effectTag";
import { arrayPush } from "react-core/util";
import { AnuPortal } from "react-core/createPortal";
import { Renderer } from "react-core/createRenderer";

/**
 * 此方法主要是用于收集虚拟DOM上的各种任务（sideEffect）,并且为元素虚拟DOM指定插入点
 * 如果Fiber存在updateFail＝true属性，那么只收集它的元素虚拟DOM，并且它只有
 * Place特效
 *
 * @param {Fiber} fiber
 * @param {Boolean} updateFail
 * @param {Boolean} isTop
 */
export function collectEffects(fiber, updateFail, isTop) {
    if (!fiber) {
        return [];
    }
    if (fiber.capturedCount == 1) {
        //这里是子组件render时引发的错误
        fiber.capturedCount++;
        // console.log("collectEffects清空节点");
        // 这里不能设置clearChildren = true;
        // fiber.clearChildren = true;
        Renderer.diffChildren(fiber, []);
    }
    let effects = fiber.effects;
    if (effects) {
        delete fiber.effects;
    } else {
        effects = [];
    }

    if (isTop && fiber.tag == 5) {
        //根节点肯定元素节点
        fiber.stateNode.insertPoint = null;
    }
    for (let child = fiber.child; child; child = child.sibling) {
        let isHost = child.tag > 3;
        if (isHost) {
            child.insertPoint = child.parent.insertPoint;
            child.parent.insertPoint = child.stateNode;
        } else {
            if (child.type != AnuPortal) {
                child.insertPoint = child.parent.insertPoint;
            }
        }
        if (updateFail || child.updateFail) {
            if (isHost) {
                if (!child.disposed) {
                    child.effectTag *= PLACE;
                    effects.push(child);
                }
            } else {
                //只有组件虚拟DOM才有钩子
                delete child.updateFail;
                arrayPush.apply(effects, collectEffects(child, true));
            }
        } else {
            arrayPush.apply(effects, collectEffects(child));
        }
        if (child.effectTag ) {
            //updateFail也会执行REF与CALLBACK
            effects.push(child);
        }
    }
    return effects;
}
