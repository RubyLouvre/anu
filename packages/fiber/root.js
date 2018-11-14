


function ReactRoot(container, isConcurrent, hydrate, ) {
    const root = DOMRenderer.createContainer(container, isConcurrent, hydrate);
    this._internalRoot = root;
}
ReactRoot.prototype.render = function (children, callback) {
    const root = this._internalRoot;
    const work = new ReactWork();
    callback = callback === undefined ? null : callback;
    if (callback !== null) {
        work.then(callback);
    }
    DOMRenderer.updateContainer(children, root, null, work._onCommit);
    return work;
};
ReactRoot.prototype.unmount = function (callback) {
    const root = this._internalRoot;
    const work = new ReactWork();
    callback = callback === undefined ? null : callback;
    if (callback !== null) {
        work.then(callback);
    }
    DOMRenderer.updateContainer(null, root, null, work._onCommit);
    return work;
};
ReactRoot.prototype.legacy_renderSubtreeIntoContainer = function (
    parentComponent,
    children,
    callback
) {
    const root = this._internalRoot;
    const work = new ReactWork();
    callback = callback === undefined ? null : callback;

    if (callback !== null) {
        work.then(callback);
    }
    DOMRenderer.updateContainer(children, root, parentComponent, work._onCommit);
    return work;
};

//行为类似一个Promise
function ReactWork() {
    this._callbacks = null;
    this._didCommit = false;
    this._onCommit = this._onCommit.bind(this);
}
ReactWork.prototype.then = function (onCommit) {
    if (this._didCommit) {
        onCommit();
        return;
    }
    let callbacks = this._callbacks;
    if (callbacks === null) {
        callbacks = this._callbacks = [];
    }
    callbacks.push(onCommit);
};
ReactWork.prototype._onCommit = function () {
    if (this._didCommit) {
        return;
    }
    this._didCommit = true;
    const callbacks = this._callbacks;
    if (callbacks === null) {
        return;
    }
    // TODO: Error handling.
    for (let i = 0; i < callbacks.length; i++) {
        const callback = callbacks[i];
        callback();
    }
};

function legacyCreateRootFromDOMContainer(container, forceHydrate) {
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

function legacyRenderSubtreeIntoContainer(parentComponent, children, container,
    forceHydrate, callback) {


    // TODO: Without `any` type, Flow says "Property cannot be accessed on any
    // member of intersection type." Whyyyyyy.
    let root = container._reactRootContainer;
    if (!root) {
        // Initial mount
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
            container,
            forceHydrate,
        );
        if (typeof callback === 'function') {
            const originalCallback = callback;
            callback = function () {
                const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
                originalCallback.call(instance);
            };
        }
        // Initial mount should not be batched.
        DOMRenderer.unbatchedUpdates(() => {
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
        if (typeof callback === 'function') {
            const originalCallback = callback;
            callback = function () {
                const instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
                originalCallback.call(instance);
            };
        }
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
    return DOMRenderer.getPublicRootInstance(root._internalRoot);
}


export function hydrate(element, container, callback) {
    // TODO: throw or warn if we couldn't hydrate?
    return legacyRenderSubtreeIntoContainer(
        null,
        element,
        container,
        true,
        callback,
    );
}

export function render(vdom, container, callback) {

    return legacyRenderSubtreeIntoContainer(
        null,
        vdom,
        container,
        false,
        callback,
    );
}

export function unstable_renderSubtreeIntoContainer( parentComponent, vdom, containerNode, callback) {
    invariant(
        parentComponent != null && ReactInstanceMap.has(parentComponent),
        'parentComponent must be a valid React Component',
    );
    return legacyRenderSubtreeIntoContainer(
        parentComponent,
        vdom,
        containerNode,
        false,
        callback,
    );
}

function unmountComponentAtNode(containerNode) {
    if (containerNode._reactRootContainer) {
        // Unmount should not be batched.
        DOMRenderer.unbatchedUpdates(() => {
            legacyRenderSubtreeIntoContainer(null, null, containerNode, false, () => {
                containerNode._reactRootContainer = null;
            });
        });
        // If you call unmountComponentAtNode twice in quick succession, you'll
        // get `true` twice. That's probably fine?
        return true;
    } else {
        return false;
    }
}
