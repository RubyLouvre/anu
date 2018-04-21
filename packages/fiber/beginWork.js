import { extend, noop, typeNumber, isFn } from 'react-core/util';
import { fiberizeChildren } from 'react-core/createElement';
import { AnuPortal } from 'react-core/createPortal';

import { Renderer } from 'react-core/createRenderer';
import { createInstance } from './createInstance';
import { Fiber } from './Fiber';
import { PLACE, ATTR, DETACH, HOOK, CONTENT, REF, NULLREF, CALLBACK } from './effectTag';
import { guardCallback } from './unwindWork';

/**
 * 基于DFS遍历虚拟DOM树，初始化vnode为fiber,并产出组件实例或DOM节点
 * 为instance/fiber添加context与parent, 并压入栈
 * 使用再路过此节点时，再弹出栈
 * 它需要对updateFail的情况进行优化
 *
 * @param {Fiber} fiber
 * @param {Fiber} topWork
 */
export function updateEffects(fiber, topWork, info) {
	if (fiber.tag > 3) {
		updateHostComponent(fiber, info); // unshift context
	} else {
		updateClassComponent(fiber, info); // unshift parent
	}

	if (fiber.batching) {
		delete fiber.updateFail;
		delete fiber.batching;
	}

	if (!fiber.updateFail && !fiber.disposed) {
		if (fiber.child) {
			return fiber.child;
		}
	}

	let f = fiber;
	while (f) {
		if (f.stateNode && f.stateNode.getChildContext) {
			info.contextStack.shift(); // shift context
		}
		if (f.tag === 5 || f.type == AnuPortal) {
			info.containerStack.shift(); // shift parent
		}
		if (f === topWork) {
			break;
		}
		if (f.sibling) {
			return f.sibling;
		}
		f = f.return;
	}
}

function updateHostComponent(fiber, info) {
	const { props, tag, root, alternate: prev } = fiber;
	if (!fiber.stateNode) {
		fiber.parent = fiber.type === AnuPortal ? fiber.props.parent : info.containerStack[0];
		try {
			fiber.stateNode = Renderer.createElement(fiber);
		} catch (e) {
			throw e;
		}
	}
	const children = props && props.children;
	if (tag === 5) {
		// 元素节点
		info.containerStack.unshift(fiber.stateNode);
		if (!root) {
			fiber.effectTag *= ATTR;
		}
		if (prev) {
			fiber._children = prev._children;
		}
		diffChildren(fiber, children);
	} else {
		if (!prev || prev.props.children !== children) {
			fiber.effectTag *= CONTENT;
		}
	}
}

function mergeStates(fiber, nextProps, keep) {
	let instance = fiber.stateNode,
		pendings = fiber.pendingStates || [],
		n = pendings.length,
		state = instance.state;
	if (n === 0) {
		return state;
	}

	let nextState = extend({}, state); // 每次都返回新的state
	let fail = true;
	for (let i = 0; i < n; i++) {
		let pending = pendings[i];
		if (pending) {
			if (isFn(pending)) {
				let a = pending.call(instance, nextState, nextProps);
				if (!a) {
					continue;
				} else {
					pending = a;
				}
			}
			fail = false;
			extend(nextState, pending);
		}
	}
	if (keep) {
		pendings.length = 0;
		if (!fail) {
			pendings.push(nextState);
		}
	} else {
		delete fiber.pendingStates;
	}

	return nextState;
}

export function updateClassComponent(fiber, info) {
	if (fiber.disposed) {
		//console.log("有这种情况吗");
		return;
	}
	let { type, stateNode: instance, isForced, props, stage } = fiber;
	// 为了让它在出错时collectEffects()还可以用，因此必须放在前面
    let {contextStack, containerStack} = info;
	let nextContext = getMaskedContext(type.contextTypes, instance, contextStack),
		context,
		updateFail = false;
	if (instance == null) {
		stage = 'mount';
		instance = fiber.stateNode = createInstance(fiber, nextContext);
		instance.updater.enqueueSetState = Renderer.updateComponent;
		instance.props = props;
		if (type === AnuPortal) {
			fiber.parent = props.parent;
			containerStack.unshift(fiber.parent);
		} else {
			fiber.parent = containerStack[0];
		}
	}
	instance._reactInternalFiber = fiber;
	let updater = instance.updater;
	if (!instance.__isStateless) {
		//必须带生命周期
		if (updater._isMounted()) {
			//如果是更新阶段
			let hasSetState = isForced === true || fiber.pendingStates || fiber._updates;
			if (hasSetState) {
				stage = 'update';
				let u = fiber._updates;
				if (u) {
					fiber.isForced = isForced || u.isForced;
					fiber.batching = u.batching;
					fiber.pendingStates = u.pendingStates;
					let hasCb = (fiber.pendingCbs = u.pendingCbs);
					if (hasCb) {
						fiber.effectTag *= CALLBACK;
					}
					delete fiber._updates;
				}
			} else {
				stage = 'receive';
			}
		}
		let istage = stage;
		while (istage) {
			istage = stageIteration[istage](fiber, props, nextContext, instance, contextStack);
			fiber.willing = false;
		}
		let ps = fiber.pendingStates;
		if (ps && ps.length) {
			instance.state = mergeStates(fiber, props);
		} else {
			updateFail = stage == 'update' && !fiber.isForced;
		}
		delete fiber.isForced;
	}
	instance.props = props; //设置新props
	if (instance.getChildContext) {
		try {
			context = instance.getChildContext();
			context = Object.assign({}, nextContext, context);
		} catch (e) {
			context = {};
		}
		contextStack.unshift(context);
	}
	instance.context = nextContext; //设置新context
	if (fiber.updateFail || updateFail) {
		fiber._hydrating = false;
		return;
	}
	fiber.effectTag *= HOOK;
	fiber._hydrating = true;
	let lastOwn = Renderer.currentOwner;
	Renderer.currentOwner = instance;
	let rendered = guardCallback(instance, 'render', []);
	if (updater._hasError) {
		rendered = [];
	}
	Renderer.currentOwner = lastOwn;

	diffChildren(fiber, rendered);
}
const stageIteration = {
	mount(fiber, nextProps, nextContext, instance) {
		getDerivedStateFromProps(instance, fiber, nextProps, instance.state);
		fiber.willing = true;
		callUnsafeHook(instance, 'componentWillMount', []);
	},
	receive(fiber, nextProps, nextContext, instance, contextStack) {
		let updater = instance.updater;
		updater.lastProps = instance.props;
		updater.lastState = instance.state;
		let propsChange = updater.lastProps !== nextProps;
		let willReceive = propsChange || contextStack.length > 1 || instance.context !== nextContext;
		if (willReceive) {
			fiber.willing = true;
			callUnsafeHook(instance, 'componentWillReceiveProps', [nextProps, nextContext]);
		} else {
			cloneChildren(fiber);
			return;
		}
		if (propsChange) {
			getDerivedStateFromProps(instance, fiber, nextProps, updater.lastState);
		}
		return 'update';
	},
	update(fiber, nextProps, nextContext, instance) {
		let args = [nextProps, mergeStates(fiber, nextProps, true), nextContext];
		delete fiber.updateFail;
		//早期React的设计失误, SCU/CWU/CDU中setState会易死循环
		fiber._hydrating = true;
		if (!fiber.isForced && !guardCallback(instance, 'shouldComponentUpdate', args)) {
			cloneChildren(fiber);
		} else {
			guardCallback(instance, 'getSnapshotBeforeUpdate', args);
			callUnsafeHook(instance, 'componentWillUpdate', args);
		}
	},
};
function callUnsafeHook(a, b, c) {
	guardCallback(a, b, c);
	guardCallback(a, 'UNSAFE_' + b, c);
}
function isSameNode(a, b) {
	if (a.type === b.type && a.key === b.key) {
		return true;
	}
}

export function detachFiber(fiber, effects) {
	fiber.effectTag = DETACH;
	if (fiber.ref) {
		fiber.effectTag *= NULLREF;
	}
	fiber.disposed = true;
	effects.push(fiber);
	for (let child = fiber.child; child; child = child.sibling) {
		detachFiber(child, effects);
	}
}

const gDSFP = 'getDerivedStateFromProps';

function getDerivedStateFromProps(instance, fiber, nextProps, lastState) {
	let partialState = guardCallback(fiber.type, gDSFP, [nextProps, lastState], instance);
	if (typeNumber(partialState) === 8) {
		Renderer.updateComponent(instance, partialState);
	}
}

function cloneChildren(fiber) {
	fiber.updateFail = true;
	const prev = fiber.alternate;
	if (prev && prev.child) {
		let pc = prev._children;
		let cc = (fiber._children = {});
		fiber.child = prev.child;
		for (let i in pc) {
			let a = pc[i];
			a.return = fiber; // 只改父引用不复制
			cc[i] = a;
		}
	}
}

function getMaskedContext(contextTypes, instance, contextStack) {
	if (instance && !contextTypes) {
		return instance.context;
	}
	let context = {};
	if (!contextTypes) {
		return context;
	}
	let parentContext = contextStack[0];
	for (let key in contextTypes) {
		if (contextTypes.hasOwnProperty(key)) {
			context[key] = parentContext[key];
		}
	}
	return context;
}

/**
 * 转换vnode为fiber
 * @param {Fiber} parentFiber
 * @param {Any} children
 */
function diffChildren(parentFiber, children) {
	let oldFibers = parentFiber._children || {}; // 旧的
	let newFibers = fiberizeChildren(children, parentFiber); // 新的
	let effects = parentFiber.effects || (parentFiber.effects = []);
	let matchFibers = {};
	for (let i in oldFibers) {
		let newFiber = newFibers[i];
		let oldFiber = oldFibers[i];
		if (newFiber && newFiber.type === oldFiber.type) {
			matchFibers[i] = oldFiber;
			if (newFiber.key != null) {
				oldFiber.key = newFiber.key;
			}
			continue;
		}
		detachFiber(oldFiber, effects);
	}
	if (parentFiber.tag === 5) {
		var firstChild = parentFiber.stateNode.firstChild;
		if (firstChild) {
			for (let i in oldFibers) {
				var child = oldFibers[i];
				//向下找到其第一个元素节点子孙
				do {
					if (child._return) {
						break;
					}
					if (child.tag > 4) {
						child.stateNode = firstChild;
						break;
					}
				} while ((child = child.child));
				break;
			}
		}
	}

	let prevFiber,
		index = 0,
		newEffects = [];
	for (let i in newFibers) {
		let newFiber = newFibers[i];
		let oldFiber = matchFibers[i];
		let alternate = null;
		if (oldFiber) {
			if (isSameNode(oldFiber, newFiber)) {
				alternate = new Fiber(oldFiber);
				let oldRef = oldFiber.ref;
				newFiber = extend(oldFiber, newFiber); //将新属性转换旧对象上
				newFiber.alternate = alternate;
				if (oldRef && oldRef !== newFiber.ref) {
					alternate.effectTag *= NULLREF;
					effects.push(alternate);
				}
				if (newFiber.tag === 5) {
					newFiber.lastProps = alternate.props;
				}
			} else {
				detachFiber(oldFiber, effects);
			}
			newEffects.push(newFiber);
		} else {
			newFiber = new Fiber(newFiber);
		}
		newFibers[i] = newFiber;
		if (newFiber.tag > 3) {
			newFiber.effectTag *= PLACE;
		}
		if (newFiber.ref) {
			newFiber.effectTag *= REF;
		}
		newFiber.index = index++;
		newFiber.return = parentFiber;

		if (prevFiber) {
			prevFiber.sibling = newFiber;
		} else {
			parentFiber.child = newFiber;
			if (newFiber.tag > 3 && newFiber.alternate) {
				// newFiber.stateNode = newFiber.alternate.parent.firstChild;
			}
		}
		prevFiber = newFiber;
	}
	if (prevFiber) {
		delete prevFiber.sibling;
	}
}

