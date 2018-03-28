import { contextStack } from '../share';
//import { NOWORK } from "../effectTag";

export function completeWork(fiber, topWork) {
	//收集effects
	var parentFiber = fiber.return;
	if (fiber.tag < 3) {
		fiber.stateNode._reactInternalFiber = fiber;
		if (fiber.stateNode.getChildContext) {
			contextStack.pop(); // pop context
		}
	}
	// console.log('收集副作用', fiber.name);
	delete fiber.onlyPlace;

	if (parentFiber && fiber !== topWork) {
		//  console.log(fiber.effectTag, !!fiber.alternate, fiber.name, fiber.key, fiber.old);
		const childEffects = fiber.effects || [];
		const thisEffect = fiber.effectTag > 1 ? [ fiber ] : [];
		const parentEffects = parentFiber.effects || [];

		parentFiber.effects = parentEffects.concat(childEffects, thisEffect);
	}
}
