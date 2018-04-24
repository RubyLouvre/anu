import { noop, get } from 'react-core/util';
import { Renderer } from 'react-core/createRenderer';

import { NOWORK, CAPTURE, DETACH, NULLREF } from './effectTag';

export function pushError(fiber, hook, error) {
	let names = [];
	let effects = [];
	let boundary = findCatchComponent(fiber, names, effects);
	let stack = describeError(names, hook);
	Renderer.hasError = true;
	if (boundary) {
		fiber.effectTag = NOWORK;
        detachFiber(fiber, effects, true)
		boundary._children = boundary.child = null;
		boundary.effectTag *= CAPTURE;
		boundary.effects = effects;
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
function findCatchComponent(topFiber, names, effects) {
	let instance,
		name,
		fiber = topFiber;
	//当组件出错时，会收集所有已经mouted的组件，它们只执行detach操作，不执行nullref
	for (var el = topFiber.return.child; el; el = el.sibling) {
		detachFiber(el, effects);
		if (el == topFiber) {
			break;
		}
	}
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
					detachFiber(fiber, effects, true);
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

export function detachFiber(fiber, effects, only) {
	fiber.effectTag = DETACH;
	if (fiber.ref && fiber.stateNode && fiber.stateNode.parentNode) {
		fiber.effectTag *= NULLREF;
	}
	fiber.disposed = true;
	effects.push(fiber);
	if (!only) {
		for (let child = fiber.child; child; child = child.sibling) {
			detachFiber(child, effects, only);
		}
	}
}

