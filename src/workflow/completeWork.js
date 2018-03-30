import { contextStack } from '../share';
//import { NOWORK } from "../effectTag";
import { __push } from '../util';

export function collectEffects(fiber, insertHelper, shouldUpdateFalse) {
	var effects = fiber.effects; //将自己
	var isHost = fiber.tag > 3,
		parent;
	if (fiber.root) {
		parent = fiber.stateNode;
	} else if (fiber.parent) {
		parent = fiber.parent;
	} else {
		console.warn('fiber没有parent');
	}
	//<p><span></span><span></span><A /></p>
	if (effects) {
		delete fiber.effects;
	} else {
		effects = [];
	}
	var children = fiber._children;

	if (!fiber.root && parent !== fiber.stateNode) {
		if (isHost) {
			let b = parent.beforeNode;

			fiber.mountPoint = b;

			//	parent.beforeNode = fiber.stateNode;
			//	console.log(fiber.mountPoint === fiber.stateNode )
			if (fiber.tag == 5) {
				parent = fiber.stateNode;
			}
		} else {
			fiber.mountPoint = parent.beforeNode;
		}
	}
	for (var i in children) {
		var child = children[i];
		child.parent = parent;
		child.insertMount = insertHelper.dom;
		if (shouldUpdateFalse || child.shouldUpdateFalse) {
			delete child.shouldUpdateFalse;
			if (child.tag > 3) {
				child.effectTag = 2;
				effects.push(child);
			} else {
				__push.apply(effects, collectEffects(child, insertHelper, true));
			}
		} else {
			__push.apply(effects, collectEffects(child, insertHelper));

			if (child.effectTag) {
				effects.push(child);
			}
		}
		if (child.tag > 3) {
			insertHelper.dom = child.stateNode;
		}
	}
	return effects;
}
