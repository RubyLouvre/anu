import { PLACE } from './effectTag';
import { __push } from '../util';
/**
 * 此方法主要是用于收集虚拟DOM上的各种任务（sideEffect）,并且为元素虚拟DOM指定插入点
 * 如果Fiber存在shouldUpdateFalse＝true属性，那么只收集它的元素虚拟DOM，并且它只有
 * Place特效
 * 
 * @param {Fiber} fiber 
 * @param {Object} insertHelper 
 * @param {Boolean} shouldUpdateFalse 
 */
export function collectEffects(fiber, insertHelper, shouldUpdateFalse) {
	let effects = fiber.effects; //将自己
	if (effects) {
		delete fiber.effects;
	} else {
		effects = [];
	}
	// let children = fiber._children;
	for (let child = fiber.child; child; child = child.sibling) {
		let helper = insertHelper;
		let isHost = child.tag > 3;
		if (isHost) {
			child.insertPoint = helper.insertPoint;
			helper.insertPoint = child.stateNode;
			if (child.parent != helper.parent) {
				helper = {
					parent: child.stateNode,
					insertPoint: child.insertPoint
				};
			}
		}
		if (shouldUpdateFalse || child.shouldUpdateFalse) {
			if (isHost) {
				child.effectTag = PLACE;
				effects.push(child);
			} else {//只有组件虚拟DOM才有钩子
				delete child.shouldUpdateFalse;
				__push.apply(effects, collectEffects(child, helper, true));
			}
		} else {
			__push.apply(effects, collectEffects(child, helper));
			if (child.effectTag) {
				effects.push(child);
			}
		}
	}
	return effects;
}
