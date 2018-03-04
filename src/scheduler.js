import { options, clearArray, noop } from "./util";
import { Refs } from "./Refs";
import { disposeChildren } from "./dispose";

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
    let fiber;
    while ((fiber = queue.shift())) {
        // console.log(fiber.name, "执行" + fiber._states + " 状态");
        if (fiber._disposed) {
            continue;
        }
        var hook = Refs.errorHook;
        if (hook) {
            //如果存在医生节点
            var doctors = Refs.doctors,
                doctor = doctors[0],
                gotoCreateRejectQueue,
                addDoctor,
                silent; //2时添加disposed，1直接变成disposed
            switch (hook) {
            case "componentDidMount":
            case "componentDidUpdate":
            case "componentWillUnmount":
                //render之后出错，拖动最后才构建错误列队
                gotoCreateRejectQueue = queue.length === 0;
                silent = 2;
                break;
            case "render": //render出错，说明还没有执行render
            case "constructor":
            case "componentWillMount":
            case "componentWillUpdate":
            case "componentWillReceiveProps":
                //render之前出错，会立即构建错误列队，然后加上医生节点之上的列队
                gotoCreateRejectQueue = true;
                queue = queue.filter(function(el) {
                    return el._mountOrder < doctor._mountOrder;
                });
                silent = 1;
                addDoctor = true;
                break;
            }
            if (gotoCreateRejectQueue) {
                delete Refs.error;
                delete Refs.doctors;
                delete Refs.errorHook;
                var rejectedQueue = [];
                // 收集要销毁的组件（要求必须resolved）
                // 错误列队的钩子如果发生错误，如果还没有到达医生节点，它的出错会被忽略掉，
                // 详见CompositeUpdater#catch()与ErrorBoundary#captureError()中的Refs.ignoreError开关
                doctors.forEach(function(doctor){
                    disposeChildren(doctor._children,rejectedQueue, silent);
                    /* for (var i in doctor._children) {
                        var child = doctor._children[i];
                        disposeVnode(child, rejectedQueue, silent);
                    }*/
                    doctor._children = {};
                });
                // rejectedQueue = Array.from(new Set(rejectedQueue));
                doctors.forEach(function(doctor){
                    if (addDoctor) {
                        rejectedQueue.push(doctor);
                        fiber = placehoder;
                    }
                    doctor.addState("catch");
                    rejectedQueue.push(doctor);
                });
        
                queue = rejectedQueue.concat(queue);
            }
        }
        fiber.transition(queue);
    }

    options.afterPatch();
    var error = Refs.error;
    if (error) {
        delete Refs.error;
        throw error;
    }
}
