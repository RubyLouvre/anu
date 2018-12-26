function hydrate(vdom, container, callback) {
    return legacyRenderSubtreeIntoContainer(
        null,
        vdom,
        container,
        true,
        callback,
    );
}
function render(vdom, container, callback) {
    return legacyRenderSubtreeIntoContainer(
        null,
        vdom,
        container,
        false,
        callback,
    );
}

function unstable_renderSubtreeIntoContainer(parentComponent,vdom, container, callback  ) {
    return legacyRenderSubtreeIntoContainer(
        parentComponent,
        vdom,
        container,
        false,
        callback,
    );
}


function unmountComponentAtNode(container) {
    if (container && container._reactRootContainer) {
        // Unmount should not be batched.
        unbatchedUpdates(() => {
            legacyRenderSubtreeIntoContainer(null, null, container, false, () => {
                container._reactRootContainer = null;
            });
        });
        return true;
    } else {
        return false;
    }
}


function legacyRenderSubtreeIntoContainer(
    parentComponent,
    children,
    container,
    forceHydrate,
    callback,
) {
    // TODO: Without `any` type, Flow says "Property cannot be accessed on any
    // member of intersection type." Whyyyyyy.
    let root = container._reactRootContainer;
    if (typeof callback === 'function') {
        const originalCallback = callback;
        callback = function() {
            const instance = getPublicRootInstance(root._internalRoot);
            originalCallback.call(instance);
        };
    }
    if (!root) {
        // Initial mount
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
            container,
            forceHydrate,
        );
       
        // Initial mount should not be batched.
        unbatchedUpdates(() => {
            if (parentComponent != null) {
                root.legacy_renderSubtreeIntoContainer(
                    parentComponent,
                    children,
                    callback,
                );
            } else {
                root.render(children, callback);
            }
        });
    } else {
        // Update
        if (parentComponent != null) {
            root.legacy_renderSubtreeIntoContainer(
                parentComponent,
                children,
                callback,
            );
        } else {
            root.render(children, callback);
        }
    }
    return getPublicRootInstance(root._internalRoot);
}

function legacyCreateRootFromDOMContainer( container,forceHydrate) {
    const shouldHydrate =
      forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
    // First clear any existing content.
    if (!shouldHydrate) {
        let rootSibling;
        while ((rootSibling = container.lastChild)) {
            container.removeChild(rootSibling);
        }
    }
    // Legacy roots are not async by default.
    const isConcurrent = false;
    return new ReactRoot(container, isConcurrent, shouldHydrate);
}
export const ROOT_ATTRIBUTE_NAME = 'data-reactroot';

function shouldHydrateDueToLegacyHeuristic(container) {
    const rootElement = getReactRootElementInContainer(container);
    return !!(
        rootElement &&
      rootElement.nodeType === ELEMENT_NODE &&
      rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)
    );
}
  

export function updateContainerAtExpirationTime(
    element: ReactNodeList,
    container: OpaqueRoot,
    parentComponent: ?React$Component<any, any>,
    expirationTime: ExpirationTime,
    callback: ?Function,
) {
    // TODO: If this is a nested container, this won't be the root.
    const fiber = container.current;
    const context = getContextForSubtree(parentComponent);
    if (container.context === null) {
        container.context = context;
    } else {
        container.pendingContext = context;
    }
  
    return scheduleRootUpdate(fiber, element, expirationTime, callback);
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
    update.payload = {element};
  
    callback = callback === undefined ? null : callback;
    if (callback !== null) {
       
        update.callback = callback;
    }
  
    flushPassiveEffects();
    enqueueUpdate(current, update);
    scheduleWork(current, expirationTime);
  
    return expirationTime;
}