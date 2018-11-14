export function createContainer(
    containerInfo,
    isConcurrent,
    hydrate,
) {
    return createFiberRoot(containerInfo, isConcurrent, hydrate);
}


export function createFiberRoot(
    containerInfo,
    isConcurrent,
    hydrate,
) {
    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = {};
    let NoWork = 0;
    let noTimeout = 0;
    let root;

    root = {
        current: uninitializedFiber,
        containerInfo: containerInfo,
        pendingChildren: null,

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

    uninitializedFiber.stateNode = root;

    return root;
}

export function updateContainer(
    element,//children
    container,//root
    parentComponent,
    callback,
) {
    const current = container.current;
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, current);
    return updateContainerAtExpirationTime(
        element,
        container,
        parentComponent,
        expirationTime,
        callback,
    );
}

export function updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback
) {
    // TODO: If this is a nested container, this won't be the root.
    const current = container.current;
    const context = getContextForSubtree(parentComponent);
    if (container.context === null) {
        container.context = context;
    } else {
        container.pendingContext = context;
    }

    return scheduleRootUpdate(current, element, expirationTime, callback);
}

function getContextForSubtree(
    parentComponent
) {
    if (!parentComponent) {
        return emptyContextObject;
    }

    const fiber = ReactInstanceMap.get(parentComponent);
    const parentContext = findCurrentUnmaskedContext(fiber);

    if (fiber.tag === ClassComponent) {
        const Component = fiber.type;
        if (isLegacyContextProvider(Component)) {
            return processChildContext(fiber, Component, parentContext);
        }
    }

    return parentContext;
}
function scheduleRootUpdate(
    current,
    element,
    expirationTime,
    callback,
) {


    const update = createUpdate(expirationTime);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = { element };

    callback = callback === undefined ? null : callback;
    if (callback !== null) {

        update.callback = callback;
    }

    flushPassiveEffects();
    enqueueUpdate(current, update);
    scheduleWork(current, expirationTime);

    return expirationTime;
}
export function createUpdate(expirationTime) {
    return {
      expirationTime: expirationTime,
  
      tag: UpdateState,
      payload: null,
      callback: null,
  
      next: null,
      nextEffect: null,
    };
  }
  