import { options, clearArray } from "./util";
import { Refs } from "./Refs";

const dirtyComponents = [];
function mountSorter(u1, u2) {
    //按文档顺序执行
    u1._dirty = false;
    return u1._mountOrder - u2._mountOrder;
}
export function flushUpdaters() {
    if (dirtyComponents.length) {
        var currentQueue = clearArray(dirtyComponents).sort(mountSorter);
        currentQueue.forEach(function(el) {
            delete el._dirty;
        });
        drainQueue(currentQueue);
    }
}

export function enqueueUpdater(updater) {
    if (!updater._dirty) {
        updater.addJob("hydrate");
        updater._dirty = true;
        dirtyComponents.push(updater);
    }
}

export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有元素虚拟DOMrefs方法（从上到下）
    let updater;
    while ((updater = queue.shift())) {
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }
        updater.exec(queue);
        var catchError = Refs.catchError;
        if(catchError){
            delete Refs.catchError;
            //执行错误边界的didMount/Update钩子
            catchError.resolve(queue);
        }
    }

    options.afterPatch();
}
