import {
    getContext,
    getInstances,
    getComponentName,
    matchInstance,
    getTop,
    midway,
    extend
} from './util'
import {applyComponentHook} from './lifecycle'

import {transaction} from './transaction'
import {toVnode} from './toVnode'
import {diffProps} from './diffProps'
import {document, createDOMElement} from './browser'
import {removeRef} from './ref'
import {setControlledComponent} from './ControlledComponent'

/**
 * 渲染组件
 *
 * @param {any} instance
 */
export function updateComponent(instance) {
    var {props, state, context, prevProps} = instance
    var oldRendered = instance._rendered
    var vnode = instance.getVnode()
    var hostParent = vnode._hostParent
    console.log('updateComponent.......', vnode)
    if (instance._unmount) {
        return vnode._hostNode //注意
    }

    var nextProps = props
    prevProps = prevProps || props
    var nextState = instance._processPendingState(props, context)

    instance.props = prevProps
    delete instance.prevProps

    if (!instance._forceUpdate && applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
        return vnode._hostNode //注意
    }

    applyComponentHook(instance, 5, nextProps, nextState, context)
    instance.props = nextProps
    instance.state = nextState
    delete instance._updateBatchNumber

    var rendered = transaction.renderWithoutSetState(instance, nextProps, context)

    //context只能孩子用，因此不要影响原instance.context
    context = getContext(instance, context)

    instance._rendered = rendered
    //rendered的type为函数时，会多次进入toVnode
    var dom = diff(rendered, oldRendered, hostParent, context, vnode._hostNode)
    vnode._hostNode = dom
    applyComponentHook(instance, 6, nextProps, nextState, context)

    return dom //注意
}
/**
 * call componentWillUnmount
 *
 * @param {any} vnode
 */
function removeComponent(vnode) {
    var instance = vnode.instance
    var disabedInstance = instance

    applyComponentHook(instance, 7) //componentWillUnmount hook
    /*  while (disabedInstance) {
          disabedInstance._unmount = true
          disabedInstance = disabedInstance.parentInstance
      }*/

    '_hostParent,_wrapperState,_owner'.replace(/\w+/g, function (name) {
        delete vnode[name]
    })
    var props = vnode.props
    if (props) {
        removeRef(instance, props.ref)
        props
            .children
            .forEach(function (el) {
                removeComponent(el)
            })
    }

}

/**
 * 参数不要出现DOM,以便在后端也能运行
 *
 * @param {any} vnode 新的虚拟DOM
 * @param {any} prevVnode 旧的虚拟DOM
 * @param {any} hostParent 父虚拟DOM
 * @param {any} context
 * @returns
 */
export function diff(vnode, prevVnode, hostParent, context, beforeDom) { //updateComponent
    var parentNode = hostParent._hostNode
    var prevInstance = prevVnode._instance
    var prevProps = prevVnode.props || {}
    var prevChildren = prevProps.children || []
    var Type = vnode.type
    var isComponent = typeof Type === 'function'
    var dom = beforeDom
    // var dom = prevVnode._dom
    var instance
    if (prevInstance) {
        //  dom = prevInstance._rendered._hostNode
        if (prevInstance === vnode._instance) {
            instance = vnode.type === '#comment'
                ? null
                : prevInstance
        } else {
            instance = isComponent && matchInstance(prevInstance, Type)
        }
       
        if (instance) { //如果类型相同，使用旧的实例进行 render新的虚拟DOM
             console.log('拥有相同的实例', instance, beforeDom)
            instance.context = context //更新context
            instance.prevProps = prevProps
            var nextProps = vnode.props
            //处理非状态组件
            if (instance.statelessRender) {
                instance.props = nextProps
                return updateComponent(instance, context)
            }

            applyComponentHook(instance, 3, nextProps) //componentWillReceiveProps

            instance.props = nextProps
            return updateComponent(instance, context)
        } else {
            var remove = true
            removeComponent(prevVnode)
            while (prevInstance) {

                prevInstance.vnode = vnode
                prevInstance = prevInstance.parentInstance
            }
        }
    }
    if (isComponent) {
        //  vnode._hostParent = hostParent
        try {
            return toDOM(vnode, context, hostParent, beforeDom)
        } finally {
            if (remove) {
                console.log(dom, parentNode)
                parentNode.removeChild(dom)
            }
        }
    } else if (!dom || prevVnode.type !== Type) {
        //如果元素类型不一致

        var nextDom = createDOMElement(vnode)
        console.log(vnode, '标签类型不一样', nextDom, beforeDom)
        parentNode.insertBefore(nextDom, beforeDom || null)
        if (dom && dom === beforeDom) {
            parentNode.removeChild(dom)
        }
        dom = nextDom

    }
    if (prevVnode._renderedComponent) {
        vnode._renderedComponent = prevVnode._renderedComponent
    }
    console.log('当前的情况', vnode, instance)
    //必须在diffProps前添加它的dom
    
    vnode._hostNode = dom
    vnode._hostParent = hostParent
    if (prevProps.dangerouslySetInnerHTML) {
        while (dom.firstChild) {
            var removed = dom.removeChild(dom.firstChild)
        }
    }
    var props = vnode.props
    if (props) {
        if (!props.angerouslySetInnerHTML) {
            diffChildren(props.children, prevChildren, vnode, context)
        }
        diffProps(props, prevProps, vnode, prevVnode)
    }

    var wrapperState = vnode._wrapperState
    if (wrapperState && wrapperState.postUpdate) { //处理select
        wrapperState.postUpdate(vnode)
    }
    console.log('返回', dom)
    return dom
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
        return type + '/' + vnode.deep + '/' + vnode.text
    }
    return type + '/' + vnode.deep + (vnode.key !== null
        ? '/' + vnode.key
        : '')
}

/**
 *
 *
 * @param {any} newChildren
 * @param {any} oldChildren
 * @param {any} hostParent
 * @param {any} context
 */
function diffChildren(newChildren, oldChildren, hostParent, context) {
    //第一步，根据实例的类型，nodeName, nodeValue, key与数组深度 构建hash
    var mapping = {};
    var str1 = ''
    for (let i = 0, n = oldChildren.length; i < n; i++) {
        let vnode = oldChildren[i]
        let tag = vnode._instance
            ? getComponentName(vnode._instance)
            : vnode.type
        let uuid = computeUUID(tag, vnode)
        str1 += uuid + ' '
        if (mapping[uuid]) {
            mapping[uuid].push(vnode)
        } else {
            mapping[uuid] = [vnode]
        }
    }
    //第二步，遍历新children, 从hash中取出旧节点

    var removedChildren = oldChildren.concat();
    str1 = ''
    for (let i = 0, n = newChildren.length; i < n; i++) {
        let vnode = newChildren[i];

        let Type = vnode.type

        let tag = typeof Type === 'function'
            ? (vnode._hasInstance = 1, Type.displatName || Type.name)
            : vnode.instance
                ? getComponentName(vnode._instance, vnode._hasInstance = 1)
                : Type

        let uuid = computeUUID(tag, vnode)
        str1 += uuid + ' '
        if (mapping[uuid]) {
            var matchNode = mapping[uuid].shift()
            if (!mapping[uuid].length) {
                delete mapping[uuid]
            }
            if (matchNode) {
                let index = removedChildren.indexOf(matchNode)
                if (index !== -1) {
                    removedChildren.splice(index, 1)
                    vnode.prevVnode = matchNode //重点
                }
            }
        }
    }
    console.log('旧的', str1)
    var parentNode = hostParent._hostNode,
        //第三，逐一比较
        nativeChildren = parentNode.childNodes,
        branch;
        console.log(parentNode,[].slice.call(nativeChildren))
    for (var i = 0, n = newChildren.length; i < n; i++) {
        let vnode = newChildren[i],
            prevVnode = null,
            beforeDom = nativeChildren[i]

        if (vnode.prevVnode) {
            prevVnode = vnode.prevVnode
        } else {
            if (removedChildren.length) {
                prevVnode = removedChildren.shift()
            }

        }
        console.log('新的', str1)

        vnode._hostParent = hostParent
        if (prevVnode) { //假设两者都存在
            let isTextOrComment = 'text' in vnode
            let prevDom = prevVnode._hostNode
            delete vnode.prevVnode
            if (vnode._hasInstance) { //都是同种组件

                delete vnode._hasInstance
                delete prevVnode._instance._unmount
               var inst = vnode._instance = prevVnode._instance
                console.log('组件类型一致',vnode, prevVnode, beforeDom, inst)
                vnode._hostNode = diff(vnode, prevVnode, hostParent, context, beforeDom)
                branch = 'A'
            } else if (vnode.type === prevVnode.type) { //都是元素，文本或注释

                if (isTextOrComment) {
                    vnode._hostNode = prevDom

                    if (vnode.text !== prevVnode.text) {
                        vnode._hostNode.nodeValue = vnode.text
                    }
                    branch = 'B'
                } else {
                    //  '更新元素' 必须设置vnode._hostNode = newDOM
                    vnode._hostNode = diff(vnode, prevVnode, hostParent, context, beforeDom)
                    branch = 'C'
                }
            } else if (isTextOrComment) { //由其他类型变成文本或注释

                vnode._hostNode = createDOMElement(vnode)
                branch = 'D'

                removeComponent(prevVnode) //移除元素节点或组件}
            } else { //由其他类型变成元素

                vnode._hostNode = diff(vnode, prevVnode, hostParent, context, beforeDom)

                branch = 'E'
            }
            //当这个孩子是上级祖先传下来的，那么它是相等的
            if (vnode !== prevVnode) {
                delete prevVnode._hostNode //clear reference
            }

        } else { //添加新节点
            if (!vnode._hostNode) {
                console.log('产生新DOM节点', vnode, vnode.type)
                /* istanbul ignore next */
                vnode._hostNode = toDOM(vnode, context, hostParent, beforeDom)
                branch = 'F'
            }
        }
        // console.log('branch  ', branch)
        if (nativeChildren[i] !== vnode._hostNode) {
            parentNode.insertBefore(vnode._hostNode, nativeChildren[i] || null)
        }
    }
    while (nativeChildren[i]) {
        parentNode.removeChild(nativeChildren[i])
    }

    //第4步，移除无用节点
    if (removedChildren.length) {
        for (let i = 0, n = removedChildren.length; i < n; i++) {
            let vnode = removedChildren[i]
            var dom = vnode._hostNode
            if (dom.parentNode) {
                dom
                    .parentNode
                    .removeChild(dom)
            }
            if (vnode.instance) {
                removeComponent(vnode)
            }

        }
    }

}
// React.createElement返回的是用于定义数据描述结果的虚拟DOM 如果这种虚拟DOM的type为一个函数或类，那么将产生组件实例
// renderedComponent 组件实例通过render方法更下一级的虚拟DOM renderedElement
/**
 *
 * @export
 * @param {VNode} vnode
 * @param {DOM} context
 * @param {DOM} parentNode ?
 * @param {DOM} replaced ?
 * @returns
 */
export function toDOM(vnode, context, hostParent, beforeDom) {
    //如果一个虚拟DOM的type为字符串 或 它拥有instance，且这个instance不再存在parentInstance, 那么它就可以拥有_dom属性
    vnode = toVnode(vnode, context)
    var hostNode = createDOMElement(vnode)
    var props = vnode.props
    var parentNode = hostParent._hostNode
    var instance = vnode._instance || vnode._owner
    var canComponentDidMount = instance && !vnode._hostNode
    //每个实例保存其虚拟DOM 最开始的虚拟DOM保存instance
    if (typeof vnode.type === 'string') {
        vnode._hostNode = hostNode
        vnode._hostParent = hostParent
    }
    if (instance) {
        // instance.getVnode()
        var p = getTop(instance)
        var v = p.vnode
        if (vnode !== v) {
            v._hostNode = hostNode
            v._hostParent = hostParent
        }
    }
    if (vnode.context) {
        context = vnode.context
        delete vnode.context
    }
    //文本是没有instance, 只有empty与元素节点有instance

    if (parentNode) {
        parentNode.insertBefore(hostNode, beforeDom || null)
    }
    //只有元素与组件才有props
    if (props && !props.dangerouslySetInnerHTML) {
        // 先diff Children 再 diff Props 最后是 diff ref
        diffChildren(props.children, [], vnode, context) //添加第4参数
    }
    //尝试插入DOM树
    if (parentNode) {
        var instances
        if (canComponentDidMount) { //判定能否调用componentDidMount方法
            instances = getInstances(instance)
        }
        if (props) {

            diffProps(props, {}, vnode, {})
            setControlledComponent(vnode)
        }
        if (instances) {

            while (instance = instances.shift()) {
                applyComponentHook(instance, 2)
            }
        }
    }

    return hostNode
}
//将Component中这个东西移动这里
midway.immune.updateComponent = function updateComponentProxy(instance) { //这里触发视图更新

    updateComponent(instance)
    instance._forceUpdate = false
}