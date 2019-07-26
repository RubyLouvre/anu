(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === "function" && define.amd ? define(factory) :
            (global.deepForceUpdate = factory());
}(this, (function () {

    var ReactClassComponent = 2;

    function traverseRenderedChildren(internalInstance, callback, argument) {
        callback(internalInstance, argument);

        if (internalInstance._renderedComponent) {
            traverseRenderedChildren(internalInstance._renderedComponent, callback, argument);
        } else {
            for (var key in internalInstance._renderedChildren) {
                if (internalInstance._renderedChildren.hasOwnProperty(key)) {
                    traverseRenderedChildren(
                        internalInstance._renderedChildren[key],
                        callback,
                        argument);
                }
            }
        }
    }

    function setPendingForceUpdate(internalInstance, shouldUpdate) {
        if (
            internalInstance._pendingForceUpdate === false &&
            shouldUpdate(internalInstance)
        ) {
            internalInstance._pendingForceUpdate = true;
        }
    }

    function forceUpdateIfPending(internalInstance, onUpdate) {
        if (internalInstance._pendingForceUpdate === true) {
            const publicInstance = internalInstance._instance;
            const { updater } = publicInstance;

            if (typeof publicInstance.forceUpdate === "function") {
                publicInstance.forceUpdate();
            } else if (updater && typeof updater.enqueueForceUpdate === "function") {
                updater.enqueueForceUpdate(publicInstance);
            }
            onUpdate(internalInstance);
        }
    }

    function deepForceUpdateStack(instance, shouldUpdate, onUpdate) {
        const internalInstance = instance._reactInternalInstance;
        traverseRenderedChildren(internalInstance,
            setPendingForceUpdate,
            shouldUpdate
        );
        traverseRenderedChildren(internalInstance, forceUpdateIfPending, onUpdate);
    }
    function shouldUpdate2() {
        return true;
    }
    function onUpdate2() {

    }
    function deepForceUpdate(
        instance,
        shouldUpdate,
        onUpdate
    ) {
        shouldUpdate = shouldUpdate || shouldUpdate2;
        onUpdate = onUpdate || onUpdate2;
        var root = instance._reactInternalFiber || instance._reactInternalInstance;
        if (typeof root.tag !== "number") {
            // Traverse stack-based React tree.
            return deepForceUpdateStack(instance, shouldUpdate, onUpdate);
        }

        var node = root;
        while (true) {
            if (node.tag === ReactClassComponent && shouldUpdate(node)) {
                const publicInstance = node.stateNode;
                const { updater } = publicInstance;
                if (typeof publicInstance.forceUpdate === "function") {
                    publicInstance.forceUpdate();
                } else if (updater && typeof updater.enqueueForceUpdate === "function") {
                    updater.enqueueForceUpdate(publicInstance);
                }
                onUpdate(node);
            }
            if (node.child) {
                node.child.return = node;
                node = node.child;
                continue;
            }
            if (node === root) {
                return undefined;
            }
            while (!node.sibling) {
                if (!node.return || node.return === root) {
                    return undefined;
                }
                node = node.return;
            }
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }

    return deepForceUpdate;

})));
