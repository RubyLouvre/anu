import { topFibers, topNodes, effects, containerStack } from './share'
import { updateEffects, detachFiber } from './fiber/beginWork'
import { collectEffects, getContainer } from './fiber/completeWork'
import { commitEffects } from './fiber/commitWork'
import { CALLBACK } from './fiber/effectTag'
import { deprecatedWarn, __push, get, Flutter, isFn } from './util'
let updateQueue = Flutter.mainThread
// [Top API] React.isValidElement
export function isValidElement (vnode) {
  return vnode && vnode.tag > 0 && vnode.tag !== 6
}
// [Top API] ReactDOM.findDOMNode
export function findDOMNode (stateNode) {
  if (stateNode == null) {
    // 如果是null
    return null
  }
  if (stateNode.nodeType) {
    // 如果本身是元素节点
    return stateNode
  }
  // 实例必然拥有updater与render
  if (stateNode.render) {
    let fiber = get(stateNode)
    let c = fiber.child
    if (c) {
      return findDOMNode(c.stateNode)
    } else {
      return null
    }
  }
}
export function render (vnode, root, callback) {
  let hostRoot = Flutter.updateRoot(vnode, root)
  let instance = null
  hostRoot.effectTag = CALLBACK
  hostRoot._hydrating = true; // lock 表示正在渲染
  hostRoot.pendingCbs = [ function () {
    instance = hostRoot.child ? hostRoot.child.stateNode : null
    callback && callback.call(instance)
    hostRoot._hydrating = false // unlock
  } ]
  updateQueue.push(hostRoot)
  var prev = hostRoot.alternate
  // 如果之前的还没有执行完，那么等待它执行完再处理,
  // 比如在某个组件的cb调用了ReactDOM.render就会遇到这种情况
  if (prev && prev._hydrating) {
    return
  }
  Flutter.scheduleWork()
  return instance
}

Flutter.scheduleWork = function () {
  performWork({
    timeRemaining() {
      return 2
    }
  })
}
var isBatchingUpdates = false
Flutter.batchedUpdates = function () {
  var keepbook = isBatchingUpdates
  isBatchingUpdates = true
  try {
    Flutter.scheduleWork()
  } finally {
    isBatchingUpdates = keepbook
    if (!isBatchingUpdates) {
      commitEffects()
    }
  }
}

function workLoop (deadline) {
  let topWork = getNextUnitOfWork()
  if (topWork) {
    let fiber = topWork
    let p = getContainer(fiber)
    if (p) {
      containerStack.unshift(p)
    }
    while (fiber && deadline.timeRemaining() > ENOUGH_TIME) {
      fiber = updateEffects(fiber, topWork)
    }
    if (topWork) {
      __push.apply(effects, collectEffects(topWork, null, true))
      if (topWork.effectTag) {
        effects.push(topWork)
      }
    }
    if (!isBatchingUpdates) {
      commitEffects()
    }
  }
}

function performWork (deadline) {
  workLoop(deadline)
  if (updateQueue.length > 0) {
    requestIdleCallback(performWork)
  }
}

// [Top API] ReactDOM.unstable_renderSubtreeIntoContainer
export function unstable_renderSubtreeIntoContainer (instance, vnode, container, callback) {
  deprecatedWarn('unstable_renderSubtreeIntoContainer')
  return Flutter.render(vnode, container, callback)
}
// [Top API] ReactDOM.unmountComponentAtNode
export function unmountComponentAtNode (container) {
  let rootIndex = topNodes.indexOf(container)
  if (rootIndex > -1) {
    let lastFiber = topFibers[rootIndex],
      effects = []
    detachFiber(lastFiber, effects)
    effects.shift()
    commitEffects(effects)
    topNodes.splice(rootIndex, 1)
    topFibers.splice(rootIndex, 1)
    container._reactInternalFiber = null
    return true
  }
  return false
}

let ENOUGH_TIME = 1
function requestIdleCallback (fn) {
  fn({
    timeRemaining() {
      return 2
    }
  })
}

function getNextUnitOfWork (fiber) {
  fiber = updateQueue.shift()
  if (!fiber) {
    return
  }
  if (fiber.merged) {
    return
  }
  if (fiber.root) {
    fiber.stateNode = fiber.stateNode || {}
    if (!get(fiber.stateNode)) {
      Flutter.emptyElement(fiber)
    }
    fiber.stateNode._reactInternalFiber = fiber
  }
  return fiber
}

/**
 * 这是一个深度优先过程，beginWork之后，对其孩子进行任务收集，然后再对其兄弟进行类似操作，
 * 没有，则找其父节点的孩子
 * @param {Fiber} fiber 
 * @param {Fiber} topWork 
 */

function mergeUpdates (el, state, isForced, callback) {
  var fiber = el._updates || el
  fiber.isForced = fiber.isForced || isForced; // 如果是true就变不回false
  //  fiber.alternate = fiber.alternate || fiber;//不要覆盖旧的
  if (state) {
    var ps = fiber.pendingStates || (fiber.pendingStates = [])
    ps.push(state)
  }
  if (callback) {
    var cs = fiber.pendingCbs || (fiber.pendingCbs = [])
    if (!cs.length) {
      if(!fiber.effectTag){
        fiber.effectTag = CALLBACK
      }else{
        fiber.effectTag *= CALLBACK
      }
      
    }
    cs.push(callback)
  }
}

Flutter.updateComponent = function (instance, state, callback) {
  // setState
  var fiber = get(instance)
  if (fiber.parent) {
    fiber.parent.insertPoint = fiber.insertPoint
  }

  let isForced = state === true
  state = isForced ? null : state

  if (this._hydrating || Flutter.interactQueue) {
    // 如果正在render过程中，那么要新建一个fiber,将状态添加到新fiber
    if (!fiber._updates) {
      var target = fiber._updates = {}
      var queue = Flutter.interactQueue || updateQueue
      queue.push(fiber)
    }
    mergeUpdates(fiber, state, isForced, callback)
  } else {
    // 如果是在componentWillXXX中，那么直接修改已经fiber及instance
    mergeUpdates(fiber, state, isForced, callback)
    if (!this._hooking) {
      // 不在生命周期钩子中时，需要立即触发（或异步触发）
      updateQueue.push(fiber)
      Flutter.scheduleWork()
    }
  }
}
