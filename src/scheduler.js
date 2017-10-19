import { options, clearArray } from "./util";
import { Refs } from "./Refs";

export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有refs方法（从上到下）
    Refs.clearRefs(); //假如一个组件实例也没有，也要把所有元素虚拟DOM的ref执行

    let needSort = [],
        unique = {}, updater;
    while ((updater = queue.shift())) {
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }

        if (!unique[updater._mountOrder]) {
            unique[updater._mountOrder] = 1;
            needSort.push(updater);
        }
        Refs.clearRefs();
        updater._didUpdate = updater._lifeStage === 2;
        updater._didHook(); //执行所有mount/update钩子（从下到上）
        updater._lifeStage = 1;
        updater._hydrating = false;
        if (!updater._renderInNextCycle) {
            updater._didUpdate = false;
        }
        updater._ref(); //执行组件虚拟DOM的ref
        //如果组件在componentDidMount中调用setState
        if (updater._renderInNextCycle) {
            options.patchComponent(updater, queue);
        }
    }
    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    needSort.sort(mountSorter).forEach(function(updater) {
        clearArray(updater._pendingCallbacks).forEach(function(fn) {
            fn.call(updater._instance);
        });
    });
    options.afterPatch();
}

var dirtyComponents = [];
function mountSorter(u1, u2) {
    //按文档顺序执行
    return u1._mountOrder - u2._mountOrder;
}

options.flushUpdaters = function(queue) {
    if (!queue) {
        queue = clearArray(dirtyComponents);
        if (queue.length) {
            queue.sort(mountSorter);
        }
    }
    drainQueue(queue);
};

options.enqueueUpdater = function(updater) {
    if (dirtyComponents.indexOf(updater) == -1) {
        dirtyComponents.push(updater);
    }
};
