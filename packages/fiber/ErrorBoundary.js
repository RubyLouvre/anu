import { noop, get } from "react-core/util";
import { Renderer } from "react-core/createRenderer";
import { NOWORK, CAPTURE, DETACH } from "./effectTag";

export function pushError(fiber, hook, error) {
    let names = [];

    let catchFiber = findCatchComponent(fiber, names);
    let stack = describeError(names, hook);
    if (catchFiber) {
        fiber.effectTag = NOWORK;
        fiber._hydrating = false;
        delete catchFiber._children;
        delete catchFiber.child;
        catchFiber.effectTag *= CAPTURE;
        //  disableEffect(fiber); // 禁止患者节点执行钩子
        catchFiber = Object.assign({}, catchFiber);
        catchFiber.effectTag = 1;
        catchFiber.stateNode.updater.enqueueSetState = function(a){
            console.log("=====",catchFiber.name);
            catchFiber._updates = {
                // pendingStates:[a]
            };
            catchFiber.stateNode.updater.enqueueSetState = Renderer.updateComponent;
        };
        Renderer.errors.push(catchFiber);
        
        catchFiber.errorInfo = catchFiber.errorInfo || [error, { ownerStack: stack }];
        // catchFiber.effectTag *= CAPTURE;
        Renderer.catchError = true;
    } else {

        var p = fiber.return;
        for(var i in p._children){
            if(p._children[i] == fiber){
                fiber.type = noop;
            }
        }
        
        while(p){
            p._hydrating = false;
            p = p.return;
        }
       
        // 如果同时发生多个错误，那么只收集第一个错误，并延迟到afterPatch后执行
        if (!Renderer.error) {
            Renderer.error = error;
        }
    }
}

export function guardCallback(host, hook, args, four) {
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
        let instance = four || host;
        pushError(get(instance), hook, error);
    }
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
// 让该组件不要再触发钩子
function disableEffect(fiber) {
    // 它的所有孩子都不会执行操作
    if (fiber.stateNode) {
        fiber.stateNode.render = noop;
    }
    fiber.effectTag = 1;
    for (var child = fiber.child; child; child = child.sibling) {
        disableEffect(fiber);
    }
}
/**
 * 此方法遍历医生节点中所有updater，收集沿途的标签名与组件名
 */
function findCatchComponent(topFiber, names) {
    let instance,
        name,
        fiber = topFiber;
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
                    console.log("它已经处理过一次了",fiber.effectTag);
                    //disableEffect(fiber);
                } else if ( fiber !== topFiber) {
                    console.log("又找了一个",fiber.name);
                    return fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
        fiber = fiber.return;
    }
}
