import { emptyElement, createElement } from './browser';
import { getProps, fiberizeChildren } from './createElement';
import { returnFalse, returnTrue, emptyObject, isFn } from './util';
import { captureError as callLifeCycleHook, pushError } from './ErrorBoundary';
import { Refs } from './Refs';

export function render(vnode, container, callback) {
	return renderByAnu(vnode, container, callback);
}
//[Top API] React.isValidElement
export function isValidElement(vnode) {
	return vnode && vnode.tag > 0 && vnode.tag !== 6;
}
//[Top API] ReactDOM.findDOMNode
export function findDOMNode(instanceOrElement) {
	if (instanceOrElement == null) {
		//如果是null
		return null;
	}
	if (instanceOrElement.nodeType) {
		//如果本身是元素节点
		return instanceOrElement;
	}
	//实例必然拥有updater与render
	if (instanceOrElement.render) {
		let fiber = instanceOrElement.updater;
		let c = fiber.child;
		if (c) {
			return findDOMNode(c.stateNode);
		} else {
			return null;
		}
	}
}
let contextStack = [ emptyObject ],
	updateQueue = [],
	ENOUGH_TIME = 1;

function renderByAnu(vnode, root, callback) {
	if (!(root && root.appendChild)) {
		throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
	}
	let instance;
	let hostRoot = {
		stateNode: root,
		from: 'root',
		tag: 5,
		type: root.tagName.toLowerCase(),
		props: Object.assign(getProps(root), {
			children: vnode
		}),
		alternate: root.__component,
		callback() {
			instance = hostRoot.child ? hostRoot.child.stateNode : null;
			callback && callback.call(instance);
		}
	};
	updateQueue.push(hostRoot);
	workLoop({
		timeRemaining() {
			return 2;
		}
	});
	return instance;
}
function getNextUnitOfWork() {
	var fiber = updateQueue.shift();
	if (!fiber) {
		return;
	}
	if (fiber.from == 'root') {
		if (!fiber.stateNode.__component) {
			emptyElement(fiber.stateNode);
		}
		fiber.stateNode.__component = fiber;
	}
	return fiber;
}
function workLoop(deadline) {
	var topWork = getNextUnitOfWork();
	var fiber = topWork;
	while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
		fiber = performUnitOfWork(fiber, topWork);
	}
	if (topWork) {
		commitAllWork(topWork);
	}
}

function commitAllWork(fiber) {
	fiber.effects.concat(fiber).forEach((f) => {
		commitWork(f);
	});
	if (fiber.callback) {
		//ReactDOM.render/forceUpdate/setState callback
		fiber.callback.call(fiber.stateNode);
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
	// No child, we call completeWork until we find a sibling
	let f = fiber;
	while (f) {
		completeWork(f, topWork);
		if (f === topWork) {
			break;
		}
		if (f.sibling) {//往右走
			return f.sibling;
		} 
		f = f.return;
	}
}

//用于实例化组件
function beginWork(fiber) {
	if (!fiber.effectTag) {
		fiber.effectTag = WORKING;
	}
	if (fiber.ref) {
		fiber.effectTag *= REF;
	}
	if (fiber.tag > 4) {
		updateHostComponent(fiber);
	} else {
		updateClassComponent(fiber);
	}
}

function completeWork(fiber, topWork) {
	//收集effects
	if (fiber.tag == 2) {
		fiber.stateNode._reactInternalFiber = fiber;
		if (fiber.stateNode.getChildContext) {
			contextStack.pop(); // pop context
		}
	}

	if (fiber.return && fiber.effectTag !== NOWORK && fiber !== topWork) {
		const childEffects = fiber.effects || [];
		const thisEffect = fiber.effectTag != null ? [ fiber ] : [];
		const parentEffects = fiber.return.effects || [];
		fiber.return.effects = parentEffects.concat(childEffects, thisEffect);
	}
}

const NOWORK = 0;
const WORKING = 1;
const MOUNT = 2;
const UPDATE = 3;
const DELETE = 5;
const CONTENT = 7
const CALLBACK = 11;
const REF = 13;
const NULLREF = 17;
var effectNames = [ MOUNT, UPDATE, DELETE, CONTENT, CALLBACK, REF, NULLREF ];
function commitWork(fiber) {
	let parentFiber = fiber.return;
	if (!parentFiber) {
		return;
	}

	while (parentFiber.tag == 2) {
		parentFiber = parentFiber.return;
	}
	let parentNode = parentFiber.stateNode;
	let instance = fiber.stateNode;
	let amount = fiber.effectTag;
	for (let i = 0; i < 7; i++) {
		let effectNo = effectNames[i];
		if (effectNo > amount) {
			break;
		}
		let remainder = amount / effectNo;
		if (remainder == ~~remainder) {
			amount = remainder;
			switch (effectNo) {
				case MOUNT:
					if (fiber.tag > 3) {
						parentNode.appendChild(fiber.stateNode);
					}
					break;
				case UPDATE:
					break;
				case DELETE:
					commitDeletion(fiber, parentNode);
					break;
				case CALLBACK:
					if (instance.isMounted()) {
						callLifeCycleHook(instance, 'componentDidUpdate', []);
					} else {
						callLifeCycleHook(instance, 'componentDidMount', []);
						instance.updater._isMounted = returnTrue;
					}
					break;
				case CONTENT:
                    fiber.stateNode.nodeValue = fiber.props.children;
                    break
				case REF:
					Refs.fireRef(fiber, instance);
					break;
				case NULLREF:
					Refs.fireRef(fiber, null);
					break;
			}
		}
	}
	fiber.effectTag = amount;
}

function updateHostComponent(fiber) {
	if (!fiber.stateNode) {
		try {
			fiber.stateNode = createElement(fiber);
		} catch (e) {
			throw e;
		}
	}
	const children = fiber.props && fiber.props.children;
	if (fiber.tag === 6) {
		const prev = fiber.alternate;
		if (!prev || prev.props.children !== children) {
			fiber.effectTag *= CONTENT;
		}
	} else if (fiber.props) {
		diffChildren(fiber, children);
	}
}
function get(key) {
	return key._reactInternalFiber;
}
function enqueueSetState(instance, state, callback) {
	var fiber = get(instance);
	var isForceUpdate = state === true;
	updateQueue.unshift(
		Object.assign({}, fiber, {
			stateNode: instance,
			alternate: fiber,
			effectTag: null,
			partialState: isForceUpdate ? null : state,
			isForceUpdate,
			callback
		})
	);

	if (this._isMounted === returnTrue) {
		if (this._receiving) {
			//componentWillReceiveProps中的setState/forceUpdate应该被忽略
			return;
		}
		// this.addState("hydrate");
		requestIdleCallback(performWork);
	}
}
function performWork(deadline) {
	workLoop(deadline);
	if (updateQueue.length > 0) {
		requestIdleCallback(performWork);
	}
}

function getMaskedContext(contextTypes) {
	let context = {};
	if (!contextTypes) {
		return emptyObject;
	}
	let parentContext = contextStack[0],
		hasKey;
	for (let key in contextTypes) {
		if (contextTypes.hasOwnProperty(key)) {
			hasKey = true;
			context[key] = parentContext[key];
		}
	}
	return hasKey ? context : emptyObject;
}
function createInstance(type, props, context) {
	let instance = new type(props, context);
	instance.updater = {
		name: type.displayName || type.name,
		enqueueSetState: enqueueSetState,
		_isMounted: returnFalse
	};
	return instance;
}

function updateClassComponent(fiber) {
	let { type, props: nextProps, stateNode: instance } = fiber;
	let nextContext = getMaskedContext(type.contextTypes);
	if (instance == null) {
		instance = fiber.stateNode = createInstance(type, nextProps, nextContext);
	}
	let { props: lastProps, state: lastState } = instance;
	fiber.lastState = lastProps;
	fiber.lastProps = lastState;
	var oldFiber = instance._reactInternalFiber;
	instance._reactInternalFiber = fiber;
	fiber.partialState = null;
	if (instance.getChildContext) {
		try {
			var c = instance.getChildContext();
			c = Object.assign({}, nextContext, c);
		} catch (e) {
			c = {};
		}
		contextStack.unshift(c);
	}
	let shouldUpdate = true;
	if (instance.isMounted()) {
		let willReceive = oldFiber !== fiber && instance.context !== nextContext;
		let updater = instance.updater;
		updater._receiving;
		if (willReceive) {
			callLifeCycleHook(instance, 'componentWillReceiveProps', [ nextProps, nextContext ]);
		}
		if (oldFiber.props !== nextProps) {
			try {
				getDerivedStateFromProps(instance, type, nextProps, lastState);
			} catch (error) {
				pushError(instance, 'getDerivedStateFromProps', error);
			}
		}
		delete updater._receiving;

		let args = [ nextProps, instance.state, nextContext ];
		if (!fiber.isForceUpdate && !callLifeCycleHook(instance, 'shouldComponentUpdate', args)) {
			shouldUpdate = false;
		} else {
			callLifeCycleHook(instance, 'componentWillUpdate', args);
		}
	} else {
		try {
			getDerivedStateFromProps(instance, type, nextProps, lastState);
		} catch (error) {
			pushError(instance, 'getDerivedStateFromProps', error);
		}
		callLifeCycleHook(instance, 'componentWillMount', []);
	}
	fiber.effectTag *= CALLBACK;
	instance.context = nextContext;
	instance.props = nextProps;
	instance.state = Object.assign({}, lastState, fiber.partialState);
	if (!shouldUpdate) {
		fiber.effectTag = NOWORK;
		return;
	}
	const children = instance.render();
	diffChildren(fiber, children);
}
function isSameNode(a, b) {
	if (a.type === b.type && a.key === b.key) {
		return true;
	}
}

function diffChildren(parentFiber, children) {
	let oldFibers = parentFiber.alternate ? parentFiber.alternate._children : {}; //旧的
	let newFibers = fiberizeChildren(children, parentFiber); //新的
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
			if (oldFiber.ref !== newFiber.ref) {
				oldFiber.effectTag *= NULLREF;
				effects.push(oldFiber);
			}
			continue;
		}
		oldFiber.effectTag *= DELETE;
		effects.push(oldFiber);
	}

	let prevFiber,
		index = 0;
	for (let i in newFibers) {
		let newFiber = newFibers[i];
		newFiber.effectTag = WORKING;
		let oldFiber = matchFibers[i];
		if (oldFiber) {
			if (isSameNode(oldFiber, newFiber)) {
				newFiber.effectTag *= UPDATE;
				newFiber.stateNode = oldFiber.stateNode;
				newFiber.alternate = oldFiber;
			} else {
				oldFiber.effectTag *= DELETE;
				effects.push(oldFiber);
				newFiber.effectTag *= MOUNT;
			}
		} else {
			newFiber.effectTag *= MOUNT;
			//  console.log("xxxx",newFiber.effectTag,MOUNT)
		}
		newFiber.index = index++;
		newFiber.return = parentFiber;
		if (prevFiber) {
			prevFiber.sibling = newFiber;
		} else {
			parentFiber.child = newFiber;
		}
		prevFiber = newFiber;
	}
	if (prevFiber) {
		delete prevFiber.sibling;
	}
}
export function getDerivedStateFromProps(instance, type, props, state) {
	if (isFn(type.getDerivedStateFromProps)) {
		state = type.getDerivedStateFromProps.call(null, props, state);
		if (state != null) {
			instance.setState(state);
		}
	}
}
function commitDeletion() {}

function cloneChildFibers(parentFiber) {
	const oldFiber = parentFiber.alternate;
	if (!oldFiber.child) {
		return;
	}
	//oldFiber._children

	let oldChild = oldFiber.child;
	let prevChild = null;
	while (oldChild) {
		const newChild = {
			type: oldChild.type,
			tag: oldChild.tag,
			stateNode: oldChild.stateNode,
			props: oldChild.props,
			partialState: oldChild.partialState,
			alternate: oldChild,
			return: parentFiber
		};
		if (prevChild) {
			prevChild.sibling = newChild;
		} else {
			parentFiber.child = newChild;
		}
		prevChild = newChild;
		oldChild = oldChild.sibling;
	}
}
