import { hasContextChanged } from './oldContext';
import { resolveDefaultProps } from './newContext';

//引入各种组件
import { updateClassComponent } from './StatefulComponent';
import { updateFunctionComponent, updateMemoComponent, updateSimpleMemoComponent, updateForwardRef } from './StatelessComponent';
import { updateFragment, updateMode, updateProfiler } from './VirtualComponent';
import { updateHostComponent, updateHostText, updateHostRoot, updateHostPortal } from './HostComponent';
import { updateSuspenseComponent, mountLazyComponent } from './PlaceHolder';

export function beginWork (current, fiber, renderExpirationTime) {
    const updateExpirationTime = fiber.expirationTime;

    if (current !== null) {
        const oldProps = current.memoizedProps;
        const newProps = fiber.pendingProps;
        if (oldProps === newProps && !hasContextChanged(fiber) && updateExpirationTime < renderExpirationTime) {
            // This fiber does not have any pending work. Bailout without entering
            // the begin phase. There's still some bookkeeping we that needs to be done
            // in this optimized path, mostly pushing stuff onto the stack.
            switch (fiber.tag) {
                case HostRoot:
                    // 处理fiber的context
                    break;
                case HostComponent:
                    // 处理根节点的container

                    break;
                case ClassComponent: {
                    // 处理fiber的context
                    break;
                }
                case HostPortal:
                    // 处理根节点的container
                    break;
                case ContextProvider: {
                    // 处理fiber的context
                    break;
                }
                case SuspenseComponent:
                    break;
            }
            return bailoutOnAlreadyFinishedWork(current, fiber, renderExpirationTime);
        }
    }

    // Before entering the begin phase, clear the expiration time.
    fiber.expirationTime = NoWork;
    return updateAdapter[fiber.tag](alternate, fiber, fiber.type, updateExpirationTime, renderExpirationTime);
}
/*

export const FunctionComponent = 0
export const ClassComponent = 1
export const IndeterminateComponent = 2 // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5
export const HostText = 6
export const Fragment = 7
export const Mode = 8
export const ContextConsumer = 9
export const ContextProvider = 10
export const ForwardRef = 11
export const Profiler = 12
export const SuspenseComponent = 13
export const MemoComponent = 14
export const SimpleMemoComponent = 15
export const LazyComponent = 16

*/
var updateAdapter = {
    0: updateFunctionComponent,
    1: updateClassComponent,
    3: updateHostRoot,
    4: updateHostPortal,
    5: updateHostComponent,
    6: updateHostText,
    7: updateFragment,
    8: updateMode,
    9: updateClassComponent, // updateContextConsumer,
    10: updateClassComponent, // updateContextProvider,
    11: updateForwardRef,
    12: updateProfiler,
    13: updateSuspenseComponent,
    14: updateMemoComponent,
    15: updateSimpleMemoComponent,
    16: mountLazyComponent
};




