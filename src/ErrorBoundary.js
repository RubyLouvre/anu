import { disposeVnode } from "./dispose";
import { Refs } from "./Refs";
import { noop, catchHook, disposeHook } from "./util";

export function pushError(instance, hook, error) {
    var names = [];
    instance.updater._hasError = true;
    var catchUpdater = findCatchComponent(instance, names);
    if (catchUpdater) {
        disableHook(instance.updater); //禁止患者节点执行钩子
        catchUpdater._hasCatch = [error, describeError(names, hook), instance];
        catchUpdater.errHook = hook;
        var vnode = catchUpdater.vnode;
        delete vnode.child;
        delete catchUpdater.pendingVnode;
        Refs.catchError = catchUpdater;
    } else {
        //不做任何处理，遵循React15的逻辑
        console.warn(describeError(names, hook)); // eslint-disable-line
        throw error;
    }
}
export function captureError(instance, hook, args) {
    try {
        var fn = instance[hook];
        if (fn) {
            return fn.apply(instance, args);
        }
        return true;
    } catch (error) {
        if (!instance.updater.isMounted()) {
            //患者组件回收时不再触发此钩子
            instance[disposeHook] = noop;
        }
        pushError(instance, hook, error);
    }
}
function describeError(names, hook) {
    return (
        hook +
        " occur error in " +
        names
            .map(function(componentName) {
                return "<" + componentName + " />";
            })
            .join(" created By ")
    );
}
//让该组件不要再触发钩子
function disableHook(u){
    u.hydrate = u.render = u.resolve = noop;
}
/**
 * 此方法遍历医生节点中所有updater,将它们的exec方法禁用，并收集沿途的标签名与组件名
 */
function findCatchComponent(target, names) {
    var vnode = target.updater.vnode,
        instance,
        updater,
        type,
        name;
    do {
        type = vnode.type;
        if (vnode.isTop) {
            disposeVnode(vnode, [], true);
            return;
        } else if (vnode.vtype > 1) {
            name = type.displayName || type.name;
            names.push(name);
            instance = vnode.stateNode;
            if (instance[catchHook]) {
                updater = instance.updater;
                if (updater._hasTry) {
                    disableHook(updater);
                    updater.children = {};
                } else if (target !== instance) {
                    console.log("找到医生", updater.name);
                    return updater; //移交更上级的医师处理
                }
            }
        } else if (vnode.vtype === 1) {
            names.push(type);
           
        }
    } while ((vnode = vnode.return));
}
