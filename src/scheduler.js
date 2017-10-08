import {
    options,
    clearArray
} from "./util";
import {
    Refs
} from "./Refs";


function callUpdate(updater, instance) {
    Refs.clearRefs();
    if (updater._lifeStage === 2) {  
        updater._didUpdate = true;
        instance.componentDidUpdate();
        if (!updater._renderInNextCycle) {
            updater._didUpdate = false;
        }
        updater._lifeStage = 1;
        updater._hydrating = false;
        options.afterUpdate(instance);
    }
    updater._ref();
}

export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有refs方法（从上到下）
    Refs.clearRefs();
    //再执行所有mount/update钩子（从下到上）
    let i = 0;
    while(i < queue.length){//queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        var updater = queue[i], instance = updater._instance;
        i++;
        if (!updater._lifeStage) {
            Refs.clearRefs();
            instance.newStageAddedRefs = instance.newStageAddedRefs || {};
            if (instance.componentDidMount) {
                instance.componentDidMount();
                instance.componentDidMount = null;
            }
            updater._lifeStage = 1;
            updater._hydrating = false;
            updater._ref();
            options.afterMount(instance);
        } else {
            callUpdate(updater, instance);
        }
        //如果组件在componentDidMount中调用setState
        if (updater._renderInNextCycle) {
            options.refreshComponent(updater, queue);
            // callUpdate(updater, instance);
        }
    }
    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    queue.sort(mountSorter).forEach(function(updater){
        clearArray(updater._pendingCallbacks).forEach(function(fn) {
            fn.call(updater._instance);
        });
    });
    queue.length = 0;
    options.afterPatch();
}

var dirtyComponents = [];
function mountSorter(u1, u2) {//按文档顺序执行
    return u1._mountIndex - u2._mountIndex;
}

options.flushUpdaters = function(queue) {
    if (!queue) {
        queue = dirtyComponents;
        if(queue.length) {
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