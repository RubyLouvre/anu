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
    _disposed: true
};
export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有元素虚拟DOMrefs方法（从上到下）
    let updater;
    while ((updater = queue.shift())) {
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }

        var doctor = Refs.doctor;
        if (doctor) {
            queue.unshift(updater); //如果发生错误时，调度器已经将upater shift出来，那么需要再吞回去（unshift）
            /**
             * 当一个组件在componentDidMount出错时，其实整个列队也在执行componentDidMount,
             * 这样让它们都执行完componentDidMount，然后让它们都执行componentWillUnmount,
             * 这时这些钩子可能会出错，不用管它，最后将医生的componentDidCatch放进去救场
             */

            for (var i in doctor.children) {
                var child = doctor.children[i];
                disposeVnode(child, queue, true); //这里只清理虚拟/真实DOM，不执行钩子
            }
            doctor.children = {};
            var insertIndex = 0,
                quack;
            //构建错误列队
            for (var i = 0, el; (el = queue[i]); i++) {
                if (el === doctor) {
                    //只保留医生节点上方的组件
                    insertIndex = i;
                } else {
                    if (el._isQuack) {
                        queue[i] = placehoder;
                        quack = el;
                        delete el._isQuack;
                        continue;
                    }
                    //还没有来得及resolve的组件直接dispose
                    if (el && el.isMounted()) {
                        el._states = ["dispose"];
                    } else {
                        queue[i] = placehoder;
                    }
                }
            }
            queue.splice(insertIndex, 0, doctor);
            doctor.addState("catch");
            if (quack) {
                quack._states = ["dispose"];
                queue.unshift(quack);
            }
            delete Refs.doctor;
        } else {
            updater.transition(queue);
        }
    }

    options.afterPatch();
    var error = Refs.error;
    if (error) {
        delete Refs.error;
        throw error;
    }
}
