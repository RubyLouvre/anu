
import { getUnmaskedContext, getMaskedContext } from './oldContext';

export  function updateFunctionComponent(alternate, fiber, Component, nextProps, renderExpirationTime) {
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