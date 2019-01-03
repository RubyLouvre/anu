function completeUnitOfWork(workInProgress: Fiber): Fiber | null {
    // Attempt to complete the current unit of work, then move to the
    // next sibling. If there are no more siblings, return to the
    // parent fiber.
    while (true) {
      // The current, flushed, state of this fiber is the alternate.
      // Ideally nothing should rely on this, but relying on it here
      // means that we don't need an additional field on the work in
      // progress.
      const current = workInProgress.alternate;
      if (__DEV__) {
        setCurrentFiber(workInProgress);
      }
  
      const returnFiber = workInProgress.return;
      const siblingFiber = workInProgress.sibling;
  
      if ((workInProgress.effectTag & Incomplete) === NoEffect) {
        if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
          // Don't replay if it fails during completion phase.
          mayReplayFailedUnitOfWork = false;
        }
        // This fiber completed.
        // Remember we're completing this unit so we can find a boundary if it fails.
        nextUnitOfWork = workInProgress;
        if (enableProfilerTimer) {
          if (workInProgress.mode & ProfileMode) {
            startProfilerTimer(workInProgress);
          }
          nextUnitOfWork = completeWork(
            current,
            workInProgress,
            nextRenderExpirationTime,
          );
          if (workInProgress.mode & ProfileMode) {
            // Update render duration assuming we didn't error.
            stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
          }
        } else {
          nextUnitOfWork = completeWork(
            current,
            workInProgress,
            nextRenderExpirationTime,
          );
        }
        if (__DEV__ && replayFailedUnitOfWorkWithInvokeGuardedCallback) {
          // We're out of completion phase so replaying is fine now.
          mayReplayFailedUnitOfWork = true;
        }
        stopWorkTimer(workInProgress);
        resetChildExpirationTime(workInProgress, nextRenderExpirationTime);
        if (__DEV__) {
          resetCurrentFiber();
        }
  
        if (nextUnitOfWork !== null) {
          // Completing this fiber spawned new work. Work on that next.
          return nextUnitOfWork;
        }
  
        if (
          returnFiber !== null &&
          // Do not append effects to parents if a sibling failed to complete
          (returnFiber.effectTag & Incomplete) === NoEffect
        ) {
          // Append all the effects of the subtree and this fiber onto the effect
          // list of the parent. The completion order of the children affects the
          // side-effect order.
          if (returnFiber.firstEffect === null) {
            returnFiber.firstEffect = workInProgress.firstEffect;
          }
          if (workInProgress.lastEffect !== null) {
            if (returnFiber.lastEffect !== null) {
              returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
            }
            returnFiber.lastEffect = workInProgress.lastEffect;
          }
  
          // If this fiber had side-effects, we append it AFTER the children's
          // side-effects. We can perform certain side-effects earlier if
          // needed, by doing multiple passes over the effect list. We don't want
          // to schedule our own side-effect on our own list because if end up
          // reusing children we'll schedule this effect onto itself since we're
          // at the end.
          const effectTag = workInProgress.effectTag;
          // Skip both NoWork and PerformedWork tags when creating the effect list.
          // PerformedWork effect is read by React DevTools but shouldn't be committed.
          if (effectTag > PerformedWork) {
            if (returnFiber.lastEffect !== null) {
              returnFiber.lastEffect.nextEffect = workInProgress;
            } else {
              returnFiber.firstEffect = workInProgress;
            }
            returnFiber.lastEffect = workInProgress;
          }
        }
  
        if (__DEV__ && ReactFiberInstrumentation.debugTool) {
          ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress);
        }
  
        if (siblingFiber !== null) {
          // If there is more work to do in this returnFiber, do that next.
          return siblingFiber;
        } else if (returnFiber !== null) {
          // If there's no more work in this returnFiber. Complete the returnFiber.
          workInProgress = returnFiber;
          continue;
        } else {
          // We've reached the root.
          return null;
        }
      } else {
        if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
          // Record the render duration for the fiber that errored.
          stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
  
          // Include the time spent working on failed children before continuing.
          let actualDuration = workInProgress.actualDuration;
          let child = workInProgress.child;
          while (child !== null) {
            actualDuration += child.actualDuration;
            child = child.sibling;
          }
          workInProgress.actualDuration = actualDuration;
        }
  
        // This fiber did not complete because something threw. Pop values off
        // the stack without entering the complete phase. If this is a boundary,
        // capture values if possible.
        const next = unwindWork(workInProgress, nextRenderExpirationTime);
        // Because this fiber did not complete, don't reset its expiration time.
        if (workInProgress.effectTag & DidCapture) {
          // Restarting an error boundary
          stopFailedWorkTimer(workInProgress);
        } else {
          stopWorkTimer(workInProgress);
        }
  
        if (__DEV__) {
          resetCurrentFiber();
        }
  
        if (next !== null) {
          stopWorkTimer(workInProgress);
          if (__DEV__ && ReactFiberInstrumentation.debugTool) {
            ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress);
          }
  
          // If completing this work spawned new work, do that next. We'll come
          // back here again.
          // Since we're restarting, remove anything that is not a host effect
          // from the effect tag.
          next.effectTag &= HostEffectMask;
          return next;
        }
  
        if (returnFiber !== null) {
          // Mark the parent fiber as incomplete and clear its effect list.
          returnFiber.firstEffect = returnFiber.lastEffect = null;
          returnFiber.effectTag |= Incomplete;
        }
  
        if (__DEV__ && ReactFiberInstrumentation.debugTool) {
          ReactFiberInstrumentation.debugTool.onCompleteWork(workInProgress);
        }
  
        if (siblingFiber !== null) {
          // If there is more work to do in this returnFiber, do that next.
          return siblingFiber;
        } else if (returnFiber !== null) {
          // If there's no more work in this returnFiber. Complete the returnFiber.
          workInProgress = returnFiber;
          continue;
        } else {
          return null;
        }
      }
    }
  
    // Without this explicit null return Flow complains of invalid return type
    // TODO Remove the above while(true) loop
    // eslint-disable-next-line no-unreachable
    return null;
  }