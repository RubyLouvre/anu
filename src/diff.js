
import { fiberizeChildren } from "./createElement";
import { captureError as callLifeCycleHook, pushError } from "./ErrorBoundary";
import { ComponentFiber, createInstance, getMaskedContext, getDerivedStateFromProps } from "./ComponentFiber";
import { returnFalse, returnTrue, deprecatedWarn, get, shader } from "./util";
import { Refs } from "./Refs";
import { topFibers, topNodes, updateQueue, componentStack, contextStack } from "./share";


export function render(vnode, container, callback) {
    return renderByAnu(vnode, container, callback);
}
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

//[Top API] ReactDOM.unstable_renderSubtreeIntoContainer
export function unstable_renderSubtreeIntoContainer(instance, vnode, container, callback) {
    deprecatedWarn("unstable_renderSubtreeIntoContainer");
    return renderByAnu(vnode, container, callback, instance.context);
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
function renderByAnu(vnode, root, callback) {
    if (!(root && root.appendChild)) {
		throw `ReactDOM.render的第二个参数错误`; // eslint-disable-line
    }
    let instance;
    let hostRoot = {
        stateNode: root,
        from: "root",
        tag: 5,
        type: root.tagName.toLowerCase(),
        props: Object.assign({
            children: vnode
        }),
        effectTag: CALLBACK,
        alternate: get(root),
        callback() {
            instance = hostRoot.child ? hostRoot.child.stateNode : null;
            callback && callback.call(instance);
        }
    };
    if (topNodes.indexOf(root) == -1) {
        topNodes.push(root);
        topFibers.push(hostRoot);
    }
    updateQueue.push(hostRoot);
    workLoop({
        timeRemaining() {
            return 2;
        }
    });
    return instance;
}

function getNextUnitOfWork() {
    let fiber = updateQueue.shift();
    if (!fiber) {
        return;
    }
    if (fiber.from == "root") {
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
    fiber.effects.concat(fiber).forEach((f) => {
        commitWork(f);
    });
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

//用于实例化组件
function beginWork(fiber) {
    if (!fiber.effectTag) {
        fiber.effectTag = WORKING;
    }

    if (fiber.tag > 3) {
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
        const thisEffect = fiber.effectTag > 1 ? [fiber] : [];
        const parentEffects = fiber.return.effects || [];
        fiber.return.effects = parentEffects.concat(childEffects, thisEffect);
    }
}

const NOWORK = 0; //不处理此节点及孩子
const WORKING = 1; //用于叠加其他任务
const MOUNT = 2; //插入或移动
const ATTR = 3; //更新属性
const CONTENT = 5; //设置文本
const NULLREF = 7; //ref null
const HOOK = 11; //componentDidMount/Update/WillUnmount
const REF = 13; //ref stateNode
const DELETE = 17; //移出DOM树
const CALLBACK = 19; //回调
const CATRH = 23; //出错
const effectNames = [MOUNT, ATTR, CONTENT, NULLREF, HOOK, REF, DELETE, CALLBACK, CATCH];
const effectLength = effectNames.length;
/**
 * 基于素数的任务系统
 * @param {Fiber} fiber 
 */
function commitWork(fiber) {
    let instance = fiber.stateNode;
    let amount = fiber.effectTag;
    for (let i = 0; i < effectLength; i++) {
        let effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        let remainder = amount / effectNo;
        if (remainder == ~~remainder) {
            //如果能整除，下面的分支操作以后要改成注入方法
            amount = remainder;
            switch (effectNo) {
            case MOUNT://只对原生组件
                shader.insertElement(fiber);
                break;
            case ATTR://只对原生组件
                shader.updateAttribute(fiber);
                break;
            case DELETE:
                if (fiber.tag > 3) {//只对原生组件
                    shader.removeElement(fiber);
                }//业务 & 原生
                delete fiber.stateNode;
                break;
            case HOOK: //只对业务组件
                if (fiber.disposed) {
                    callLifeCycleHook(instance, "componentWillUnmount", []);
                    instance.updater._isMounted = returnFalse;
                } else {
                    if (instance.isMounted()) {
                        callLifeCycleHook(instance, "componentDidUpdate", []);
                    } else {
                        callLifeCycleHook(instance, "componentDidMount", []);
                        instance.updater._isMounted = returnTrue;
                    }
                }
                break;
            case CONTENT:
                shader.updateContext(fiber);
                break;
            case REF:
                Refs.fireRef(fiber, instance);
                break;
            case NULLREF:
                Refs.fireRef(fiber, null);
                break;
            case CALLBACK:
                //ReactDOM.render/forceUpdate/setState callback
                fiber.callback.call(instance);
                break;
            case CATRH:
                var updater = instance.updater;
                updater._isDoctor = true;
                instance.componentDidCatch.apply(instance, fiber.errorInfo);
                fiber.errorInfo = null;
                updater._isDoctor = false;
                break;
            }
        }
    }
    fiber.effectTag = amount;
    fiber.effects = null;
}


function enqueueSetState(instance, state, callback) {
    let fiber = get(instance);
    let isForceUpdate = state === true;
    state = isForceUpdate ? null : state;
    let prevEffect;
    updateQueue.some(function (el) {
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
                prevEffect.callback = function () {
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
}

function performWork(deadline) {
    workLoop(deadline);
    if (updateQueue.length > 0) {
        requestIdleCallback(performWork);
    }
}

function updateHostComponent(fiber) {
    if (!fiber.stateNode) {
        try {
            fiber.stateNode = shader.createElement(fiber);
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

function updateClassComponent(fiber) {
    let { type, props: nextProps, stateNode: instance, partialState } = fiber;
    let nextContext = getMaskedContext(type.contextTypes);
    if (instance == null) {
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = enqueueSetState;
    }
    let { props: lastProps, state: lastState } = instance,
        c;
    fiber.lastState = lastProps;
    fiber.lastProps = lastState;
    instance._reactInternalFiber = fiber;
    fiber.partialState = null;
    if (instance.getChildContext) {
        try {
            c = instance.getChildContext();
            c = Object.assign({}, nextContext, c);
        } catch (e) {
            c = {};
        }
        contextStack.unshift(c);
    }
    let shouldUpdate = true;
    let nextState = partialState ? Object.assign({}, lastState, partialState) : lastState;
    if (instance.isMounted()) {
        let propsChange = lastProps !== nextProps;
        let willReceive = propsChange && instance.context !== nextContext;
        let updater = instance.updater;
        updater._receiving = true;
        if (willReceive) {
            callLifeCycleHook(instance, "componentWillReceiveProps", [nextProps, nextContext]);
        }
        if (propsChange) {
            try {
                getDerivedStateFromProps(instance, type, nextProps, lastState);
            } catch (error) {
                pushError(instance, "getDerivedStateFromProps", error);
            }
        }
        delete updater._receiving;

        let args = [nextProps, nextState, nextContext];
        if (!fiber.isForceUpdate && !callLifeCycleHook(instance, "shouldComponentUpdate", args)) {
            shouldUpdate = false;
        } else {
            callLifeCycleHook(instance, "componentWillUpdate", args);
        }
    } else {
        try {
            getDerivedStateFromProps(instance, type, nextProps, lastState);
        } catch (error) {
            pushError(instance, "getDerivedStateFromProps", error);
        }
        callLifeCycleHook(instance, "componentWillMount", []);
    }
    fiber.effectTag *= HOOK;
    instance.context = nextContext;
    instance.props = nextProps;
    instance.state = nextState;
    if (!shouldUpdate) {
        fiber.effectTag = NOWORK;
        cloneChildren(fiber);
        if (componentStack[0] === instance) {
            componentStack.shift();
        }
        return;
    }
    var lastOwn = Refs.currentOwner,
        children;
    Refs.currentOwner = instance;
    try {
        children = instance.render();
    } finally {
        if (componentStack[0] === instance) {
            componentStack.shift();
        }
        Refs.currentOwner = lastOwn;
    }
    diffChildren(fiber, children);
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function detachFiber(fiber, effects) {
    if (fiber.ref) {
        fiber.effectTag *= NULLREF;
    }
    fiber.effectTag *= DELETE;
    fiber.disposed = true;
    if (fiber.tag < 3) {
        fiber.effectTag *= HOOK;
    }
    effects.push(fiber);
    for (let child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects);
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
        detachFiber(oldFiber, effects);
    }

    let prevFiber,
        index = 0;
    for (let i in newFibers) {
        let newFiber = (newFibers[i] = new ComponentFiber(newFibers[i]));
        newFiber.effectTag = WORKING;
        let oldFiber = matchFibers[i];
        if (oldFiber) {
            if (newFiber.tag > 3) {
                newFiber.effectTag *= MOUNT;
                newFiber.effectTag *= ATTR;
            }
            if (isSameNode(oldFiber, newFiber)) {
                newFiber.stateNode = oldFiber.stateNode;
                newFiber.alternate = oldFiber;
            } else {
                detachFiber(oldFiber, effects);
            }
        } else {
            if (newFiber.tag > 3) {
                newFiber.effectTag *= MOUNT;
            }
        }
        newFiber.index = index++;
        newFiber.return = parentFiber;
        if (newFiber.ref) {
            newFiber.effectTag *= REF;
        }
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


function cloneChildren(parentFiber) {
    const oldFiber = parentFiber.alternate;
    if (!oldFiber) {
        return;
    }
    parentFiber._children = oldFiber._children;
    if (oldFiber.child) {
        parentFiber.child = oldFiber.child;
    }
}
