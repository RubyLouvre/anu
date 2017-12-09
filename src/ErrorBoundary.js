import { disposeVnode } from "./dispose";
import { Refs } from "./Refs";
import { noop } from "./util";
import { catchHook, disposeHook } from "./CompositeUpdater";

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
        Refs.doctor = catchUpdater;
    } else {
        console.warn(describeError(names, hook)); // eslint-disable-line
        //如果同时发生多个错误，那么只收集第一个错误，并延迟到afterPatch后执行
        if(!Refs.error){
            Refs.error = error;
        }
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
 * 此方法遍历医生节点中所有updater，收集沿途的标签名与组件名
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
                if (updater._isDoctor) {
                    updater._isQuack = true;
                    disableHook(updater);
                } else if (target !== instance) {
                    return updater; //移交更上级的医师处理
                }
            }
        } else if (vnode.vtype === 1) {
            names.push(type);
           
        }
    } while ((vnode = vnode.return));
}
