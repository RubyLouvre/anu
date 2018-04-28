import { extend, typeNumber, isFn } from "react-core/util";
import { fiberizeChildren } from "react-core/createElement";
import { AnuPortal } from "react-core/createPortal";

import { Renderer } from "react-core/createRenderer";
import { createInstance } from "./createInstance";
import { Fiber } from "./Fiber";
import { PLACE, ATTR, HOOK, CONTENT, REF, NULLREF, CALLBACK } from "./effectTag";
import { guardCallback, detachFiber, pushError, applyCallback } from "./ErrorBoundary";
import { gDSFP, gSBU } from "./util";

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
        try {
            // 为了性能起见，constructor, render, cWM,cWRP, cWU, gDSFP, render
            // getChildContext都可能 throw Exception，因此不逐一try catch
            // 通过fiber.errorHook得知出错的方法
            updateClassComponent(fiber, info); // unshift context
        } catch (e) {
            pushError(fiber, fiber.errorHook, e);

        }
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
            if (updater.isMounted()) {
                updater.snapshot = guardCallback(instance, gSBU, [updater.lastProps || {}, updater.lastState || {}]);
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
    let { type, stateNode: instance, isForced, props, stage } = fiber;
    // 为了让它在出错时collectEffects()还可以用，因此必须放在前面
    let { contextStack, containerStack, capturedValues } = info;
    let nextContext = getMaskedContext(type.contextTypes, instance, contextStack),
        context,
        updateFail = false;
    if (instance == null) {
        if (type === AnuPortal) {
            fiber.parent = props.parent;
        } else {
            fiber.parent = containerStack[0];
        }
        stage = "mount";
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = Renderer.updateComponent;
        instance.props = props;
        if (type[gDSFP] || instance[gSBU]) {
            instance.__useNewHooks = true;
        }
    }
    if (type === AnuPortal) {
        containerStack.unshift(fiber.parent);
        fiber.shiftContainer = true;
    }
    instance._reactInternalFiber = fiber;
    let updater = instance.updater;
    if (!instance.__isStateless) {
        //必须带生命周期
        if (updater.isMounted()) {
            //如果是更新阶段
            let hasSetState = isForced === true || fiber.pendingStates || fiber._updates;
            if (hasSetState) {
                stage = "update";
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
                updater.lastProps = instance.props;
                updater.lastState = instance.state;
                stage = "receive";
            }
        }
        let istage = stage;
        while (istage) {
            istage = stageIteration[istage](fiber, props, nextContext, instance, contextStack);
            fiber.setout = false;
        }
        let ps = fiber.pendingStates;
        if (ps && ps.length) {
            instance.state = mergeStates(fiber, props);
        } else {
            updateFail = stage == "update" && !fiber.isForced;
        }
        delete fiber.isForced;
    }
    instance.props = props; //设置新props
    if (instance.getChildContext) {
        context = instance.getChildContext();
        context = Object.assign({}, nextContext, context);
        fiber.shiftContext = true;
        contextStack.unshift(context);
    }
    instance.context = nextContext; //设置新context
    if (fiber.updateFail || updateFail) {
        fiber._hydrating = false;
        return;
    }
    fiber.effectTag *= HOOK;
    // 需要统一fiber.clearChildren与fiber.capturedCount
    //  console.log("fiber.clearChildren",fiber.clearChildren,capturedValues.length);
    if (fiber.clearChildren) {
        delete fiber.clearChildren;
        delete fiber.capturedCount;
        //console.log("处理一次");
        return;
    }
    fiber._hydrating = true;

    let lastOwn = Renderer.currentOwner;
    Renderer.currentOwner = instance;

    let rendered = applyCallback(instance, "render", []);
    Renderer.currentOwner = lastOwn;
    //render内部出错，可能被catch掉，因此会正常执行，但我们还是需要清空它
    if (capturedValues.length) {
        //console.log("返回", fiber.name);
        return;
    }
    diffChildren(fiber, rendered);
}
const stageIteration = {
    mount(fiber, nextProps, nextContext, instance) {
        fiber.setout = true;
        if (instance.__useNewHooks) {
            getDerivedStateFromProps(instance, fiber, nextProps, instance.state);
        } else {
            callUnsafeHook(instance, "componentWillMount", []);
        }
    },
    receive(fiber, nextProps, nextContext, instance, contextStack) {
        if (instance.__useNewHooks) {
            return "update";
        } else {
            let willReceive =
                instance.props !== nextProps || instance.context !== nextContext || contextStack.length > 1;
            if (willReceive) {
                fiber.setout = true;
                callUnsafeHook(instance, "componentWillReceiveProps", [nextProps, nextContext]);
                return "update";
            } else {
                cloneChildren(fiber);
                return false;
            }
        }
    },
    update(fiber, nextProps, nextContext, instance) {
        let updater = instance.updater;
        let args = [nextProps, mergeStates(fiber, nextProps, true), nextContext];
        if (updater.lastProps !== nextProps) {
            fiber.setout = true;
            getDerivedStateFromProps(instance, fiber, nextProps, args[1]);
        }
        delete fiber.setout;
        delete fiber.updateFail;
        //早期React的设计失误, SCU/CWU/CDU中setState会易死循环
        fiber._hydrating = true;
        if (!fiber.isForced && !applyCallback(instance, "shouldComponentUpdate", args)) {
            cloneChildren(fiber);
        } else if (!instance.__useNewHooks) {
            callUnsafeHook(instance, "componentWillUpdate", args);
        }
    },
};

function callUnsafeHook(a, b, c) {
    applyCallback(a, b, c);
    applyCallback(a, "UNSAFE_" + b, c);
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

function getDerivedStateFromProps(instance, fiber, nextProps, lastState) {
    fiber.errorHook = gDSFP;
    var fn = fiber.type[gDSFP];
    if (fn) {
        var s = fn.call(null, nextProps, lastState);
        if (typeNumber(s) === 8) {
            Renderer.updateComponent(instance, s);
        }
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
