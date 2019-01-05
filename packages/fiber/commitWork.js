import { emptyObject, returnFalse } from 'react-core/util';
import {
    NOWORK,
    WORKING,
    PLACE,
    CONTENT,
    DUPLEX,
    ATTR, //UPDATE
    DETACH, //DELETION
    HOOK,
    REF,
    CALLBACK,
    PASSIVE,
    CAPTURE,
    effectLength,
    effectNames
} from './effectTag';
import { guardCallback, removeFormBoundaries } from './ErrorBoundary';
import { fakeObject } from 'react-core/Component';
import { Renderer } from 'react-core/createRenderer';
import { Refs } from './Refs';

/**
 * COMMIT阶段也做成深度调先遍历
 * @param {*} fiber
 * @param {*} topFiber
 */
var domFns = ['insertElement', 'updateContent', 'updateAttribute'];
var domEffects = [PLACE, CONTENT, ATTR];
var domRemoved = [];
var passiveFibers = [];
function commitDFSImpl(fiber) {
    let topFiber = fiber;
    outerLoop: while (true) {
        //逐步向下执行所有移除与插入操作
        if (fiber.effects && fiber.effects.length) {
            //fiber里面是被重用的旧节点与无法重用的旧节点
            fiber.effects.forEach(disposeFiber);
            delete fiber.effects;
        }
        if (fiber.effectTag % PLACE == 0) {
            // DOM节点插入或移除
            domEffects.forEach(function (effect, i) {
                if (fiber.effectTag % effect == 0) {
                    Renderer[domFns[i]](fiber);
                    fiber.effectTag /= effect;
                }
            });
            fiber.hasMounted = true;
        } else {
            // 边界组件的清洗工件
            if (fiber.catchError) {
                removeFormBoundaries(fiber);
                disposeFibers(fiber);
            }
        }
        if (fiber.updateFail) {
            delete fiber.updateFail;
        }
        if (fiber.child && fiber.child.effectTag > NOWORK) {
            fiber = fiber.child;
            continue;
        }

        let f = fiber;
        while (f) {
            if (f.effectTag === WORKING) {
                f.effectTag = NOWORK;
                f.hasMounted = true;//做react hooks新时新加的
            } else if (f.effectTag > WORKING) {
                commitEffects(f);
                f.hasMounted = true;
                if (f.capturedValues) {
                    f.effectTag = CAPTURE;
                }
            }

            if (f === topFiber || f.hostRoot) {
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
export function commitDFS(effects) {
    Renderer.batchedUpdates(function () {
        var el;
        while ((el = effects.shift())) {
            //处理retry组件
            if (el.effectTag === DETACH && el.caughtError) {
                disposeFiber(el);
            } else {
                commitDFSImpl(el);
            }
            if (passiveFibers.length) {
                passiveFibers.forEach(function (fiber) {
                    safeInvokeHooks(fiber.updateQueue, 'passive', 'unpassive');
                });
                passiveFibers.length = 0;
            }
            if (domRemoved.length) {
                domRemoved.forEach(Renderer.removeElement);
                domRemoved.length = 0;
            }
        }
    }, {});

    let error = Renderer.catchError;
    if (error) {
        delete Renderer.catchError;
        throw error;
    }
}

/**
 * 执行其他任务
 *
 * @param {Fiber} fiber
 */
export function commitEffects(fiber) {
    let instance = fiber.stateNode || emptyObject;
    let amount = fiber.effectTag;
    let updater = instance.updater || fakeObject;
    for (let i = 0; i < effectLength; i++) {
        let effectNo = effectNames[i];
        if (effectNo > amount) {
            break;
        }
        if (amount % effectNo === 0) {
            amount /= effectNo;
            //如果能整除
            switch (effectNo) {
                case WORKING:
                    break;
                case DUPLEX:
                    Renderer.updateControlled(fiber);
                    break;
                case HOOK:
                    if (instance.__isStateless) {
                        safeInvokeHooks(fiber.updateQueue, 'layout', 'unlayout');
                    } else if (fiber.hasMounted) {
                        guardCallback(instance, 'componentDidUpdate', [
                            updater.prevProps,
                            updater.prevState,
                            updater.snapshot
                        ]);
                    } else {
                        fiber.hasMounted = true;
                        guardCallback(instance, 'componentDidMount', []);
                    }
                    delete fiber._hydrating;
                    //这里发现错误，说明它的下方组件出现错误，不能延迟到下一个生命周期
                    if (fiber.catchError) {
                        fiber.effectTag = amount;
                        return;
                    }
                    break;
                case PASSIVE:
                    passiveFibers.push(fiber);
                    break;
                case REF:
                    Refs.fireRef(fiber, instance);
                    break;
                case CALLBACK:
                    //ReactDOM.render/forceUpdate/setState callback
                    var queue = fiber.pendingCbs;
                    fiber._hydrating = true; //setState回调里再执行setState
                    queue.forEach(function (fn) {
                        fn.call(instance);
                    });
                    delete fiber._hydrating;
                    delete fiber.pendingCbs;
                    break;
                case CAPTURE: // 23
                    // console.log("进入CAPTURE");
                    var values = fiber.capturedValues;
                    fiber.caughtError = true;
                    var a = values.shift();
                    var b = values.shift();
                    if (!values.length) {
                        fiber.effectTag = amount;
                        delete fiber.capturedValues;
                    }
                    instance.componentDidCatch(a, b);
                    break;
            }
        }
    }
    fiber.effectTag = NOWORK;
}

export function disposeFibers(fiber) {
    let list = [fiber.oldChildren, fiber.children];
    for (let i = 0; i < 2; i++) {
        let c = list[i];
        if (c) {
            for (let i in c) {
                let child = c[i];
                if (!child.disposed && child.hasMounted) {
                    disposeFiber(child, true);
                    disposeFibers(child);
                }
            }
        }
    }
    delete fiber.child;
    delete fiber.lastChild;
    delete fiber.oldChildren;
    fiber.children = {};
}
function safeInvokeHooks(upateQueue, create, destory) {
    var uneffects = upateQueue[destory],
        effects = upateQueue[create], fn;
    if (!uneffects){
        return;
    }
    while ((fn = uneffects.shift())) {
        try {
            fn();
        } catch (e) { /** */ }
    }
    while ((fn = effects.shift())) {
        try {
            var f = fn();
            if (typeof f === 'function') {
                uneffects.push(f);
            }
        } catch (e) { /** */ }
    }
}
function disposeFiber(fiber, force) {
    let { stateNode, effectTag } = fiber;
    if (!stateNode) {
        return;
    }
    let isStateless = stateNode.__isStateless;
    if (!isStateless && fiber.ref) {
        Refs.fireRef(fiber, null);
    }
    if (effectTag % DETACH == 0 || force === true) {
        if (fiber.tag > 3) {
            domRemoved.push(fiber);
        } else {
            Renderer.onDispose(fiber);
            if (fiber.hasMounted) {
                if (isStateless) {
                    safeInvokeHooks(fiber.updateQueue, 'layout', 'unlayout');
                    safeInvokeHooks(fiber.updateQueue, 'passive', 'unpassive');
                }
                stateNode.updater.enqueueSetState = returnFalse;
                guardCallback(stateNode, 'componentWillUnmount', []);
                delete fiber.stateNode;
            }
        }
        delete fiber.alternate;
        delete fiber.hasMounted;
        fiber.disposed = true;
    }
    fiber.effectTag = NOWORK;
}