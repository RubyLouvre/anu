function ReactDOMRenderImpl (parentComponent, children, container, forceHydrate, callback) {
  var root = container._reactRootContainer
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = createReactRoot(container, forceHydrate)
    unbatchedUpdates(function () {
      if (parentComponent != null) {
        root.setStateHasParent(parentComponent, children, callback)
      } else {
        root.setState(children, callback)
      }
    })
  } else {
    // Update
    if (parentComponent != null) {
      root.setStateHasParent(parentComponent, children, callback)
    } else {
      root.setState(children, callback)
    }
  }
  return getPublicRootInstance(root._internalRoot)
}

function createReactRoot (container, forceHydrate) {
  var shouldHydrate = forceHydrate ||
    (container.nodeType == 1 && container.getAttribute('data-reactroot'))
  if (!shouldHydrate) {
    var rootSibling = void 0
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling)
    }
  }
  // Legacy roots are not async by default.
  var isConcurrent = false
  return new ReactRoot(container, isConcurrent, shouldHydrate)
}

function ReactRoot (container, isConcurrent, hydrate) {
  var root = createContainer(container, isConcurrent, hydrate)
  this._internalRoot = root
}
ReactRoot.prototype.setState = function (children, callback) {
  var root = this._internalRoot, fn = null, instance
  if (typeof callback === 'function') {
    fn = function () {
      instance = root.child ? root.child.stateNode : null
      callback.call(instance)
    }
  }
  updateContainer(children, root, null, fn)
  return instance
}

function FiberNode (tag, pendingProps, key) {
  // Instance
  this.tag = tag
  this.key = key
  this.elementType = null
  this.type = null
  this.stateNode = null
  this.pendingProps = pendingProps
}
var HostRoot = 3
function createContainer (containerInfo, isConcurrent, hydrate) {
  var fiber = new FiberNode(HostRoot, null, null, null)
  fiber.current = new FiberNode(HostRoot, null, null, null)
  fiber.containerInfo = containerInfo
  fiber.stateNode = containerInfo
  return fiber
}
var originalStartTimeMs = Date.now()
var currentRendererTime = msToExpirationTime(originalStartTimeMs)
var currentSchedulerTime = currentRendererTime
function requestCurrentTime () {
  return currentSchedulerTime
}
var maxSigned31BitInt = 1073741823

var NoWork = 0
var Never = 1
var Sync = maxSigned31BitInt

var UNIT_SIZE = 10
var MAGIC_NUMBER_OFFSET = maxSigned31BitInt - 1

// 1 unit of expiration time represents 10ms.
function msToExpirationTime (ms) {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - (ms / UNIT_SIZE | 0)
}
function computeExpirationForFiber (currentTime, fiber) {
  return currentTime
}
function updateContainer (children, hostRoot, parentComponent, callback) {
  var current = hostRoot.current
  var currentTime = requestCurrentTime()
  var expirationTime = computeExpirationForFiber(currentTime, current)
  return updateContainerAtExpirationTime(children, hostRoot, parentComponent, expirationTime, callback)
}

function updateContainerAtExpirationTime (element, hostRoot, parentComponent, expirationTime, callback) {
  // TODO: If this is a nested container, this won't be the root.
  var current = hostRoot.current
  var context = getContextForSubtree(parentComponent)
  if (hostRoot.context === null) {
    hostRoot.context = context
  } else {
    hostRoot.pendingContext = context
  }
  return scheduleRootUpdate(current, element, expirationTime, callback)
}
function get (instance) {
  return instance._internalReactFiber
}
function getContextForSubtree (parentComponent) {
  if (!parentComponent) {
    return {}
  }
  /*
    var fiber = get(parentComponent)
    var parentContext = findCurrentUnmaskedContext(fiber)

    if (fiber.tag === ClassComponent) {
      var Component = fiber.type
      if (isContextProvider(Component)) {
        return processChildContext(fiber, Component, parentContext)
      }
    }
  */
  return parentContext
}
function createUpdate (expirationTime) {
  return {
    expirationTime: expirationTime,

    tag: UpdateState,
    payload: null,
    callback: null,

    next: null,
    nextEffect: null
  }
}
function scheduleRootUpdate (current, element, expirationTime, callback) {
  var update = createUpdate(expirationTime)
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {
    element: element
  }

  callback = callback === undefined ? null : callback
  if (callback !== null) {
    update.callback = callback
  }
  //  flushPassiveEffects()
  enqueueUpdate(current, update)
  scheduleWork(current, expirationTime)
  return expirationTime
}
function createUpdateQueue (baseState) {
  return [baseState]
}
function enqueueUpdate (fiber, update) {
  // Update queues are created lazily.
  var alternate = fiber.alternate
  if (alternate) {
    var queue = alternate.updateQueue || createUpdateQueue(alternate.memoizedState)
    queue.push(update)
  }
  var queue1 = fiber.updateQueue || createUpdateQueue(fiber.memoizedState)
  queue1.push(update)
}

function scheduleWork (fiber, expirationTime) {
  var root = scheduleWorkToRoot(fiber, expirationTime)
  if (
    // If we're in the render phase, we don't need to schedule this root
    // for an update, because we'll do it before we exit...
    !isWorking || isCommitting ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root) {
    var rootExpirationTime = root.expirationTime
    requestWork(root, rootExpirationTime)
  }
}
