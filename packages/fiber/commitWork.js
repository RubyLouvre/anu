// import { updateClassComponent, updateHostComponent } from "./beginWork";
import {
    effects,
    emptyObject,
    returnFalse
} from "react-core/util";
import {
    PLACE,
    CONTENT,
    ATTR, //UPDATE
    NOWORK,
    DETACH, //DELETION
    HOOK,
    REF,
    CALLBACK,
    CAPTURE,
    effectLength,
    effectNames,
} from "./effectTag";
import {
    guardCallback,
    removeFormBoundaries
} from "./ErrorBoundary";
import {
    fakeObject
} from "react-core/Component";
import {
    Renderer
} from "react-core/createRenderer";
import {
    Refs
} from "./Refs";

/**
 * COMMIT阶段也做成深度调先遍历
 * @param {*} fiber 
 * @param {*} topFiber 
 */

function commitDFS(fiber) {
    let topFiber = fiber;
    outerLoop:
    while (true) {
        //逐步向下执行所有移除与插入操作
        if (fiber.effects && fiber.effects.length) {
            //fiber里面是被重用的旧节点与无法重用的旧节点
            fiber.effects.forEach(disposeFiber);
            delete fiber.effects;
        }
        if (fiber.effectTag % PLACE == 0) {
            // DOM节点插入或移除
            Renderer.insertElement(fiber);
            fiber.hasMounted = true;
            fiber.effectTag /= PLACE;
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
        if (fiber.child) {
            fiber = fiber.child;
            continue;
        } else {
            if (fiber.effectTag > 1) {
                commitEffects(fiber);
                if (fiber.capturedValues) {
                    fiber.effectTag = CAPTURE;
                    // Renderer.boundaries.push(fiber);
                }
            }
        }

        if (fiber.sibling) {
            fiber = fiber.sibling;
            continue;
        } else {

            while (fiber.return) {
                fiber = fiber.return;

                if (fiber.effectTag > 1) {
                    commitEffects(fiber);
                    if (fiber.capturedValues) {
                        fiber.effectTag = CAPTURE;
                        //  Renderer.boundaries.push(fiber);
                    }
                }
                if (fiber === topFiber || fiber.hostRoot) {
                    break outerLoop;
                }
                if (fiber.sibling) {
                    fiber = fiber.sibling;
                    continue outerLoop;
                }
            }
        }
    }
}
export function commitWork() {

    Renderer.batchedUpdates(function () {
        var el;
        while (el = effects.shift()) {
            //处理retry组件
            if (el.effectTag === DETACH && el.caughtError) {
                disposeFiber(el);
                return;
            }
            commitDFS(el, effects);
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
            case PLACE:
                Renderer.insertElement(fiber);
                fiber.hasMounted = true;
                break;
            case CONTENT:
                Renderer.updateContext(fiber);
                break;
            case ATTR:
                Renderer.updateAttribute(fiber);
                break;
            case HOOK:
                if (fiber.hasMounted) {
                    guardCallback(instance, "componentDidUpdate", [
                        updater.prevProps,
                        updater.prevState,
                        updater.snapshot,
                    ]);
                } else {
                    fiber.hasMounted = true;
                    guardCallback(instance, "componentDidMount", []);
                }
                delete fiber._hydrating;
                //这里发现错误，说明它的下方组件出现错误，不能延迟到下一个生命周期
                if (fiber.catchError) {
                    return;
                }
                break;
            case REF:
                if (!instance.__isStateless) {
                    Refs.fireRef(fiber, instance);
                }
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
    fiber.effectTag = 1;
}


export function disposeFibers(fiber) {
    let list = [fiber.oldChildren, fiber.children],
        count = 0;

    while (count != 2) {
        let c = list[count++];
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

function disposeFiber(fiber, force) {
    let {
        stateNode,
        effectTag
    } = fiber;
    if (!stateNode) {
        return;
    }
    if (!stateNode.__isStateless && fiber.ref) {
        Refs.fireRef(fiber, null);
    }
    if (effectTag % DETACH == 0 || force === true) {
        if (fiber.tag > 3) {
            Renderer.removeElement(fiber);
        } else {
            if (fiber.hasMounted) {
                stateNode.updater.enqueueSetState = returnFalse;
                guardCallback(stateNode, "componentWillUnmount", []);
            }
        }
        delete fiber.alternate;
        delete fiber.hasMounted;
        delete fiber.stateNode;
        fiber.disposed = true;
    }
    fiber.effectTag = NOWORK;
}

/*
var pendingFiber = [];
function reconcileDFS(fiber, topFiber, info, dl) {
    do {

        if (dl.timeRemaining < 1) { //时间不够，下次处理
            pendingFiber.push(fiber);
            break;
        }

        //没有销毁， 就实例化或更新组件
        if (!fiber.disposed) {
            if (fiber.tag < 3) {
                updateClassComponent(fiber, info);
                //在批处理中，它的updateFail会失效
            } else {
                updateHostComponent(fiber, info);
            }
            //没有发生异常 或 没有SCU 
            if (!fiber.occurError && !fiber.updateFail && fiber.child) {
                fiber = fiber.child;
                continue;
            }
        }
        if (fiber.sibling) {
            fiber = fiber.sibling;
            continue;
        }
        if (fiber.return) {
            //流程开始往上寻找时, 处理containerStack， contextStack, parent.insertPoint
            let instance = fiber.stateNode;
            let updater = instance && instance.updater;
            if (fiber.shiftContainer) {
                delete fiber.shiftContainer;
                info.containerStack.shift();
            } else if (updater) {
                if (fiber.shiftContext) {
                    delete fiber.shiftContext;
                    info.contextStack.shift();
                }
            }
            //instance为元素节点
            if (instance.insertPoint) {
                instance.insertPoint = null;
            }

            //处理contextStack, containerStack
            if (fiber.return !== topFiber) {
                fiber = fiber.return;
            } else {
                //清空所有栈
                break;
            }
        }

    } while (1);
}

*/