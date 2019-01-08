function ReactDOMRenderImpl (parentComponent, children, container, forceHydrate, callback) {
    var root = container._reactRootContainer;
    if (!root) {
    // Initial mount
        root = container._reactRootContainer = createReactRoot(container, forceHydrate);
        unbatchedUpdates(function () {
            if (parentComponent != null) {
                root.setStateHasParent(parentComponent, children, callback);
            } else {
                root.setState(children, callback);
            }
        });
    } else {
    // Update
        if (parentComponent != null) {
            root.setStateHasParent(parentComponent, children, callback);
        } else {
            root.setState(children, callback);
        }
    }
    return getPublicRootInstance(root._internalRoot);
}

function createReactRoot (container, forceHydrate) {
    var shouldHydrate = forceHydrate ||
    (container.nodeType == 1 && container.getAttribute('data-reactroot'));
    if (!shouldHydrate) {
        var rootSibling = void 0;
        while ((rootSibling = container.lastChild)) {
            container.removeChild(rootSibling);
        }
    }
    // Legacy roots are not async by default.
    var isConcurrent = false;
    return new ReactRoot(container, isConcurrent, shouldHydrate);
}

function ReactRoot (container, isConcurrent, hydrate) {
    var root = createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
}
ReactRoot.prototype.setState = function (children, callback) {
    var root = this._internalRoot, fn = null, instance;
    if (typeof callback === 'function') {
        fn = function () {
            instance = root.child ? root.child.stateNode : null;
            callback.call(instance);
        };
    }
    updateContainer(children, root, null, fn);
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
function updateContainer (children, hostRoot, parentComponent, callback) {
    var current = hostRoot.current;
    var currentTime = requestCurrentTime();
    var expirationTime = computeExpirationForFiber(currentTime, current);
    return updateContainerAtExpirationTime(children, hostRoot, parentComponent, expirationTime, callback);
}

function updateContainerAtExpirationTime (element, hostRoot, parentComponent, expirationTime, callback) {
    // TODO: If this is a nested container, this won't be the root.
    var current = hostRoot.current;
    var context = getContextForSubtree(parentComponent);
    if (hostRoot.context === null) {
        hostRoot.context = context;
    } else {
        hostRoot.pendingContext = context;
    }
    return scheduleRootUpdate(current, element, expirationTime, callback);
}
function get (instance) {
    return instance._internalReactFiber;
}
function getContextForSubtree (parentComponent) {
    if (!parentComponent) {
        return {};
    }
    /*
    var fiber = get(parentComponent)
    var parentContext = findCurrentUnmaskedContext(fiber)

    if (fiber.tag === ClassComponent) {
      var Component = fiber.type
      if (isContextProvider(Component)) {
        return processChildContext(fiber, Component, parentContext)
      }
    }
  */
    return parentContext;
}
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
function scheduleRootUpdate (current, element, expirationTime, callback) {
    var update = createUpdate(expirationTime);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = {
        element: element
    };

    callback = callback === undefined ? null : callback;
    if (callback !== null) {
        update.callback = callback;
    }
    //  flushPassiveEffects()
    enqueueUpdate(current, update);
    scheduleWork(current, expirationTime);
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
//在anu中isRendering， isWorking， isCommitting合而为1 
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



function requestWork (root, expirationTime) {
    //提高优先级，并加入列队
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

    // TODO: Get rid of Sync and use current time?
    if (expirationTime === Sync) {
        //选出优先级最高的root
        var [highestPriorityRoot] = findHighestPriorityRoot();
        performWorkOnRoot(highestPriorityRoot,Sync, false );
    } else {
    //  scheduleCallbackWithExpirationTime(root, expirationTime)
    }
}

function performWorkOnRoot (root, expirationTime, isYieldy) {
    isRendering = true;
    var finishedWork = root.finishedWork;

    if (finishedWork !== null) {
    // This root is already complete. We can commit it.
        commitRoot(root, finishedWork, expirationTime);
    } else {
        root.finishedWork = null;
        //timeoutHandle可能为undefined, -1, 12123, 
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

var roots = [];
function addRootToSchedule (root, expirationTime) {
    for (var i = 0, el; el = roots[i++];) {
        if (el === root) {
            // 提高优先级
            if (expirationTime > root.expirationTime) {
                root.expirationTime = expirationTime;
            }
            return;
        }
    }
    roots.push(root);
}
function findHighestPriorityRoot() {
    let highestPriorityWork = NoWork;
    let highestPriorityRoot = null;
    for (let i = 0, root; root = roots[i++];){
        let remainingExpirationTime = root.expirationTime;
        if (remainingExpirationTime > highestPriorityWork) {
            // Update the priority, if it's higher
            highestPriorityWork = remainingExpirationTime;
            highestPriorityRoot = root;
        }
    }
    return [highestPriorityRoot, highestPriorityWork];
}