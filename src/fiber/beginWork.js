import { callLifeCycleHook, pushError } from './unwindWork'
import { contextStack, componentStack, containerStack, emptyObject } from '../share'
import { fiberizeChildren } from '../createElement'
import { createInstance } from '../createInstance'
import { PLACE, ATTR, DETACH, HOOK, CONTENT, REF, NULLREF } from './effectTag'
import { extend, Flutter, get, noop } from '../util'
/**
 * 基于DFS遍历虚拟DOM树，初始化vnode为fiber,并产出组件实例或DOM节点
 * 为instance/fiber添加context与parent, 并压入栈
 * 使用再路过此节点时，再弹出栈
 * 它需要对shouldUpdateFalse的情况进行优化
 * 
 * @param {Fiber} fiber 
 * @param {Fiber} topWork 
 */
export function updateEffects (fiber, topWork) {
  if (fiber.tag > 3) {
    updateHostComponent(fiber) // unshift context
  } else {
    updateClassComponent(fiber) // unshift parent
  }
  if (fiber.child) {
    if (fiber.shouldUpdateFalse) {
      // ...
    } else {
      return fiber.child
    }
  }
  let f = fiber
  while (f) {
    if (f.stateNode.getChildContext) {
      contextStack.shift() // shift context
    }
    if (f.tag === 5) {
      containerStack.shift() // shift parent
    }
    if (f === topWork) {
      break
    }
    if (f.sibling) {
      return f.sibling
    }
    f = f.return
  }
}

// 实例化组件
export function Fiber (vnode) {
  extend(this, vnode)
  let type = vnode.type
  this.name = type.displayName || type.name || type
  this.effectTag = 1
}

function updateHostComponent (fiber) {
  if (!fiber.stateNode) {
    try {
      fiber.stateNode = Flutter.createElement(fiber)
    } catch (e) {
      throw e
    }
  }

  fiber.parent = fiber._return ? fiber._return.stateNode : containerStack[0]
  const { props, tag, root, alternate: prev } = fiber
  const children = props && props.children
  if (tag === 5) {
    // 元素节点
    containerStack.unshift(fiber.stateNode)
    if (!root) {
      fiber.effectTag *= ATTR
    }

    diffChildren(fiber, children)
  } else {
    // 文本节点
    if (!prev || prev.props.children !== children) {
      fiber.effectTag *= CONTENT
    }
  }
}
// 第一次是没有alternate 也没有stateNode
// 如果是setState是没有alternate
// 如果是receive是有alternate
function updateClassComponent (fiber) {
  let { type, stateNode: instance, isForced, props, stage } = fiber
  let nextContext = getMaskedContext(type.contextTypes), context
  if (instance == null) {
    // 初始化
    stage = 'init'
    instance = fiber.stateNode = createInstance(fiber, props)
    instance.updater.enqueueSetState = Flutter.updateComponent
    fiber.partialState = instance.state
  } else {
    stage = isForced === true || isForced === false ? 'update' : 'receive'
    delete fiber.isForced
  }
  instance._reactInternalFiber = fiber
  if (instance.__isStateless) {
    stage = 'noop'
  }
  var updater = instance.updater
  updater._hooking = true
  while (stage) {
    stage = stageIteration[stage](fiber, props, nextContext, instance, isForced)
  }
  updater._hooking = false
  fiber.parent = containerStack[0]
  if (instance.getChildContext) {
    try {
      context = instance.getChildContext()
      context = Object.assign({}, nextContext, context)
    } catch (e) {
      context = {}
    }
    contextStack.unshift(context)
  }
  if (fiber.shouldUpdateFalse) {
    return
  }
  instance.context = nextContext
  instance.props = props
  instance.state = fiber.partialState; // fiber.partialState可能在钩子里被重写
  fiber.effectTag *= HOOK
  updater._hydrating = true
  /* if (!fiber.isForceUpdate && willReceive === false) {
		delete fiber._willReceive
		let a = fiber.child
		if (a && a.sibling) {
			rendered = []
			for (; a; a = a.sibling) {
				rendered.push(a)
			}
		} else {
			rendered = a
		}
	} else {
		*/
  let lastOwn = Flutter.currentOwner
  Flutter.currentOwner = instance
  let rendered = callLifeCycleHook(instance, 'render', [])
  if (componentStack[0] === instance) {
    componentStack.shift()
  }
  if (updater._hasError) {
    rendered = []
  }
  Flutter.currentOwner = lastOwn

  diffChildren(fiber, rendered)
}
var stageIteration = {
  noop: noop,
  init(fiber, nextProps, nextContext, instance) {
    getDerivedStateFromProps(instance, fiber, nextProps, instance.state)
    callLifeCycleHook(instance, 'componentWillMount', [])
  },
  receive(fiber, nextProps, nextContext, instance) {
    var updater = instance.updater
    updater.lastProps = instance.props
    updater.lastState = instance.state
    let propsChange = updater.lastProps !== nextProps
    var willReceive = propsChange || instance.context !== nextContext
    if (willReceive) {
      callLifeCycleHook(instance, 'componentWillReceiveProps', [ nextProps, nextContext ])
    }else {
      cloneChildren(fiber)
      return
    }
    if (propsChange) {
      getDerivedStateFromProps(instance, fiber, nextProps, updater.lastState)
    }
    return 'update'
  },
  update(fiber, nextProps, nextContext, instance, isForced) {
    let args = [ nextProps, fiber.partialState, nextContext ]
    // console.log(fiber.name, "===",fiber.props === nextProps ,fiber.stateChange)

    if (!isForced && !callLifeCycleHook(instance, 'shouldComponentUpdate', args)) {
      cloneChildren(fiber)
    } else {
      callLifeCycleHook(instance, 'getSnapshotBeforeUpdate', args)
      callLifeCycleHook(instance, 'componentWillUpdate', args)
    }
  }
}

function isSameNode (a, b) {
  if (a.type === b.type && a.key === b.key) {
    return true
  }
}

export function detachFiber (fiber, effects) {
  fiber.effectTag = DETACH
  if (fiber.ref) {
    fiber.effectTag *= NULLREF
  }
  fiber.disposed = true
  if (fiber.tag < 3) {
    fiber.effectTag *= HOOK
  }
  effects.push(fiber)
  for (let child = fiber.child; child; child = child.sibling) {
    detachFiber(child, effects)
  }
}

var gDSFP = 'getDerivedStateFromProps'
function getDerivedStateFromProps (instance, fiber, nextProps, lastState) {
  try {
    var method = fiber.type[gDSFP]
    if (method) {
      var partialState = method.call(null, nextProps, lastState)
      if (partialState != null) {
        fiber.partialState = Object.assign({}, fiber.partialState, partialState)
      }
    }
  } catch (error) {
    pushError(instance, gDSFP, error)
  }
}

function cloneChildren (fiber) {
  fiber.shouldUpdateFalse = true
  const prev = fiber.alternate
  if (prev && prev.child) {
    var pc = prev._children
    var cc = (fiber._children = {})
    fiber.child = prev.child
    for (let i in pc) {
      let a = pc[i]
      a.return = fiber; // 只改父引用不复制
      cc[i] = a
    }
  }
  if (componentStack[0] === fiber.stateNode) {
    componentStack.shift()
  }
}
function getMaskedContext (contextTypes) {
  let context = {}
  if (!contextTypes) {
    return emptyObject
  }
  let parentContext = contextStack[0],
    hasKey
  for (let key in contextTypes) {
    if (contextTypes.hasOwnProperty(key)) {
      hasKey = true
      context[key] = parentContext[key]
    }
  }
  return hasKey ? context : emptyObject
}

/**
 * 转换vnode为fiber
 * @param {Fiber} parentFiber 
 * @param {Any} children 
 */
function diffChildren (parentFiber, children) {
  let prev = parentFiber.alternate
  let oldFibers = prev ? prev._children : {}; // 旧的
  var newFibers = fiberizeChildren(children, parentFiber); // 新的
  var effects = parentFiber.effects || (parentFiber.effects = [])

  let matchFibers = {}
  for (let i in oldFibers) {
    let newFiber = newFibers[i]
    let oldFiber = oldFibers[i]
    if (newFiber && newFiber.type === oldFiber.type) {
      matchFibers[i] = oldFiber
      if (newFiber.key != null) {
        oldFiber.key = newFiber.key
      }
      continue
    }
    detachFiber(oldFiber, effects)
  }

  let prevFiber,
    index = 0
  for (let i in newFibers) {
    let newFiber = (newFibers[i] = new Fiber(newFibers[i]))
    let oldFiber = matchFibers[i]
    if (oldFiber) {
      if (isSameNode(oldFiber, newFiber)) {
        newFiber.stateNode = oldFiber.stateNode
        newFiber.alternate = oldFiber
        if (oldFiber.ref && oldFiber.ref !== newFiber.ref) {
          oldFiber.effectTag = NULLREF
          effects.push(oldFiber)
        }
        if (newFiber.tag === 5) {
          newFiber.lastProps = oldFiber.props
        }
      } else {
        detachFiber(oldFiber, effects)
      }
    }
    if (newFiber.tag > 3) {
      newFiber.effectTag *= PLACE
    }
    if (newFiber.ref) {
      newFiber.effectTag *= REF
    }
    newFiber.index = index++
    newFiber.return = parentFiber

    if (prevFiber) {
      prevFiber.sibling = newFiber
    } else {
      parentFiber.child = newFiber
    }
    prevFiber = newFiber
  }
  if (prevFiber) {
    delete prevFiber.sibling
  }
}
