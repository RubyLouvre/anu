import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

function hydrate(vdom, container, callback) {
    return legacyRenderSubtreeIntoContainer(
        null,
        vdom,
        container,
        true,
        callback,
    );
}
function render(vdom, container, callback) {
    return legacyRenderSubtreeIntoContainer(
        null,
        vdom,
        container,
        false,
        callback,
    );
}

function unstable_renderSubtreeIntoContainer(parentComponent,vdom, container, callback  ) {
    return legacyRenderSubtreeIntoContainer(
        parentComponent,
        vdom,
        container,
        false,
        callback,
    );
}


function unmountComponentAtNode(container) {
    if (container && container._reactRootContainer) {
        // Unmount should not be batched.
        unbatchedUpdates(() => {
            legacyRenderSubtreeIntoContainer(null, null, container, false, () => {
                container._reactRootContainer = null;
            });
        });
        return true;
    } else {
        return false;
    }
}


function legacyRenderSubtreeIntoContainer(
    parentComponent,
    children,
    container,
    forceHydrate,
    callback,
) {
    // TODO: Without `any` type, Flow says "Property cannot be accessed on any
    // member of intersection type." Whyyyyyy.
    let root = container._reactRootContainer;
    if (typeof callback === 'function') {
        const originalCallback = callback;
        callback = function() {
            const instance = getPublicRootInstance(root._internalRoot);
            originalCallback.call(instance);
        };
    }
    if (!root) {
        // Initial mount
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
            container,
            forceHydrate,
        );
       
        // Initial mount should not be batched.
        unbatchedUpdates(() => {
            if (parentComponent != null) {
                root.render(
                    parentComponent,
                    children,
                    callback,
                );
            } else {
                root.render(children, callback);
            }
        });
    } else {
        // Update
        if (parentComponent != null) {
            root.render(
                parentComponent,
                children,
                callback,
            );
        } else {
            root.render(children, callback);
        }
    }
    return getPublicRootInstance(root._internalRoot);
}

function legacyCreateRootFromDOMContainer( container,forceHydrate) {
    const shouldHydrate =
      forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
    // First clear any existing content.
    if (!shouldHydrate) {
        let rootSibling;
        while ((rootSibling = container.lastChild)) {
            container.removeChild(rootSibling);
        }
    }
    // Legacy roots are not async by default.
    const isConcurrent = false;
    return new ReactRoot(container, isConcurrent, shouldHydrate);
}

function ReactRoot(
    container,
    isConcurrent,
    hydrate,
) {
    const root = createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
    root.render = render;
}



function render(
    parentComponent,
    children,
    callback,
) {
    const root = this._internalRoot;
   
    callback = callback === undefined ? null : callback;
    updateContainer(children, root, parentComponent, callback);
}



export const ROOT_ATTRIBUTE_NAME = 'data-reactroot';

function shouldHydrateDueToLegacyHeuristic(container) {
    const rootElement = getReactRootElementInContainer(container);
    return !!(
        rootElement &&
      rootElement.nodeType === ELEMENT_NODE &&
      rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)
    );
}
const NoWork = 0;
const noTimeout = -1;

function createContainer(container, isConcurrent, hydrate){
    const uninitializedFiber = createHostRootFiber(isConcurrent);
    var fiber = {
        current: uninitializedFiber,
        containerInfo: container,
        pendingChildren: null,
  
        pingCache: null,
  
        earliestPendingTime: NoWork,
        latestPendingTime: NoWork,
        earliestSuspendedTime: NoWork,
        latestSuspendedTime: NoWork,
        latestPingedTime: NoWork,
  
        didError: false,
  
        pendingCommitExpirationTime: NoWork,
        finishedWork: null,
        timeoutHandle: noTimeout,
        context: null,
        pendingContext: null,
        hydrate,
        nextExpirationTimeToWorkOn: NoWork,
        expirationTime: NoWork,
        firstBatch: null,
        nextScheduledRoot: null,
    };
    uninitializedFiber.stateNode = fiber;
    return fiber;
    
}
function createHostRootFiber(isConcurrent) {
    var mode = isConcurrent ? ConcurrentMode | StrictMode : NoContext;
  
    return {
        tag: HostRoot,
        mode: mode,
        expirationTime: NoWork
    };
}
  
function updateContainer( vnode ,
    rootFiber,//fiber
    parentComponent,
    callback,
) {
    const current = rootFiber.current;
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, current);

    // TODO: If this is a nested container, this won't be the root.
    const fiber = rootFiber.current;
    const context = getContextForSubtree(parentComponent);
    if (rootFiber.context === null) {
        rootFiber.context = context;
    } else {
        rootFiber.pendingContext = context;
    }
  
    return scheduleRootUpdate(fiber, vnode, expirationTime, callback);
}

var maxSigned31BitInt = 1073741823;

var NoWork = 0;
var Never = 1;
var Sync = maxSigned31BitInt;

var UNIT_SIZE = 10;

// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms) {
    return 1073741822 - (ms / 10 | 0);
}


var originalStartTimeMs = new Date - 0;
var cacheTime = msToExpirationTime(originalStartTimeMs);
function recomputeCurrentRendererTime(){
    var currentTimeMs = Date.now() - originalStartTimeMs;
    cacheTime = msToExpirationTime(currentTimeMs);
    return cacheTime;
}
function requestCurrentTime(isRendering) {
    /*
调度程序调用requestCurrentTime来计算过期时间
时间。

过期时间是通过添加到当前时间(开始)来计算的
时间)。但是，如果在同一个事件中安排了两个更新，则我们
应该将它们的启动时间视为同步的，即使是实际的时钟
从第一次呼叫到第二次呼叫之间的时间已经提前了。

换句话说，因为过期时间决定了更新的批处理方式，
我们希望在同一事件中发生的所有类似优先级的更新
接收相同的过期时间。否则我们就会流泪。

我们跟踪两个独立的时间:当前的“呈现器”时间和
当前的“调度”时间。渲染器时间可以随时更新;它
只存在于最小化调用性能。
    */
    if (isRendering) {
        //我们已经开始渲染。返回最近读取的时间。
        return cacheTime;
    }
    // Check if there's pending work.
    var nextFlushedExpirationTime = findHighestPriorityRoot();
    if (nextFlushedExpirationTime === NoWork || nextFlushedExpirationTime === Never) {
        //   如果没有挂起的工作，或者挂起的工作不在屏幕上，我们可以
        //   阅读当前的时间，没有撕裂的风险。
        return recomputeCurrentRendererTime();
    }
    //  已经有正在工作的fiber。我们可能运行于浏览器的某些事件中，
    //  如果读取当前时间，可能会导致多次更新
    //  在同一事件中接收不同的过期时间，导致撕裂。返回最后一次读取时间。在下一次空闲回调期间
    //  时间将会更新。
    return cacheTime;
}

function scheduleRootUpdate(
    current,
    vnode,
    expirationTime,
    callback,
) {
    
    const update = createUpdate(expirationTime);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = {element:vnode};
  
    callback = callback === undefined ? null : callback;
    if (callback !== null) {
       
        update.callback = callback;
    }
  
    flushPassiveEffects();
    enqueueUpdate(current, update);
    scheduleWork(current, expirationTime);
  
    return expirationTime;
}
var nextRenderExpirationTime = NoWork;

function scheduleWork(fiber, expirationTime) {
    const root = scheduleWorkToRoot(fiber, expirationTime);
    if (root === null) {
        return;
    }
    if (
        !isWorking &&
		nextRenderExpirationTime !== NoWork &&
		expirationTime > nextRenderExpirationTime
    ) {
        resetStack();
    }
    markPendingPriorityLevel(root, expirationTime);
    if (
    //如果在准备阶段或commitRoot阶段或渲染另一个节点
        !isWorking ||
		isCommitting ||
		// ...unless this is a different root than the one we're rendering.
		nextRoot !== root
    ) {
        const rootExpirationTime = root.expirationTime;
        requestWork(root, rootExpirationTime);
    }
}

function scheduleWorkToRoot(fiber, expirationTime) {
    // Update the source fiber's expiration time
    if (fiber.expirationTime < expirationTime) {
        fiber.expirationTime = expirationTime;
    }
    var alternate = fiber.alternate;
    if (alternate !== null && alternate.expirationTime < expirationTime) {
        alternate.expirationTime = expirationTime;
    }
    // Walk the parent path to the root and update the child expiration time.
    var node = fiber.return;
    var root = null;
    if (node === null && fiber.tag === HostRoot) {
        root = fiber.stateNode;
    } else {
        while (node !== null) {
            alternate = node.alternate;
            if (node.childExpirationTime < expirationTime) {
                node.childExpirationTime = expirationTime;
                if (alternate !== null && alternate.childExpirationTime < expirationTime) {
                    alternate.childExpirationTime = expirationTime;
                }
            } else if (alternate !== null && alternate.childExpirationTime < expirationTime) {
                alternate.childExpirationTime = expirationTime;
            }
            if (node.return === null && node.tag === HostRoot) {
                root = node.stateNode;
                break;
            }
            node = node.return;
        }
    }
  
    return root;
}
  




function requestWork(root, expirationTime) {
    addRootToSchedule(root, expirationTime);
    if (isRendering) {
        // Prevent reentrancy. Remaining work will be scheduled at the end of
        // the currently rendering batch.
        return;
    }
  
    if (isBatchingUpdates) {//它没有走下面的逻辑，自己走performSyncWork
        // Flush work at the end of the batch.
        if (isUnbatchingUpdates) {
        // ...unless we're inside unbatchedUpdates, in which case we should
        // flush it now.
            nextFlushedRoot = root;
            nextFlushedExpirationTime = Sync;
            performWorkOnRoot(root, Sync, false);
        }
        return;
    }
  
    // TODO: Get rid of Sync and use current time?
    if (expirationTime === Sync) {
        performSyncWork();
    } else {
        scheduleCallbackWithExpirationTime(root, expirationTime);
    }
}
var roots = [];
function addRootToSchedule(root, expirationTime) {
    // Add the root to the schedule.
    // Check if this root is already part of the schedule.
    var inQueue = false;
    for (var i = 0,fiber; fiber = roots[i++];){
        if (fiber === root){
            const remainingExpirationTime = root.expirationTime;
            if (expirationTime > remainingExpirationTime) {
            // Update the priority.
                root.expirationTime = expirationTime;
            }
            inQueue = true;
            break;
        }
    }
    if (!inQueue){
        root.expirationTime = expirationTime;
        roots.push(root);
    }
}
  
function findHighestPriorityRoot() {
    var highestPriorityWork = NoWork;
    var highestPriorityFiber = null;
    for (var i = 0; i < roots.length; i++){
        var root = roots[i];
        if (root.expirationTime > highestPriorityWork){
            highestPriorityWork = root.expirationTime;
            highestPriorityFiber = root;
        }
    }
    nextFlushedRoot = highestPriorityFiber;
    return  nextFlushedExpirationTime = highestPriorityWork;

}


function performSyncWork() {
    performWork(Sync, false);
}
  
function performWork(minExpirationTime: ExpirationTime, isYieldy: boolean) {
    // Keep working on roots until there's no more work, or until there's a higher
    // priority event.
    findHighestPriorityRoot();
  
    if (isYieldy) {
        recomputeCurrentRendererTime();
        currentSchedulerTime = currentRendererTime;
  
        if (enableUserTimingAPI) {
            const didExpire = nextFlushedExpirationTime > currentRendererTime;
            const timeout = expirationTimeToMs(nextFlushedExpirationTime);
            stopRequestCallbackTimer(didExpire, timeout);
        }
  
        while (
            nextFlushedRoot !== null &&
        nextFlushedExpirationTime !== NoWork &&
        minExpirationTime <= nextFlushedExpirationTime &&
        !(didYield && currentRendererTime > nextFlushedExpirationTime)
        ) {
            performWorkOnRoot(
                nextFlushedRoot,
                nextFlushedExpirationTime,
                currentRendererTime > nextFlushedExpirationTime,
            );
            findHighestPriorityRoot();
            recomputeCurrentRendererTime();
            currentSchedulerTime = currentRendererTime;
        }
    } else {
        while (
            nextFlushedRoot !== null &&
        nextFlushedExpirationTime !== NoWork &&
        minExpirationTime <= nextFlushedExpirationTime
        ) {
            performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
            findHighestPriorityRoot();
        }
    }
  
    // We're done flushing work. Either we ran out of time in this callback,
    // or there's no more work left with sufficient priority.
  
    // If we're inside a callback, set this to false since we just completed it.
    if (isYieldy) {
        callbackExpirationTime = NoWork;
        callbackID = null;
    }
    // If there's work left over, schedule a new callback.
    if (nextFlushedExpirationTime !== NoWork) {
        scheduleCallbackWithExpirationTime(
            nextFlushedRoot,
            nextFlushedExpirationTime
        );
    }
  
    // Clean-up.
    // finishRendering();
}
var isRendering = false;
var cancelTimeout = clearTimeout;
function performWorkOnRoot(
    root,
    expirationTime,
    isYieldy,
) {

  
    isRendering = true;

    // Flush async work.
    let finishedWork = root.finishedWork;
    if (finishedWork !== null) {
        // This root is already complete. We can commit it.
        completeRoot(root, finishedWork, expirationTime);
    } else {
        root.finishedWork = null;
        // If this root previously suspended, clear its existing timeout, since
        // we're about to try rendering again.
        const timeoutHandle = root.timeoutHandle;
        if (timeoutHandle !== noTimeout) {
            root.timeoutHandle = noTimeout;
            // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
            cancelTimeout(timeoutHandle);
        }
        renderRoot(root, isYieldy);
        finishedWork = root.finishedWork;
        if (finishedWork !== null) {
            // We've completed the root. Check the if we should yield one more time
            // before committing.
            if ( !isYieldy ){
                completeRoot(root, finishedWork, expirationTime);
                isRendering = false;
                return;
            }

            if (!shouldYieldToRenderer()) {
                // Still time left. Commit the root.
                completeRoot(root, finishedWork, expirationTime);
            } else {
                // There's no time left. Mark this root as complete. We'll come
                // back and commit it later.
                root.finishedWork = finishedWork;
            }
        }
        
    }
  
    isRendering = false;
}
  


function renderRoot(root: FiberRoot, isYieldy: boolean): void {
    invariant(
        !isWorking,
        'renderRoot was called recursively. This error is likely caused ' +
        'by a bug in React. Please file an issue.',
    );
  
    flushPassiveEffects();
  
    isWorking = true;

    const expirationTime = root.nextExpirationTimeToWorkOn;
  
  
    nextUnitOfWork = createAlternate(
        nextRoot.current,
        null,
        nextRenderExpirationTime,
    );
    root.pendingCommitExpirationTime = NoWork;
  
     
    
  
  
    let didFatal = false;
  
  
    do {
        try {
            workLoop(isYieldy);
        } catch (thrownValue) {
            resetContextDependences();
            resetHooks();
  
            // Reset in case completion throws.
            // This is only used in DEV and when replaying is on.
            let mayReplay;
     
  
            if (nextUnitOfWork === null) {
                // This is a fatal error.
                didFatal = true;
                onUncaughtError(thrownValue);
            } else {
         
  
      
  
                const sourceFiber: Fiber = nextUnitOfWork;
                let returnFiber = sourceFiber.return;
                if (returnFiber === null) {
                    // This is the root. The root could capture its own errors. However,
                    // we don't know if it errors before or after we pushed the host
                    // context. This information is needed to avoid a stack mismatch.
                    // Because we're not sure, treat this as a fatal error. We could track
                    // which phase it fails in, but doesn't seem worth it. At least
                    // for now.
                    didFatal = true;
                    onUncaughtError(thrownValue);
                } else {
                    throwException(
                        root,
                        returnFiber,
                        sourceFiber,
                        thrownValue,
                        nextRenderExpirationTime,
                    );
                    nextUnitOfWork = completeUnitOfWork(sourceFiber);
                    continue;
                }
            }
        }
        break;
    } while (true);
  

    // We're done performing work. Time to clean up.
    isWorking = false;
    ReactCurrentOwner.currentDispatcher = null;
    resetContextDependences();
    resetHooks();
  
    // Yield back to main thread.
    if (didFatal) {
        const didCompleteRoot = false;
        interruptedBy = null;
 
        // `nextRoot` points to the in-progress root. A non-null value indicates
        // that we're in the middle of an async render. Set it to null to indicate
        // there's no more work to be done in the current batch.
        nextRoot = null;
        onFatal(root);
        return;
    }
  

  
    // We completed the whole tree.
    const didCompleteRoot = true;
    stopWorkLoopTimer(interruptedBy, didCompleteRoot);
    const rootWorkInProgress = root.current.alternate;
    invariant(
        rootWorkInProgress !== null,
        'Finished root should have a work-in-progress. This error is likely ' +
        'caused by a bug in React. Please file an issue.',
    );
  
    // `nextRoot` points to the in-progress root. A non-null value indicates
    // that we're in the middle of an async render. Set it to null to indicate
    // there's no more work to be done in the current batch.
    nextRoot = null;
    interruptedBy = null;
  
    if (nextRenderDidError) {
        // There was an error
        if (hasLowerPriorityWork(root, expirationTime)) {
        // There's lower priority work. If so, it may have the effect of fixing
        // the exception that was just thrown. Exit without committing. This is
        // similar to a suspend, but without a timeout because we're not waiting
        // for a promise to resolve. React will restart at the lower
        // priority level.
            markSuspendedPriorityLevel(root, expirationTime);
            const suspendedExpirationTime = expirationTime;
            const rootExpirationTime = root.expirationTime;
            onSuspend(
                root,
                rootWorkInProgress,
                suspendedExpirationTime,
                rootExpirationTime,
                -1, // Indicates no timeout
            );
            return;
        } else if (
        // There's no lower priority work, but we're rendering asynchronously.
        // Synchronsouly attempt to render the same level one more time. This is
        // similar to a suspend, but without a timeout because we're not waiting
        // for a promise to resolve.
            !root.didError &&
        isYieldy
        ) {
            root.didError = true;
            const suspendedExpirationTime = (root.nextExpirationTimeToWorkOn = expirationTime);
            const rootExpirationTime = (root.expirationTime = Sync);
            onSuspend(
                root,
                rootWorkInProgress,
                suspendedExpirationTime,
                rootExpirationTime,
                -1, // Indicates no timeout
            );
            return;
        }
    }
  
   
    // Ready to commit.
    onComplete(root, rootWorkInProgress, expirationTime);
}
  