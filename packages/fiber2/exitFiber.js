


function bailoutOnAlreadyFinishedWork(alternate, fiber, renderExpirationTime) {
    // Check if the children have any pending work.
    var childExpirationTime = fiber.childExpirationTime;
    if (childExpirationTime < renderExpirationTime) {
        // The children don't have any work either. We can skip them.
        // TODO: Once we add back resuming, we should check if the children are
        // a work-in-progress set. If so, we need to transfer their effects.
        return null;
    } else {
        // This fiber doesn't have work, but its subtree does. Clone the child
        // fibers and continue.
        cloneChildFibers(alternate, fiber);
        return fiber.child;
    }
}

function cloneChildFibers(alternate, fiber) {
    var currentChild = fiber.child;
    if (currentChild === null) {
        return;
    }
    var newChild = createAlternate(currentChild, currentChild.pendingProps, currentChild.expirationTime);
    fiber.child = newChild;
    newChild.return = fiber;
    while (currentChild.sibling !== null) {
        currentChild = currentChild.sibling;
        newChild = newChild.sibling = createAlternate(currentChild, currentChild.pendingProps, currentChild.expirationTime);
        newChild.return = fiber;
    }
    newChild.sibling = null;
}



function finishClassComponent(alternate, fiber, Component, shouldUpdate, hasContext, renderExpirationTime) {
    // Refs should update even if shouldComponentUpdate returns false
    markRef(alternate, fiber);

    var didCaptureError = (fiber.effectTag & DidCapture) !== NoEffect;

    if (!shouldUpdate && !didCaptureError) {
        // Context providers should defer to sCU for rendering
           
        return bailoutOnAlreadyFinishedWork(alternate, fiber, renderExpirationTime);
    }

    var instance = fiber.stateNode;

    // Rerender
    // ReactCurrentOwner.current = fiber;
    var nextChildren = void 0;
    if (didCaptureError && typeof Component.getDerivedStateFromError !== 'function') {
        // If we captured an error, but getDerivedStateFrom catch is not defined,
        // unmount all the children. componentDidCatch will schedule an update to
        // re-render a fallback. This is temporary until we migrate everyone to
        // the new API.
        // TODO: Warn in a future release.
        nextChildren = null;

        
    } else {
        nextChildren = instance.render();
    }

    // React DevTools reads this flag.
    fiber.effectTag |= PerformedWork;
    if (current !== null && didCaptureError) {
        // 如果我们从错误中恢复过来，那么我们将不会复用现有的children,
        // 从概念上讲，正常的children与用于
        // 显示错误信息的children是两个没有交集的东西，即使它们的位置类型都一样，我们也不应该复用它们。

        fiber.child = reconcileChildFibers(fiber, curret.child, null, renderExpirationTime);
        fiber.child = reconcileChildFibers(fiber, null, nextChildren, renderExpirationTime);
    } else {
        reconcileChildren(current, fiber, nextChildren, renderExpirationTime);
    }

    // Memoize state using the values we just used to render.
    // TODO: Restructure so we never read values from the instance.
    fiber.memoizedState = instance.state;

    return fiber.child;
}
