var NoEffect = /*              */ 0;
var PerformedWork = /*         */ 1;

// You can change the rest (and add more).
var Placement = /*             */ 2;
var Update = /*                */ 4;
var PlacementAndUpdate = /*    */ 6;
var Deletion = /*              */ 8;
var ContentReset = /*          */ 16;
var Callback = /*              */ 32;
var DidCapture = /*            */ 64;
var Ref = /*                   */ 128;
var Snapshot = /*              */ 256;
var Passive = /*               */ 512;

// Passive & Update & Callback & Ref & Snapshot
var LifecycleEffectMask = /*   */ 932;

// Union of all host effects
var HostEffectMask = /*        */ 1023;

var Incomplete = /*            */ 1024;
var ShouldCapture = /*         */ 2048;
import { getContextForSubtree } from './context';
function K (fn) {
    fn();
}
function ReactDOMRenderImpl (parentComponent, children, container, forceHydrate, callback) {
    var root = container._reactRootContainer, instance, exec = !root ? unbatchedUpdates : K;
    if (!root) {
        root = container._reactRootContainer = createReactRoot(container, forceHydrate);
    }
    exec(function () {
        instance = root.setState(children, callback, parentComponent);
    });
    return instance;
}

function createReactRoot (container, forceHydrate) {
    // shouldHydrate: 允许重用已有节点
    var shouldHydrate = forceHydrate ||
    (container.nodeType == 1 && container.getAttribute('data-reactroot'));
    if (!shouldHydrate) { // 不能重用已有节点，就将这个父节点下的所有孩子清空
        var rootSibling = void 0;
        while ((rootSibling = container.lastChild)) {
            container.removeChild(rootSibling);
        }
    }
    var isConcurrent = false; // 目前只能同步
    return new ReactRoot(container, isConcurrent, shouldHydrate);
}

function ReactRoot (container, isConcurrent, hydrate) {
    var root = createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
}
ReactRoot.prototype.setState = function (children, callback, parentInstance) {
    var root = this._internalRoot, fn = null, instance;
    if (typeof callback === 'function') {
        fn = function () {
            instance = root.child ? root.child.stateNode : null;
            callback.call(instance);
        };
    }
    updateContainer(children, root, parentInstance || null, fn);
    return instance;
};

function FiberNode (tag, pendingProps, key) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;
    this.timeoutHandle = noTimeout,
    this.pendingProps = pendingProps;
}
var HostRoot = 3;
function createContainer (containerInfo, isConcurrent, hydrate) {
    var fiber = new FiberNode(HostRoot, null, null, null);
    fiber.current = new FiberNode(HostRoot, null, null, null);
    fiber.containerInfo = containerInfo;
    fiber.stateNode = containerInfo;
    return fiber;
}
var originalStartTimeMs = Date.now();
var currentRendererTime = msToExpirationTime(originalStartTimeMs);
var currentSchedulerTime = currentRendererTime;
function requestCurrentTime () {
    return currentSchedulerTime;
}
var maxSigned31BitInt = 1073741823;

var NoWork = 0;
var Never = 1;
var Sync = maxSigned31BitInt;

var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = maxSigned31BitInt - 1;

// 1 unit of expiration time represents 10ms.
function msToExpirationTime (ms) {
    // Always add an offset so that we don't clash with the magic number for NoWork.
    return MAGIC_NUMBER_OFFSET - (ms / UNIT_SIZE | 0);
}
function computeExpirationForFiber (currentTime, fiber) {
    return currentTime;
}
function updateContainer (children, hostRoot, parentInstance, callback) {
    var current = hostRoot.current;
    var currentTime = requestCurrentTime();
    var expirationTime = computeExpirationForFiber(currentTime, current);
    return updateContainerAtExpirationTime(children, hostRoot, parentInstance, expirationTime, callback);
}

function updateContainerAtExpirationTime (children, hostRoot, parentInstance, expirationTime, callback) {
    // TODO: If this is a nested container, this won't be the root.
    var current = hostRoot.current;
    var context = getContextForSubtree(parentInstance);
    if (hostRoot.context === null) {
        hostRoot.context = context;
    } else {
        hostRoot.pendingContext = context;
    }
    return scheduleRootUpdate(current, children, expirationTime, callback);
}

var UpdateState = 1;

function createUpdate (expirationTime) {
    return {
        expirationTime: expirationTime,

        tag: UpdateState,
        payload: null,
        callback: null,

        next: null,
        nextEffect: null
    };
}
function scheduleRootUpdate (current, children, expirationTime, callback) {
    var update = createUpdate(expirationTime);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = {
        element: children
    };
    if (typeof callback === 'function') {
        update.callback = callback;
    }
    //  flushPassiveEffects()
    enqueueUpdate(current, update);
    scheduleWork(current, expirationTime); // setState, forceUpdate也走这方法
    return expirationTime;
}
function createUpdateQueue (baseState) {
    return [baseState];
}
function enqueueUpdate (fiber, update) {
    // Update queues are created lazily.
    var alternate = fiber.alternate;
    if (alternate) {
        var queue = alternate.updateQueue || createUpdateQueue(alternate.memoizedState);
        queue.push(update);
    }
    var queue1 = fiber.updateQueue || createUpdateQueue(fiber.memoizedState);
    queue1.push(update);
}
// 在anu中isRendering， isWorking， isCommitting合而为1 
var isRendering = false;
var nextRoot = null;
var noTimeout = -1;
function scheduleWork (fiber, expirationTime) {
    var root = scheduleWorkToRoot(fiber, expirationTime);
    if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit...
        !isRendering ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root) {
        var rootExpirationTime = root.expirationTime;
        requestWork(root, rootExpirationTime);
    }
}

function scheduleWorkToRoot (fiber, expirationTime) {

    // Update the source fiber's expiration time
    if (fiber.expirationTime < expirationTime) {
        fiber.expirationTime = expirationTime;
    }
    var alternate = fiber.alternate;
    if (alternate && alternate.expirationTime < expirationTime) {
        alternate.expirationTime = expirationTime;
    }
    // Walk the parent path to the root and update the child expiration time.
    var node = fiber.return;
    var root = null;
    if (node && fiber.tag === HostRoot) {
        root = fiber.stateNode;
    } else {
        while (node ) {
            alternate = node.alternate;
            if (node.childExpirationTime < expirationTime) {
                node.childExpirationTime = expirationTime;
                if (alternate && alternate.childExpirationTime < expirationTime) {
                    alternate.childExpirationTime = expirationTime;
                }
            } else if (alternate && alternate.childExpirationTime < expirationTime) {
                alternate.childExpirationTime = expirationTime;
            }
            if (node.return && node.tag === HostRoot) {
                root = node.stateNode;
                break;
            }
            node = node.return;
        }
    }

    return root;
}
var isBatchingUpdates = false;
export function batchedUpdates (fn, a) {
    const previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
        return fn(a);
    } finally {
        isBatchingUpdates = previousIsBatchingUpdates;
        if (!isBatchingUpdates && !isRendering) {
            performSyncWork();
        }
    }
}

function requestWork (root, expirationTime) {
    // 提高优先级，并加入列队
    addRootToSchedule(root, expirationTime);
    if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
        return;
    }
    if (isBatchingUpdates) {
    // Flush work at the end of the batch.
        if (isUnbatchingUpdates) {
            performWorkOnRoot(root, Sync, false);
        }
        return;
    }

    if (expirationTime === Sync) {
    // 选出优先级最高的root
        performSyncWork();
    } else {
    //  scheduleCallbackWithExpirationTime(root, expirationTime)
    }
}

var roots = [];
function addRootToSchedule (currentRoot, expirationTime) {
    for (let i = 0, root; root = roots[i++];) {
        if (root === currentRoot) {
            // 提高优先级
            if (expirationTime > currentRoot.expirationTime) {
                currentRoot.expirationTime = expirationTime;
            }
            return;
        }
    }
    roots.push(currentRoot);
}
// 将最高优先级的根挑出来
function findHighestPriorityRoot () {
    let highestPriorityWork = NoWork;
    let highestPriorityRoot = null;
    for (let i = 0, root; root = roots[i++];) {
        let remainingExpirationTime = root.expirationTime;
        if (remainingExpirationTime > highestPriorityWork) {
            // Update the priority, if it's higher
            highestPriorityWork = remainingExpirationTime;
            highestPriorityRoot = root;
        }
    }
    return [highestPriorityRoot, highestPriorityWork];
}
// 同步处理多个root
function performSyncWork () {
    performWork(Sync, false);
}
// 处理多个root
function performWork (minExpirationTime, isYieldy) {
    // Keep working on roots until there's no more work, or until there's a higher
    // priority event.
    var [nextFlushedRoot, nextFlushedExpirationTime] = findHighestPriorityRoot();
    while (nextFlushedRoot !== null && nextFlushedExpirationTime !== NoWork && minExpirationTime <= nextFlushedExpirationTime) {
        performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false)
        ;[nextFlushedRoot, nextFlushedExpirationTime] = findHighestPriorityRoot();
    }
}
// 只处理一个root
function performWorkOnRoot (root, expirationTime, isYieldy) {
    isRendering = true;
    var finishedWork = root.finishedWork;
    if (finishedWork !== null) {
    // This root is already complete. We can commit it.
        commitRoot(root, finishedWork, expirationTime);
    } else {
        root.finishedWork = null;
        // timeoutHandle可能为undefined, -1, 12123, 
        var timeoutHandle = root.timeoutHandle;
        if (timeoutHandle > noTimeout) {
            root.timeoutHandle = noTimeout;
            clearTimeout(timeoutHandle);
        }
        renderRoot(root, isYieldy);
        finishedWork = root.finishedWork;
        if (finishedWork !== null) {
            // We've completed the root. Commit it.
            commitRoot(root, finishedWork, expirationTime);
        }
    }
    isRendering = false;
}
function renderRoot (root, isYieldy) {
    isWorking = true;
    var nextUnitOfWork;
    if (roots.indexOf(root) == -1) {
        nextUnitOfWork = createAlternate(root.current, null);
    }

    do {
        try {
            workLoop(nextUnitOfWork, isYieldy);
        } catch (thrownValue) {
            console.log('thrownValue', thrownValue);
        }
        break;
    } while (true);

    // We're done performing work. Time to clean up.
    isWorking = false;
    var finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
}

function workLoop (nextUnitOfWork, isYieldy) {
    // Flush work without yielding
    while (nextUnitOfWork !== null) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
}

function createAlternate (current, pendingProps) {
    var alternate = current.alternate;
    if (!alternate) {
        alternate = Object.assign({}, current);
        alternate.__proto__ = FiberNode;
        alternate.alternate = current;
        current.alternate = alternate;
    } else {
        alternate.pendingProps = pendingProps;

        // We already have an alternate.
        // Reset the effect tag.
        alternate.effectTag = NoEffect;

        // The effect list is no longer valid.
        alternate.nextEffect = null;
        alternate.firstEffect = null;
        alternate.lastEffect = null;
    }

    return alternate;
}

function performUnitOfWork (fiber) {
    var current = fiber.alternate;
    var next = void 0;
    next = beginWork(current, fiber);
    fiber.memoizedProps = fiber.pendingProps;
    // 如果当前fiber的第一个孩子不存在，那么就需要返回它的兄弟或它的父节点的兄弟
    if (next === null || next === void 0) {
        next = completeUnitOfWork(fiber);
    }
    return next;
}

function completeUnitOfWork (fiber) {
    // Attempt to complete the current unit of work, then move to the
    // next sibling. If there are no more siblings, return to the
    // parent fiber.
    while (true) {
    // The current, flushed, state of this fiber is the alternate.
    // Ideally nothing should rely on this, but relying on it here
    // means that we don't need an additional field on the work in
    // progress.
        var current = fiber.alternate;

        var returnFiber = fiber.return;
        var siblingFiber = fiber.sibling;

        if ((fiber.effectTag & Incomplete) === NoEffect) {

            // This fiber completed.
            // Remember we're completing this unit so we can find a boundary if it fails.
            nextUnitOfWork = fiber;

            nextUnitOfWork = completeWork(current, fiber, nextRenderExpirationTime);

            resetChildExpirationTime(fiber, nextRenderExpirationTime);

            if (nextUnitOfWork !== null) {
                // Completing this fiber spawned new work. Work on that next.
                return nextUnitOfWork;
            }

            if (returnFiber !== null &&
        // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect) {
                // Append all the effects of the subtree and this fiber onto the effect
                // list of the parent. The completion order of the children affects the
                // side-effect order.
                if (returnFiber.firstEffect === null) {
                    returnFiber.firstEffect = fiber.firstEffect;
                }
                if (fiber.lastEffect !== null) {
                    if (returnFiber.lastEffect !== null) {
                        returnFiber.lastEffect.nextEffect = fiber.firstEffect;
                    }
                    returnFiber.lastEffect = fiber.lastEffect;
                }

                // If this fiber had side-effects, we append it AFTER the children's
                // side-effects. We can perform certain side-effects earlier if
                // needed, by doing multiple passes over the effect list. We don't want
                // to schedule our own side-effect on our own list because if end up
                // reusing children we'll schedule this effect onto itself since we're
                // at the end.
                var effectTag = fiber.effectTag;
                // Skip both NoWork and PerformedWork tags when creating the effect list.
                // PerformedWork effect is read by React DevTools but shouldn't be committed.
                if (effectTag > PerformedWork) {
                    if (returnFiber.lastEffect !== null) {
                        console.log('Append2', getFiberName(returnFiber), !!fiber);

                        returnFiber.lastEffect.nextEffect = fiber;
                    } else {
                        console.log('Append1', getFiberName(returnFiber), !!fiber);

                        returnFiber.firstEffect = fiber;
                    }
                    returnFiber.lastEffect = fiber;
                }
            }

            if (siblingFiber !== null) {
                // If there is more work to do in this returnFiber, do that next.
                return siblingFiber;
            } else if (returnFiber !== null) {
                // If there's no more work in this returnFiber. Complete the returnFiber.
                fiber = returnFiber;
                continue;
            } else {
                // We've reached the root.
                return null;
            }
        } else {

            // This fiber did not complete because something threw. Pop values off
            // the stack without entering the complete phase. If this is a boundary,
            // capture values if possible.
            var next = unwindWork(fiber, nextRenderExpirationTime);
            // Because this fiber did not complete, don't reset its expiration time.

            if (next !== null) {

                // If completing this work spawned new work, do that next. We'll come
                // back here again.
                // Since we're restarting, remove anything that is not a host effect
                // from the effect tag.
                next.effectTag &= HostEffectMask;
                return next;
            }

            if (returnFiber !== null) {
                // Mark the parent fiber as incomplete and clear its effect list.
                returnFiber.firstEffect = returnFiber.lastEffect = null;
                returnFiber.effectTag |= Incomplete;
            }

            if (siblingFiber !== null) {
                // If there is more work to do in this returnFiber, do that next.
                return siblingFiber;
            } else if (returnFiber !== null) {
                // If there's no more work in this returnFiber. Complete the returnFiber.
                fiber = returnFiber;
                continue;
            } else {
                return null;
            }
        }
    }

    // Without this explicit null return Flow complains of invalid return type
    // TODO Remove the above while(true) loop
    // eslint-disable-next-line no-unreachable
    return null;
}
