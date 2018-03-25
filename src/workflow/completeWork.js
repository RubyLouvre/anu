import { contextStack } from '../share';
import { NOWORK } from '../effectTag';

export function completeWork(fiber, topWork) {
	//收集effects
	var parentFiber = fiber.return;
	var parent = fiber.parent;
	if (fiber.tag == 2) {
		fiber.stateNode._reactInternalFiber = fiber;
		if (fiber.stateNode.getChildContext) {
			contextStack.pop(); // pop context
		}
	}

	if (parentFiber && fiber.effectTag !== NOWORK && fiber !== topWork) {
		const childEffects = fiber.effects || [];
		const thisEffect = fiber.effectTag > 1 ? [ fiber ] : [];
		const parentEffects = parentFiber.effects || [];
		parentFiber.effects = parentEffects.concat(childEffects, thisEffect);
	}
}