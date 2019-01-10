

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
        nextProps );
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


  function constructClassInstance(fiber, ctor, props) {
    var isLegacyContextConsumer = false;
    var unmaskedContext = emptyContextObject;
    var context = null;
    var contextType = ctor.contextType;
    if (Object( contextType ) === contextType ) {//React 16.7的static contextType
        context = readContext(contextType);
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



function mountClassInstance(
    fiber,
    ctor,
    newProps,
    renderExpirationTime
  ) {

    const instance = fiber.stateNode;
    instance.props = newProps;
    instance.state = fiber.memoizedState;
    instance.refs = emptyRefsObject;
   
    let updateQueue = fiber.updateQueue;
    if (updateQueue !== null) {
      processUpdateQueue(
        fiber,
        updateQueue,
        newProps,
        instance,
        renderExpirationTime,
      );
      instance.state = fiber.memoizedState;
    }
   
    if(instance.useReact16Hook){
        const getDerivedStateFromProps = ctor.getDerivedStateFromProps;

        if (typeof getDerivedStateFromProps === 'function') {
            applyDerivedStateFromProps(
              fiber,
              ctor,
              getDerivedStateFromProps,
              newProps,
            );
            instance.state = fiber.memoizedState;
          }
    }else{
        callComponentWillMount(fiber, instance);
        // If we had additional state updates during this life-cycle, let's
        // process them now.
        updateQueue = fiber.updateQueue;
        if (updateQueue !== null) {
          processUpdateQueue(
            fiber,
            updateQueue,
            newProps,
            instance,
            renderExpirationTime,
          );
          instance.state = fiber.memoizedState;
        }
    }
    if (typeof instance.componentDidMount === 'function') {
      fiber.effectTag |= Update;
    }
  }


  function updateClassInstance(
    current,
    fiber,
    ctor,
    newProps,
    renderExpirationTime,
  ) {
    const instance = fiber.stateNode;
  
    const oldProps = fiber.memoizedProps;
    instance.props =
      fiber.type === fiber.elementType
        ? oldProps
        : resolveDefaultProps(fiber.type, oldProps);
  
    const oldContext = instance.context;
    const contextType = ctor.contextType;
    let nextContext;
    if (typeof contextType === 'object' && contextType !== null) {
      nextContext = readContext(contextType);
    } else {
      const nextUnmaskedContext = getUnmaskedContext(fiber, ctor, true);
      nextContext = getMaskedContext(fiber, nextUnmaskedContext);
    }
  
    var useReact16Hook = instance.useReact16Hook 
   
  
    // ComponentWillReceiveProps
    if (
      !useReact16Hook &&
      (typeof instance.UNSAFE_componentWillReceiveProps === 'function' ||
        typeof instance.componentWillReceiveProps === 'function')
    ) {
      if (oldProps !== newProps || oldContext !== nextContext) {
        callComponentWillReceiveProps(
          fiber,
          instance,
          newProps,
          nextContext,
        );
      }
    }
  
    resetHasForceUpdateBeforeProcessing();
  
    const oldState = fiber.memoizedState;
    let newState = (instance.state = oldState);
    let updateQueue = fiber.updateQueue;
    if (updateQueue !== null) {
      processUpdateQueue(
        fiber,
        updateQueue,
        newProps,
        instance,
        renderExpirationTime,
      );
      newState = fiber.memoizedState;
    }
   //设置effectTag
    if (typeof instance.componentDidUpdate === 'function') {
        if (
          oldProps !== current.memoizedProps ||
          oldState !== current.memoizedState
        ) {
          fiber.effectTag |= Update;
        }
      }
      if (typeof instance.getSnapshotBeforeUpdate === 'function') {
        if (
          oldProps !== current.memoizedProps ||
          oldState !== current.memoizedState
        ) {
          fiber.effectTag |= Snapshot;
        }
      }
  
    if (
      oldProps === newProps &&
      oldState === newState &&
      !hasContextChanged() &&
      !checkHasForceUpdateAfterProcessing()
    ) {
      // If an update was already in progress, we should schedule an Update
      // effect even though we're bailing out, so that cWU/cDU are called.
      return false;
    }
  
    if (typeof getDerivedStateFromProps === 'function') {
      applyDerivedStateFromProps(
        fiber,
        ctor,
        getDerivedStateFromProps,
        newProps,
      );
      newState = fiber.memoizedState;
    }
  
    const shouldUpdate =
      checkHasForceUpdateAfterProcessing() ||
      checkShouldComponentUpdate(
        fiber,
        ctor,
        oldProps,
        newProps,
        oldState,
        newState,
        nextContext,
      );
  
    if (shouldUpdate) {
      // In order to support react-lifecycles-compat polyfilled components,
      // Unsafe lifecycles should not be invoked for components using the new APIs.
      if (
        !hasNewLifecycles 
      ) {
        callComponentWillUpdate(instance, newProps, newState, nextContext )
      
      }
    } else {
      // If shouldComponentUpdate returned false, we should still update the
      // memoized props/state to indicate that this work can be reused.
      fiber.memoizedProps = newProps;
      fiber.memoizedState = newState;
    }
    // Update the existing instance's state, props, and context pointers even
    // if shouldComponentUpdate returns false.
    instance.props = newProps;
    instance.state = newState;
    instance.context = nextContext;
    return shouldUpdate;
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


    function updateFunctionComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime) {
        var unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
        var context = getMaskedContext(workInProgress, unmaskedContext);

        var nextChildren = void 0;
        prepareToReadContext(workInProgress, renderExpirationTime);
        prepareToUseHooks(current$$1, workInProgress, renderExpirationTime); {
            ReactCurrentOwner$3.current = workInProgress;
            setCurrentPhase('render');
            nextChildren = Component(nextProps, context);
            setCurrentPhase(null);
        }
        nextChildren = finishHooks(Component, nextProps, nextChildren, context);

        // React DevTools reads this flag.
        workInProgress.effectTag |= PerformedWork;
        reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        return workInProgress.child;
    }

    avalon的设计失误，当年就是模拟knockout, angular那样，把指令写在真实的标签上。这导致一个问题是，
    浏览器会对标签的属性进行了转义，比如说href，src在IE6-8会得到完整路径，你为了兼容IE，需要用getAttribute("src",2)
    这样的hack。你想得到元素的属性集合，在IE6，7下会得到上百个我们没有指定的属性，这也要过滤。最惨的是，我们想实现组件机制
    <Picker />这样的标签名无法得到，不是全部小写化，就是全部大写化。虽然可以学VML那样引入命名空间机制，但这也导致性能问题。
    如果当然 <div ms-controller="vmId"></div> 这些需要解析的标签放在<script type="avalon"></script>
    那么通过AST进行转译，我们可以得到用户原汁原叶的属性定义与标签名，也不怕某个标签名不能包含某个标签名下（比如说，
    thead标签下只能放tr与col, script这几种标签，不能 <thead><Tds / ></thead>这样的效果）