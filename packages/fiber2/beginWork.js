

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