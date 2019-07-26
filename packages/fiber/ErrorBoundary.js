import { noop, get } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { fakeObject } from "react-core/Component";
import {
    NOWORK,
    CAPTURE,
    DETACH
    //  NULLREF
} from "./effectTag";

export function pushError(fiber, hook, error) {
    let names = [];
    let boundary = findCatchComponent(fiber, names, hook);
    let stack = describeError(names, hook);
    if (boundary) {
        if (fiber.hasMounted) {
            //已经插入
        } else {
            fiber.stateNode = {
                updater: fakeObject
            };
            fiber.effectTag = NOWORK;
        }

        let values = boundary.capturedValues || (boundary.capturedValues = []);
        values.push(error, {
            componentStack: stack
        });
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
            Renderer.catchStack = stack;
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
    names.forEach(function(name, i) {
        if (names[i + 1]) {
            segments.push("in " + name + " (created By " + names[i + 1] + ")");
        }
    });
    return segments.join("\n\r").trim();
}

function findCatchComponent(fiber, names, hook) {
    let instance,
        name,
        topFiber = fiber,
        retry,
        boundary;
    while (fiber) {
        name = fiber.name;
        if (fiber.tag < 4) {
            names.push(name);
            instance = fiber.stateNode || {};

            if (instance.componentDidCatch && !boundary) {
                //boundary不能等于出错组件，不能已经处理过错误
                if (!fiber.caughtError && topFiber !== fiber) {
                    boundary = fiber;
                } else if (fiber.caughtError) {
                    retry = fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }

        fiber = fiber.return;
        if (boundary) {
            let boundaries = Renderer.boundaries;

            if (!retry || retry !== boundary) {
                var effectTag = boundary.effectTag;
                //防止被多次回滚
                //console.log("捕捉",boundary.name, hook);
                var f = boundary.alternate;
                if (f && !f.catchError) {
                    f.forward = boundary.forward;
                    f.sibling = boundary.sibling;
                    if (boundary.return.child == boundary) {
                        boundary.return.child = f;
                    }
                    boundary = f;
                }
                //防止被多次重置children, oldChildren, effectTag
                if (!boundary.catchError) {
                    if (
                        hook == "componentWillUnmount" ||
                        hook == "componentDidUpdate"
                    ) {
                        boundary.effectTag = CAPTURE;
                    } else {
                        boundary.effectTag = effectTag * CAPTURE;
                    }
                    //防止被重复添加
                    boundaries.unshift(boundary);
                    boundary.catchError = true;
                }

                //边界组件在没有componentDidCatch之前（以caughtError为标识），可以捕捉多个冒泡上来的组件
                if (retry) {
                    let arr = boundary.effects || (boundary.effects = []);
                    arr.push(retry);
                }
            }
            return boundary;
        }
    }
}

export function removeFormBoundaries(fiber) {
    delete fiber.catchError;
    let arr = Renderer.boundaries;
    let index = arr.indexOf(fiber);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

export function detachFiber(fiber, effects) {
    fiber.effectTag = DETACH;

    effects.push(fiber);

    fiber.disposed = true;
    for (let child = fiber.child; child; child = child.sibling) {
        detachFiber(child, effects);
    }
}
