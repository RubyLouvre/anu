function workLoop(minPriorityLevel, deadline) {
    if (pendingCommit !== null) {
        priorityContext = TaskPriority$1;
        commitAllWork(pendingCommit);
        handleCommitPhaseErrors();
    } else if (nextUnitOfWork === null) {
        resetNextUnitOfWork();
    }

    if (nextPriorityLevel === NoWork$2 || nextPriorityLevel > minPriorityLevel) {
        return;
    }

    // During the render phase, updates should have the same priority at which
    // we're rendering.
    priorityContext = nextPriorityLevel;

    loop: do {
        if (nextPriorityLevel <= TaskPriority$1) {
        // Flush all synchronous and task work.
            while (nextUnitOfWork !== null) {
                nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
                if (nextUnitOfWork === null) {
                    !(pendingCommit !== null) ? invariant_1(false, "Should have a pending commit. This error is likely caused by a bug in React. Please file an issue.") : void 0;
                    // We just completed a root. Commit it now.
                    priorityContext = TaskPriority$1;
                    commitAllWork(pendingCommit);
                    priorityContext = nextPriorityLevel;
                    // Clear any errors that were scheduled during the commit phase.
                    handleCommitPhaseErrors();
                    // The priority level may have changed. Check again.
                    if (nextPriorityLevel === NoWork$2 || nextPriorityLevel > minPriorityLevel || nextPriorityLevel > TaskPriority$1) {
                        // The priority level does not match.
                        break;
                    }
                }
            }
        } else if (deadline !== null) {
        // Flush asynchronous work until the deadline expires.
            while (nextUnitOfWork !== null && !deadlineHasExpired) {
                if (deadline.timeRemaining() > timeHeuristicForUnitOfWork) {
                    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
                    // In a deferred work batch, iff nextUnitOfWork returns null, we just
                    // completed a root and a pendingCommit exists. Logically, we could
                    // omit either of the checks in the following condition, but we need
                    // both to satisfy Flow.
                    if (nextUnitOfWork === null) {
                        !(pendingCommit !== null) ? invariant_1(false, "Should have a pending commit. This error is likely caused by a bug in React. Please file an issue.") : void 0;
                        // We just completed a root. If we have time, commit it now.
                        // Otherwise, we'll commit it in the next frame.
                        if (deadline.timeRemaining() > timeHeuristicForUnitOfWork) {
                            priorityContext = TaskPriority$1;
                            commitAllWork(pendingCommit);
                            priorityContext = nextPriorityLevel;
                            // Clear any errors that were scheduled during the commit phase.
                            handleCommitPhaseErrors();
                            // The priority level may have changed. Check again.
                            if (nextPriorityLevel === NoWork$2 || nextPriorityLevel > minPriorityLevel || nextPriorityLevel < HighPriority) {
                                // The priority level does not match.
                                break;
                            }
                        } else {
                            deadlineHasExpired = true;
                        }
                    }
                } else {
                    deadlineHasExpired = true;
                }
            }
        }

        // There might be work left. Depending on the priority, we should
        // either perform it now or schedule a callback to perform it later.
        switch (nextPriorityLevel) {
        case SynchronousPriority$1:
        case TaskPriority$1:
            // We have remaining synchronous or task work. Keep performing it,
            // regardless of whether we're inside a callback.
            if (nextPriorityLevel <= minPriorityLevel) {
                continue loop;
            }
            break loop;
        case HighPriority:
        case LowPriority:
        case OffscreenPriority:
            // We have remaining async work.
            if (deadline === null) {
            // We're not inside a callback. Exit and perform the work during
            // the next callback.
                break loop;
            }
            // We are inside a callback.
            if (!deadlineHasExpired && nextPriorityLevel <= minPriorityLevel) {
            // We still have time. Keep working.
                continue loop;
            }
            // We've run out of time. Exit.
            break loop;
        case NoWork$2:
            // No work left. We can exit.
            break loop;
        default:
            invariant_1(false, "Switch statement should be exhuastive. This error is likely caused by a bug in React. Please file an issue.");
        }
    } while (true);
}

function performWorkCatchBlock(failedWork, boundary, minPriorityLevel, deadline) {
    // We're going to restart the error boundary that captured the error.
    // Conceptually, we're unwinding the stack. We need to unwind the
    // context stack, too.
    unwindContexts(failedWork, boundary);

    // Restart the error boundary using a forked version of
    // performUnitOfWork that deletes the boundary's children. The entire
    // failed subree will be unmounted. During the commit phase, a special
    // lifecycle method is called on the error boundary, which triggers
    // a re-render.
    nextUnitOfWork = performFailedUnitOfWork(boundary);

    // Continue working.
    workLoop(minPriorityLevel, deadline);
}

function performWork(minPriorityLevel, deadline) {
    {
        startWorkLoopTimer();
    }

    isPerformingWork ? invariant_1(false, "performWork was called recursively. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    isPerformingWork = true;

    // The priority context changes during the render phase. We'll need to
    // reset it at the end.
    var previousPriorityContext = priorityContext;

    var didError = false;
    var error = null;
    {
        invokeGuardedCallback$1(null, workLoop, null, minPriorityLevel, deadline);
        if (hasCaughtError()) {
            didError = true;
            error = clearCaughtError();
        }
    }

    // An error was thrown during the render phase.
    while (didError) {
        if (didFatal) {
        // This was a fatal error. Don't attempt to recover from it.
            firstUncaughtError = error;
            break;
        }

        var failedWork = nextUnitOfWork;
        if (failedWork === null) {
        // An error was thrown but there's no current unit of work. This can
        // happen during the commit phase if there's a bug in the renderer.
            didFatal = true;
            continue;
        }

        // "Capture" the error by finding the nearest boundary. If there is no
        // error boundary, we use the root.
        var boundary = captureError(failedWork, error);
        !(boundary !== null) ? invariant_1(false, "Should have found an error boundary. This error is likely caused by a bug in React. Please file an issue.") : void 0;

        if (didFatal) {
        // The error we just captured was a fatal error. This happens
        // when the error propagates to the root more than once.
            continue;
        }

        didError = false;
        error = null;
        {
            invokeGuardedCallback$1(null, performWorkCatchBlock, null, failedWork, boundary, minPriorityLevel, deadline);
            if (hasCaughtError()) {
                didError = true;
                error = clearCaughtError();
                continue;
            }
        }
        // We're finished working. Exit the error loop.
        break;
    }

    // Reset the priority context to its previous value.
    priorityContext = previousPriorityContext;

    // If we're inside a callback, set this to false, since we just flushed it.
    if (deadline !== null) {
        isCallbackScheduled = false;
    }
    // If there's remaining async work, make sure we schedule another callback.
    if (nextPriorityLevel > TaskPriority$1 && !isCallbackScheduled) {
        scheduleDeferredCallback(performDeferredWork);
        isCallbackScheduled = true;
    }

    var errorToThrow = firstUncaughtError;

    // We're done performing work. Time to clean up.
    isPerformingWork = false;
    deadlineHasExpired = false;
    didFatal = false;
    firstUncaughtError = null;
    capturedErrors = null;
    failedBoundaries = null;
    nextRenderedTree = null;
    nestedUpdateCount = 0;

    {
        stopWorkLoopTimer();
    }

    // It's safe to throw any unhandled errors.
    if (errorToThrow !== null) {
        throw errorToThrow;
    }
}

// Returns the boundary that captured the error, or null if the error is ignored
function captureError(failedWork, error) {
    // It is no longer valid because we exited the user code.
    ReactCurrentOwner$1.current = null;
    {
        ReactDebugCurrentFiber$3.resetCurrentFiber();
    }

    // Search for the nearest error boundary.
    var boundary = null;

    // Passed to logCapturedError()
    var errorBoundaryFound = false;
    var willRetry = false;
    var errorBoundaryName = null;

    // Host containers are a special case. If the failed work itself is a host
    // container, then it acts as its own boundary. In all other cases, we
    // ignore the work itself and only search through the parents.
    if (failedWork.tag === HostRoot$6) {
        boundary = failedWork;

        if (isFailedBoundary(failedWork)) {
        // If this root already failed, there must have been an error when
        // attempting to unmount it. This is a worst-case scenario and
        // should only be possible if there's a bug in the renderer.
            didFatal = true;
        }
    } else {
        var node = failedWork["return"];
        while (node !== null && boundary === null) {
            if (node.tag === ClassComponent$5) {
                var instance = node.stateNode;
                if (typeof instance.componentDidCatch === "function") {
                    errorBoundaryFound = true;
                    errorBoundaryName = getComponentName_1(node);

                    // Found an error boundary!
                    boundary = node;
                    willRetry = true;
                }
            } else if (node.tag === HostRoot$6) {
                // Treat the root like a no-op error boundary
                boundary = node;
            }

            if (isFailedBoundary(node)) {
                // This boundary is already in a failed state.

                // If we're currently unmounting, that means this error was
                // thrown while unmounting a failed subtree. We should ignore
                // the error.
                if (isUnmounting) {
                    return null;
                }

                // If we're in the commit phase, we should check to see if
                // this boundary already captured an error during this commit.
                // This case exists because multiple errors can be thrown during
                // a single commit without interruption.
                if (commitPhaseBoundaries !== null && (commitPhaseBoundaries.has(node) || node.alternate !== null && commitPhaseBoundaries.has(node.alternate))) {
                    // If so, we should ignore this error.
                    return null;
                }

                // The error should propagate to the next boundary -â€” we keep looking.
                boundary = null;
                willRetry = false;
            }

            node = node["return"];
        }
    }

    if (boundary !== null) {
        // Add to the collection of failed boundaries. This lets us know that
        // subsequent errors in this subtree should propagate to the next boundary.
        if (failedBoundaries === null) {
            failedBoundaries = new Set();
        }
        failedBoundaries.add(boundary);

        // This method is unsafe outside of the begin and complete phases.
        // We might be in the commit phase when an error is captured.
        // The risk is that the return path from this Fiber may not be accurate.
        // That risk is acceptable given the benefit of providing users more context.
        var _componentStack = getStackAddendumByWorkInProgressFiber$2(failedWork);
        var _componentName = getComponentName_1(failedWork);

        // Add to the collection of captured errors. This is stored as a global
        // map of errors and their component stack location keyed by the boundaries
        // that capture them. We mostly use this Map as a Set; it's a Map only to
        // avoid adding a field to Fiber to store the error.
        if (capturedErrors === null) {
            capturedErrors = new Map();
        }

        var capturedError = {
            componentName: _componentName,
            componentStack: _componentStack,
            error: error,
            errorBoundary: errorBoundaryFound ? boundary.stateNode : null,
            errorBoundaryFound: errorBoundaryFound,
            errorBoundaryName: errorBoundaryName,
            willRetry: willRetry
        };

        capturedErrors.set(boundary, capturedError);

        try {
            logCapturedError(capturedError);
        } catch (e) {
        // Prevent cycle if logCapturedError() throws.
        // A cycle may still occur if logCapturedError renders a component that throws.
            console.error(e);
        }

        // If we're in the commit phase, defer scheduling an update on the
        // boundary until after the commit is complete
        if (isCommitting) {
            if (commitPhaseBoundaries === null) {
                commitPhaseBoundaries = new Set();
            }
            commitPhaseBoundaries.add(boundary);
        } else {
        // Otherwise, schedule an update now.
        // TODO: Is this actually necessary during the render phase? Is it
        // possible to unwind and continue rendering at the same priority,
        // without corrupting internal state?
            scheduleErrorRecovery(boundary);
        }
        return boundary;
    } else if (firstUncaughtError === null) {
        // If no boundary is found, we'll need to throw the error
        firstUncaughtError = error;
    }
    return null;
}

function hasCapturedError(fiber) {
    // TODO: capturedErrors should store the boundary instance, to avoid needing
    // to check the alternate.
    return capturedErrors !== null && (capturedErrors.has(fiber) || fiber.alternate !== null && capturedErrors.has(fiber.alternate));
}

function isFailedBoundary(fiber) {
    // TODO: failedBoundaries should store the boundary instance, to avoid
    // needing to check the alternate.
    return failedBoundaries !== null && (failedBoundaries.has(fiber) || fiber.alternate !== null && failedBoundaries.has(fiber.alternate));
}

function commitErrorHandling(effectfulFiber) {
    var capturedError = void 0;
    if (capturedErrors !== null) {
        capturedError = capturedErrors.get(effectfulFiber);
        capturedErrors["delete"](effectfulFiber);
        if (capturedError == null) {
            if (effectfulFiber.alternate !== null) {
                effectfulFiber = effectfulFiber.alternate;
                capturedError = capturedErrors.get(effectfulFiber);
                capturedErrors["delete"](effectfulFiber);
            }
        }
    }

    !(capturedError != null) ? invariant_1(false, "No error for given unit of work. This error is likely caused by a bug in React. Please file an issue.") : void 0;

    switch (effectfulFiber.tag) {
    case ClassComponent$5:
        var instance = effectfulFiber.stateNode;

        var info = {
            componentStack: capturedError.componentStack
        };

        // Allow the boundary to handle the error, usually by scheduling
        // an update to itself
        instance.componentDidCatch(capturedError.error, info);
        return;
    case HostRoot$6:
        if (firstUncaughtError === null) {
            // If this is the host container, we treat it as a no-op error
            // boundary. We'll throw the first uncaught error once it's safe to
            // do so, at the end of the batch.
            firstUncaughtError = capturedError.error;
        }
        return;
    default:
        invariant_1(false, "Invalid type of work. This error is likely caused by a bug in React. Please file an issue.");
    }
}