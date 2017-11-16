import { disposeVnode } from "./dispose";
import { removeElement } from "./browser";

var catchHook = "componentDidCatch";
export function pushError(instance, hook, error) {
    var names = [];
    instance._hasError = true;
    var catchUpdater = findCatchComponent(instance, names);
    if( catchUpdater){        
        //console.log("发生错误 catch by", catchUpdater.name);// eslint-disable-line    
        catchUpdater._hasCatch = [error, describeError(names, hook), instance];
        catchUpdater.vnode.collectNodes().forEach(removeElement);
        delete catchUpdater.vnode.child;
        if( !catchUpdater._jobs.length ){
            catchUpdater.addJob("resolve");
            instance.updateQueue.unshift(catchUpdater);
        }
    }else{
        //不做任何处理，遵循React15的逻辑
        console.warn(describeError(names, hook));// eslint-disable-line
        let vnode = instance.updater.vnode,top;
        do{
            top = vnode;
            if(vnode.isTop){
                break;
            }
        }while((vnode = vnode.return));
        disposeVnode(top, true);  
        
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
function findCatchComponent(instance, names){
    var target = instance.updater.vnode;
    do {
        var type = target.type;
        if (target.isTop) {
            break;
        } else if (target.vtype > 1) {
            names.push(type.displayName || type.name);
            var dist = target.stateNode;
            if(dist[catchHook] ){
                if(dist._hasTry){//治不好的医生要自杀
                    dist._hasError = false;
                    disposeVnode(dist.updater.vnode);
                }else if(dist !== instance ){//自已不能治愈自己
                    return dist.updater;//移交更上级的医师处理
                }
            }
        } else if (target.vtype === 1) {
            names.push(type);
        }
    }while((target = target.return));

}
export function showError() {}
