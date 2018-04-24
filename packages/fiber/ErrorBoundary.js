import { noop, get } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { fakeObject } from "react-core/Component";

import { NOWORK, CAPTURE, DETACH, NULLREF } from "./effectTag";

export function pushError(fiber, hook, error) {
    let names = [];
    let effects = [];
    let boundary = findCatchComponent(fiber, names, effects);
    let stack = describeError(names, hook);
    Renderer.hasError = true;
    if (boundary) {
        fiber.effectTag = NOWORK;
        fiber.stateNode = {
            updater: fakeObject
        };
        // var a = {
        //     child: boundary.child
        // };
        // var effects = [];
        // detachFiber(a,effects );
        // console.log(effects, 222);
        boundary._children = boundary.child = null;
        boundary.effectTag *= CAPTURE;
        boundary.effects = effects;
        console.log(effects);
        boundary.errorInfo = [error, { ownerStack: stack }];
        Renderer.catchBoundary = boundary;
    } else {
        var p = fiber.return;
        for (var i in p._children) {
            if (p._children[i] == fiber) {
                fiber.type = noop;
            }
        }
        while (p) {
            p._hydrating = false;
            p = p.return;
        }
        if (!Renderer.catchError) {
            Renderer.catchError = error;
        }
    }
}

export function guardCallback(host, hook, args) {
    try {
        let fn = host[hook];
        if (hook == "componentWillUnmount") {
            host[hook] = noop;
        }
        if (fn) {
            return fn.apply(host, args);
        }
        return true;
    } catch (error) {
        pushError(get(host), hook, error);
    }
}

export function detachFiber(fiber, effects) {
    fiber.effectTag = DETACH;
    if (fiber.ref) {
        fiber.effectTag *= NULLREF;
    }
    fiber.disposed = true;
    effects.push(fiber);
    for (let child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects);
    }
}
export function applyCallback(host, hook, args) {
    var fiber = host._reactInternalFiber;
    fiber.errorHook = hook;
    let fn = host[hook];
    if (hook == "componentWillUnmount") {
        host[hook] = noop;
    }
    if (fn) {
        return fn.apply(host, args);
    }
    return true;

}
function describeError(names, hook) {
    let segments = [`**${hook}** method occur error `];
    names.forEach(function (name, i) {
        if (names[i + 1]) {
            segments.push("in " + name + " (created By " + names[i + 1] + ")");
        }
    });
    return segments.join("\n").trim();
}

/**
 * 此方法遍历医生节点中所有updater，收集沿途的标签名与组件名
 */
function findCatchComponent(topFiber, names, effects) {
    let instance,
        name,
        fiber = topFiber;
    for(var el = topFiber.return.child; el; el = el.sibling){
        detachFiber(el, effects);
        if(el == topFiber){
            break;
        }
    }
    if (!topFiber) {
        return;
    }
    while (fiber.return) {
        name = fiber.name;
        if (fiber.tag < 4) {
            names.push(name);
            instance = fiber.stateNode || {};
            if (instance.componentDidCatch) {
                if (fiber._isDoctor) {
                    fiber.effectTag = DETACH;
                    if (fiber.ref) {
                        fiber.effectTag *= NULLREF;
                    }
                    fiber.disposed = true;
                    effects.push(fiber);

                    /* var updater = instance.updater;
                    fiber.effectTag = NOWORK;//不要触发其他任务
                    updater.enqueueSetState = returnFalse;
                    guardCallback(instance, "componentWillUnmount", []);
                    updater.isMounted = returnFalse;
                    */
                } else if (fiber !== topFiber) {
                    return fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
        fiber = fiber.return;
    }
}
