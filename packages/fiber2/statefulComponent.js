import { hasContextChanged, getUnmaskedContext, getMaskedContext, cacheContext, pushConext, adjustContext } from './oldContext';
import { readContext, resolveDefaultProps } from './newContext';

import { Placement, Update, Snapshot,DidCapture, NoEffect, NoWork, PerformedWork ,Ref} from './effectTag';
export function updateClassComponent(
    current,
    fiber,
    Component,
    nextProps,
    renderExpirationTime,
) {
    // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    let hasContext = false;
   
    if ( 'getChildContext' in Component.prototype) {
        hasContext = true;
        pushConext(fiber);
    } else {
        hasContext = false;
    }
  
    const instance = fiber.stateNode;
    let shouldUpdate;
    if (instance === null) {
        if (current !== null) {
            current.alternate = null;
            fiber.alternate = null;
            // Since this is conceptually a new fiber, schedule a Placement effect
            fiber.effectTag |= Placement;
        }
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
    fiber.shiftContext = hasContext;
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
    var unmaskedContext = {};
    var context = null;
    var contextType = ctor.contextType;
    if (Object( contextType ) === contextType ) {//React 16.7的static contextType
        context = readContext(contextType);
    } else {
        unmaskedContext = getUnmaskedContext(fiber, ctor, true);
        var contextTypes = ctor.contextTypes;
        isLegacyContextConsumer = Object( contextTypes ) === contextTypes;
        context = isLegacyContextConsumer ? getMaskedContext(fiber, unmaskedContext) : {};
    }
    var instance = new ctor(props, context);
    fiber.memoizedState =  instance.state || null;
    // instance.updater = classComponentUpdater;
    fiber.stateNode = instance;
    if (typeof ctor.getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function') {
        instance.useReact16Hook = true;
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
    instance.refs = {};
   
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
   
    if (instance.useReact16Hook){
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
    } else {
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
      fiber.type === fiber.type
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
  
    var useReact16Hook = instance.useReact16Hook; 
   
  
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
      !hasContextChanged(fiber) &&
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
        if ( !instance.useReact16Hook ) {
            callComponentWillUpdate(instance, newProps, newState, nextContext );
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

function markRef(alternate, fiber) {
    var ref = fiber.ref;
    if (alternate === null && ref !== null || alternate !== null && alternate.ref !== ref) {
        // Schedule a Ref effect
        fiber.effectTag |= Ref;
    }
}

function finishClassComponent(alternate, fiber, Component, shouldUpdate, hasContext, renderExpirationTime) {
    // Refs should update even if shouldComponentUpdate returns false
    markRef(alternate, fiber);

    var didCaptureError = (fiber.effectTag & DidCapture) !== NoEffect;

    if (!shouldUpdate && !didCaptureError) {
        // Context providers should defer to sCU for rendering
        if (hasContext) {
            adjustContext(fiber, Component, false);
        }
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
    if (alternate !== null && didCaptureError) {
        // 如果我们从错误中恢复过来，那么我们将不会复用现有的children,
        // 从概念上讲，正常的children与用于
        // 显示错误信息的children是两个没有交集的东西，即使它们的位置类型都一样，我们也不应该复用它们。

        fiber.child = reconcileChildFibers(fiber, alternate.child, null, renderExpirationTime);
        fiber.child = reconcileChildFibers(fiber, null, nextChildren, renderExpirationTime);
    } else {
        reconcileChildren(alternate, fiber, nextChildren, renderExpirationTime);
    }
    if (hasContext) {
        adjustContext(fiber, Component, true);
    }
    // Memoize state using the values we just used to render.
    // TODO: Restructure so we never read values from the instance.
    fiber.memoizedState = instance.state;

    return fiber.child;
}


function applyDerivedStateFromProps(fiber, ctor, getDerivedStateFromProps, nextProps) {
    var prevState = fiber.memoizedState;
    var partialState = getDerivedStateFromProps(nextProps, prevState);

    // Merge the partial state and the previous state.
    var memoizedState = partialState === null || partialState === undefined ? prevState : Object.assign({}, prevState, partialState);
    fiber.memoizedState = memoizedState;

    // Once the update queue is empty, persist the derived state onto the
    // base state.
    var updateQueue = fiber.updateQueue;
    if (updateQueue !== null && fiber.expirationTime === NoWork) {
        updateQueue.baseState = memoizedState;
    }
}

function callComponentWillUpdate(){}