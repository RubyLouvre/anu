import { disposeVnode } from "./dispose";
import { Refs } from "./Refs";
import { noop } from "./util";

export function pushError(instance, hook, error) {
    let names = [];
    let catchUpdater = findCatchComponent(instance, names);
    instance.updater._hasError = true;
    let stack = describeError(names, hook);
    if (catchUpdater) {
        disableHook(instance.updater); //禁止患者节点执行钩子
        catchUpdater.errorInfo = catchUpdater.errorInfo || [error, { componentStack: stack }, instance];
        if (!Refs.errorHook) {
            Refs.errorHook = hook;
            Refs.doctors = [catchUpdater];
        } else {
            if (Refs.doctors.indexOf(catchUpdater) === -1) {
                Refs.doctors.push(catchUpdater);
            }
        }

        delete catchUpdater.child;
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
    let segments = [`**${hook}** method occur error `];
    names.forEach(function (name, i) {
        if (names[i + 1]) {
            segments.push("in " + name + " (created By " + names[i + 1] + ")");
        }
    });
    return segments.join("\n").trim();
}
//让该组件不要再触发钩子
function disableHook(u) {
    u.hydrate = u.render = u.resolve = noop;
}
/**
 * 此方法遍历医生节点中所有updater，收集沿途的标签名与组件名
 */
function findCatchComponent(target, names) {
    let fiber = target.updater,
        instance,
        name,
        catchIt;
    do {
        name = fiber.name;
        if (fiber.name === "AnuInternalFiber") {
            if (catchIt) {
                return catchIt;
            }
            disposeVnode(fiber, [], true);
            break;
        } else if (fiber.tag < 4) {//1,2
            names.push(name);
            instance = fiber.stateNode;
            if (instance.componentDidCatch) {
                if (fiber._isDoctor) {
                    disableHook(fiber);
                } else if (!catchIt && target !== instance) {
                    catchIt = fiber;
                }
            }
        } else if (fiber.tag === 5) {
            names.push(name);
        }
    } while ((fiber = fiber.return));
}
