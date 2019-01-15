export function bailoutOnAlreadyFinishedWork (alternate, fiber, renderExpirationTime) {
  // Check if the children have any pending work.
  var childExpirationTime = fiber.childExpirationTime
  if (childExpirationTime < renderExpirationTime) {
    // The children don't have any work either. We can skip them.
    // TODO: Once we add back resuming, we should check if the children are
    // a work-in-progress set. If so, we need to transfer their effects.
    return null
  } else {
    // This fiber doesn't have work, but its subtree does. Clone the child
    // fibers and continue.
    cloneChildFibers(alternate, fiber)
    return fiber.child
  }
}

export function cloneChildFibers (alternate, fiber) {
  var currentChild = fiber.child
  if (currentChild === null) {
    return
  }
  var newChild = createAlternate(currentChild, currentChild.pendingProps, currentChild.expirationTime)
  fiber.child = newChild
  newChild.return = fiber
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling
    newChild = newChild.sibling = createAlternate(currentChild, currentChild.pendingProps, currentChild.expirationTime)
    newChild.return = fiber
  }
  newChild.sibling = null
}
