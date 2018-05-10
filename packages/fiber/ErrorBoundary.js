import { noop, get } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { fakeObject } from "react-core/Component";
import { NOWORK, CAPTURE, DETACH, NULLREF } from "./effectTag";

export function pushError(fiber, hook, error) {
    let boundary = findCatchComponent(fiber, hook, error);
    if (boundary) {
        fiber.effectTag = NOWORK;
        // let inst = fiber.stateNode;
        if (fiber.hasMounted) {
            //已经插入
        } else {
            fiber.stateNode = {
                updater: fakeObject,
            };
        }

    } else {
        let p = fiber.return;
        for (let i in p.children) {
            if (p.children[i] == fiber) {
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
        return applyCallback(host, hook, args);
    } catch (error) {
        pushError(get(host), hook, error);
    }
}

export function applyCallback(host, hook, args) {
    let fiber = host._reactInternalFiber;
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


function findCatchComponent(fiber, hook, error) {
    let instance,
        name,
        names = [],
        topFiber = fiber, retry,
        boundary;
    while (fiber) {
        name = fiber.name;
        if (fiber.tag < 4) {
            names.push(name);
            instance = fiber.stateNode || {};
            if (instance.componentDidCatch && !boundary) {
                //boundary不能等于出错组件，不能已经处理过错误
                if (!fiber.hasCatch && topFiber !== fiber) {
                    boundary = fiber;
                } else if (fiber.hasCatch) {
                    //防止被去重
                    retry = Object.assign({}, fiber);

                    retry.effectTag = DETACH;
                    retry.disposed = true;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }

        fiber = fiber.return;

        if (boundary) {
            let boundaries = Renderer.boundaries;
            let stack = describeError(names, hook);
            let values = boundary.capturedValues || (boundary.capturedValues = []);
            values.push(error, {
                componentStack: stack
            });
            boundary.hasError = true;
            boundary.effectTag *= CAPTURE;
            boundaries.unshift(boundary);
            if (retry && retry !== boundary) {
                let arr = boundary.effects || (boundary.effects = []);
                arr.push(retry);
            }
            return boundary;
        }
    }
}

export function removeFormBoundaries(fiber) {
    delete fiber.hasError;
    let arr = Renderer.boundaries;
    let index = arr.indexOf(fiber);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

export function detachFiber(fiber, effects) {
    fiber.effectTag = DETACH;
  
    effects.push(fiber);
    if (fiber.ref && fiber.hasMounted) {
        fiber.effectTag *= NULLREF;
    }
    fiber.disposed = true;
    for (let child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects);
    }
}
