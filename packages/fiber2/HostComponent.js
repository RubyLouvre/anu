//  HostRoot, HostPortal ,HostComponent, HostText

export function updateHostComponent (alternate, fiber, type, renderExpirationTime) {
  pushHostContext(fiber)

  if (alternate === null) {
    tryToClaimNextHydratableInstance(fiber)
  }

  const nextProps = fiber.pendingProps
  const prevProps = alternate !== null ? alternate.memoizedProps : null

  let nextChildren = nextProps.children
  const isDirectTextChild = shouldSetTextContent(type, nextProps)

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also have access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    fiber.effectTag |= ContentReset
  }

  markRef(alternate, fiber)

  // Check the host config to see if the children are offscreen/hidden.
  if (renderExpirationTime !== Never && fiber.mode & ConcurrentMode && shouldDeprioritizeSubtree(type, nextProps)) {
    // Schedule this fiber to re-render at offscreen priority. Then bailout.
    fiber.expirationTime = Never
    return null
  }

  reconcileChildren(alternate, fiber, nextChildren, renderExpirationTime)
  return fiber.child
}

export function updateHostText (alternate, fiber) {
  if (alternate === null) {
    tryToClaimNextHydratableInstance(fiber)
  }
  // Nothing to do here. This is terminal. We'll do the completion step
  // immediately after.
  return null
}

function pushHostRootContext (fiber) {
  var instance = fiber.stateNode
  instance.__reactInternalMemoizedMergedChildContext = root.pendingContext || root.context

  if (root.pendingContext) {
    adjustContext(fiber, null, fiber.pendingContext !== fiber.context)
  } else if (root.context) {
    // Should always be set
    adjustContext(fiber, nullt, false)
  }
  pushHostContainer(fiber, fiber.containerInfo)
}
export function updateHostRoot (alternate, fiber, ctor, renderExpirationTime) {
  pushHostRootContext(fiber)
  const updateQueue = fiber.updateQueue
  const nextProps = fiber.pendingProps
  const prevState = fiber.memoizedState
  const prevChildren = prevState !== null ? prevState.element : null
  processUpdateQueue(fiber, updateQueue, nextProps, null, renderExpirationTime)
  const nextState = fiber.memoizedState
  // Caution: React DevTools currently depends on this property
  // being called "element".
  const nextChildren = nextState.element
  if (nextChildren === prevChildren) {
    // If the state is the same as before, that's a bailout because we had
    // no work that expires at this time.
    resetHydrationState()
    return bailoutOnAlreadyFinishedWork(alternate, fiber, renderExpirationTime)
  }
  const root = fiber.stateNode
  if ((alternate === null || alternate.child === null) && root.hydrate && enterHydrationState(fiber)) {
    // If we don't have any alternate children this might be the first pass.
    // We always try to hydrate. If this isn't a hydration pass there won't
    // be any children to hydrate which is effectively the same thing as
    // not hydrating.

    // This is a bit of a hack. We track the host root as a placement to
    // know that we're currently in a mounting state. That way isMounted
    // works as expected. We must reset this before committing.
    // TODO: Delete this when we delete isMounted and findDOMNode.
    fiber.effectTag |= Placement

    // Ensure that children mount into this root without tracking
    // side-effects. This ensures that we don't store Placement effects on
    // nodes that will be hydrated.
    fiber.child = mountChildFibers(fiber, null, nextChildren, renderExpirationTime)
  } else {
    // Otherwise reset hydration state in case we aborted and resumed another
    // root.
    reconcileChildren(alternate, fiber, nextChildren, renderExpirationTime)
    resetHydrationState()
  }
  return fiber.child
}

export function updateHostPortal (alternate, fiber, ctor, renderExpirationTime) {
  pushHostContainer(fiber, fiber.stateNode.containerInfo)
  const nextChildren = fiber.pendingProps
  if (current === null) {
    // Portals are special because we don't append the children during mount
    // but at commit. Therefore we need to track insertions which the normal
    // flow doesn't do during mount. This doesn't happen at the root because
    // the root always starts with a "current" with a null child.
    // TODO: Consider unifying this with how the root works.
    workInProgress.child = reconcileChildFibers(fiber, null, nextChildren, renderExpirationTime)
  } else {
    reconcileChildren(alternate, fiber, nextChildren, renderExpirationTime)
  }
  return workInProgress.child
}
