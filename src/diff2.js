import { emptyElement, createElement } from './browser';
import { createVnode, createVText, getProps } from './createElement';
import { typeNumber, returnFalse } from './util';
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
var contextStack = [ {} ],
	updateQueue = [],
	pendingCommit,
	nextUnitOfWork;
var ENOUGH_TIME = 1;

function renderByAnu(vnode, root, callback) {
	if (!(root && root.appendChild)) {
		throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
	}
	updateQueue.push({
		stateNode: root,
		from: 'root',
		tag: 5,
		type: root.tagName.toLowerCase(),
		props: Object.assign(getProps(root), {
			children: vnode
		}),
		alternate: root.__component,
		callback
	});
	workLoop({
		timeRemaining() {
			return 2;
		}
	});
	var hostRoot = root.__component;
	return hostRoot.child ? hostRoot.child.instance : null;
}

function getNextUnitOfWork() {
	var fiber = updateQueue.shift();
	if (!fiber) {
		return;
	}
	nextUnitOfWork = fiber;
	if (fiber.from == 'root') {
		fiber.stateNode.__component = nextUnitOfWork;
	}
}
function workLoop(deadline) {
	if (!nextUnitOfWork) {
		getNextUnitOfWork();
	}
	console.log(deadline);
	while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}
	if (pendingCommit) {
		commitAllWork(pendingCommit);
	}
}

function commitAllWork(fiber) {
	fiber.effects.forEach((f) => {
		commitWork(f);
		f.effectTag = f.effects = null;
	});
	nextUnitOfWork = null;
    pendingCommit = null;
    console.log(fiber, "xxxxx444")
	if (fiber.callback) {
		console.log('执行');
		fiber.callback.call(fiber.child ? fiber.child.stateNode : null);
		delete fiber.callback;
	}
}

function commitWork(fiber) {
	let domParentFiber = fiber.return;

	while (domParentFiber.tag == 2) {
		domParentFiber = domParentFiber.return;
	}
	const domParent = domParentFiber.stateNode;

	if (fiber.effectTag == PLACEMENT && fiber.tag >= 5) {
		domParent.appendChild(fiber.stateNode);
	} else if (fiber.effectTag == UPDATE) {
		console.log(fiber, '更新');
		//  updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
	} else if (fiber.effectTag == DELETION) {
		commitDeletion(fiber, domParent);
	}
}

function performUnitOfWork(fiber) {
	beginWork(fiber);
	if (fiber.child) {
		return fiber.child;
	}

	// No child, we call completeWork until we find a sibling
	let f = fiber;
	while (f) {
        completeWork(f);
        if(f.stateNode && f.from === "class"){
            break
        }
		if (f.sibling) {
			// Sibling needs to beginWork
			return f.sibling;
		}
		f = f.return;
	}
}

function completeWork(fiber) {
	//收集effects
	if (fiber.tag == 2) {
		fiber.stateNode._reactInternalFiber = fiber;
		if (fiber.stateNode.getChildContext) {
			contextStack.pop();
			console.log(contextStack.length);
		}
	}

	if (fiber.return) {
		const childEffects = fiber.effects || [];
		const thisEffect = fiber.effectTag != null ? [ fiber ] : [];
		const parentEffects = fiber.return.effects || [];
		fiber.return.effects = parentEffects.concat(childEffects, thisEffect);
	} else {
		pendingCommit = fiber;
	}
}
//用于实例化组件
function beginWork(fiber) {
	if (fiber.tag > 4) {
		updateHostComponent(fiber);
	} else {
		updateClassComponent(fiber);
	}
}

function updateHostComponent(fiber) {
	if (!fiber.stateNode) {
		try {
			fiber.stateNode = createElement(fiber);
		} catch (e) {
			console.log(fiber);
			throw e;
		}
	}
	const children = fiber.props && fiber.props.children;
	if (fiber.tag === 6) {
		const prev = fiber.alternate;
		if (!prev || prev.props.children !== children) {
			fiber.stateNode.nodeValue = children;
		}
	} else if (fiber.props) {
		reconcileChildrenArray(fiber, children);
	}
}
function get(key) {
	return key._reactInternalFiber;
}
function enqueueSetState(instance, state, callback) {
	var fiber = get(instance);
    var isForce = state === true;
    console.log(arguments)
	updateQueue.unshift(
		Object.assign({}, fiber, {
            alternate: fiber,
            from: "class",
			partialState: isForce ? null : state,
			isForce,
			callback
		})
	);
	requestIdleCallback(performWork);
}
function performWork(deadline) {
	workLoop(deadline);
	if (nextUnitOfWork || updateQueue.length > 0) {
		requestIdleCallback(performWork);
	}
}

 function getMaskedContext(contextTypes) {
    let context = {}
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
function createInstance(type, props, context) {
	let instance = new type(props, context);	
	instance.updater = {
		enqueueSetState: enqueueSetState,
		_isMounted: returnFalse
	};
	return instance;
}

function updateClassComponent(fiber) {
    let {type, props, stateNode: instance} = fiber
    let context = getMaskedContext(type.contextTypes)
	if (instance == null) {
		instance = fiber.stateNode = createInstance(type, props, context);
	} else if (fiber.props == instance.props && !fiber.partialState) {
		// No need to render, clone children from last time
		cloneChildFibers(fiber);
		return;
	}
    instance.context = context;
    console.log(context,'xxx')
	instance.props = fiber.props;
    instance.state = Object.assign({}, instance.state, fiber.partialState);
    instance._reactInternalFiber = fiber;
    fiber.partialState = null;
    if (instance.getChildContext) {
		try {
			var c = instance.getChildContext();
			c = Object.assign({}, context, c);
		} catch (e) {
			c = {};
		}
        contextStack.unshift(c);
	}
	const children = instance.render();
	reconcileChildrenArray(fiber, children);
}

var PLACEMENT = 1,
	UPDATE = 2,
	DELETION = 3;
function reconcileChildrenArray(fiber, newChildElements) {
	var number = typeNumber(newChildElements);
	var elements = [];
	switch (number) {
		case 0:
		case 1:
		case 2:
		case 5:
			break;
		case 3:
		case 4:
			elements.push(new createVText('#text', newChildElements));
			break;
		case 8:
			elements.push(newChildElements);
			break;
		case 7:
			elements = newChildElements;
			break;
	}

	let index = 0;
	let oldFiber = fiber.alternate ? fiber.alternate.child : null;
	let newFiber = null;
	while (index < elements.length || oldFiber != null) {
		const prevFiber = newFiber;
		const element = index < elements.length && elements[index];
		const sameType = oldFiber && element && element.type == oldFiber.type;

		if (sameType) {
			newFiber = {
				type: oldFiber.type,
				tag: oldFiber.tag,
				stateNode: oldFiber.stateNode,
				props: element.props,
				return: fiber,
				alternate: oldFiber,
				partialState: oldFiber.partialState,
				effectTag: UPDATE
			};
		}

		if (element && !sameType) {
			newFiber = {
				type: element.type,
				tag: element.tag,
				// typeof element.type === "string" ? 5 : 1,
				props: element.props,
				return: fiber,
				effectTag: PLACEMENT
			};
		}

		if (oldFiber && !sameType) {
			oldFiber.effectTag = DELETION;
			fiber.effects = fiber.effects || [];
			fiber.effects.push(oldFiber);
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		if (index == 0) {
			fiber.child = newFiber;
		} else if (prevFiber && element) {
			prevFiber.sibling = newFiber;
		}

		index++;
	}
}

function commitDeletion() {}

function cloneChildFibers(parentFiber) {
	const oldFiber = parentFiber.alternate;
	if (!oldFiber.child) {
		return;
	}

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
