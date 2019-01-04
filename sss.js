function completeUnitOfWork (fiber) {
  // Attempt to complete the current unit of work, then move to the
  // next sibling. If there are no more siblings, return to the
  // parent fiber.
  while (true) {
    // The current, flushed, state of this fiber is the alternate.
    // Ideally nothing should rely on this, but relying on it here
    // means that we don't need an additional field on the work in
    // progress.
    const current = fiber.alternate

    const returnFiber = fiber.return
    const siblingFiber = fiber.sibling

    if ((fiber.effectTag & Incomplete) === NoEffect) {
      // This fiber completed.
      // Remember we're completing this unit so we can find a boundary if it fails.
      nextUnitOfWork = fiber

      nextUnitOfWork = completeWork(
        current,
        fiber,
        nextRenderExpirationTime
      )

      if (nextUnitOfWork !== null) {
        // Completing this fiber spawned new work. Work on that next.
        return nextUnitOfWork
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
          returnFiber.firstEffect = fiber.firstEffect
        }
        if (fiber.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = fiber.firstEffect
          }
          returnFiber.lastEffect = fiber.lastEffect
        }

        // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if
        // needed, by doing multiple passes over the effect list. We don't want
        // to schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.
        const effectTag = fiber.effectTag
        // Skip both NoWork and PerformedWork tags when creating the effect list.
        // PerformedWork effect is read by React DevTools but shouldn't be committed.
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = fiber
          } else {
            returnFiber.firstEffect = fiber
          }
          returnFiber.lastEffect = fiber
        }
      }

      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber
      } else if (returnFiber !== null) {
        // If there's no more work in this returnFiber. Complete the returnFiber.
        fiber = returnFiber
        continue
      } else {
        // We've reached the root.
        return null
      }
    } else {
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      const next = unwindWork(fiber, nextRenderExpirationTime)
      // Because this fiber did not complete, don't reset its expiration time.
      if (fiber.effectTag & DidCapture) {
        // Restarting an error boundary
        stopFailedWorkTimer(fiber)
      } else {
        stopWorkTimer(fiber)
      }

      if (next !== null) {
        stopWorkTimer(fiber)

        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        next.effectTag &= HostEffectMask
        return next
      }

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null
        returnFiber.effectTag |= Incomplete
      }
      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber
      } else if (returnFiber !== null) {
        // If there's no more work in this returnFiber. Complete the returnFiber.
        fiber = returnFiber
        continue
      } else {
        return null
      }
    }
  }

  // Without this explicit null return Flow complains of invalid return type
  // TODO Remove the above while(true) loop
  // eslint-disable-next-line no-unreachable
  return null
}
