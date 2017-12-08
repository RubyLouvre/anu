import { disposeVnode } from "./dispose";
import { Refs } from "./Refs";
import { noop } from "./util";

var catchHook = "componentDidCatch";
export function pushError(instance, hook, error) {
    var names = [];
    instance._hasError = true;
    var catchUpdater = findCatchComponent(instance, names);
    if (catchUpdater) {
        //移除医生节点下方的所有真实节点
        catchUpdater._hasCatch = [error, describeError(names, hook), instance];
        var u = instance.updater;
        u.hydrate = u.render = u.resolve = noop;
        var vnode = catchUpdater.vnode;
        catchUpdater.children = {};
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
        if (fn ) { //&& !instance._hasError
            return fn.apply(instance, args);
        }
        return true;
    } catch (error) {
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

/**
 * 此方法遍历医生节点中所有updater,将它们的exec方法禁用，并收集沿途的标签名与组件名
 */
function findCatchComponent(instance, names) {
    var target = instance.updater.vnode;
    do {
        var type = target.type;
        if (target.isTop) {
            disposeVnode(target, [], true);
            return;
        } else if (target.vtype > 1) {
            var name = type.displayName || type.name;
            names.push(name);
            var dist = target.stateNode;
            if (dist[catchHook]) {
                if (dist._hasTry) {
                    //治不好的医生要自杀
                    dist._hasError = false;
                    dist.updater.dispose();
                } else if (dist !== instance) {
                    var updater = dist.updater;
                    for (var i in updater.children) {
                        var child = updater.children[i];
                        disposeVnode(child, [], true);
                    }
                    //自已不能治愈自己
                    return updater; //移交更上级的医师处理
                }
            } 
        } else if (target.vtype === 1) {
            names.push(type);
        }
    } while ((target = target.return));
}
