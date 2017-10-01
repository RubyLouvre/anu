import {
    options,
    clearArray
} from "./util";

export const pendingRefs = [];
function clearRefs() {
    var refs = pendingRefs.slice(0);
    pendingRefs.length = 0;
    refs.forEach(function(fn) {
        fn();
    });
}
function callUpdate(updater, instance) {
    if (updater._lifeStage === 2) {
        if(pendingRefs.length){                
            clearRefs();
        }
        if (instance.componentDidUpdate) {
            updater._didUpdate = true;
            instance.componentDidUpdate(
                updater.lastProps,
                updater.lastState,
                updater.lastContext
            );
            if (!updater._renderInNextCycle) {
                updater._didUpdate = false;
            }
        }
        options.afterUpdate(instance);
        updater._lifeStage = 1;
    }
}

export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有refs方法（从上到下）
    clearRefs();
    //再执行所有mount/update钩子（从下到上）
    let i = 0;
    while(i < queue.length){//queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        var updater = queue[i], instance = updater._instance;
        i++;
        if (!updater._lifeStage) {
            if(pendingRefs.length){                
                clearRefs();
            }
            if (instance.componentDidMount) {
                instance.componentDidMount();
                instance.componentDidMount = null;
            }
            updater._lifeStage = 1;
            options.afterMount(instance);
        } else {
            callUpdate(updater, instance);
        }
        var ref = updater.nextVnode.ref;
        if (ref) {
            ref(instance.__isStateless ? null: instance);
        }
        updater._hydrating = false; //子树已经构建完毕
        while (updater._renderInNextCycle) {
            options.refreshComponent(updater, queue);
            callUpdate(updater, instance);
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

//有一个列队， 先放进A组件与A组件回调
var dirtyComponents = [];
dirtyComponents.isChildProcess = true;

function mountSorter(u1, u2) {//让子节点先于父节点执行
    return u2._mountOrder - u1._mountOrder;
}

options.flushUpdaters = function(queue) {
    if (!queue) {
        queue = dirtyComponents;
    }
    drainQueue(queue);
};

options.enqueueUpdater = function(updater) {
    if (dirtyComponents.indexOf(updater) == -1) {
        dirtyComponents.push(updater);
    }
};