import { effects, containerStack } from './util';
import { updateEffects } from './beginWork';
import { collectEffects, getContainer } from './completeWork';
import { commitEffects } from './commitWork';
import { CALLBACK } from './effectTag';
import { Renderer } from 'react-core/createRenderer';
import { __push, get, isFn } from 'react-core/util';

const macrotasks = Renderer.macrotasks;
const batchedCbs = [],
	microtasks = [];
export function render(vnode, root, callback) {
	let hostRoot = Renderer.updateRoot(root),
		instance = null;
	// 如果组件的componentDidMount/Update中调用ReactDOM.render
	if (hostRoot._hydrating) {
		hostRoot.pendingCbs.push(function() {
			render(vnode, root, callback);
		});
		return;
	}
	//如果在ReactDOM.batchedUpdates中调用ReactDOM.render
	if (isBatchingUpdates) {
		if (get(root)) {
			batchedCbs.push(function() {
				render(vnode, root, callback);
			});
			return;
		} else {
			root.isOther = true;
		}
	}

	hostRoot.props = {
		children: vnode,
	};
	hostRoot.pendingCbs = [
		function() {
			instance = hostRoot.child ? hostRoot.child.stateNode : null;
			callback && callback.call(instance);
			hostRoot._hydrating = false; // unlock
		},
	];
	hostRoot.effectTag = CALLBACK;
	hostRoot._hydrating = true; // lock 表示正在渲染
	macrotasks.push(hostRoot);
	if (!Renderer.isRendering) {
		Renderer.scheduleWork();
	}
	return instance;
}

function performWork(deadline) {
	workLoop(deadline);
	if (macrotasks.length || microtasks.length) {
		requestIdleCallback(performWork);
	}
}

let ENOUGH_TIME = 1;
function requestIdleCallback(fn) {
	fn({
		timeRemaining() {
			return 2;
		},
	});
}

Renderer.scheduleWork = function() {
	performWork({
		timeRemaining() {
			return 2;
		},
	});
};

var isBatchingUpdates = false;
Renderer.batchedUpdates = function(callback) {
	var keepbook = isBatchingUpdates;
	isBatchingUpdates = true;
	//  console.log("isBatchingUpdates = true");
	Renderer.batch = {};
	try {
		return callback();
	} finally {
		isBatchingUpdates = keepbook;
		if (!isBatchingUpdates) {
			batchedCbs.forEach(fn => fn());
			batchedCbs.length = 0;
			Renderer.scheduleWork();
			Renderer.batch = false;
			//  console.log("isBatchingUpdates = false");
		}
	}
};
function getRoot(fiber) {
	while (fiber.return) {
		fiber = fiber.return;
	}
	return fiber;
}
function workLoop(deadline) {
	let topWork = getNextUnitOfWork();
	if (topWork) {
		let fiber = topWork;
		let c = getContainer(fiber);
		if (c) {
			containerStack.unshift(c);
		}
		while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
			fiber = updateEffects(fiber, topWork);
		}
		if (topWork) {
			__push.apply(effects, collectEffects(topWork, null, true));
			if (topWork.effectTag) {
				effects.push(topWork);
			}
		}
		if (macrotasks.length && deadline.timeRemaining() > ENOUGH_TIME) {
			workLoop(deadline); //收集任务
		} else {
			commitEffects(); //执行任务
		}
	}
}
function mountSorter(u1, u2) {
	return u1.stateNode.updater.mountOrder - u2.stateNode.updater.mountOrder;
}
function getNextUnitOfWork(fiber) {
	if (microtasks.length) {
		microtasks.sort(mountSorter);
		__push.apply(macrotasks, microtasks);
		microtasks.length = 0;
	}
	fiber = macrotasks.shift();
	if (!fiber || fiber.merged) {
		return;
	}
	if (fiber.root) {
		fiber.stateNode = fiber.stateNode || {};
		if (!get(fiber.stateNode)) {
			Renderer.emptyElement(fiber);
		}
		fiber.stateNode._reactInternalFiber = fiber;
	}
	return fiber;
}

/**
 * 这是一个深度优先过程，beginWork之后，对其孩子进行任务收集，然后再对其兄弟进行类似操作，
 * 没有，则找其父节点的孩子
 * @param {Fiber} fiber
 * @param {Fiber} topWork
 */

function mergeUpdates(el, state, isForced, callback) {
	let fiber = el._updates || el;
	if (isForced) {
		fiber.isForced = true; // 如果是true就变不回false
	}
	if (state) {
		let ps = fiber.pendingStates || (fiber.pendingStates = []);
		ps.push(state);
	}
	if (isFn(callback)) {
		let cs = fiber.pendingCbs || (fiber.pendingCbs = []);
		if (!cs.length) {
			if (!fiber.effectTag) {
				fiber.effectTag = CALLBACK;
			} else {
				fiber.effectTag *= CALLBACK;
			}
		}
		cs.push(callback);
	}
}
function fiberContains(parent, son) {
	while (son) {
		if (son === parent) {
			return true;
		}
		son = son.return;
	}
}
function parentIsHydrating(fiber, batched, state) {
	var p = fiber,
		inQueue = false;
	var w = false;
	var queue = batched ? microtasks : macrotasks;

	while (p.return) {
		p = p.return;
		//如果父节点本来就已经hydrating, hydrating的节点肯定已经放在列队中，
		//那么此节点就不用放入列队了，因为更新都是从上到下
		if (p.tag < 3 && p._hydrating && !p.root) {
			inQueue = true;
			w = true;
			break;
		}
	}
	for (var i = queue.length, el; (el = queue[--i]); ) {
		if (fiberContains(fiber, el)) {
			queue.splice(i, 1);
		}
		if (fiber === el) {
			console.log('=====');
			inQueue = false;
		}
	}
    console.log(fiber.name, inQueue, w);
    if(batched){
       fiber._updates = fiber._updates || {};
    }
	if (!inQueue) {
	
		if (batched) {
			//如果是批量更新，必须打开强制更新，防止进入SCU
			fiber._updates.isForced = true;
			fiber._hydrating = true;
		}

		queue.push(fiber);
	}
}
Renderer.updateComponent = function(instance, state, callback) {
	let fiber = get(instance);
	if (fiber.parent) {
		fiber.parent.insertPoint = fiber.insertPoint;
	}
	let root = getRoot(fiber),
		rootNode = root.stateNode;
	if (rootNode && rootNode.isOther) {
		delete rootNode.isOther;
		batchedCbs.push(Renderer.updateComponent.bind(null, instance, state, callback));
		return;
	}
	let isForced = state === true,
		immediate = false;
	state = isForced ? null : state;

	if (fiber.willing) {
		//componentWillMount/ReceiveProps(...)
		mergeUpdates(fiber, state, isForced, callback);
	} else {
		//batchedUpdate(...)
		if (isBatchingUpdates) {
			parentIsHydrating(fiber, true, state);
		} else {
			immediate = !fiber._hydrating;
			parentIsHydrating(fiber, !immediate, state);
		}
		mergeUpdates(fiber, state, isForced, callback);
		if (immediate) {
			Renderer.scheduleWork();
		}
	}
};
