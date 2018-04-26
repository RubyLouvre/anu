import { noop, get } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';
import { fakeObject } from 'react-core/Component';

import { NOWORK, CAPTURE, DETACH, NULLREF } from './effectTag';

export function pushError(fiber, hook, error) {
	let names = [];
	let carrier = {};
	let boundary = findCatchComponent(fiber, names, carrier);
	let stack = describeError(names, hook);
	Renderer.hasError = true;
	if (boundary) {
		var old = carrier.fiber;
		while (old && old.return) {
			if (old == boundary) {
				Renderer.catchTry = carrier.fiber;
				break;
			}
			old = old.return;
		}

		fiber.effectTag = NOWORK;
		var inst = fiber.stateNode;
		if (inst && inst.updater && inst.updater.isMounted()) {
			//已经插入
		} else {
			fiber.stateNode = {
				updater: fakeObject,
			};
		}
		fiber._children = {};
		delete fiber.child;
		boundary.effectTag *= CAPTURE;
		boundary.errorInfo = [error, { ownerStack: stack }];
		Renderer.catchBoundary = boundary;
	} else {
		var p = fiber.return;
		for (var i in p._children) {
			if (p._children[i] == fiber) {
				fiber.type = noop;
			}
		}
		while (p) {
			p._hydrating = false;
			p = p.return;
		}
		if (!Renderer.catchError) {
			Renderer.catchError = error;
		}
	}
}

export function guardCallback(host, hook, args) {
	try {
		return applyCallback(host, hook, args);
	} catch (error) {
		pushError(get(host), hook, error);
	}
}
export function applyCallback(host, hook, args) {
	var fiber = host._reactInternalFiber;
	fiber.errorHook = hook;
	let fn = host[hook];
	if (hook == 'componentWillUnmount') {
		host[hook] = noop;
	}
	if (fn) {
		return fn.apply(host, args);
	}
	return true;
}
function describeError(names, hook) {
	let segments = [`**${hook}** method occur error `];
	names.forEach(function(name, i) {
		if (names[i + 1]) {
			segments.push('in ' + name + ' (created By ' + names[i + 1] + ')');
		}
	});
	return segments.join('\n').trim();
}

/**
 * 收集沿途的标签名与组件名
 */
function findCatchComponent(topFiber, names, carrier) {
	let instance,
		name,
		fiber = topFiber;
	if (!topFiber) {
		return;
	}
	while (fiber.return) {
		name = fiber.name;
		if (fiber.tag < 4) {
			names.push(name);
			instance = fiber.stateNode || {};
			if (instance.componentDidCatch) {
				if (fiber.hasTry) {
					carrier.fiber = fiber;
				} else if (fiber !== topFiber) {
					return fiber;
				}
			}
		} else if (fiber.tag === 5) {
			names.push(name);
		}
		fiber = fiber.return;
	}
}

export function detachFiber(fiber, effects) {
	fiber.effectTag = DETACH;
	fiber.disposed = true;
	effects.push(fiber);
	if (fiber.ref && fiber.stateNode && fiber.stateNode.parentNode) {
		fiber.effectTag *= NULLREF;
	}
	for (let child = fiber.child; child; child = child.sibling) {
		detachFiber(child, effects);
	}
}
