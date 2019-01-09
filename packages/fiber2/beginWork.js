

expot function beginWork(
    current,
    fiber,
    renderExpirationTime,
) {
    const updateExpirationTime = fiber.expirationTime;
  
    if (current !== null) {
        const oldProps = current.memoizedProps;
        const newProps = fiber.pendingProps;
        if (
            oldProps === newProps &&
        !hasLegacyContextChanged() &&
        updateExpirationTime < renderExpirationTime
        ) {
        // This fiber does not have any pending work. Bailout without entering
        // the begin phase. There's still some bookkeeping we that needs to be done
        // in this optimized path, mostly pushing stuff onto the stack.
            switch (fiber.tag) {
                case HostRoot:
                    //处理fiber的context
                    break;
                case HostComponent:
                    //处理根节点的container

                    break;
                case ClassComponent: {
                    //处理fiber的context
                    break;
                }
                case HostPortal:
                    //处理根节点的container
                    break;
                case ContextProvider: {
                    //处理fiber的context
                    break;
                }
                case SuspenseComponent: 
                   
                    break;
            }
            return bailoutOnAlreadyFinishedWork(
                current,
                fiber,
                renderExpirationTime,
            );
        }
    }
  
    // Before entering the begin phase, clear the expiration time.
    fiber.expirationTime = NoWork;
  
    switch (fiber.tag) {
        case LazyComponent: {
            const elementType = fiber.elementType;
            return mountLazyComponent(
                current,
                fiber,
                elementType,
                updateExpirationTime,
                renderExpirationTime,
            );
        }
        case FunctionComponent: {
            const Component = fiber.type;
            const unresolvedProps = fiber.pendingProps;
            const resolvedProps =
          fiber.elementType === Component
              ? unresolvedProps
              : resolveDefaultProps(Component, unresolvedProps);
            return updateFunctionComponent(
                current,
                fiber,
                Component,
                resolvedProps,
                renderExpirationTime,
            );
        }
        case ClassComponent: {
            const Component = fiber.type;
            const unresolvedProps = fiber.pendingProps;
            const resolvedProps =
          fiber.elementType === Component
              ? unresolvedProps
              : resolveDefaultProps(Component, unresolvedProps);
            return updateClassComponent(
                current,
                fiber,
                Component,
                resolvedProps,
                renderExpirationTime,
            );
        }
        case HostRoot:
            return updateHostRoot(current, fiber, renderExpirationTime);
        case HostComponent:
            return updateHostComponent(current, fiber, renderExpirationTime);
        case HostText:
            return updateHostText(current, fiber);
        case SuspenseComponent:
            return updateSuspenseComponent(
                current,
                fiber,
                renderExpirationTime,
            );
        case HostPortal:
            return updatePortalComponent(
                current,
                fiber,
                renderExpirationTime,
            );
        case ForwardRef: {
            const type = fiber.type;
            const unresolvedProps = fiber.pendingProps;
            const resolvedProps =
          fiber.elementType === type
              ? unresolvedProps
              : resolveDefaultProps(type, unresolvedProps);
            return updateForwardRef(
                current,
                fiber,
                type,
                resolvedProps,
                renderExpirationTime,
            );
        }
        case Fragment:
            return updateFragment(current, fiber, renderExpirationTime);
        case ContextProvider:
            return updateContextProvider(
                current,
                fiber,
                renderExpirationTime,
            );
        case ContextConsumer:
            return updateContextConsumer(
                current,
                fiber,
                renderExpirationTime,
            );
        case MemoComponent: {
            const type = fiber.type;
            const unresolvedProps = fiber.pendingProps;
            // Resolve outer props first, then resolve inner props.
            let resolvedProps = resolveDefaultProps(type, unresolvedProps);
            resolvedProps = resolveDefaultProps(type.type, resolvedProps);
            return updateMemoComponent(
                current,
                fiber,
                type,
                resolvedProps,
                updateExpirationTime,
                renderExpirationTime,
            );
        }
        case SimpleMemoComponent: {
            return updateSimpleMemoComponent(
                current,
                fiber,
                fiber.type,
                fiber.pendingProps,
                updateExpirationTime,
                renderExpirationTime,
            );
        }
    }
}
  

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

function updateClassComponent(
    current,
    fiber,
    Component,
    nextProps,
    renderExpirationTime,
  ) {
    // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    let hasContext;
    if (isLegacyContextProvider(Component)) {
      hasContext = true;
      pushLegacyContextProvider(fiber);
    } else {
      hasContext = false;
    }
    prepareToReadContext(fiber, renderExpirationTime);
  
    const instance = fiber.stateNode;
    let shouldUpdate;
    if (instance === null) {
      if (current !== null) {
        // An class component without an instance only mounts if it suspended
        // inside a non- concurrent tree, in an inconsistent state. We want to
        // tree it like a new mount, even though an empty version of it already
        // committed. Disconnect the alternate pointers.
        current.alternate = null;
        fiber.alternate = null;
        // Since this is conceptually a new fiber, schedule a Placement effect
        fiber.effectTag |= Placement;
      }
      // In the initial pass we might need to construct the instance.
      constructClassInstance(
        fiber,
        Component,
        nextProps,
        renderExpirationTime,
      );
      mountClassInstance(
        fiber,
        Component,
        nextProps,
        renderExpirationTime,
      );
      shouldUpdate = true;
    } else {
      shouldUpdate = updateClassInstance(
        current,
        fiber,
        Component,
        nextProps,
        renderExpirationTime,
      );
    }
    const child = finishClassComponent(
      current,
      fiber,
      Component,
      shouldUpdate,
      hasContext,
      renderExpirationTime,
    );

    return child;
  }


  function constructClassInstance(fiber, ctor, props, renderExpirationTime) {
    var isLegacyContextConsumer = false;
    var unmaskedContext = emptyContextObject;
    var context = null;
    var contextType = ctor.contextType;
    if (Object( contextType ) === contextType ) {//React 16.7的static contextType
        context = readContext$1(contextType);
    } else {
        unmaskedContext = getUnmaskedContext(fiber, ctor, true);
        var contextTypes = ctor.contextTypes;
        isLegacyContextConsumer = contextTypes !== null && contextTypes !== undefined;
        context = isLegacyContextConsumer ? getMaskedContext(fiber, unmaskedContext) : emptyContextObject;
    }
    var instance = new ctor(props, context);
    fiber.memoizedState =  instance.state || null;
   // instance.updater = classComponentUpdater;
    fiber.stateNode = instance;
    if (typeof ctor.getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function') {
        instance.useReact16Hook = true
    }
    
    if (isLegacyContextConsumer) {
        cacheContext(fiber, unmaskedContext, context);
    }

    return instance;
}