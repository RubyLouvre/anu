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
export function collectEffects(fiber, shouldUpdateFalse) {
	let effects = fiber.effects; //将自己
	if (effects) {
		delete fiber.effects;
	} else {
		effects = [];
	}
	var a = fiber, b = fiber.return;
	if (a.tag > 3 && b) {

		do{
			if(a === b.child){
				if(b.tag === 5){
					b.stateNode.insertPoint = null
					break
				}else{
					a = b;
				}
			}
		}while(b == b.return)
	//	var container = getContainer(fiber);
	//	container.insertPoint = null;
	}
//	console.log(fiber)
	if(fiber.type === "p"){
		console.log(fiber)
	}
	for (let child = fiber.child; child; child = child.sibling) {
		let isHost = child.tag > 3;
		if (shouldUpdateFalse || child.shouldUpdateFalse) {
		/*	if(child.shouldUpdateFalse){
				console.log("这是return false的组件")
			}*/
			if (isHost) {
				child.effectTag = PLACE;
				console.log(child, true, 'shouldUpdateFalse下的元素节点')
				effects.push(child);
			} else {
				//只有组件虚拟DOM才有钩子
				delete child.shouldUpdateFalse;
				//console.log(child, true, '999999')
				__push.apply(effects, collectEffects(child, true));
			}
		} else {
			__push.apply(effects, collectEffects(child));
		//	console.log(child, false, '不是false')
			if (child.effectTag) {
				effects.push(child);
			}
		}
	}
	//console.log(!!fiber.parent, fiber.name, fiber.key)
	if (fiber.parent) {
		
		fiber.insertPoint = fiber.parent.insertPoint;
		if (fiber.tag > 3) {
			fiber.parent.insertPoint = fiber.stateNode;
		}
	}
	//console.log(fiber.name, '先执行');
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
