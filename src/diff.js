import {
    getContext,
    getInstances,
    getComponentName,
    recyclables,
    options,
    noop,
    HTML_KEY,
    extend,
    getNodes
} from './util'
import {
    applyComponentHook
} from './lifecycle'

import {
    transaction
} from './transaction'
import {
    toVnode
} from './toVnode'
import {
    diffProps
} from './diffProps'
import {
    document,
    createDOMElement
} from './browser'
import {
    setControlledComponent
} from './ControlledComponent'

// createElement创建的虚拟DOM叫baseVnode,用于确定DOM树的结构与保存原始数据与DOM节点
// 如果baseVnode的type类型为函数，那么产生实例

/**
 * 渲染组件
 *
 * @param {any} instance
 */
export function updateComponent(instance) {
    var {
        props,
        state,
        context,
        lastProps
    } = instance
    var lastRendered = instance._rendered
    var baseVnode = instance.getBaseVnode()
    var hostParent = baseVnode._hostParent //|| lastRendered._hostParent

    var nextProps = props
    lastProps = lastProps || props
    var nextState = instance._processPendingState(props, context)

    instance.props = lastProps
    delete instance.lastProps
    //生命周期 shouldComponentUpdate(nextProps, nextState, nextContext)
    if (!instance._forceUpdate && applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
        return baseVnode._hostNode //注意
    }
    //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
    applyComponentHook(instance, 5, nextProps, nextState, context)
    instance.props = nextProps
    instance.state = nextState
    delete instance._updateBatchNumber

    var rendered = transaction.renderWithoutSetState(instance, nextProps, context)
    context = getContext(instance, context)
    instance._rendered = rendered
    // rendered的type为函数时，会多次进入toVnode  var dom = diff(rendered, lastRendered,
    // hostParent, context, baseVnode._hostNode)

    var dom = diffChildren([rendered], [lastRendered], hostParent,  context)
    baseVnode._hostNode = dom
    //生命周期 componentDidUpdate(lastProps, prevState, prevContext)
    applyComponentHook(instance, 6, nextProps, nextState, context)
    if (options.afterUpdate)
        options.afterUpdate(instance._currentElement);

    return dom //注意
}
/**
 * call componentWillUnmount
 *
 * @param {any} vnode
 */
function removeComponent(vnode, dom) {

    if (dom) {
        var nodeName = dom.__n || (dom.__n = dom.nodeName.toLowerCase())
        if (recyclables[nodeName] && recyclables[nodeName].length < 512) {
            recyclables[nodeName].push(dom)
        } else {
            recyclables[nodeName] = [dom]
        }
    }

    var instance = vnode._instance
    if (instance) {
        if (options.beforeUnmount) {
            options.beforeUnmount(instance._currentElement)
        }

        applyComponentHook(instance, 7) //componentWillUnmount hook
    }

    var props = vnode.props
    if (props) {
        vnode.__ref && vnode.__ref(null)
        dom && (dom.__events = null)
        var nodes = props.children
        for (var i = 0, el; el = nodes[i++];) {
            removeComponent(el, el._hostNode)
        }
    };
    '_hostNode,_hostParent,_instance,_wrapperState,_owner'.replace(/\w+/g, function (name) {
        vnode[name] = NaN
    })

}

function removeComponents(nodes) {
    for (var i = 0, el; el = nodes[i++];) {
        var dom = el._hostNode
        if (!dom && el._instance) {
            var a = el
                ._instance
                .getBaseVnode()
            dom = a && a._hostNode
        }

        if (dom && dom.parentNode) {
            dom
                .parentNode
                .removeChild(dom)
        }
        removeComponent(el, dom)
    }
}

/**
 * 参数不要出现DOM,以便在后端也能运行
 *
 * @param {VNode} vnode 新的虚拟DOM
 * @param {VNode} lastVnode 旧的虚拟DOM
 * @param {VNode} hostParent 父虚拟DOM
 * @param {Object} context
 * @param {DOM} insertPoint
 * @returns
 */
export function diff(vnode, lastVnode, hostParent, context, insertPoint, lastInstance) { //updateComponent

    var baseVnode = vnode
    var hostNode = lastVnode._hostNode || vnode._prevCached

    lastInstance = lastInstance || lastVnode._instance

    var lastProps = lastVnode.props || {}
    if (lastInstance) {
        var instance = lastInstance
        vnode._instance = lastInstance
        baseVnode = lastInstance.getBaseVnode()
        hostNode = baseVnode._hostNode

        vnode._instance = instance

        instance.context = context //更新context
        instance.lastProps = lastProps
        var nextProps = vnode.props
        //处理非状态组件
        if (instance.statelessRender) {
            instance.props = nextProps
            return updateComponent(instance, context)
        }
        //componentWillReceiveProps(nextProps, nextContext)
        applyComponentHook(instance, 3, nextProps, context)

        instance.props = nextProps

        return updateComponent(instance, context)
    }

    if (vnode.vtype > 1) {
        var parentInstance = lastInstance && lastInstance.parentInstance
        return toDOM(vnode, context, hostParent, insertPoint, parentInstance)

    }
    var parentNode = hostParent._hostNode
    var lastChildren = lastProps.children || []
    if (!hostNode) {
        //如果元素类型不一致

        var nextNode = createDOMElement(vnode)
        parentNode.insertBefore(nextNode, hostNode || null)
        lastChildren = []
        lastProps = {}
        if (insertPoint) {
            parentNode.removeChild(insertPoint)
        }
        removeComponent(lastVnode, hostNode)

        hostNode = nextNode
    }

    //必须在diffProps前添加它的真实节点

    baseVnode._hostNode = hostNode
    baseVnode._hostParent = hostParent

    if (lastProps.dangerouslySetInnerHTML) {
        while (hostNode.firstChild) {
            hostNode.removeChild(hostNode.firstChild)
        }
    }
    var props = vnode.props
    if (props) {
        if (vnode._prevCached) {
            alignChildren(nextChildren, getNodes(hostNode), baseVnode, context)
        } else {
            if (!props[HTML_KEY]) {
                var nextChildren = props.children
                var n1 = nextChildren.length
                var n2 = lastChildren.length
                var old = lastChildren[0]
                var neo = nextChildren[0]
                if (!neo && old) {
                    removeComponents(lastChildren)

                } else if (neo && !old) {
                    var beforeDOM = null
                    for (var i = 0, el; el = nextChildren[i++];) {
                        var dom = el._hostNode = toDOM(el, context, baseVnode, beforeDOM)
                        beforeDOM = dom.nextSibling
                    }

                    //    } else if (n1 + n2 === 2 && neo.type === old.type) {    neo._hostNode =
                    // diff(neo, old, baseVnode, context, old._hostNode, old._instance)

                } else {
                    diffChildren(nextChildren, lastChildren, baseVnode, context)
                }
            }
        }
        diffProps(props, lastProps, vnode, lastVnode)
        vnode.__ref && vnode.__ref(hostNode)
    }

    var wrapperState = vnode._wrapperState
    if (wrapperState && wrapperState.postUpdate) { //处理select
        wrapperState.postUpdate(vnode)
    }
    return hostNode
}

function alignChildren(children, nodes, hostParent, context) {
    var insertPoint = nodes[0] || null
    var parentNode = hostParent._hostNode
    for (let i = 0, n = children.length; i < n; i++) {
        var vnode = children[i]
        var data = {context}
        vnode = toVnode(vnode, data)
        context = data.context
        var dom = nodes[i]
        if (!dom || vnode.type !== dom.nodeName.toLowerCase()) {

            var newDOM = createDOMElement(vnode)
            parentNode.insertBefore(newDOM, insertPoint)

            dom = newDOM
        }
        vnode._prevCached = dom

        toDOM(vnode, context, hostParent, insertPoint)
        insertPoint = dom.nextSibling
    }

}

/**
 *
 *
 * @param {any} type
 * @param {any} vnode
 * @returns
 */
function computeUUID(type, vnode) {
    if (type === '#text') {
        return type + '/' + vnode._deep
    }
    return type + '/' + (vnode._deep || 0) + (vnode.key ?
        '/' + vnode.key :
        '')
}

/**
 *
 *v
 * @param {any} nextChildren
 * @param {any} lastChildren
 * @param {any} hostParent
 * @param {any} context
 */
function diffChildren(nextChildren, lastChildren, hostParent, context) {
    //第一步，根据实例的类型，nodeName, nodeValue, key与数组深度 构建hash
    var mapping = {},
        debugString = '',
        returnDOM,
        hashmap = {},
        parentNode = hostParent._hostNode,
        branch;

    for (let i = 0, n = lastChildren.length; i < n; i++) {
        let vnode = lastChildren[i]

        vnode.uuid = '.' + i
        hashmap[vnode.uuid] = vnode
        let uuid = computeUUID(getComponentName(vnode.type), vnode)
        debugString += uuid + ' '
        if (mapping[uuid]) {
            mapping[uuid].push(vnode)
        } else {
            mapping[uuid] = [vnode]
        }
    }

    //第2步，遍历新children, 从hash中取出旧节点, 然后一一比较
    debugString = ''
    var firstDOM = lastChildren[0] && lastChildren[0]._hostNode
    var insertPoint = firstDOM
    for (let i = 0, n = nextChildren.length; i < n; i++) {
        let vnode = nextChildren[i];
        let tag = getComponentName(vnode.type)

        let uuid = computeUUID(tag, vnode)
        debugString += uuid + ' '
        var lastVnode = null
        if (mapping[uuid]) {
            lastVnode = mapping[uuid].shift()
            if (!mapping[uuid].length) {
                delete mapping[uuid]
            }
            delete hashmap[lastVnode.uuid]
        }

        vnode._hostParent = hostParent

        if (lastVnode) { //它们的组件类型， 或者标签类型相同
            var lastInstance = lastVnode._instance

            if ('text' in vnode) {
                var textNode = vnode._hostNode = lastVnode._hostNode
                if (vnode.text !== lastVnode.text) {
                    textNode.nodeValue = vnode.text
                }
                branch = 'B'
                if (textNode !== insertPoint) {
                    parentNode.insertBefore(textNode, insertPoint)
                }
            } else {
                vnode._hostNode = diff(vnode, lastVnode, hostParent, context, insertPoint, lastInstance)
                branch = 'C'
            }

        } else { //添加新节点

            vnode._hostNode = toDOM(vnode, context, hostParent, insertPoint, null)
            branch = 'D'

        }
        if (i === 0) {
            returnDOM = vnode._hostNode
            if (branch != 'D' && firstDOM && vnode._hostNode !== firstDOM) {
                // console.log('调整位置。。。。')
                parentNode.replaceChild(vnode._hostNode, firstDOM)
            }
        }

        insertPoint = vnode._hostNode.nextSibling

    }
    //console.log('新的',debugString) 第3步，移除无用节点
    var removedChildren = []
    for (var key in hashmap) {
        removedChildren.push(hashmap[key])

    }
    if (removedChildren.length) {
        removeComponents(removedChildren)
    }
    return returnDOM

}

/**
 *
 * @export
 * @param {VNode} vnode
 * @param {DOM} context
 * @param {DOM} parentNode ?
 * @param {DOM} replaced ?
 * @returns
 */
export function toDOM(vnode, context, hostParent, insertPoint, parentIntance) {
    //如果一个虚拟DOM的type为字符串 或 它拥有instance，且这个instance不再存在parentInstance, 那么它就可以拥有_dom属性
    var hasDOM = vnode._prevCached
    var data = {context}
    vnode = toVnode(vnode, data, parentIntance)
   

    var hostNode = hasDOM || createDOMElement(vnode)
    var props = vnode.props
    var parentNode = hostParent._hostNode
    var instance = vnode._instance || vnode._owner
    var canComponentDidMount = instance && !vnode._hostNode
    // 每个实例保存其虚拟DOM 最开始的虚拟DOM保存instance 相当于typeof vnode.type === 'string'
    if (vnode.type + '' === vnode.type) {
        vnode._hostNode = hostNode
        vnode._hostParent = hostParent
    }
    if (instance) {
        var baseVnode = instance.getBaseVnode()
        if (!baseVnode._hostNode) {
            baseVnode._hostNode = hostNode
            baseVnode._hostParent = hostParent
        }
    }

    //文本是没有instance, 只有empty与元素节点有instance

    if (parentNode && !hasDOM) {
        parentNode.insertBefore(hostNode, insertPoint || null)
    }
    //只有元素与组件才有props
    if (props && !props[HTML_KEY]) {
        // 先diff Children 再 diff Props 最后是 diff ref
        if (hasDOM) {
            alignChildren(props.children, getNodes(hasDOM), vnode, data.context)
        } else {
            diffChildren(props.children, [], vnode, data.context) //添加第4参数
        }

    }
    var afterMount = options.afterMount || noop
    //尝试插入DOM树
    if (parentNode) {
        var instances
        if (canComponentDidMount) { //判定能否调用componentDidMount方法
            instances = getInstances(instance)
        }
        if (props) {
            diffProps(props, {}, vnode, {})
            setControlledComponent(vnode)
            vnode.__ref && vnode.__ref(vnode._hostNode)
        }
        if (instances) {

            while (instance = instances.shift()) {
                afterMount(instance._currentElement)
                applyComponentHook(instance, 2)
            }
        } 
    }

    return hostNode
}
//将Component中这个东西移动这里
options.immune.updateComponent = function updateComponentProxy(instance) { //这里触发视图更新

    updateComponent(instance)
    instance._forceUpdate = false
}