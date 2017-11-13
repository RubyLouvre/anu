import { options, clearArray } from "./util";
import { Refs } from "./Refs";
import { showError } from "./error";

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
        updater.addJob("patch");
        updater._dirty = true;
        dirtyComponents.push(updater);
    }
}

export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有元素虚拟DOMrefs方法（从上到下）
    Refs.clearElementRefs();
    let needSort = [],
        unique = {},
        updater;
    var max = 99999;
    while ((updater = queue.shift())) {
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }
        if(--max < 100){
            break;
        }
        if (!unique[updater._mountOrder]) {
            unique[updater._mountOrder] = 1;
            needSort.push(updater);
        }
        updater.exec(queue);
    }
   
    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    needSort.sort(mountSorter).forEach(function(updater) {
        clearArray(updater._pendingCallbacks).forEach(function(fn) {
            fn.call(updater.instance);
        });
    });
    options.afterPatch();
    showError();
}
