export function updateMode (alternate, fiber, type, renderExpirationTime) {
  const nextChildren = fiber.pendingProps.children
  reconcileChildren(alternate, fiber, nextChildren, renderExpirationTime)
  return fiber.child
}

export function updateProfiler (alternate, fiber, type, renderExpirationTime) {
  return updateMode(alternate, fiber, renderExpirationTime)
}

export function updateFragment (alternate, fiber, type, renderExpirationTime) {
  const nextChildren = fiber.pendingProps
  reconcileChildren(alternate, fiber, nextChildren, renderExpirationTime)
  return fiber.child
}
