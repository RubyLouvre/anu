import { callLifeCycleHook, pushError } from "./unwindWork";
import { contextStack, componentStack, emptyObject } from "../share";
import { fiberizeChildren } from "../createElement";
import { createInstance } from "../createInstance";
import { NOWORK, WORKING, PLACE, ATTR, DETACH, HOOK, CONTENT, REF, NULLREF } from "../effectTag";
import { extend, Flutter, get } from "../util";

//用于实例化组件
export function beginWork(fiber) {
    if (!fiber.effectTag) {
        fiber.effectTag = WORKING;
    }
    if (fiber.tag > 3) {
        updateHostComponent(fiber);
    } else {
        updateClassComponent(fiber);
    }
}

export function Fiber(vnode) {
    extend(this, vnode);
    let type = vnode.type;
    this.name = type.displayName || type.name || type;
}

function updateHostComponent(fiber) {
    if (!fiber.stateNode) {
        try {
            fiber.stateNode = Flutter.createElement(fiber);
        } catch (e) {
            throw e;
        }
    }
    if (fiber.tag == 5 && !fiber.root) {
        fiber.effectTag *= ATTR;
    }
    if (fiber.parent) {
        let b = fiber.parent.before;
        fiber.mountPoint = b;
        fiber.parent.before = fiber.stateNode;
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

    let { type, props: nextProps, stateNode: instance, partialState, isForceUpdate } = fiber;
    let nextContext = getMaskedContext(type.contextTypes), c;
    if (instance == null) {
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = Flutter.updateComponent;
        var willReceive = fiber._willReceive;
        delete fiber._willReceive;
    }
    let { props: lastProps, state: lastState } = instance;
    let shouldUpdate = true;
    let updater = instance.updater;
    let propsChange = lastProps !== nextProps;
    let stateNoChange = !partialState;//;

    fiber.lastProps = lastProps;
    fiber.lastState = lastState;
    instance._reactInternalFiber = fiber;
    if (fiber.parent) {
        fiber.mountPoint = fiber.parent.before;
    }
    if (instance.getChildContext) {
        try {
            c = instance.getChildContext();
            c = Object.assign({}, nextContext, c);
        } catch (e) {
            c = {};
        }
        contextStack.unshift(c);
    }

    updater._hooking = true;

    if (updater._isMounted()) {
        delete fiber.isForceUpdate;
        if (stateNoChange) {
            //只要props/context任于一个发生变化，就会触发cWRP
            willReceive = propsChange || instance.context !== nextContext;
            if (willReceive) {

                callLifeCycleHook(instance, "componentWillReceiveProps", [nextProps, nextContext]);
            }

            if (propsChange) {
                getDerivedStateFromProps(instance, type, nextProps, lastState);
            }
        }
        let args = [nextProps, fiber.partialState, nextContext];
        if (!isForceUpdate && !callLifeCycleHook(instance, "shouldComponentUpdate", args)) {
            shouldUpdate = false;
        } else {
            callLifeCycleHook(instance, "componentWillUpdate", args);
        }
    } else {
        getDerivedStateFromProps(instance, type, nextProps, lastState);
        callLifeCycleHook(instance, "componentWillMount", []);
    }
    fiber.effectTag *= HOOK;
    instance.context = nextContext;
    instance.props = nextProps;
    instance.state = fiber.partialState || lastState;//fiber.partialState可能在钩子里被重写
    updater._hooking = false;
    if (!shouldUpdate) {
        fiber.effectTag = NOWORK;
        cloneChildren(fiber);
        if (componentStack[0] === instance) {
            componentStack.shift();
        }
        return;
    }
    var rendered;
    updater._hydrating = true;
    if (!isForceUpdate && willReceive === false) {
        delete fiber._willReceive;
        let a = fiber.child;
        if (a && a.sibling) {
            rendered = [];
            for (; a; a = a.sibling) {
                rendered.push(a);
            }
        } else {
            rendered = a;
        }
    } else {
        let lastOwn = Flutter.currentOwner;
        Flutter.currentOwner = instance;
        rendered = callLifeCycleHook(instance, "render", []);
        if (componentStack[0] === instance) {
            componentStack.shift();
        }
        if (updater._hasError) {
            rendered = [];
        }
        Flutter.currentOwner = lastOwn;
    }
    diffChildren(fiber, rendered);
}

function isSameNode(a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

export function detachFiber(fiber, effects) {
    fiber.effectTag = DETACH;
    if (fiber.ref) {
        fiber.effectTag *= NULLREF;
    }
    fiber.disposed = true;
    if (fiber.tag < 3) {
        fiber.effectTag *= HOOK;
    }
    effects.push(fiber);
    for (let child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects);
    }
}

var gDSFP = "getDerivedStateFromProps";
function getDerivedStateFromProps(instance, type, nextProps, lastState) {
    try {
        var method = type[gDSFP];
        if (method) {
            var partialState = method.call(null, nextProps, lastState);
            if (partialState != null) {
                var fiber = get(instance);
                fiber.partialState = Object.assign({}, fiber.partialState || lastState, partialState);
            }
        }
    } catch (error) {
        pushError(instance, gDSFP, error);
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

/**
 * 在这里确定parent
 * @param {*} parentFiber 
 * @param {*} children 
 */
function diffChildren(parentFiber, children) {
    let prev = parentFiber.alternate;
    let oldFibers = prev ? prev._children : {}; //旧的
    let newFibers = fiberizeChildren(children, parentFiber); //新的
    let effects = parentFiber.effects || (parentFiber.effects = []);
    let matchFibers = {};
    let parent = parentFiber;
    do {
        if (parent.tag === 5) {
            break;
        }
    } while ((parent = parent.return));
    parent = parent.stateNode;
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
        let newFiber = (newFibers[i] = new Fiber(newFibers[i]));
        newFiber.effectTag = WORKING;
        newFiber.parent = parent;
        let oldFiber = matchFibers[i];
        if (oldFiber) {
            if (isSameNode(oldFiber, newFiber)) {
                newFiber.stateNode = oldFiber.stateNode;
                newFiber.alternate = oldFiber;
                if (newFiber.tag === 5) {
                    newFiber.lastProps = oldFiber.props;
                }
            } else {
                detachFiber(oldFiber, effects);
            }
        }
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
