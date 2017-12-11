import { options, clearArray, noop } from "./util";
import { Refs } from "./Refs";
import { disposeVnode } from "./dispose";

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
        updater.addState("hydrate");
        updater._dirty = true;
        dirtyComponents.push(updater);
    }
}
var placehoder = {
    transition: noop
};
export function drainQueue(queue) {
    options.beforePatch();
    let updater;

    while ((updater = queue.shift())) {
        // console.log(updater.name, "执行" + updater._states + " 状态");
        if (updater._disposed) {
            continue;
        }
        var doctor = Refs.doctor;
        if (doctor) {
            var hook = Refs.errorHook,
                gotoCreateRejectQueue,
                addDoctor,
                silent; //2时添加disposed，1直接变成disposed
            switch (hook) {
            case "componentDidMount":
            case "componentDidUpdate":
            case "componentWillUnmount":
                gotoCreateRejectQueue = queue.length === 0;//拖到最后构建
                silent = 2;
                break;
            case "render":
            case "constructor":
            case "componentWillMount":
            case "componentWillUpdate":
            case "componentWillReceiveProps":
                gotoCreateRejectQueue = true;//立即构建
                queue = queue.filter(function(el){
                    return el._mountOrder < doctor._mountOrder;
                });
                //  queue.length = 0;
                silent = 1;
                addDoctor = true;
                break;
            }
            if (gotoCreateRejectQueue) {
                var rejectedQueue = [];
                console.log("开始构建错误列队", updater.name);
                //收集要销毁的组件（要求必须resolved）
                for (var i in doctor.children) {
                    var child = doctor.children[i];
                    disposeVnode(child, rejectedQueue, silent);
                }
                // 错误列队的钩子如果发生错误，如果还没有到达医生节点，它的出错会被忽略掉，
                // 详见CompositeUpdater#catch()与ErrorBoundary#captureError()中的Refs.ignoreError开关
                doctor.children = {};
                if (addDoctor) {
                    rejectedQueue.push(doctor);
                    updater = placehoder;
                }
                doctor.addState("catch");
                rejectedQueue.push(doctor);
                delete Refs.doctor;
                queue = rejectedQueue.concat(queue);
            }
        }
        updater.transition(queue);
    }

    options.afterPatch();
    var error = Refs.error;
    if (error) {
        delete Refs.error;
        throw error;
    }
}
