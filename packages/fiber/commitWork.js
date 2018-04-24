import {
	PLACE,
	CONTENT,
	ATTR, //UPDATE
	NULLREF,
	DETACH, //DELETION
	HOOK,
	REF,
	CALLBACK,
	CAPTURE,
	effectLength,
	effectNames,
} from './effectTag';
import { effects } from './util';
import { guardCallback } from './ErrorBoundary';
import { returnFalse, get, __push, returnTrue, emptyObject } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';
import { Refs } from './Refs';

export function commitEffects() {
	commitPlaceEffects(effects);
	Renderer.isRendering = true;
	/*
	  console.log(effects.reduce(function (pre, el) {
        pre.push(el.effectTag, el.name);
        return pre;
    }, []));
 */
	var tasks = effects,
		task;
	while ((task = tasks.shift())) {
		commitOtherEffects(task, tasks);
		if (Renderer.catchError) {
			tasks.length = 0;
			break;
		}
	}

	var error = Renderer.catchError;
	Renderer.isRendering = false;
	if (error) {
		delete Renderer.catchError;
		throw error;
	}
}
/**
 * 提先执行所有RLACE任务
 * @param {Fiber} tasks
 */
export function commitPlaceEffects(tasks) {
	var ret = [];
	for (let i = 0, n = tasks.length; i < n; i++) {
		let fiber = tasks[i];
		let amount = fiber.effectTag;
		let remainder = amount / PLACE;
		let hasEffect = amount > 1;
		if (hasEffect && remainder == ~~remainder) {
			try {
				fiber.parent.insertPoint = null;
				Renderer.insertElement(fiber);
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
	tasks.length = 0;
	__push.apply(tasks, ret);
	return ret;
}

/**
 * 执行其他任务
 *
 * @param {Fiber} fiber
 */
export function commitOtherEffects(fiber, tasks) {
	let instance = fiber.stateNode || emptyObject;
	let amount = fiber.effectTag;
	let updater = instance.updater || {};
	for (let i = 0; i < effectLength; i++) {
		let effectNo = effectNames[i];
		if (effectNo > amount) {
			break;
		}
		if (amount % effectNo === 0) {
			amount /= effectNo;
			//如果能整除
			switch (effectNo) {
				case PLACE:
					if (fiber.tag > 3) {
						Renderer.insertElement(fiber);
					}
					break;
				case CONTENT:
					Renderer.updateContext(fiber);
					break;
				case ATTR:
					Renderer.updateAttribute(fiber);
					break;
				case NULLREF:
					if (!instance.__isStateless) {
						Refs.fireRef(fiber, null);
					}
					break;
				case DETACH:
					if (fiber.tag > 3) {
						Renderer.removeElement(fiber);
					} else {
						updater.enqueueSetState = returnFalse;
						guardCallback(instance, 'componentWillUnmount', []);
						updater.isMounted = returnFalse;
					}
					delete fiber.stateNode;
					delete fiber.alternate;
					break;
				case HOOK:
					Renderer._hydratingParent = fiber;
					if (updater.isMounted()) {
						guardCallback(instance, 'componentDidUpdate', [
							updater.lastProps,
							updater.lastState,
							updater.snapshot,
						]);
					} else {
						updater.isMounted = returnTrue;
						guardCallback(instance, 'componentDidMount', []);
					}
					Renderer._hydratingParent = null;
					delete fiber._hydrating;
					break;
				case REF:
					if (!instance.__isStateless) {
						Refs.fireRef(fiber, instance);
					}
					break;
				case CALLBACK:
					//ReactDOM.render/forceUpdate/setState callback
					var queue = fiber.pendingCbs || [];
					fiber._hydrating = true; //setState回调里再执行setState
					queue.forEach(function(fn) {
						fn.call(instance);
					});
					fiber._hydrating = false;
					delete fiber.pendingCbs;
					break;
				case CAPTURE: // 23
					fiber._isDoctor = true;
					fiber.effectTag = amount;
					//根据观察，componentDidCatch里面的setState不会中断流程，它还会继续往上一个个执行钩子
					//最后才执行它的render
					instance.componentDidCatch.apply(instance, fiber.errorInfo);
					delete fiber.errorInfo;
					break;
			}
		}
	}
	fiber.effectTag = 1;
}
