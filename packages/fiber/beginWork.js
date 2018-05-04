import { extend, typeNumber, isFn, gDSFP, gSBU } from "react-core/util";
import { fiberizeChildren } from "react-core/createElement";
import { AnuPortal } from "react-core/createPortal";

import { Renderer } from "react-core/createRenderer";
import { createInstance, UpdateQueue } from "./createInstance";
import { Fiber } from "./Fiber";
import { PLACE, ATTR, HOOK, CONTENT, REF, NULLREF, CALLBACK } from "./effectTag";
import { guardCallback, detachFiber, pushError, applyCallback } from "./ErrorBoundary";


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
    if (fiber.tag < 3) {
        let keepbook = Renderer.currentOwner;
        try {
            // 为了性能起见，constructor, render, cWM,cWRP, cWU, gDSFP, render
            // getChildContext都可能 throw Exception，因此不逐一try catch
            // 通过fiber.errorHook得知出错的方法

            updateClassComponent(fiber, info); // unshift context
        } catch (e) {
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
    if (fiber.child && !fiber.updateFail) {
        return fiber.child;
    }


    let f = fiber;
    while (f) {
        let instance = f.stateNode;
        let updater = instance && instance.updater;
        if (f.shiftContainer) {
            //元素节点与AnuPortal
            delete fiber.shiftContainer;
            info.containerStack.shift(); // shift parent
        } else if (updater) {
            if (fiber.shiftContext) {
                delete fiber.shiftContext;
                info.contextStack.shift(); // shift context
            }
            if (updater.isMounted() && instance[gSBU]) {
                updater.snapshot = guardCallback(instance, gSBU, [updater.prevProps, updater.prevState]);
            }
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
    const { props, tag, alternate: prev } = fiber;

    if (!fiber.stateNode) {
        fiber.parent = info.containerStack[0];
        fiber.stateNode = Renderer.createElement(fiber);
    }
    const children = props && props.children;
    if (tag === 5) {
        // 元素节点
        info.containerStack.unshift(fiber.stateNode);
        fiber.shiftContainer = true;
        fiber.effectTag *= ATTR;
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
        return fiber.memoizedState = nextState;
    }
}


export function updateClassComponent(fiber, info) {
    let { type, stateNode: instance, props } = fiber;
    // 为了让它在出错时collectEffects()还可以用，因此必须放在前面
    let { contextStack, containerStack, capturedValues } = info;
    let newContext = getMaskedContext(type.contextTypes, instance, contextStack);
    if (instance == null) {
        if (type === AnuPortal) {
            fiber.parent = props.parent;
        } else {
            fiber.parent = containerStack[0];
        }
        instance = createInstance(fiber, newContext);
    }

    instance._reactInternalFiber = fiber; //更新rIF
    if (type === AnuPortal) {
        containerStack.unshift(fiber.parent);
        fiber.shiftContainer = true;
    }
    let updateQueue = fiber.updateQueue;
    if (!instance.__isStateless) {
        //必须带生命周期
        delete fiber.updateFail;
        let updater = instance.updater;
        if (updater.isMounted()) {
            applybeforeUpdateHooks(fiber, instance, props, newContext, contextStack);
        } else {
            applybeforeMountHooks(fiber, instance, props, newContext, contextStack);
        }
        if (fiber.memoizedState) {
            instance.state = fiber.memoizedState;
        }
    }
    fiber.batching = updateQueue.batching;
    var cbs = updateQueue.pendingCbs;
    if (cbs.length) {
        fiber.pendingCbs = cbs;
        fiber.effectTag *= CALLBACK;
    }
    if (fiber.updateFail) {
        cloneChildren(fiber);
        fiber._hydrating = false;
        return;
    }
    instance.context = newContext; //设置新context
    fiber.memoizedProps = instance.props = props;
    fiber.memoizedState = instance.state;
    if (instance.getChildContext) {
        let context = instance.getChildContext();
        context = Object.assign({}, newContext, context);
        fiber.shiftContext = true;
        contextStack.unshift(context);
    }

    fiber.effectTag *= HOOK;
    if (fiber._boundaries) {
        return;
    }
    fiber._hydrating = true;
    Renderer.currentOwner = instance;
    let rendered = applyCallback(instance, "render", []);
    //render内部出错，可能被catch掉，因此会正常执行，但我们还是需要清空它
    if (capturedValues.length) {
        return;
    }
    diffChildren(fiber, rendered);
}

function applybeforeMountHooks(fiber, instance, newProps) {
    fiber.setout = true;
    if (instance.__useNewHooks) {
        setStateByProps(instance, fiber, newProps, instance.state);
    } else {
        callUnsafeHook(instance, "componentWillMount", []);
    }
    delete fiber.setout;
    mergeStates(fiber, newProps);
    fiber.updateQueue = UpdateQueue();
}

function applybeforeUpdateHooks(fiber, instance, newProps, newContext, contextStack) {
    const oldProps = fiber.memoizedProps;
    const oldState = fiber.memoizedState;
    let updater = instance.updater;
    updater.prevProps = oldProps;
    updater.prevState = oldState;
    let propsChanged = oldProps !== newProps;
    let contextChanged = instance.context !== newContext;
    fiber.setout = true;

    if (!instance.__useNewHooks) {
        if (propsChanged || contextChanged) {
            let prevState = instance.state;
            callUnsafeHook(instance, "componentWillReceiveProps", [newProps, newContext]);
            if (prevState !== instance.state) {//模拟replaceState
                fiber.memoizedState = instance.state;
            }
        }
    }
    let newState = instance.state = oldState;
    let updateQueue = fiber.updateQueue;
    mergeStates(fiber, newProps);
    newState = fiber.memoizedState;

    setStateByProps(instance, fiber, newProps, newState);
    newState = fiber.memoizedState;

    delete fiber.setout;
    fiber._hydrating = true;
    if (!propsChanged && newState === oldState && contextStack.length == 1 && !updateQueue.isForced) {
        fiber.updateFail = true;
    } else {
        let args = [newProps, newState, newContext];
        fiber.updateQueue = UpdateQueue();

        if (!updateQueue.isForced && !applyCallback(instance, "shouldComponentUpdate", args)) {
            fiber.updateFail = true;

        } else if (!instance.__useNewHooks) {
            callUnsafeHook(instance, "componentWillUpdate", args);
        }
    }

}

function callUnsafeHook(a, b, c) {
    applyCallback(a, b, c);
    applyCallback(a, "UNSAFE_" + b, c);
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function setStateByProps(instance, fiber, nextProps, prevState) {
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

                newFiber = extend(oldFiber, newFiber);
                //将新属性转换旧对象上
                effects.push(alternate);
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
        }
        prevFiber = newFiber;
    }
    if (prevFiber) {
        delete prevFiber.sibling;
    }
}

Renderer.diffChildren = diffChildren;
