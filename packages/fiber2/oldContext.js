function findCurrentUnmaskedContext (fiber) {
  var node = fiber
  do {
    var stateNode = node.stateNode
    if (node.containerInfo) {
      return fiber.context || {}
    }
    if (stateNode.getChildContext) {
      return stateNode._unmaskedContext
    }
    node = node.return
  } while (node !== null)
}

export function getContextForSubtree (instance) {
  if (!instance) {
    return {}
  }
  var fiber = instance._internalReactFiber
  var unmaskedContext = findCurrentUnmaskedContext(fiber)
  var type = fiber.type
  var contextTypes = type && type.contextTypes
  if (contextTypes === Object(contextTypes)) {
    var context = {}
    for (var key in contextTypes) {
      if (contextTypes.hasOwnProperty(key)) {
        context[key] = unmaskedContext[key]
      }
    }
    return context
  }
  return unmaskedContext
}

function get (instance) {
  return instance._internalReactFiber
}
// 查找一个fiber的根节点
var cachedRoot, cachedFiber
function getRoot (fiber) {
  var root = fiber
  if (cachedFiber === fiber) {
    return cachedRoot
  }
  while (root.return){
    root = root.return
    if (root.containerInfo) {
      break
    }
  }
  cachedFiber = fiber
  cachedRoot = root
  return root
}
// 移除最前面的context
function popContext (fiber) {
  if (fiber.shiftContext) {
    var root = getRoot(fiber)
    var { contextChangeStack, contextStack } = root
    contextChangeStack.shift(); // 里面都是boolean
    contextStack.shift(); // 里面都是mergedContext
    delete fiber.shiftContext
  }
}

var previousContext = {}

export function pushContext (fiber) {
  const instance = fiber.stateNode
  const context = (instance && instance.__reactInternalMemoizedMergedChildContext) || {}
  const root = getRoot(fiber)
  const { contextChangeStack, contextStack } = root
  previousContext = contextStack[0]
  contextStack.unshift(context)
  contextChangeStack.unshift(contextChangeStack[0])
  return true
}

export function contextHasChanged (fiber) {
  const root = getRoot(fiber)
  const { contextChangeStack } = root
  return contextChangeStack[0]
}

export function adjustContext (fiber, type, didChange) {
  var instance = fiber.stateNode
  const root = getRoot(fiber)
  const { contextChangeStack, contextStack } = root
  if (didChange) {
    contextStack[0] = instance.__reactInternalMemoizedMergedChildContext
  }
  contextChangeStack[0] = didChange
}
