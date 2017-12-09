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

export function drainQueue(queue) {
    options.beforePatch();
    //先执行所有元素虚拟DOMrefs方法（从上到下）
    let updater;
    while ((updater = queue.shift())) {
        //queue可能中途加入新元素,  因此不能直接使用queue.forEach(fn)
        if (updater._disposed) {
            continue;
        }

        var catchError = Refs.catchError;
        if (catchError) {
            queue.unshift(updater); //如果发生错误时，调度器已经将upater shift出来，那么需要再吞回去（unshift）
            /**
             * 当一个组件在componentDidMount出错时，其实整个列队也在执行componentDidMount,
             * 这样让它们都执行完componentDidMount，然后让它们都执行componentWillUnmount,
             * 这时这些钩子可能会出错，不用管它，最后将医生的componentDidCatch放进去救场
             */

            //  delete updater.vnode.ref;
            for (var i in catchError.children) {
                var child = catchError.children[i];
                disposeVnode(child, queue, true); //这里只清理虚拟/真实DOM，不执行钩子
            }
            catchError.children = {};
            var catchIndex = 0;
            //var isResolve = catchError.catchHook ===mountedHook || catchError.catchHook === updatedHook;
            //构建错误列队
            for (var i = 0, el; (el = queue[i]); i++) {
                if (el === catchError) {
                    //只保留医生节点上方的组件
                    catchIndex = i;
                    break;
                } else {
                    //还没有来得及resolve的组件直接dispose，并且不执行ref

                    if (el && el.isMounted()) {
                        // delete el.vnode.ref;
                        el._states = ["dispose"];
                    } else {
                        queue[i] = {
                            _disposed: true
                        };
                    }
                }
            }

            queue.splice(catchIndex, 0, catchError);
            catchError.addState("catch");
            delete Refs.catchError;
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
