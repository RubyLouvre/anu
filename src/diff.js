
import { topFibers, topNodes, updateQueue } from './share';
import { beginWork, detachFiber } from './workflow/beginWork';
import { completeWork } from './workflow/completeWork';
import { commitWork } from './workflow/commitWork';
import { NOWORK } from './effectTag';
import { returnTrue, deprecatedWarn, get, shader } from './util';

//[Top API] React.isValidElement
export function isValidElement(vnode) {
	return vnode && vnode.tag > 0 && vnode.tag !== 6;
}
//[Top API] ReactDOM.findDOMNode
export function findDOMNode(stateNode) {
	if (stateNode == null) {
		//如果是null
		return null;
	}
	if (stateNode.nodeType) {
		//如果本身是元素节点
		return stateNode;
	}
	//实例必然拥有updater与render
	if (stateNode.render) {
		let fiber = get(stateNode);
		let c = fiber.child;
		if (c) {
			return findDOMNode(c.stateNode);
		} else {
			return null;
		}
	}
}
export function render(vnode, root, callback) {
	let hostRoot = shader.updateRoot(vnode, root, callback);
	updateQueue.push(hostRoot);
	workLoop({
		timeRemaining() {
			return 2;
		}
	});
	return hostRoot.child ? hostRoot.child.stateNode : null;
}

//[Top API] ReactDOM.unstable_renderSubtreeIntoContainer
export function unstable_renderSubtreeIntoContainer(instance, vnode, container, callback) {
	deprecatedWarn('unstable_renderSubtreeIntoContainer');
	return shader.render(vnode, container, callback);
}
//[Top API] ReactDOM.unmountComponentAtNode
export function unmountComponentAtNode(container) {
	let rootIndex = topNodes.indexOf(container);
	if (rootIndex > -1) {
		let lastFiber = topFibers[rootIndex],
			effects = [];
		detachFiber(lastFiber, effects);
		lastFiber.effects = effects;
		commitWork(lastFiber);
		container._reactInternalFiber = null;
		return true;
	}
	return false;
}

let ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
	fn({
		timeRemaining() {
			return 2;
		}
	});
}

function getNextUnitOfWork() {
	let fiber = updateQueue.shift();
	if (!fiber) {
		return;
	}
	if (fiber.root) {
		fiber.stateNode = fiber.stateNode || {};
		if (!get(fiber.stateNode)) {
			shader.emptyElement(fiber);
		}
		fiber.stateNode._reactInternalFiber = fiber;
	}
	return fiber;
}

function workLoop(deadline) {
	let topWork = getNextUnitOfWork();
	let fiber = topWork;
	while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
		fiber = performUnitOfWork(fiber, topWork);
	}
	if (topWork) {
		commitAllWork(topWork);
	}
}

function commitAllWork(fiber) {
	fiber.effects.concat(fiber).forEach(commitWork);
}
/**
 * 这是一个深度优先过程，beginWork之后，对其孩子进行任务收集，然后再对其兄弟进行类似操作，
 * 没有，则找其父节点的孩子
 * @param {Fiber} fiber 
 * @param {Fiber} topWork 
 */
function performUnitOfWork(fiber, topWork) {
	beginWork(fiber);
	if (fiber.child && fiber.effectTag !== NOWORK) {
		return fiber.child;
	}
	let f = fiber;
	while (f) {
		completeWork(f, topWork);
		if (f === topWork) {
			break;
		}
		if (f.sibling) {
			//往右走
			return f.sibling;
		}

		f = f.return;
	}
}

shader.updaterComponent = function(instance, state, callback) {
	let fiber = get(instance);
	let isForceUpdate = state === true;
	state = isForceUpdate ? null : state;
	let prevEffect;
	updateQueue.some(function(el) {
		if (el.stateNode === instance) {
			prevEffect = el;
		}
	});
	if (prevEffect) {
		if (isForceUpdate) {
			prevEffect.isForceUpdate = isForceUpdate;
		}
		if (state) {
			prevEffect.partialState = Object.assign(prevEffect.partialState || {}, state);
		}
		if (callback) {
			prevEffect.effectTag = CALLBACK;
			let prev = prevEffect.callback;
			if (prev) {
				prevEffect.callback = function() {
					prev.call(this);
					callback.call(this);
				};
			} else {
				prevEffect.callback = callback;
			}
		}
	} else {
		updateQueue.unshift(
			Object.assign({}, fiber, {
				stateNode: instance,
				alternate: fiber,
				effectTag: callback ? CALLBACK : null,
				partialState: state,
				isForceUpdate,
				callback
			})
		);
	}
	if (this._isMounted === returnTrue) {
		if (this._receiving) {
			//componentWillReceiveProps中的setState/forceUpdate应该被忽略
			return;
		}
		requestIdleCallback(performWork);
	}
};

function performWork(deadline) {
	workLoop(deadline);
	if (updateQueue.length > 0) {
		requestIdleCallback(performWork);
	}
}
