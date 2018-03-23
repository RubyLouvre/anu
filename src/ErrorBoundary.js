import { Refs } from "./Refs";
import { updateQueue } from "./share";
import { noop, get } from "./util";

export function pushError(instance, hook, error) {
    let names = [],
        fiber = get(instance);
    let catchFiber = findCatchComponent(fiber, names);
    let stack = describeError(names, hook);
    if (catchFiber) {
        disableEffect(fiber); //禁止患者节点执行钩子
        catchFiber.errorInfo = catchFiber.errorInfo || [ error, { componentStack: stack }, instance ];
        delete catchFiber._children;
        delete catchFiber.child;
        catchFiber.effectTag = 23;
        updateQueue.push(catchFiber);
    } else {
		console.warn(stack); // eslint-disable-line
        //如果同时发生多个错误，那么只收集第一个错误，并延迟到afterPatch后执行
        if (!Refs.error) {
            Refs.error = error;
        }
    }
}
export function captureError(instance, hook, args) {
    try {
        let fn = instance[hook];
        if (fn) {
            return fn.apply(instance, args);
        }
        return true;
    } catch (error) {
        if (hook === "componentWillUnmount") {
            instance[hook] = noop;
        }
        pushError(instance, hook, error);
    }
}
function describeError(names, hook) {
    let segments = [ `**${hook}** method occur error ` ];
    names.forEach(function(name, i) {
        if (names[i + 1]) {
            segments.push("in " + name + " (created By " + names[i + 1] + ")");
        }
    });
    return segments.join("\n").trim();
}
//让该组件不要再触发钩子
function disableEffect(fiber) {
    //它的所有孩子都不会执行操作
    if (fiber.stateNode) {
        fiber.stateNode.render = noop;
    }
    fiber.effectTag = 0;
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
        fiber = topFiber,
        catchIt;
    do {
        name = fiber.name;
        if (!fiber.return) {
            if (catchIt) {
                return catchIt;
            }
            break;
        } else if (fiber.tag < 4) {
            //1,2
            names.push(name);
            instance = fiber.stateNode;
            if (instance.componentDidCatch) {
                if (instance.updater._isDoctor) {
                    disableEffect(fiber);
                } else if (!catchIt && fiber !== topFiber) {
                    catchIt = fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
    } while ((fiber = fiber.return));
}
