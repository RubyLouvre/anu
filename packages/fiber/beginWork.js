import { extend, typeNumber, isFn, gDSFP, gSBU } from 'react-core/util';
import { fiberizeChildren } from 'react-core/createElement';
import { AnuPortal } from 'react-core/createPortal';

import { Renderer } from 'react-core/createRenderer';
import { createInstance, UpdateQueue } from './createInstance';
import { Fiber } from './Fiber';
import {
    PLACE,
    ATTR,
    HOOK,
    CONTENT,
    REF,
    CALLBACK,
    WORKING
} from './effectTag';
import {
    guardCallback,
    detachFiber,
    pushError,
    applyCallback
} from './ErrorBoundary';
import { resetCursor } from './dispatcher';
import { getInsertPoint, setInsertPoints } from './insertPoint';

/**
 * 基于DFS遍历虚拟DOM树，初始化vnode为fiber,并产出组件实例或DOM节点
 * 为instance/fiber添加context与parent, 并压入栈
 * 使用再路过此节点时，再弹出栈
 * 它需要对updateFail的情况进行优化
 */

export function reconcileDFS(fiber, info, deadline, ENOUGH_TIME) {
    var topWork = fiber;
    outerLoop: while (fiber) {
        if (fiber.disposed || deadline.timeRemaining() <= ENOUGH_TIME) {
            break;
        }
        let occurError;
        if (fiber.tag < 3) {
            let keepbook = Renderer.currentOwner;
            try {
                // 为了性能起见，constructor, render, cWM,cWRP, cWU, gDSFP, render
                // getChildContext都可能 throw Exception，因此不逐一try catch
                // 通过fiber.errorHook得知出错的方法
                updateClassComponent(fiber, info); // unshift context
            } catch (e) {
                occurError = true;
                pushError(fiber, fiber.errorHook, e);
            }
            Renderer.currentOwner = keepbook;
            if (fiber.batching) {
                delete fiber.updateFail;
                delete fiber.batching;
            }
        } else {
            updateHostComponent(fiber, info); // unshift parent
        }
        //如果没有阻断更新，没有出错
        if (fiber.child && !fiber.updateFail && !occurError) {
            fiber = fiber.child;
            continue outerLoop;
        }

        let f = fiber;
        while (f) {
            let instance = f.stateNode;
            if (f.tag > 3 || f.shiftContainer) {
                if (f.shiftContainer) {
                    //元素节点与AnuPortal
                    delete f.shiftContainer;
                    info.containerStack.shift(); // shift parent
                }
            } else {
                let updater = instance && instance.updater;
                if (f.shiftContext) {
                    delete f.shiftContext;
                    info.contextStack.shift(); // shift context
                }
                if (f.hasMounted && instance[gSBU]) {
                    updater.snapshot = guardCallback(instance, gSBU, [
                        updater.prevProps,
                        updater.prevState
                    ]);
                }
            }

            if (f === topWork) {
                break outerLoop;
            }
            if (f.sibling) {
                fiber = f.sibling;
                continue outerLoop;
            }
            f = f.return;
        }
    }
}

function updateHostComponent(fiber, info) {
    const { props, tag, alternate: prev } = fiber;

    if (!fiber.stateNode) {
        fiber.parent = info.containerStack[0];
        fiber.stateNode = Renderer.createElement(fiber);
    }
    const parent = fiber.parent;

    fiber.forwardFiber = parent.insertPoint;

    parent.insertPoint = fiber;
    fiber.effectTag = PLACE;
    if (tag === 5) {
        // 元素节点
        fiber.stateNode.insertPoint = null;
        info.containerStack.unshift(fiber.stateNode);
        fiber.shiftContainer = true;
        fiber.effectTag *= ATTR;
        if (fiber.ref) {
            fiber.effectTag *= REF;
        }
        diffChildren(fiber, props.children);
    } else {
        if (!prev || prev.props !== props) {
            fiber.effectTag *= CONTENT;
        }
    }
}

function mergeStates(fiber, nextProps) {
    let instance = fiber.stateNode,
        pendings = fiber.updateQueue.pendingStates,
        n = pendings.length,
        state = fiber.memoizedState || instance.state;
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

    if (fail) {
        return state;
    } else {
        return (fiber.memoizedState = nextState);
    }
}

export function updateClassComponent(fiber, info) {
    let { type, stateNode: instance, props } = fiber;
    let { contextStack, containerStack } = info;
    let getContext = type.contextType;
    let unmaskedContext = contextStack[0];
    //如果这是React16.7的static ContextType
    let isStaticContextType = isFn(type.contextType);
    let newContext = isStaticContextType ? getContext(fiber): getMaskedContext(
        instance,
        type.contextTypes,
        unmaskedContext
    );
    if (instance == null) {
        fiber.parent = type === AnuPortal ? props.parent : containerStack[0];
        instance = createInstance(fiber, newContext);
        if (isStaticContextType){
            getContext.subscribers.push(instance);
        }
    }
    if (!isStaticContextType){
        cacheContext(instance, unmaskedContext, newContext);
    }
    let isStateful = !instance.__isStateless;
    instance._reactInternalFiber = fiber; //更新rIF
    if (isStateful) {
        //有狀态组件
        let updateQueue = fiber.updateQueue;

        delete fiber.updateFail;
        if (fiber.hasMounted) {
            applybeforeUpdateHooks(
                fiber,
                instance,
                props,
                newContext,
                contextStack
            );
        } else {
            applybeforeMountHooks(
                fiber,
                instance,
                props
            );
        }

        if (fiber.memoizedState) {
            instance.state = fiber.memoizedState;
        }
        fiber.batching = updateQueue.batching;
        let cbs = updateQueue.pendingCbs;
        if (cbs.length) {
            fiber.pendingCbs = cbs;
            fiber.effectTag *= CALLBACK;
        }
        if (fiber.ref) {
            fiber.effectTag *= REF;
        }
    } else if (type === AnuPortal) {
        //无狀态组件中的传送门组件
        containerStack.unshift(fiber.parent);
        fiber.shiftContainer = true;
    }
    //存放它上面的所有context的并集
    //instance.unmaskedContext = contextStack[0];
    //设置新context, props, state
    instance.context = newContext;
    fiber.memoizedProps = instance.props = props;
    fiber.memoizedState = instance.state;

    if (instance.getChildContext) {
        let context = instance.getChildContext();
        context = Object.assign({}, unmaskedContext, context);
        fiber.shiftContext = true;
        contextStack.unshift(context);
    }
    if (fiber.parent && fiber.hasMounted && fiber.dirty) {
        fiber.parent.insertPoint = getInsertPoint(fiber);
    }
    if (isStateful) {
        //上面设置fiber.parent.insertPoint的if分支原来是放这里
        if (fiber.updateFail) {
            cloneChildren(fiber);
            fiber._hydrating = false;
            return;
        }

        delete fiber.dirty;
        fiber.effectTag *= HOOK;
    } else if (fiber.effectTag == 1){
        fiber.effectTag = WORKING;
    }

    if (fiber.catchError) {
        return;
    }
    Renderer.onBeforeRender(fiber);
    fiber._hydrating = true;
    Renderer.currentOwner = instance;
    let rendered = applyCallback(instance, 'render', []);
    resetCursor();
    diffChildren(fiber, rendered);
    Renderer.onAfterRender(fiber);
}

function applybeforeMountHooks(fiber, instance, newProps) {
    fiber.setout = true;
    if (instance.__useNewHooks) {
        setStateByProps(fiber, newProps, instance.state);
    } else {
        callUnsafeHook(instance, 'componentWillMount', []);
    }
    delete fiber.setout;
    mergeStates(fiber, newProps);
    fiber.updateQueue = UpdateQueue();
}

function applybeforeUpdateHooks(
    fiber,
    instance,
    newProps,
    newContext,
    contextStack
) {
    const oldProps = fiber.memoizedProps;
    const oldState = fiber.memoizedState;
    let updater = instance.updater;
    updater.prevProps = oldProps;
    updater.prevState = oldState;
    let propsChanged = oldProps !== newProps;
    fiber.setout = true;

    if (!instance.__useNewHooks) {
        let contextChanged = instance.context !== newContext;
        if (propsChanged || contextChanged) {
            let prevState = instance.state;
            callUnsafeHook(instance, 'componentWillReceiveProps', [
                newProps,
                newContext
            ]);
            if (prevState !== instance.state) {
                //模拟replaceState
                fiber.memoizedState = instance.state;
            }
        }
    }
    let newState = (instance.state = oldState);
    let updateQueue = fiber.updateQueue;
    mergeStates(fiber, newProps);
    newState = fiber.memoizedState;

    setStateByProps(fiber, newProps, newState);
    newState = fiber.memoizedState;

    delete fiber.setout;
    fiber._hydrating = true;
    if (
        !propsChanged &&
        newState === oldState &&
        contextStack.length == 1 &&
        !updateQueue.isForced
    ) {
        fiber.updateFail = true;
    } else {
        let args = [newProps, newState, newContext];
        fiber.updateQueue = UpdateQueue();

        if (
            !updateQueue.isForced &&
            !applyCallback(instance, 'shouldComponentUpdate', args)
        ) {
            fiber.updateFail = true;
        } else if (!instance.__useNewHooks) {
            callUnsafeHook(instance, 'componentWillUpdate', args);
        }
    }
}

function callUnsafeHook(a, b, c) {
    applyCallback(a, b, c);
    applyCallback(a, 'UNSAFE_' + b, c);
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function setStateByProps(fiber, nextProps, prevState) {
    fiber.errorHook = gDSFP;
    let fn = fiber.type[gDSFP];
    if (fn) {
        let partialState = fn.call(null, nextProps, prevState);
        if (typeNumber(partialState) === 8) {
            fiber.memoizedState = Object.assign({}, prevState, partialState);
        }
    }
}

function cloneChildren(fiber) {
    const prev = fiber.alternate;
    if (prev && prev.child) {
        let pc = prev.children;

        let cc = (fiber.children = {});
        fiber.child = prev.child;
        fiber.lastChild = prev.lastChild;
        for (let i in pc) {
            let a = pc[i];
            a.return = fiber; // 只改父引用不复制
            cc[i] = a;
        }
        setInsertPoints(cc);
    }
}
function cacheContext(instance, unmaskedContext, context) {
    instance.__unmaskedContext = unmaskedContext;
    instance.__maskedContext = context;
}
function getMaskedContext(instance, contextTypes, unmaskedContext) {
    var noContext = !contextTypes;
    if (instance){
        if (noContext){
            return instance.context;
        }
        var cachedUnmasked = instance.__unmaskedContext;
        if (cachedUnmasked === unmaskedContext) {
            return instance.__maskedContext;
        }
    } 
    let context = {};
    if (noContext) {
        return context;
    }
    for (let key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = unmaskedContext[key];
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
    let oldFibers = parentFiber.children; // 旧的
    if (oldFibers) {
        parentFiber.oldChildren = oldFibers;
    } else {
        oldFibers = {};
    }
    let newFibers = fiberizeChildren(children, parentFiber); // 新的
    let effects = parentFiber.effects || (parentFiber.effects = []);
    let matchFibers = new Object();
    delete parentFiber.child;
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

    let prevFiber,
        index = 0;
    for (let i in newFibers) {
        let newFiber = newFibers[i];
        let oldFiber = matchFibers[i];
        let alternate = null;
        if (oldFiber) {
            if (isSameNode(oldFiber, newFiber)) {
                //&& !oldFiber.disposed
                alternate = new Fiber(oldFiber);
                let oldRef = oldFiber.ref;
                newFiber = extend(oldFiber, newFiber);
                delete newFiber.disposed;
                newFiber.alternate = alternate;
                if (newFiber.ref && newFiber.deleteRef) {
                    delete newFiber.ref;
                    delete newFiber.deleteRef;
                }
                if (oldRef && oldRef !== newFiber.ref) {
                    //  alternate.effectTag *= NULLREF;
                    effects.push(alternate);
                }
                if (newFiber.tag === 5) {
                    newFiber.lastProps = alternate.props;
                }
            } else {
                detachFiber(oldFiber, effects);
            }
            // newFiber.effectTag = NOWORK;
        } else {
            newFiber = new Fiber(newFiber);
        }
        newFibers[i] = newFiber;
        newFiber.index = index++;
        newFiber.return = parentFiber;

        if (prevFiber) {
            prevFiber.sibling = newFiber;
            newFiber.forward = prevFiber;
        } else {
            parentFiber.child = newFiber;
            newFiber.forward = null;
        }
        prevFiber = newFiber;
    }
    parentFiber.lastChild = prevFiber;
    if (prevFiber) {
        prevFiber.sibling = null;
    }
}
