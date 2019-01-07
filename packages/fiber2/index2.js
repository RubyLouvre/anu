function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
 
    // TODO: Without `any` type, Flow says "Property cannot be accessed on any
    // member of intersection type." Whyyyyyy.
    var root = container._reactRootContainer;
    if (!root) {
        // Initial mount
        root = container._reactRootContainer = createReactRoot(container, forceHydrate);
        unbatchedUpdates(function () {
            if (parentComponent != null) {
                root.setStateHasParent(parentComponent, children, callback);
            } else {
                root.setState(children, callback);
            }
        });
    } else {
        // Update
        if (parentComponent != null) {
            root.setStateHasParent(parentComponent, children, callback);
        } else {
            root.setState(children, callback);
        }
    }
    return getPublicRootInstance(root._internalRoot);
}

function createReactRoot(container, forceHydrate) {
    var shouldHydrate = forceHydrate ||
    (container.nodeType == 1 && container.getAttribute('data-reactroot'));
    if (!shouldHydrate) {
        var rootSibling = void 0;
        while ((rootSibling = container.lastChild)) {
            container.removeChild(rootSibling);
        }
    }
    // Legacy roots are not async by default.
    var isConcurrent = false;
    return new ReactRoot(container, isConcurrent, shouldHydrate);
}

function ReactRoot(container, isConcurrent, hydrate) {
    var root = createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
}
ReactRoot.prototype.setState = function (children, callback) {
    var root = this._internalRoot, fn = null, instance;
    if (typeof callback === 'function'){
        fn = function (){
            instance = root.child ? root.child.stateNode : null;
            callback.call(instance);
        };
    }
    updateContainer(children, root, null, fn);
    return  instance;
};


function FiberNode(tag, pendingProps, key) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;
    this.pendingProps = pendingProps;
}
var HostRoot = 3;
function createContainer(containerInfo, isConcurrent, hydrate) {
    var fiber = new FiberNode(HostRoot, null, null, null);
    fiber.current = new FiberNode(HostRoot, null, null, null);
    fiber.containerInfo = containerInfo;
    fiber.stateNode = containerInfo;
    return fiber;
}

function updateContainer(element, container, parentComponent, callback) {
    var current = container.current;
    var currentTime = requestCurrentTime();
    var expirationTime = computeExpirationForFiber(currentTime, current);
    return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback);
}