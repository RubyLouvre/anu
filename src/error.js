import { disposeVnode } from "./dispose";
import { removeElement } from "./browser";
import { Refs } from "./Refs";
var catchHook = "componentDidCatch";
export function pushError(instance, hook, error) {
    var names = [];
    instance._hasError = true;
    Refs.eraseElementRefs();
    var catchUpdater = findCatchComponent(instance, names);
    if( catchUpdater){        
        //移除医生节点下方的所有真实节点
        catchUpdater._hasCatch = [error, describeError(names, hook), instance];
        // todo!
        // var vnode = catchUpdater.vnode;
        // 清空医生节点的所有子孙节点（但不包括自己）
        // vnode.collectNodes().forEach(removeElement);
        // discontinue(vnode.child);
        // delete instance.updater.vnode.return.child;
        delete catchUpdater.pendingVnode;
        Refs.catchError = catchUpdater ;
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

function discontinue(vnode){
    if(!vnode){
        return; 
    }
    if(vnode.vtype > 1){
        captureError(vnode.stateNode, "componentWillUnmount",[]);
        vnode.stateNode._hasError = true;
    }
    discontinue(vnode.child);
    discontinue(vnode.sibling);
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
