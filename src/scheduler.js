import { options, clearArray } from "./util";
import { Refs } from "./Refs";
var dirtyMap = {};
var currentQueue = [];
const dirtyComponents = [];
export const mainQueue = [currentQueue];
function mountSorter(u1, u2) {
    //按文档顺序执行
    return u1.host._mountOrder - u2.host._mountOrder;
}

export function flushUpdaters() {
    var first = mainQueue.shift();//dirtyComponent必须移除
    if (first && first.length) {
        dirtyMap = {};
        currentQueue = clearArray(first).sort(mountSorter);
        mainQueue.unshift(currentQueue);
        drainQueue();
    }
    if(!mainQueue.length){
        mainQueue.push(currentQueue);
    }
    currentQueue = mainQueue[0];
}


export function switchUpdaters(){
    if(currentQueue !== dirtyComponents){
        currentQueue = dirtyComponents;
        mainQueue.unshift(currentQueue);
    }
}

export function enqueueUpdater(updater) {
    if (!dirtyMap[updater._mountOrder]) {
        dirtyMap[updater._mountOrder] = 1;
        updater._dirty = true;
        dirtyComponents.push({
            host: updater,
            exec: updater.onUpdate
        });
    }
}

export function enqueueQueue(job) {
    currentQueue.push(job);
}


export function spwanChildQueue(cb) {
    if(currentQueue.length){
        currentQueue = [];
        mainQueue.unshift(currentQueue);
    }
  
    cb(currentQueue);
    if(currentQueue.length){
        drainQueue();
    }else if(mainQueue.length > 1){
        mainQueue.shift();
    }
    currentQueue = mainQueue[0];
}
export function drainQueue() {
    var queue = mainQueue[0];
    //如果父元素拥有多个子组件，如果第一个组件在mounted/updated钩子里再次更新父元素，
    //那么mainQueue可能没有子数组了，需要置换queue为currentQueue，执行里面的mounted/updated钩子
    if(!queue &&  currentQueue.length){
        queue = currentQueue;
    }
    options.beforePatch();
    //先执行所有元素虚拟DOMrefs方法（从上到下）
    Refs.clearElementRefs();
    let needSort = [],
        unique = {},
        job, updater;

    while( job = queue.shift() ){
        updater = job.host;
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }

        if (!unique[updater._mountOrder]) {
            unique[updater._mountOrder] = 1;
            needSort.push(job);
        }
        // currentQueue = queue;    
        // var command = job.exec === updater.onUpdate ? "update" : job.exec === updater.onEnd ? "end" : "receive";
        // console.log(updater.name, command,updater._hookName );
       
        job.exec.call(updater);
       
    }

    if (mainQueue.length > 1) {
        mainQueue.shift();
    }
    //再执行所有setState/forceUpdate回调，根据从下到上的顺序执行
    needSort.sort(mountSorter).forEach(function(job) {
        var updater = job.host;
        clearArray(updater._pendingCallbacks).forEach(function(fn) {
            fn.call(updater._instance);
        });
    });
    options.afterPatch();
    showError();
  
}
//mainQueue就是传送带，currentQueue或其他queue就是托运箱，job就是要加工的材料，exec是决定如何加工。
//在diffChildren有需要立即解决的任务，先进先出

var errIntance, errObject ,errMethod;
var catchHook = "componentDidCatch";
export function captureError(instance, hook, args) {
    try {
        var fn = instance[hook];
        if (fn) {
            return fn.apply(instance, args);
        }
        return true;
    } catch (e) {
        if(!errIntance){
            errIntance = instance;
            errMethod = hook;
            errObject = e;
        }
    }
}
export function showError() {
    if(errIntance){
        var instance = errIntance;
        errIntance = null;
        var names = [errMethod + " in "];
        do {
            names.push(instance.updater.name);
            if (instance[catchHook]) {
                return instance[catchHook](errObject, {
                    componentStack: names.join(" create By  ")
                });
            }
        } while ((instance = instance.updater.vnode._owner));
        throw errObject;
    }
}