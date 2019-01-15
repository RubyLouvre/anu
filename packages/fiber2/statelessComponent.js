
//处理无狀态组件
import { PerformedWork } from './effectTag'
import { getUnmaskedContext, getMaskedContext } from './oldContext';
import { bailoutOnAlreadyFinishedWork } from './exitFiber';
export  function updateFunctionComponent(alternate, fiber, Component, renderExpirationTime) {
    const unresolvedProps = fiber.pendingProps;
    const nextProps =  fiber.elementType === Component
        ? unresolvedProps
        : resolveDefaultProps(Component, unresolvedProps);
    //无状态组件也可以使用contextTypes
    var unmaskedContext = getUnmaskedContext(fiber, Component, true);
    var context = getMaskedContext(fiber, unmaskedContext);

    var nextChildren = void 0;
    prepareToReadContext(fiber, renderExpirationTime);
    prepareToUseHooks(alternate, fiber, renderExpirationTime); {
    ReactCurrentOwner.current = fiber;
    nextChildren = Component(nextProps, context);
    
    nextChildren = finishHooks(Component, nextProps, nextChildren, context);

    // React DevTools reads this flag.
    fiber.effectTag |= PerformedWork;
    reconcileChildren(alternate, fiber, nextChildren, renderExpirationTime);
    return fiber.child;
}

export function updateMemoComponent(alternate, fiber, Component, updateExpirationTime, renderExpirationTime) {
    const type = Component
    const unresolvedProps = fiber.pendingProps
    // Resolve outer props first, then resolve inner props.
    let resolvedProps = resolveDefaultProps(type, unresolvedProps);
    nextProps = resolveDefaultProps(type.type, resolvedProps);
    if (alternate === null) {
        var type = Component.type;
        if (isSimpleFunctionComponent(type) && !Component.compare) {
            // If this is a plain function component without default props,
            // and with only the default shallow comparison, we upgrade it
            // to a SimpleMemoComponent to allow fast path updates.
            fiber.tag = SimpleMemoComponent;
            fiber.type = type; 
            fiber.pendingProps = nextProps
            return updateSimpleMemoComponent(alternate, fiber, type, updateExpirationTime, renderExpirationTime);
        }
        var child = createFiberFromTypeAndProps(Component.type, null, nextProps, null, fiber.mode, renderExpirationTime);
        child.ref = fiber.ref;
        child.return = fiber;
        fiber.child = child;
        return child;
    }
    var currentChild = alternate.child; // This is always exactly one child
    if (updateExpirationTime < renderExpirationTime) {
        // This will be the props with resolved defaultProps,
        // unlike current.memoizedProps which will be the unresolved ones.
        var prevProps = currentChild.memoizedProps;
        // Default to shallow comparison
        var compare = Component.compare;
        compare = compare !== null ? compare : shallowEqual;
        if (compare(prevProps, nextProps) && alternate.ref === fiber.ref) {
            return bailoutOnAlreadyFinishedWork(alternate, fiber, renderExpirationTime);
        }
    }
    // React DevTools reads this flag.
    fiber.effectTag |= PerformedWork;
    var newChild = createAlternate(currentChild, nextProps, renderExpirationTime);
    newChild.ref = fiber.ref;
    newChild.return = fiber;
    fiber.child = newChild;
    return newChild;
}
//updateSimpleMemoComponent是MemoComponent的优化，没有比较
export function updateSimpleMemoComponent(alternate, fiber, Component, updateExpirationTime, renderExpirationTime) {
  
    if (alternate !== null && updateExpirationTime < renderExpirationTime) {
        var prevProps = alternate.memoizedProps;
        var nextProps = fiber.pendingProps;
        if (shallowEqual(prevProps, nextProps) && alternate.ref === fiber.ref) {
            return bailoutOnAlreadyFinishedWork(alternate, fiber, renderExpirationTime);
        }
    }
    return updateFunctionComponent(alternate, fiber, Component, renderExpirationTime);
}


export function updateForwardRef( alternate, fiber, type) {
    const unresolvedProps = fiber.pendingProps;
    const nextProps =
        fiber.elementType === type
          ? unresolvedProps
          : resolveDefaultProps(type, unresolvedProps);
  
    const render = Component.render;
    const ref = fiber.ref;
  
    // The rest is a fork of updateFunctionComponent
    let nextChildren;
    prepareToReadContext(fiber, renderExpirationTime);
    prepareToUseHooks(alternate, fiber, renderExpirationTime);

    nextChildren = render(nextProps, ref);
    
    nextChildren = finishHooks(render, nextProps, nextChildren, ref);
  
    // React DevTools reads this flag.
    fiber.effectTag |= PerformedWork;
    reconcileChildren(
        alternate,
      fiber,
      nextChildren,
      renderExpirationTime,
    );
    return fiber.child;
  }
  