if (_workInProgress.tag === SuspenseComponent &&
    shouldCaptureSuspense(_workInProgress.alternate, _workInProgress)) {
    // Found the nearest boundary.
    // If the boundary is not in concurrent mode, we should not suspend, and
    // likewise, when the promise resolves, we should ping synchronously.
    var pingTime = (_workInProgress.mode & ConcurrentMode) === NoEffect ? Sync : renderExpirationTime;

    // Attach a listener to the promise to "ping" the root and retry.
    var onResolveOrReject = retrySuspendedRoot.bind(null, root, _workInProgress, sourceFiber, pingTime);
    if (enableSchedulerTracing) {
        onResolveOrReject = unstable_wrap(onResolveOrReject);
    }
    thenable.then(onResolveOrReject, onResolveOrReject);
}