import { effects, containerStack, batchedqueue } from './util';
import { updateEffects } from './beginWork';
import { collectEffects, getContainer } from './completeWork';
import { commitEffects } from './commitWork';
import { CALLBACK } from './effectTag';
import { Renderer } from 'react-core/createRenderer';
import { __push, get, isFn, inherit } from 'react-core/util';
import { Component } from 'react-core/Component';
import { createElement } from 'react-core/createElement';

//import { createElement } from "../render/dom/DOMRenderer";

const macrotasks = Renderer.macrotasks;
const batchedCbs = [],
	microtasks = [];
window.microtasks = microtasks;
window.batchedqueue = batchedqueue;
/*
export function render(vnode, root, callback) {
let hostRoot = Renderer.updateRoot(root),
    instance = null;
// 如果组件的componentDidMount/Update中调用ReactDOM.render
if (hostRoot._hydrating) {
    hostRoot.pendingCbs.push(function () {
        render(vnode, root, callback);
    });
    return;
}
//如果在ReactDOM.batchedUpdates中调用ReactDOM.render
if (isBatchingUpdates) {
    if (get(root)) {
        batchedCbs.push(function () {
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
    function () {
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
*/
export function Wrapper(props, context) {
	Component.call(this, props, context);
	this.state = {
		child: props.child,
	};
}

let fn = inherit(Wrapper, Component);
fn.render = function() {
	return this.state.child;
};
const publicRoot = {};

export function render(vnode, root, callback) {
	let hostRoot = Renderer.updateRoot(root);
	if (!hostRoot.wrapperInstance) {
		var w = createElement(Wrapper);
		w.effectTag = 1;
        hostRoot.child = w;
        w.name = "Wrapper"
		w.return = hostRoot;
		macrotasks.push(w);
		Renderer.scheduleWork();
        hostRoot.wrapperInstance = w.stateNode;
	}
    let rootInstance = hostRoot.wrapperInstance;
	Renderer.updateComponent(
		rootInstance,
		{
			child: vnode,
		},
		wrapCb(callback)
	);
	return publicRoot.instance;
}

function wrapCb(fn) {
	return function() {
		var fiber = get(this);
		var target = fiber.child ? fiber.child.stateNode : null;
		fn && fn.call(target);
		publicRoot.instance = target;
	};
}

function performWork(deadline, el) {
	workLoop(deadline);
	if (macrotasks.length || microtasks.length) {
		while ((el = microtasks.shift())) {
			if (!el.disabled) {
				macrotasks.push(el);
			}
		}
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
	try {
		return callback();
	} finally {
		isBatchingUpdates = keepbook;
		if (!isBatchingUpdates) {
			//  batchedCbs.forEach(fn => fn());
			//  batchedCbs.length = 0;
			var el;
			while ((el = batchedqueue.shift())) {
				if (!el.disabled) {
					macrotasks.push(el);
				}
			}
			Renderer.scheduleWork();
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
function pushChildQueue(fiber, queue, a) {
	var p = fiber,
		inQueue = false;
	while (p.return) {
		p = p.return;
		//判定它的父节点是否已经在列队中
		if (p.tag < 3 && (p._updates || p._hydrating)) {
			inQueue = true; //在列队中就不会立即触发
			break;
		}
	}
	//判定当前节点是否包含已进队的节点
	for (var i = queue.length, el; (el = queue[--i]); ) {
		if (fiberContains(fiber, el)) {
			queue.splice(i, 1);
		}

		if (fiber === el) {
			//可能不少心将自己移掉，再放回去
			inQueue = false;
		}
	}
	fiber._updates = fiber._updates || {};
	if (!inQueue) {
		//如果是批量更新，必须强制更新，防止进入SCU
		fiber._updates.batching = true;
		queue.push(fiber);
	}
}

function contains(p, son) {
	while (son.return) {
		if (son.return === p) {
			return true;
		}
		son = son.return;
	}
}
//setState的实现
Renderer.updateComponent = function(instance, state, callback) {
	let fiber = get(instance);
	if (fiber.parent) {
		fiber.parent.insertPoint = fiber.insertPoint;
	}
	let parent = Renderer._hydratingParent;
	let isForced = state === true,
		immediate = false;
	state = isForced ? null : state;

	if (fiber.willing) {
        //情况1，在componentWillMount/ReceiveProps中setState， 不放进列队
        console.log("setState 1")
		immediate = false;
	} else if (parent && contains(parent, fiber)) {
        //情况2，在componentDidMount/Update中，子组件setState， 放进microtasks
        console.log("setState 2")
		microtasks.push(fiber);
	} else if (isBatchingUpdates) {
        console.log("setState 3")
		//情况3， 在batchedUpdates中setState，可能放进batchedqueue
		pushChildQueue(fiber, batchedqueue);
	} else {
		//情况4，在componentDidMount/Update中setState，可能放进microtasks
		//情况5，在钩子外setState, 需要立即触发
        immediate = !fiber._hydrating;
        console.log(fiber.name+" setState "+(immediate?4: 5))
		pushChildQueue(fiber, microtasks);
    }
	mergeUpdates(fiber, state, isForced, callback);
	if (immediate) {
		Renderer.scheduleWork();
	}
};
