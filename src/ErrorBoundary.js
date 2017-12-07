import { disposeVnode } from "./dispose";
import { removeElement } from "./browser";
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
        if (fn && !instance._hasError) {
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
function disconnectChildren(children) {
    for (var i in children) {
        var c = children[i];
        c && (c._hasRef = false);
        var node = c && c.stateNode;
        if(node){
            if(node.nodeType){
                removeElement(node);
            }else{
                node.updater.exec = noop;
            }
        }
    }
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
                    for(var i in  dist.updater.children){
                        var a = dist.updater.children[i];
                       
                        disposeVnode(a, [], true);
                    }
                    //自已不能治愈自己
                    //  disconnectChildren(dist.updater.children);
                    return dist.updater; //移交更上级的医师处理
                }
            }else{
                //  disconnectChildren(dist.updater.children);
            }//
        } else if (target.vtype === 1) {
            // disconnectChildren(target.updater.children);
            names.push(type);
        }
    } while ((target = target.return));
}
