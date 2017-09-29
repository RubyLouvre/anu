import {
    options,
    clearArray,
} from "./util";

export const pendingRefs = [];
function clearRefs() {
    var refs = pendingRefs.slice(0);
    pendingRefs.length = 0;
    refs.forEach(function(fn) {
        fn();
    });
}
function callUpdate(instance) {
    if (instance.__lifeStage === 2) {
        if(pendingRefs.length){                
            clearRefs();
        }
        if (instance.componentDidUpdate) {
            instance.__didUpdate = true;
            instance.componentDidUpdate(
                instance.lastProps,
                instance.lastState,
                instance.lastContext
            );
            if (!instance.__renderInNextCycle) {
                instance.__didUpdate = false;
            }
        }
        options.afterUpdate(instance);
        instance.__lifeStage = 1;
    }
}

export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有refs方法（从上到下）
    clearRefs();
    //再执行所有mount/update钩子（从下到上）
    let i = 0;
    while(i < queue.length){//queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        var instance = queue[i];
        i++;
        if (!instance.__lifeStage) {
            if(pendingRefs.length){                
                clearRefs();
            }
            if (instance.componentDidMount) {
                instance.componentDidMount();
                instance.componentDidMount = null;
            }
            instance.__lifeStage = 1;
            options.afterMount(instance);
        } else {
            callUpdate(instance);
        }
        var ref = instance.__current.ref;
        if (ref) {
            ref(instance.__isStateless ? null: instance);
        }
        instance.__hydrating = false; //子树已经构建完毕
        while (instance.__renderInNextCycle) {
            options.refreshComponent(instance, queue);
            callUpdate(instance);
        }
    }
    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    queue.sort(mountSorter).forEach(function(instance){
        clearArray(instance.__pendingCallbacks).forEach(function(fn) {
            fn.call(instance);
        });
    });
    queue.length = 0;
    options.afterPatch();
}

//有一个列队， 先放进A组件与A组件回调
var dirtyComponents = [];
dirtyComponents.isChildProcess = true;

function mountSorter(c1, c2) {//让子节点先于父节点执行
    return c2.__mountOrder - c1.__mountOrder;
}

options.flushBatchedUpdates = function(queue) {
    if (!queue) {
        queue = dirtyComponents;
    }
    drainQueue(queue);
};

options.addTask = function(instance) {
    if (dirtyComponents.indexOf(instance) == -1) {
        dirtyComponents.push(instance);
    }
};