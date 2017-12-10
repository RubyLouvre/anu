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
        //console.log(updater.name,"执行"+ updater._states+" 状态");
        if (updater._disposed) {
            continue;
        }
        var doctor = Refs.doctor;
        if (doctor) {
            var isCreateRejectQueue = doctor === updater || !queue.length;
            //console.log("isCreateRejectQueue", isCreateRejectQueue);
            //如果出错组件是在resolved过，那么进行busy模式，即让调度器继续跑，直接它遇到自己
            //这时就会构建与插入错误列队
            var errorUpdater = Refs.errorUpdater;
            //如果是在receiveHook中发生错误，那么进入lazy模式，让调度器空转
            var isResolved = errorUpdater.isMounted()|| isCreateRejectQueue; //
            /**
 * 没有mounted时，碰到第一个医生节点，那么在医生之点构建错误列队 rejectQueue.concat(updater).concat(catchDoctor)
 * 否则 updater rejectQueue.concat(catchDoctor)
 */
            console.log("isResolved", isCreateRejectQueue, errorUpdater._receiving,  errorUpdater.isMounted(), queue.map(function(el){
                return el.name;
            }));
            if (isResolved) {
                // if (isCreateRejectQueue ) {
                // console.log("开始构建错误列队", updater.name);
                var rejectedQueue = []; //收集要销毁的组件（要求必须resolved）
                for (var i in doctor.children) {
                    var child = doctor.children[i];
                    disposeVnode(child, rejectedQueue, true);
                }
                // 错误列队的钩子如果发生错误，如果还没有到达医生节点，它的出错会被忽略掉，
                // 详见CompositeUpdater#catch()与ErrorBoundary#captureError()中的Refs.ignoreError开关
                doctor.children = {};
                doctor.addState("catch");
                if (!errorUpdater.isMounted() && updater == doctor) {
                    //让其他先执行
                    rejectedQueue.push(doctor);
                    updater = placehoder;
                }

                rejectedQueue.push(doctor);
               
    
                // console.log(rejectedQueue.concat());
                delete Refs.doctor;
                queue = rejectedQueue.concat(queue);
                // queue.unshift.apply(queue, rejectedQueue);
                // }
            } else {
                // if (!isCreateRejectQueue) {
                continue; //调度器空转时不执行updater
                // }
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
