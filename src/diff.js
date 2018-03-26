import { topFibers, topNodes } from './share';
import { beginWork, detachFiber } from './workflow/beginWork';
import { completeWork } from './workflow/completeWork';
import { commitWork } from './workflow/commitWork';
import { NOWORK, CALLBACK } from './effectTag';
import { deprecatedWarn, get, shader } from './util';
let updateQueue = shader.mainThread;
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
	let hostRoot = shader.updateRoot(vnode, root);
	let instance = null;
	hostRoot.effectTag = CALLBACK;
	hostRoot._hydrating = true; //lock 表示正在渲染
	hostRoot.callback = function() {
		instance = hostRoot.child ? hostRoot.child.stateNode : null;
		callback && callback.call(instance);
		hostRoot._hydrating = false; //unlock
	};
	updateQueue.push(hostRoot);
	var prev = hostRoot.alternate;
	//如果之前的还没有执行完，那么等待它执行完再处理,
	//比如在某个组件的cb调用了ReactDOM.render就会遇到这种情况
	if (prev && prev._hydrating) {
		return;
	}
	shader.scheduleWork();
	return instance;
}

shader.scheduleWork = function() {
	performWork({
		timeRemaining() {
			return 2;
		}
	});
};

function performWork(deadline) {
	workLoop(deadline);
	if (updateQueue.length > 0) {
		requestIdleCallback(performWork);
	}
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
	if (fiber.effects) {
		fiber.effects.concat(fiber).forEach(commitWork);
	}
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
function mergeState(fiber, state, isForceUpdate, callback) {
	if (isForceUpdate) {
		fiber.isForceUpdate = isForceUpdate;
	}
	fiber.alternate = fiber;
	if (state) {
		fiber.partialState = Object.assign(fiber.partialState || {}, state);
	}
	if (callback) {
		if (fiber.callback) {
			fiber.callback = [].concat(fiber.callback, callback);
		} else {
			fiber.callback = callback;
			fiber.effectTag *= CALLBACK;
		}
	}
}

shader.updateComponent = function(instance, state, callback) {
	//setState
	let fiber = get(instance);
	let isForceUpdate = state === true;
	state = isForceUpdate ? null : state;

	if (this._hydrating || shader.interactQueue) {
		//如果正在render过程中，那么要新建一个fiber,将状态添加到新fiber
		if (fiber.pendingState) {
			mergeState(fiber.pendingState, state, isForceUpdate, callback);
		} else {
			fiber.pendingState = Object.assign({}, fiber, {
				stateNode: instance,
				alternate: fiber,
				mountOrder: this.mountOrder,
				effectTag: callback ? CALLBACK : 1,
				partialState: state,
				isForceUpdate,
				callback
			});
			var queue = Refs.interactQueue || updateQueue;
			queue.push(fiber.pendingState);
		}
	} else {
		//如果是在componentWillXXX中，那么直接修改已经fiber及instance
		mergeState(fiber, state, isForceUpdate, callback);
		if (!fiber.effectTag) {
			fiber.effectTag = 1;
		}

		if (!this._hooking) {
			//不在生命周期钩子中时，需要立即触发（或异步触发）
			updateQueue.push(fiber);
			shader.scheduleWork();
		}
	}
};
