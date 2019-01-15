var UNIT_SIZE = 10
var MAGIC_NUMBER_OFFSET = maxSigned31BitInt - 1

// 1 unit of expiration time represents 10ms.
function msToExpirationTime (ms) {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - (ms / UNIT_SIZE | 0)
}

var originalStartTimeMs = Date.now()
var currentRendererTime = msToExpirationTime(originalStartTimeMs)
var currentSchedulerTime = currentRendererTime

export function requestCurrentTime () {
  return currentSchedulerTime
}
export function computeExpirationForFiber (currentTime, fiber) {
  return currentTime
}

export var updateContainerBridge = {
  update: function () {}
}

export function FiberNode (tag, pendingProps, key) {
  // Instance
  this.tag = tag
  this.key = key
  this.elementType = null
  this.type = null
  this.stateNode = null
  this.timeoutHandle = noTimeout,
  this.pendingProps = pendingProps
}
var HostRoot = 3
// createHostRoot
export function createContainer (containerInfo, isConcurrent, hydrate) {
  var fiber = new FiberNode(HostRoot, null, null, null)
  fiber.contextStack = []
  fiber.contextChangeStack = []
  fiber.current = new FiberNode(HostRoot, null, null, null)
  fiber.containerInfo = containerInfo
  fiber.stateNode = containerInfo
  return fiber
}

export function updateContainer (children, hostRoot, parentInstance, callback) {
  var current = hostRoot.current
  var currentTime = requestCurrentTime()
  var expirationTime = computeExpirationForFiber(currentTime, current)
  return updateContainerImpl.update(children, hostRoot, parentInstance, expirationTime, callback)
}
