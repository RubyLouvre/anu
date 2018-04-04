import { callLifeCycleHook, pushError } from "./unwindWork";
import { contextStack, componentStack, containerStack, hasContextChanged,updateQueue } from "../share";
import { fiberizeChildren } from "../createElement";
import { createInstance } from "../createInstance";
import { NOWORK, PLACE, ATTR, DETACH, HOOK, CONTENT, CHANGEREF, REF, NULLREF, CALLBACK } from "./effectTag";
import { extend, Flutter, noop, typeNumber,__push } from "../util";
/**
 * 基于DFS遍历虚拟DOM树，初始化vnode为fiber,并产出组件实例或DOM节点
 * 为instance/fiber添加context与parent, 并压入栈
 * 使用再路过此节点时，再弹出栈
 * 它需要对shouldUpdateFalse的情况进行优化
 * 
 * @param {Fiber} fiber 
 * @param {Fiber} topWork 
 */
export function updateEffects (fiber, topWork) {
    if (fiber.tag > 3) {
        updateHostComponent(fiber); // unshift context
    } else {
        updateClassComponent(fiber); // unshift parent
    }

    if (!fiber.shouldUpdateFalse) {
        if (fiber.child) {
            return fiber.child;
        }
    }

    let f = fiber;
    while (f) {
        if (f.stateNode.getChildContext) {
            var useTest = contextStack.shift(); // shift context
            // console.log(useTest)
        }
        if (f.tag === 5) {
            containerStack.shift(); // shift parent
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

// 实例化组件
export function Fiber (vnode) {
    extend(this, vnode);
    let type = vnode.type;
    this.time = Date.now();
    this.name = type.displayName || type.name || type;
    this.effectTag = NOWORK;
}

function updateHostComponent (fiber) {
    if (!fiber.stateNode) {
        try {
            fiber.stateNode = Flutter.createElement(fiber);
        } catch (e) {
            throw e;
        }
    }
    fiber.parent = fiber._return ? fiber._return.stateNode : containerStack[0];
    const { props, tag, root, alternate: prev } = fiber;
    const children = props && props.children;
    if (tag === 5) {
    // 元素节点
        containerStack.unshift(fiber.stateNode);
        if (!root) {
            fiber.effectTag *= ATTR;
        }
        if(prev){
            //  console.log(fiber.stateNode, "xxxx");
            fiber._children = prev._children;
        }
        diffChildren(fiber, children);
    } else {
    // 文本节点
        if (!prev || prev.props.children !== children) {
            fiber.effectTag *= CONTENT;
        }
    }
}

function mergeStates (fiber, nextProps, keep) {
    let instance = fiber.stateNode,
        pendings = fiber.pendingStates || [],
        n = pendings.length,
        state = instance.state;
    if (n === 0) {
        return state;
    }

    let nextState = extend({}, state); // 每次都返回新的state
    for (let i = 0; i < n; i++) {
        let pending = pendings[i];
        if (pending && pending.call) {
            pending = pending.call(instance, nextState, nextProps);
        }
        extend(nextState, pending);
    }
    if (keep) {
        pendings.length = 0;
        pendings.push(nextState);
    }else {
        delete fiber.pendingStates;
    }
    return nextState;
}

// 第一次是没有alternate 也没有stateNode
// 如果是setState是没有alternate
// 如果是receive是有alternate
function updateClassComponent (fiber) {
    let { type, stateNode: instance, isForced, props, stage } = fiber;
    fiber.parent = containerStack[0]; // 为了让它在出错时collectEffects()还可以用，因此必须放在前面

    let nextContext = getMaskedContext(type.contextTypes, instance), context;
    if (instance == null) {
    // 初始化
        stage = "init";
        instance = fiber.stateNode = createInstance(fiber, nextContext);
        instance.updater.enqueueSetState = Flutter.updateComponent;
        instance.props = props;
    } else {
        var isSetState = isForced === true || isForced === false || fiber._updates;
        if (isSetState) {
            stage = "update";
            if (fiber._updates) {
                extend(fiber, fiber._updates);
                delete fiber._updates;
                isForced = fiber.isForced;
            }
            delete fiber.isForced;
        }else {
          
            stage = "receive";
        }
    }
    instance._reactInternalFiber = fiber;
    if (instance.__isStateless) {
        stage = "noop";
    }
    var updater = instance.updater;
    updater._hooking = true;

    while (stage) {
        stage = stageIteration[stage](fiber, props, nextContext, instance, isForced);
    }
    updater._hooking = false;
    var ps = fiber.pendingStates;
    if (ps && ps.length) {
        instance.state = mergeStates(fiber, props);
    }
    instance.props = props; // getChildContext可能依赖于props与state
    if (instance.getChildContext) {
        try {
            context = instance.getChildContext();
            context = Object.assign({}, nextContext, context);
        } catch (e) {
            context = {};
        }
        contextStack.unshift(context);
    }
    instance.context = nextContext;
    if (fiber.shouldUpdateFalse) {
        return;
    }
    fiber.effectTag *= HOOK;
    updater._hydrating = true;

    let lastOwn = Flutter.currentOwner;
    Flutter.currentOwner = instance;
    let rendered = callLifeCycleHook(instance, "render", []);
    if (componentStack[0] === instance) {
        componentStack.shift();
    }
    if (updater._hasError) {
        rendered = [];
    }
    Flutter.currentOwner = lastOwn;

    diffChildren(fiber, rendered);
}
var stageIteration = {
    noop: noop,
    init(fiber, nextProps, nextContext, instance) {
        getDerivedStateFromProps(instance, fiber, nextProps, instance.state);
        callLifeCycleHook(instance, "componentWillMount", []);
    },
    receive(fiber, nextProps, nextContext, instance) {

        var updater = instance.updater;
        updater.lastProps = instance.props;
        updater.lastState = instance.state;
        let propsChange = updater.lastProps !== nextProps;
        var willReceive = propsChange || (hasContextChanged() || instance.context !== nextContext);
        if (willReceive) {
            callLifeCycleHook(instance, "componentWillReceiveProps", [nextProps, nextContext]);
        } else {
            cloneChildren(fiber);
            return;
        }
        if (propsChange) {
            getDerivedStateFromProps(instance, fiber, nextProps, updater.lastState);
        }
        return "update";
    },
    update(fiber, nextProps, nextContext, instance, isForced) {
        let args = [nextProps, mergeStates(fiber, nextProps, true), nextContext];
        if (!isForced && !callLifeCycleHook(instance, "shouldComponentUpdate", args)) {
            cloneChildren(fiber);
        } else {
            callLifeCycleHook(instance, "getSnapshotBeforeUpdate", args);
            callLifeCycleHook(instance, "componentWillUpdate", args);
        }
    }
};

function isSameNode (a, b) {
    if (a.type === b.type && a.key === b.key) {
        return true;
    }
}

export function detachFiber (fiber, effects) {
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
function getDerivedStateFromProps (instance, fiber, nextProps, lastState) {
    try {
        var method = fiber.type[gDSFP];
        if (method) {
            var partialState = method.call(null, nextProps, lastState);
            if (typeNumber(partialState) === 8) {
                instance.updater.enqueueSetState(instance, partialState);
            }
        }
    } catch (error) {
        pushError(instance, gDSFP, error);
    }
}

function cloneChildren (fiber) {
    fiber.shouldUpdateFalse = true;
    const prev = fiber.alternate;
    if (prev && prev.child) {
        var pc = prev._children;
        var cc = (fiber._children = {});
        fiber.child = prev.child;
        for (let i in pc) {
            let a = pc[i];
            a.return = fiber; // 只改父引用不复制
            cc[i] = a;
        }
    }
    if (componentStack[0] === fiber.stateNode) {
        componentStack.shift();
    }
}
function getMaskedContext (contextTypes, instance) {
    if(instance && !contextTypes){
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
function diffChildren (parentFiber, children) {
    let oldFibers = parentFiber._children || {}; // 旧的
    var newFibers = fiberizeChildren(children, parentFiber); // 新的
    var effects = parentFiber.effects || (parentFiber.effects = []);
    let matchFibers = {};
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
    if (parentFiber.tag === 5) {
        var firstChild = parentFiber.stateNode.firstChild;
        if (firstChild) {
            for (let i in oldFibers) {
                var child = oldFibers[i];
                //向下找到其第一个元素节点子孙
                do {
                    if (child._return) {
                        break;
                    }
                    if (child.tag > 4) {
                        child.stateNode = firstChild;
                        break;
                    }
                } while ((child = child.child));
                break;
            }
        }
    }
 
    let prevFiber,
        index = 0,
        newEffects = [];
    for (let i in newFibers) {
        let newFiber = newFibers[i] = new Fiber(newFibers[i]);
        let oldFiber = matchFibers[i];
        if (oldFiber) {
            if (isSameNode(oldFiber, newFiber)) {
                newFiber.stateNode = oldFiber.stateNode;
                newFiber.alternate = oldFiber; // 保存旧的
                newFiber._children = oldFiber._children;
                if(oldFiber._updates){
                    newFiber._updates = oldFiber._updates;
                    delete oldFiber._updates;
                    oldFiber.merged = true;
                }       
                if (oldFiber.ref && oldFiber.ref !== newFiber.ref) {
                    oldFiber.effectTag *= CHANGEREF;
                    effects.push(oldFiber);
                }
                if (newFiber.tag === 5) {
                    newFiber.lastProps = oldFiber.props;
                }
            } else {
                detachFiber(oldFiber, effects);
            }
            newEffects.push(newFiber);
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
            if(newFiber.tag > 3 && newFiber.alternate){
                // newFiber.stateNode = newFiber.alternate.parent.firstChild;
            }
        }
        prevFiber = newFiber;
    }
    // __push.apply(effects, newEffects);
    if (prevFiber) {
        delete prevFiber.sibling;
    }
}
